(() => {
  const SUPABASE_URL='https://eqnkjhhsvfxlhsmebclo.supabase.co';
  const SUPABASE_KEY='sb_publishable_7ULebdQSBz9PXz-W-j6vlA_cB73Y0Sy';
  const statusEl=$('#onlineStatus'),nameEl=$('#onlineName'),codeEl=$('#roomCode');
  const savedName=localStorage.getItem('kingdom-online-name');if(savedName)nameEl.value=savedName;
  const ctx={active:false,seat:null,match:null,channel:null,loadedVersion:-1,resolvingVersion:-1,initializing:false};
  let client=null;

  const setStatus=(message,error=false)=>{statusEl.textContent=message||'';statusEl.classList.toggle('error',error)};
  const cleanName=()=>nameEl.value.trim().slice(0,24);
  const cleanCode=()=>codeEl.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);
  const rowOf=data=>Array.isArray(data)?data[0]:data;
  const names=()=>({host:ctx.match?.host_name||'Host',guest:ctx.match?.guest_name||'Guest'});
  const playableDeck=()=>{const deck=activeDeck();if(!deckIsPlayable(deck)){showScreen('deck');$('#deckMessage').textContent=`“${deck.name}” needs exactly ${DECK_SIZE} cards before entering an online duel.`;return null}return deck.cards.slice()};

  async function connect(){
    if(!window.supabase?.createClient)throw new Error('The multiplayer library did not load. Check your connection and refresh.');
    if(!client)client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true}});
    let {data:{session}}=await client.auth.getSession();
    if(!session){const result=await client.auth.signInAnonymously();if(result.error)throw result.error;session=result.data.session}
    return session;
  }

  async function watchMatch(row,seat){
    ctx.active=true;ctx.seat=seat;ctx.match=row;ctx.loadedVersion=-1;ctx.resolvingVersion=-1;
    if(ctx.channel)await client.removeChannel(ctx.channel);
    ctx.channel=client.channel(`kingdom-${row.id}`).on('postgres_changes',{
      event:'UPDATE',schema:'public',table:'kingdom_matches',filter:`id=eq.${row.id}`
    },payload=>handleMatch(payload.new)).subscribe();
    handleMatch(row);
  }

  async function initializeMatch(row){
    if(ctx.initializing||!row.guest_deck||row.game_state)return;ctx.initializing=true;
    try{
      const rule=META_RULES.find(r=>r.id===row.decree_id)||calendarRule();currentRule=rule;
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

  async function handleMatch(row){
    if(!ctx.active||row.id!==ctx.match.id)return;ctx.match=row;
    if(ctx.seat==='host'&&row.status==='playing'&&!row.game_state){setStatus(`${row.guest_name} joined. Preparing the battlefield…`);await initializeMatch(row);return}
    if(row.status==='waiting'){setStatus(`Room ${row.room_code} is ready. Share this code and keep this page open.`);return}
    if(row.game_state&&row.version>ctx.loadedVersion){
      ctx.loadedVersion=row.version;startOnlineGame(row.game_state,ctx.seat,names());
      if(row.phase==='planning'){$('#commitButton').textContent='Commit plans ⚔';setStatus(`Round ${row.round}: plan in secret.`)}
      if(row.phase==='finished')showOnlineResult(row);
    }
    if(row.phase==='resolving'){
      setStatus('Both rulers committed. Revealing the battlefield…');
      if(ctx.seat==='host'&&row.revealed_plans&&ctx.resolvingVersion!==row.version){ctx.resolvingVersion=row.version;resolveOnlinePlans(row.revealed_plans.host,row.revealed_plans.guest)}
    }
  }

  async function createRoom(){
    const deck=playableDeck(),name=cleanName();if(!deck)return;if(!name){setStatus('Enter your ruler name first.',true);return}
    setStatus('Creating a private room…');
    try{await connect();localStorage.setItem('kingdom-online-name',name);const {data,error}=await client.rpc('create_kingdom_match',{p_name:name,p_deck:deck,p_decree:currentRule.id});if(error)throw error;const row=rowOf(data);await watchMatch(row,'host');codeEl.value=row.room_code}
    catch(error){setStatus(formatError(error),true)}
  }

  async function joinRoom(){
    const deck=playableDeck(),name=cleanName(),code=cleanCode();if(!deck)return;if(!name){setStatus('Enter your ruler name first.',true);return}if(code.length!==6){setStatus('Enter the six-character room code.',true);return}
    setStatus('Joining the room…');
    try{await connect();localStorage.setItem('kingdom-online-name',name);const {data,error}=await client.rpc('join_kingdom_match',{p_code:code,p_name:name,p_deck:deck});if(error)throw error;await watchMatch(rowOf(data),'guest');setStatus('Joined. Waiting for the host to prepare the battlefield…')}
    catch(error){setStatus(formatError(error),true)}
  }

  function formatError(error){
    const message=error?.message||String(error);if(/function .* does not exist|schema cache|relation .* does not exist/i.test(message))return `Multiplayer database error: ${message}`;
    if(/anonymous sign-ins/i.test(message))return 'Enable Anonymous Sign-Ins in Supabase Authentication settings.';return message;
  }

  async function commit(){
    if(!ctx.active||game.locked)return;game.locked=true;selectedUid=null;renderGame();$('#commitButton').textContent='Waiting for rival…';setStatus('Plans committed. Your rival still cannot see them.');
    try{const side=JSON.parse(JSON.stringify(game.player));const {error}=await client.rpc('submit_kingdom_plan',{p_match:ctx.match.id,p_round:game.round,p_side:side});if(error)throw error}
    catch(error){game.locked=false;renderGame();setStatus(formatError(error),true)}
  }

  async function resolved(result){
    if(!ctx.active||ctx.seat!=='host')return;
    const finished=Boolean(result),winner=result==='draw'?'draw':result==='win'?'host':result==='loss'?'guest':null;
    const state=onlineCanonicalState(),nextVersion=ctx.match.version+1;
    const values={game_state:state,round:game.round,version:nextVersion,revealed_plans:null,phase:finished?'finished':'planning',status:finished?'finished':'playing',winner,updated_at:new Date().toISOString()};
    const {error}=await client.from('kingdom_matches').update(values).eq('id',ctx.match.id).eq('version',ctx.match.version);if(error){setStatus(error.message,true);return}
    if(finished)showOnlineResult({...ctx.match,...values});
  }

  async function leave(){
    ctx.active=false;if(ctx.channel&&client)await client.removeChannel(ctx.channel);ctx.channel=null;ctx.match=null;ctx.loadedVersion=-1;game=null;showScreen('home');setStatus('');
  }

  codeEl.addEventListener('input',()=>{codeEl.value=cleanCode()});
  $('#createRoom').onclick=createRoom;$('#joinRoom').onclick=joinRoom;
  const originalLeave=$('#leaveGame').onclick;$('#leaveGame').onclick=()=>ctx.active?leave():originalLeave();
  const originalRestart=$('#restartGame').onclick;$('#restartGame').onclick=()=>ctx.active?setStatus('Leave the room before starting a different battle.',true):originalRestart();
  window.kingdomMultiplayer={get active(){return ctx.active},commit,resolved,leave};
})();
