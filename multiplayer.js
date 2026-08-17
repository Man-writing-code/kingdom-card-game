(() => {
  const SUPABASE_URL='https://eqnkjhhsvfxlhsmebclo.supabase.co';
  const SUPABASE_KEY='sb_publishable_7ULebdQSBz9PXz-W-j6vlA_cB73Y0Sy';
  const statusEl=$('#onlineStatus'),nameEl=$('#onlineName'),codeEl=$('#roomCode');
  const savedName=localStorage.getItem('kingdom-online-name');if(savedName)nameEl.value=savedName;
  const REQUEST_TIMEOUT=9000,GUEST_CLAIM_DELAY=6500,RESOLUTION_RETRY_AFTER=14000;
  const ctx={active:false,seat:null,match:null,channel:null,loadedVersion:-1,resolvingVersion:-1,resolvingAt:0,initializing:false,poll:null,claimTimer:null,leaseProtocol:null};
  let client=null;

  const setStatus=(message,error=false)=>{statusEl.textContent=message||'';statusEl.classList.toggle('error',error)};
  // The panel has two faces: the setup form, and the room card shown while a match is
  // forming — the code writ large, because sharing it IS the hosting player's whole job.
  function setRoomView(mode,code,note){
    $('#roomWait').hidden=mode!=='waiting';
    $('.multiplayer-setup').style.display=mode==='waiting'?'none':'';
    if(mode==='waiting'){$('#roomWaitCode').textContent=code||'······';$('#roomWaitNote').textContent=note||''}
  }
  const cleanName=()=>nameEl.value.trim().slice(0,24);
  const cleanCode=()=>codeEl.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);
  const rowOf=data=>Array.isArray(data)?data[0]:data;
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  function withTimeout(promise,ms=REQUEST_TIMEOUT){
    let timer;
    return Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('The multiplayer request timed out.')),ms)})]).finally(()=>clearTimeout(timer));
  }
  const missingLeaseRpc=error=>/claim_kingdom_resolution|finish_kingdom_resolution|schema cache|function .* does not exist/i.test(error?.message||'');
  const names=()=>({host:ctx.match?.host_name||'Host',guest:ctx.match?.guest_name||'Guest'});
  const playableDeck=()=>{const deck=activeDeck();if(!deckIsPlayable(deck)){showScreen('deck');$('#deckMessage').textContent=`“${deck.name}” needs exactly ${DECK_SIZE} cards before entering an online duel.`;return null}return deckCards(deck).slice()};

  async function connect(){
    if(!window.supabase?.createClient)throw new Error('The multiplayer library did not load. Check your connection and refresh.');
    // Sessions live per tab, not per browser: localStorage would make every tab the same
    // anonymous ruler, and the join guard rightly refuses to seat a host against themself.
    // With sessionStorage, a second tab is a second ruler, so one machine can hold a duel.
    if(!client)client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,storage:window.sessionStorage}});
    let {data:{session}}=await client.auth.getSession();
    if(!session){const result=await client.auth.signInAnonymously();if(result.error)throw result.error;session=result.data.session}
    return session;
  }

  async function watchMatch(row,seat){
    ctx.active=true;ctx.seat=seat;ctx.match=row;ctx.loadedVersion=-1;ctx.resolvingVersion=-1;ctx.resolvingAt=0;ctx.leaseProtocol=null;clearTimeout(ctx.claimTimer);ctx.claimTimer=null;
    if(ctx.channel)await client.removeChannel(ctx.channel);
    ctx.channel=client.channel(`kingdom-${row.id}`).on('postgres_changes',{
      event:'UPDATE',schema:'public',table:'kingdom_matches',filter:`id=eq.${row.id}`
    },payload=>handleMatch(payload.new)).subscribe();
    startPolling(row.id);
    handleMatch(row);
  }

  // Realtime carries the duel, but a single dropped message would strand it: both rulers
  // committed, neither board advancing, nobody able to do anything about it. This reads the
  // match every few seconds and feeds anything new through the same handler, so a lost
  // event costs a moment rather than the game.
  function startPolling(id){
    clearInterval(ctx.poll);
    ctx.poll=setInterval(()=>syncNow(id),4000);
  }
  // Deliberately runs whether or not the tab is on screen. The database lease lets either
  // ruler recover a clash, while its version guard prevents two browsers from publishing it.
  async function syncNow(id){
      if(!ctx.active)return;
      let data,error;
      try{({data,error}=await withTimeout(client.from('kingdom_matches').select('*').eq('id',id||ctx.match?.id).maybeSingle()))}catch(_){return}
      if(error||!data)return;
      // A resolution that never finished looks identical from here whatever killed it — a lost
      // event, a throw mid-clash, a tab asleep at the wrong moment. Rather than diagnose, give
      // it a deadline: still resolving well past when the clash should have ended means try again.
      const resolving=data.phase==='resolving';
      const unseen=resolving&&ctx.resolvingVersion!==data.version;
      const overdue=resolving&&ctx.resolvingAt&&Date.now()-ctx.resolvingAt>RESOLUTION_RETRY_AFTER;
      if(overdue){ctx.resolvingVersion=-1;ctx.resolvingAt=0;clearTimeout(ctx.claimTimer);ctx.claimTimer=null}
      if(data.version>ctx.loadedVersion||unseen||overdue)handleMatch(data);
  }

  // Setting up the battlefield is a once-per-match act. The guards are deliberately layered:
  // a match past the lobby has already begun, a version above zero has already been written,
  // and a client that has ever loaded a state is mid-duel. Any one of them firing wrongly
  // would stamp a fresh round one over a live match.
  async function initializeMatch(row){
    if(ctx.initializing||!row.guest_deck||row.game_state)return;
    if(row.phase!=='lobby'||row.version>0||ctx.loadedVersion>=0){
      setStatus('The battlefield is already prepared. Reload if the board looks wrong.',true);return;
    }
    ctx.initializing=true;
    try{
      const rule=ruleById(row.decree_id)||calendarRule();currentRule=rule;
      game={round:1,player:createSide(row.host_deck),ai:createSide(row.guest_deck),aiProfile:'online',aiDifficulty:'online',decreeId:rule.id,blockedLane:rule.id==='river'?3:null,locked:false,logs:[]};
      drawOpeningHand(game.player);drawOpeningHand(game.ai);log('Two rulers enter the realm and begin planning in secret.');
      const state=JSON.parse(JSON.stringify(game));
      const {error}=await client.from('kingdom_matches').update({game_state:state,phase:'planning',round:1,version:1,updated_at:new Date().toISOString()}).eq('id',row.id).eq('version',row.version);
      if(error)throw error;
    }catch(error){setStatus(error.message,true)}finally{ctx.initializing=false}
  }

  function showOnlineResult(row){
    const mine=row.winner==='draw'?'draw':row.winner===ctx.seat?'win':'loss';
    const title=mine==='win'?'Victory for your kingdom':mine==='loss'?'Your banner has fallen':'The realms lie in ruin';
    showModal(`<p class="eyebrow">ONLINE BATTLE CONCLUDED</p><h2>${title}</h2><p>${mine==='win'?'Your rival has been defeated.':'Return to the hall and challenge them again.'}</p><div class="modal-actions"><button class="button primary" data-online-home>Return to hall</button></div>`);
    $('[data-online-home]').onclick=()=>{closeModal();leave()};
  }

  function clearResolutionAttempt(){
    clearTimeout(ctx.claimTimer);ctx.claimTimer=null;ctx.resolvingVersion=-1;ctx.resolvingAt=0;
  }

  function runResolution(row){
    ctx.resolvingAt=Date.now();
    try{resolveOnlinePlans(row.revealed_plans.host,row.revealed_plans.guest,ctx.seat,row.round)}
    catch(error){resolutionFailed(error)}
  }

  async function attemptResolution(row){
    ctx.claimTimer=null;
    if(!ctx.active||ctx.match?.id!==row.id||ctx.match?.phase!=='resolving'||ctx.match?.version!==row.version)return clearResolutionAttempt();
    // Old deployed schemas still work for hosts while the migration is being applied.
    if(ctx.leaseProtocol===false){if(ctx.seat==='host')runResolution(row);else clearResolutionAttempt();return}
    try{
      const {data,error}=await withTimeout(client.rpc('claim_kingdom_resolution',{p_match:row.id,p_version:row.version}));
      if(error)throw error;
      ctx.leaseProtocol=true;
      if(data===true)return runResolution(row);
      clearResolutionAttempt();
    }catch(error){
      if(missingLeaseRpc(error)){
        ctx.leaseProtocol=false;
        if(ctx.seat==='host')runResolution(row);
        else{clearResolutionAttempt();setStatus('Both rulers committed. Waiting for the host (database migration pending)…')}
      }else{clearResolutionAttempt();setStatus('Could not claim the clash — retrying. '+formatError(error),true)}
    }
  }

  function scheduleResolution(row){
    if(!row.revealed_plans||ctx.resolvingVersion===row.version||ctx.claimTimer)return;
    if(ctx.leaseProtocol===false&&ctx.seat!=='host')return;
    ctx.resolvingVersion=row.version;ctx.resolvingAt=Date.now();
    // The host normally resolves immediately. The guest waits briefly, then acts as failover.
    ctx.claimTimer=setTimeout(()=>attemptResolution(row),ctx.seat==='host'?0:GUEST_CLAIM_DELAY);
  }

  async function handleMatch(row){
    if(!ctx.active||row.id!==ctx.match.id)return;ctx.match=row;
    if(row.phase!=='resolving'&&ctx.resolvingVersion!==-1)clearResolutionAttempt();
    // Only a match still in the lobby wants preparing. Keying this on a missing game_state
    // meant any payload the host read as stateless reset a duel in progress to round one.
    if(ctx.seat==='host'&&row.status==='playing'&&row.phase==='lobby'&&!row.game_state){setStatus(`${row.guest_name} joined. Preparing the battlefield…`);await initializeMatch(row);return}
    if(row.status==='waiting'){setStatus(`Room ${row.room_code} is ready. Share this code and keep this page open.`);return}
    if(row.game_state&&row.version>ctx.loadedVersion){
      ctx.loadedVersion=row.version;startOnlineGame(row.game_state,ctx.seat,names());
      if(row.phase==='planning'){$('#commitButton').textContent='Commit plans ⚔';setStatus(`Round ${row.round}: plan in secret.`)}
      if(row.phase==='finished')showOnlineResult(row);
    }
    if(row.phase==='resolving'){
      setStatus(ctx.seat==='host'?'Both rulers committed. Revealing the battlefield…':'Both rulers committed. Preparing the clash…');
      scheduleResolution(row);
    }
  }

  async function createRoom(){
    const deck=playableDeck(),name=cleanName();if(!deck)return;if(!name){setStatus('Enter your ruler name first.',true);return}
    setStatus('Creating a private room…');
    try{await connect();localStorage.setItem('kingdom-online-name',name);const {data,error}=await client.rpc('create_kingdom_match',{p_name:name,p_deck:deck,p_decree:currentRule.id});if(error)throw error;const row=rowOf(data);await watchMatch(row,'host');setRoomView('waiting',row.room_code,'Share this code with your rival. The battle begins the moment they join.')}
    catch(error){setStatus(formatError(error),true)}
  }

  async function joinRoom(){
    const deck=playableDeck(),name=cleanName(),code=cleanCode();if(!deck)return;if(!name){setStatus('Enter your ruler name first.',true);return}if(code.length!==6){setStatus('Enter the six-character room code.',true);return}
    if(ctx.active&&ctx.seat==='host'&&code===ctx.match?.room_code){setStatus('That is your own room — the code is for your rival. Open another tab or device to duel yourself.',true);return}
    setStatus('Joining the room…');
    try{await connect();localStorage.setItem('kingdom-online-name',name);const {data,error}=await client.rpc('join_kingdom_match',{p_code:code,p_name:name,p_deck:deck});if(error)throw error;await watchMatch(rowOf(data),'guest');setRoomView('waiting',code,'Joined. Waiting for the host to prepare the battlefield…')}
    catch(error){setStatus(formatError(error),true)}
  }

  function formatError(error){
    const message=error?.message||String(error);if(/function .* does not exist|schema cache|relation .* does not exist/i.test(message))return `Multiplayer database error: ${message}`;
    if(/anonymous sign-ins/i.test(message))return 'Enable Anonymous Sign-Ins in Supabase Authentication settings.';return message;
  }

  async function submitPlan(side){
    let lastError;
    for(let attempt=0;attempt<3;attempt++){
      try{
        const {error}=await withTimeout(client.rpc('submit_kingdom_plan',{p_match:ctx.match.id,p_round:game.round,p_side:side}));
        if(error)throw error;
        return;
      }catch(error){
        lastError=error;
        // A timeout can mean the write succeeded but its response was lost. Re-read before
        // retrying; the upsert itself is idempotent if the match is still accepting plans.
        let data;try{({data}=await withTimeout(client.from('kingdom_matches').select('*').eq('id',ctx.match.id).maybeSingle()))}catch(_){}
        if(data&&(data.phase!=='planning'||data.round!==game.round)){handleMatch(data);return}
        if(attempt<2)await wait(500*(attempt+1));
      }
    }
    throw lastError;
  }

  async function commit(){
    if(!ctx.active||game.locked)return;game.locked=true;selectedUid=null;renderGame();$('#commitButton').textContent='Waiting for rival…';setStatus('Plans committed. Your rival still cannot see them.');
    try{const side=JSON.parse(JSON.stringify(game.player));await submitPlan(side)}
    catch(error){
      game.locked=false;renderGame();setStatus(formatError(error),true);
      // Refused because the table is on a different round or still resolving: this board is
      // out of step rather than broken, so pull the authoritative row and fall back into line.
      if(/no longer accepting plans/i.test(error?.message||'')){
        const {data}=await client.from('kingdom_matches').select('*').eq('id',ctx.match.id).maybeSingle();
        if(data){ctx.loadedVersion=-1;ctx.resolvingVersion=-1;handleMatch(data);setStatus('That round had already moved on — your board is back in step. Commit again.',true)}
      }
    }
  }

  async function resolved(result){
    if(!ctx.active)return false;
    const finished=Boolean(result),otherSeat=ctx.seat==='host'?'guest':'host';
    const winner=result==='draw'?'draw':result==='win'?ctx.seat:result==='loss'?otherSeat:null;
    // The expected version is read once. Reading it again for the guard would let a payload
    // arriving mid-call move the target, writing a version derived from a row we never saw.
    const expected=ctx.match.version,matchId=ctx.match.id;
    const state=onlineCanonicalState(),values={game_state:state,round:game.round,version:expected+1,revealed_plans:null,phase:finished?'finished':'planning',status:finished?'finished':'playing',winner,updated_at:new Date().toISOString()};
    let data,error;
    if(ctx.leaseProtocol===true){
      ({data,error}=await withTimeout(client.rpc('finish_kingdom_resolution',{p_match:matchId,p_version:expected,p_state:state,p_round:game.round,p_result:winner})));
      data=rowOf(data);
    }else if(ctx.seat==='host'){
      ({data,error}=await withTimeout(client.from('kingdom_matches').update(values).eq('id',matchId).eq('version',expected).select('*')));
      data=rowOf(data);
    }else{return false}
    if(error){clearResolutionAttempt();setStatus(formatError(error),true);syncNow(matchId);return false}
    // No row matched: the match moved on beneath us. Rather than diverge in silence, take
    // whatever is authoritative now and carry on from there.
    if(!data){
      const {data:fresh}=await client.from('kingdom_matches').select('*').eq('id',matchId).maybeSingle();
      clearResolutionAttempt();if(fresh)handleMatch(fresh);
      return false;
    }
    clearResolutionAttempt();await handleMatch(data);return true;
  }

  function resolutionFailed(error){
    clearResolutionAttempt();setStatus('The clash failed to resolve — retrying. '+(error?.message||error),true);syncNow();
  }

  async function leave(){
    ctx.active=false;clearInterval(ctx.poll);clearTimeout(ctx.claimTimer);ctx.poll=null;ctx.claimTimer=null;if(ctx.channel&&client)await client.removeChannel(ctx.channel);ctx.channel=null;ctx.match=null;ctx.loadedVersion=-1;ctx.resolvingVersion=-1;ctx.resolvingAt=0;game=null;showScreen('home');setStatus('');setRoomView('setup');
  }

  // A hidden tab has its timers throttled to a crawl, so the poll above may not have run for
  // some time. Catch up the moment the ruler looks back at the board.
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&ctx.active)syncNow()});
  window.addEventListener('focus',()=>{if(ctx.active)syncNow()});

  codeEl.addEventListener('input',()=>{codeEl.value=cleanCode()});
  $('#createRoom').onclick=createRoom;$('#joinRoom').onclick=joinRoom;$('#leaveRoom').onclick=leave;
  const originalLeave=$('#leaveGame').onclick;$('#leaveGame').onclick=()=>ctx.active?leave():originalLeave();
  const originalRestart=$('#restartGame').onclick;$('#restartGame').onclick=()=>ctx.active?setStatus('Leave the room before starting a different battle.',true):originalRestart();
  // An escape hatch for a duel that has gone quiet: re-reads the table and, for a host,
  // re-attempts a resolution it had already marked as handled.
  function nudge(){if(!ctx.active)return;clearResolutionAttempt();ctx.loadedVersion=Math.min(ctx.loadedVersion,ctx.match?.version??ctx.loadedVersion);syncNow()}
  window.kingdomMultiplayer={get active(){return ctx.active},commit,resolved,resolutionFailed,leave,nudge,
    get diagnostics(){return {seat:ctx.seat,active:ctx.active,loadedVersion:ctx.loadedVersion,resolvingVersion:ctx.resolvingVersion,
      resolvingFor:ctx.resolvingAt?Math.round((Date.now()-ctx.resolvingAt)/1000)+'s':null,leaseProtocol:ctx.leaseProtocol,claimPending:!!ctx.claimTimer,
      row:ctx.match&&{phase:ctx.match.phase,round:ctx.match.round,version:ctx.match.version,hasPlans:!!ctx.match.revealed_plans},
      local:game&&{round:game.round,locked:game.locked,pending:game.player?.pendingDraws}}}};
})();
