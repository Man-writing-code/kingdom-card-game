const CARDS = {
  logging:{name:'Logging Camp',type:'building',icon:'♧',accent:'#51734d',cost:{},text:'Harvest 1 wood after each clash.',produce:{material:1}},
  mining:{name:'Mining Camp',type:'building',icon:'◆',accent:'#65717a',cost:{},text:'Harvest 1 metal after each clash.',produce:{metal:1}},
  farm:{name:'Farm',type:'building',icon:'♨',accent:'#87964c',cost:{},text:'Harvest 1 food after each clash.',produce:{food:1}},
  goldmine:{name:'Gold Mine',type:'building',icon:'●',accent:'#b4852f',cost:{},text:'Produce 1 gold after every second clash.',special:'goldmine'},
  townhall:{name:'Town Hall',type:'building',icon:'♜',accent:'#955a3b',cost:{material:3},text:'Recruit a random worker at the start of each new round. It costs nothing to deploy.',special:'townhall'},
  university:{name:'University',type:'building',icon:'✦',accent:'#5a5481',cost:{material:3},text:'Draw one additional card each new hand.',special:'university'},
  soldier:{name:'Soldier',type:'unit',icon:'⚔',accent:'#8b4b38',cost:{food:1,metal:1},power:2,text:''},
  farmer:{name:'Farmer',type:'unit',icon:'♟',accent:'#87964c',cost:{food:1},power:1,text:'Harvest 1 food after each clash.',special:'worker',produce:{food:1}},
  lumberjack:{name:'Lumberjack',type:'unit',icon:'♣',accent:'#51734d',cost:{material:1},power:1,text:'Harvest 1 wood after each clash.',special:'worker',produce:{material:1}},
  miner:{name:'Miner',type:'unit',icon:'♦',accent:'#65717a',cost:{metal:1},power:1,text:'Harvest 1 metal after each clash.',special:'worker',produce:{metal:1}},
  firesapper:{name:'Fire Sapper',type:'unit',icon:'♨',accent:'#a84d32',cost:{material:1},power:0,text:'At the clash, burns itself out and destroys the opposing unit in its lane.',special:'sapper'},
  knight:{name:'Knight',type:'unit',icon:'♞',accent:'#475b73',cost:{food:1,metal:2},power:2,text:'Gains +2 power when facing an opposing unit.',special:'knight'},
  lumbermill:{name:'Sawmill',type:'building',icon:'♧',accent:'#406a46',cost:{material:2,food:1},text:'Harvest 2 wood after each clash.',produce:{material:2}},
  foundry:{name:'Forge',type:'building',icon:'♢',accent:'#59636a',cost:{metal:2,food:1},text:'Harvest 2 metal after each clash.',produce:{metal:2}},
  granary:{name:'Mill',type:'building',icon:'≋',accent:'#889448',cost:{food:2,material:1},text:'Harvest 2 food after each clash.',produce:{food:2}},
  market:{name:'Market',type:'building',icon:'¤',accent:'#9a7739',cost:{material:2,gold:1},text:'Produce 1 gold after each clash.',produce:{gold:1}},
  watchtower:{name:'Watchtower',type:'building',icon:'♖',accent:'#596856',cost:{material:2},text:'The friendly unit in this lane has +1 power.',special:'watchtower'},
  archer:{name:'Archer',type:'unit',icon:'➶',accent:'#6a7750',cost:{material:2},power:2,text:''},
  pikeman:{name:'Pikeman',type:'unit',icon:'↟',accent:'#596676',cost:{food:1,metal:2},power:2,text:'Gains +1 power for each round it has held its lane, up to +3.',special:'entrench'},
  merchant:{name:'Merchant',type:'unit',icon:'$',accent:'#a37835',cost:{food:1,gold:1},power:1,text:'Produces 1 gold if unblocked after combat.',special:'merchant'},
  ranger:{name:'Ranger',type:'unit',icon:'⌁',accent:'#3e714d',cost:{food:2,material:1},power:3,text:''},
  champion:{name:'Champion',type:'unit',icon:'♛',accent:'#944d39',cost:{food:2,metal:2,gold:1},power:5,text:''},
  militia:{name:'Militia',type:'unit',icon:'⚑',accent:'#75664d',cost:{food:1,material:1},power:2,text:''},
  peasant:{name:'Peasant',type:'unit',icon:'♟',accent:'#9a8147',cost:{food:1},power:1,text:'A generated 1-power unit. Peasants vanish when they leave the battlefield.',special:'peasant',token:true},
  villagecommons:{name:'Village Commons',type:'building',icon:'⌂',accent:'#8b9548',cost:{food:2},text:'At the start of each round, adds a Peasant to your hand.',special:'commons'},
  peasantmob:{name:'Peasant Mob',type:'unit',icon:'⚑',accent:'#9b733d',cost:{food:2},power:2,text:'Gains +1 power for each friendly unit in an adjacent lane.',special:'mob'},
  manatarms:{name:'Man-at-Arms',type:'unit',icon:'⚔',accent:'#596779',cost:{metal:2},power:3,text:''},
  gatehouse:{name:'Gatehouse',type:'building',icon:'♜',accent:'#566573',cost:{material:1,metal:2},text:'When revealed, raise 2 fortification. The friendly unit in this lane has +1 power.',special:'gatehouse'},
  batteringram:{name:'Battering Ram',type:'unit',icon:'➠',accent:'#59636a',cost:{material:1,metal:3},power:4,text:'After surviving against a building, destroys it instead of striking the ruler, then becomes a 1-power Damaged Ram.',special:'ram'},
  rabblerouser:{name:'Rabble-Rouser',type:'unit',icon:'⚑',accent:'#a86f3b',cost:{food:2},power:2,text:'When revealed, generates a Peasant in your hand.',special:'rabble'},
  boarriders:{name:'Boar Riders',type:'unit',icon:'♞',accent:'#9b613c',cost:{food:4},power:3,text:'Gains +1 power for each friendly unit in an adjacent lane.',special:'boarriders'},
  palisade:{name:'Palisade',type:'building',icon:'╫',accent:'#6f7844',cost:{material:2},text:'Reduces direct damage through this lane by 2.',special:'palisade'},
  wallwarden:{name:'Wall Warden',type:'unit',icon:'♜',accent:'#68734c',cost:{material:2},power:1,text:'Gains +2 power while sharing a lane with a friendly building.',special:'wallwarden'},
  royalguard:{name:'Royal Guard',type:'unit',icon:'♛',accent:'#4e637b',cost:{metal:3},power:4,text:''},
  armoury:{name:'Armoury',type:'building',icon:'⚒',accent:'#566779',cost:{metal:2},text:'The friendly unit in this lane has +1 power.',special:'armoury'},
  huntsman:{name:'Huntsman',type:'unit',icon:'➶',accent:'#557448',cost:{food:1,material:1},power:2,text:'After winning a unit clash and surviving, gain 1 wood.',special:'huntsman'},
  huntinglodge:{name:'Hunting Lodge',type:'building',icon:'⌂',accent:'#657348',cost:{food:1,material:2},text:'When this lane’s unit deals direct damage, gain 1 food.',special:'huntinglodge'},
  ballista:{name:'Ballista Emplacement',type:'building',icon:'➠',accent:'#566a67',cost:{material:2,metal:2},text:'Before combat, destroys itself and an opposing unit with at least 4 current power.',special:'ballista'},
  paviseguard:{name:'Pavise Guard',type:'unit',icon:'◈',accent:'#566b72',cost:{material:1,metal:2},power:2,text:'The first time it would fall during normal unit combat, it survives permanently damaged at 1 power.',special:'pavise'},
  mason:{name:'Mason',type:'unit',icon:'▨',accent:'#7c8792',cost:{metal:1},power:1,text:'Raises 1 fortification after each clash.',special:'mason'}
};
// The Lancer and Banner Captain (the Charge mechanic) are shelved for now; their art stays under
// assets/cards/ and normaliseCollection/sanitizeDeck already scrub them from old saves.

const WORKERS=['farmer','lumberjack','miner'];
const TIER_TWO=['lumbermill','foundry','granary'];
const ARCHETYPE_CARDS=['villagecommons','peasantmob','manatarms','gatehouse','batteringram'];
const COLLECTIBLE_IDS=Object.keys(CARDS).filter(id=>!CARDS[id].token);
const INITIAL_UNLOCKED=['logging','mining','farm','goldmine','townhall','university','soldier','farmer','lumberjack','miner','firesapper','knight','archer',...TIER_TWO,...ARCHETYPE_CARDS];
const PRE_ARCHER_DEFAULT=['logging','mining','mining','farm','lumbermill','foundry','granary','goldmine','goldmine','townhall','townhall','university','soldier','soldier','farmer','lumberjack','miner','firesapper','knight','knight'];
const DEFAULT_DECK=['logging','mining','mining','farm','lumbermill','foundry','granary','goldmine','goldmine','townhall','townhall','university','soldier','soldier','farmer','lumberjack','miner','firesapper','knight','archer'];
// The General, Wood Architect and Commons Rush banners are retired for now; their cards remain
// in the pool, and git history holds the lists if any of them is wanted back.
const AI_DECKS={
  uprising:['farm','farm','farm','farm','farmer','farmer','rabblerouser','rabblerouser','rabblerouser','rabblerouser','peasantmob','peasantmob','peasantmob','peasantmob','villagecommons','villagecommons','granary','granary','lumberjack','lumberjack'],
  forestfire:['firesapper','firesapper','firesapper','firesapper','logging','logging','logging','logging','lumbermill','lumbermill','lumbermill','farm','farm','university','university','university','lumberjack','lumberjack','lumberjack','wallwarden'],
  strikesteel:['royalguard','royalguard','royalguard','royalguard','manatarms','manatarms','manatarms','manatarms','armoury','armoury','mining','mining','mining','mining','miner','miner','miner','miner','foundry','goldmine'],
  metal:['mining','mining','mining','mining','foundry','foundry','farm','farm','logging','logging','manatarms','manatarms','royalguard','royalguard','armoury','armoury','gatehouse','batteringram','ballista','paviseguard'],
  timber:['logging','logging','logging','logging','lumbermill','lumbermill','lumbermill','farm','farm','university','university','lumberjack','archer','archer','archer','archer','firesapper','firesapper','firesapper','firesapper'],
  siege:['mining','mining','mining','mining','logging','logging','foundry','batteringram','batteringram','batteringram','batteringram','manatarms','manatarms','manatarms','manatarms','paviseguard','paviseguard','firesapper','firesapper','firesapper']
};
const AI_PROFILE_NAMES={uprising:'VILLAGE UPRISING',forestfire:'FOREST FIRE',strikesteel:'STRIKE STEEL',metal:'IRON CROWN',timber:'TIMBER SCHOLARS',siege:'SIEGE TRAIN'};
const PRE_TIER_TWO_DECK=['logging','logging','mining','mining','mining','farm','farm','goldmine','goldmine','townhall','townhall','university','soldier','soldier','farmer','lumberjack','miner','firesapper','knight','knight'];
const META_RULES=[
// Guild Charters is retired: it only ever touched the three tier-two engines, so a week could
// land on it and change nothing at all for a collection that held none of them. A decree should
// reshape the week for every banner, not just the ones holding the right three cards.
  {id:'winter',icon:'❄',name:'The Long Winter',text:'Food, Metal, and Wood buildings produce 1 less; surviving workers produce 1 extra.',flavour:'“Storehouses empty. Calloused hands endure.”'},
  {id:'tradefair',icon:'¤',name:'The Grand Fair',text:'Markets produce +1 Gold, Gold Mines pay every round, and Merchants gain +1 power.',flavour:'“Every road leads to the royal market.”'},
  {id:'leancourt',icon:'Ⅰ',name:'The Lean Court',text:'Each ruler draws only 1 base card at the start of a new round.',flavour:'“Every summons must earn its place at court.”'},
  {id:'longmuster',icon:'Ⅲ',name:'The Long Muster',text:'Each ruler begins with 3 cards, then draws 3 base cards at the start of each new round.',flavour:'“The host assembles slowly, then all at once.”'},
  {id:'river',icon:'≈',name:'The River Runs High',text:'The easternmost lane is flooded for both rulers, leaving only 3 active lanes.',flavour:'“The river takes no side, only ground.”'}
];

// Development builds may override the calendar decree. Set this to false for the live rotation.
const DEV_BUILD=true;

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SAVE_VERSION=5;
// The collection is a fixed roster of designs; decks are drawn from it and may repeat a design.
const COLLECTION_SIZE=20, DECK_SIZE=20, MAX_COPIES=4, HAND_LIMIT=10;
const startOfDay=d=>new Date(d.getFullYear(),d.getMonth(),d.getDate());
const weekKey=()=>{const d=startOfDay(new Date()),jan=new Date(d.getFullYear(),0,1),days=Math.round((d-jan)/86400000);return `${d.getFullYear()}-${Math.ceil((days+jan.getDay()+1)/7)}`};
const weekIndex=()=>Number(weekKey().split('-')[1]);
// A blank modifier for testing cards without a decree distorting the result. Deliberately kept out of
// META_RULES so it never comes up in the calendar rotation, but it must still resolve by id for
// multiplayer, where the guest looks the host's chosen decree back up.
const NO_RULE={id:'none',icon:'○',name:'No Decree',text:'No weekly modifier is in effect.',flavour:'“A quiet week. The realm holds its breath.”'};
const ALL_RULES=[...META_RULES,NO_RULE];
const ruleById=id=>ALL_RULES.find(rule=>rule.id===id);
const calendarRule=()=>META_RULES[weekIndex()%META_RULES.length];
// DEV_BUILD gates whether the tools exist at all; devMode is the runtime toggle within a dev build,
// so the panel can be closed without losing the override you set.
const storedDevMode=localStorage.getItem('kingdom-dev-mode');
let devMode=DEV_BUILD&&(storedDevMode===null?true:storedDevMode==='1');
let currentRule=calendarRule(),game=null,selectedUid=null,deckFilter='all',meta=null,countdownTimer=null;
const readStore=()=>{try{return JSON.parse(localStorage.getItem('kingdom-meta')||'{}')||{}}catch(e){return {}}};
const saveMeta=()=>{try{localStorage.setItem('kingdom-meta',JSON.stringify(meta))}catch(e){}};
function sanitizeDeck(deck,unlocked){const counts={},out=[];for(const id of deck||[]){if(!CARDS[id]||!unlocked.includes(id))continue;if(out.length>=DECK_SIZE)break;counts[id]=(counts[id]||0)+1;if(counts[id]>MAX_COPIES)continue;out.push(id)}return out}
function buildDefaultDeck(unlocked){const deck=sanitizeDeck(DEFAULT_DECK,unlocked),pool=unlocked.filter(id=>CARDS[id]);for(let i=0;deck.length<DECK_SIZE&&pool.length&&i<pool.length*5;i++){const id=pool[i%pool.length];if(deck.filter(x=>x===id).length<MAX_COPIES)deck.push(id)}return deck}
// The collection is a fixed roster of exactly COLLECTION_SIZE designs. Packs swap one in for one out,
// so this only ever has to trim an oversized save or top up a short one, in declared order.
function normaliseCollection(ids){
  const out=[...new Set((ids||[]).filter(id=>CARDS[id]&&!CARDS[id].token))];
  for(const id of [...INITIAL_UNLOCKED,...COLLECTIBLE_IDS]){if(out.length>=COLLECTION_SIZE)break;if(!out.includes(id))out.push(id)}
  return out.slice(0,COLLECTION_SIZE);
}
// INITIAL_UNLOCKED is the starting roster and must fit COLLECTION_SIZE; anything past the cap is
// dropped in declared order, so say which cards fell off rather than trimming them silently.
if(DEV_BUILD&&INITIAL_UNLOCKED.length!==COLLECTION_SIZE){
  const kept=normaliseCollection(INITIAL_UNLOCKED);
  console.warn(`Kingdom: INITIAL_UNLOCKED declares ${INITIAL_UNLOCKED.length} designs but the collection holds ${COLLECTION_SIZE}.`,
    INITIAL_UNLOCKED.length>COLLECTION_SIZE?`Dropped: ${INITIAL_UNLOCKED.filter(id=>!kept.includes(id)).join(', ')}. Reorder INITIAL_UNLOCKED to change which.`
      :`Topped up with: ${kept.filter(id=>!INITIAL_UNLOCKED.includes(id)).join(', ')}.`);
}
let deckSeq=0;
const newDeckId=()=>`d${Date.now().toString(36)}${(deckSeq++).toString(36)}${Math.random().toString(36).slice(2,6)}`;
const deckName=n=>String(n||'').trim().slice(0,28)||'Untitled banner';
function makeDeck(name,cards){return {id:newDeckId(),name:deckName(name),cards:cards||[]}}
function activeDeck(){
  if(!meta.decks.length)meta.decks.push(makeDeck('First Banner',buildDefaultDeck(meta.unlocked)));
  const found=meta.decks.find(d=>d.id===meta.activeDeckId);
  if(found)return found;
  meta.activeDeckId=meta.decks[0].id;return meta.decks[0];
}
function sanitizeDevDeck(deck){
  const counts={},out=[];
  for(const id of deck||[]){if(!COLLECTIBLE_IDS.includes(id)||out.length>=DECK_SIZE)continue;counts[id]=(counts[id]||0)+1;if(counts[id]<=MAX_COPIES)out.push(id)}
  return out;
}
let devDeck=[];
function readDevDeck(){
  try{const stored=JSON.parse(localStorage.getItem('kingdom-dev-deck')||'null');if(Array.isArray(stored))return sanitizeDevDeck(stored)}catch(e){}
  const active=sanitizeDevDeck(activeDeck().cards);return active.length===DECK_SIZE?active:buildDefaultDeck(meta.unlocked);
}
const saveDevDeck=()=>{try{localStorage.setItem('kingdom-dev-deck',JSON.stringify(devDeck))}catch(e){}};
const resetDevDeck=()=>{const active=sanitizeDevDeck(activeDeck().cards);devDeck=active.length===DECK_SIZE?active:buildDefaultDeck(meta.unlocked);saveDevDeck()};
const clearDevDeck=()=>{devDeck=[];saveDevDeck()};
const availableDesigns=()=>devMode?COLLECTIBLE_IDS:meta.unlocked;
const deckCards=d=>devMode?devDeck:d.cards;
const deckIsPlayable=d=>{const cards=deckCards(d);return cards.length===DECK_SIZE&&cards.every(id=>devMode?COLLECTIBLE_IDS.includes(id):meta.unlocked.includes(id))};
// v1 saves predate the worker split, the Fire Sapper and the tier-two buildings. Run once, then stamp
// the version, so a design sacrificed to a pack is not quietly restored on the next load.
function migrateSave(stored){
  if(stored.version===3){
    return {deck:stored.deck||[],unlocked:[...new Set([...(stored.unlocked||[]).filter(id=>CARDS[id]&&!CARDS[id].token),...ARCHETYPE_CARDS])]};
  }
  if(stored.version===2){
    const unlocked=[...new Set([...(stored.unlocked||[]).filter(id=>CARDS[id]&&!CARDS[id].token),'archer',...ARCHETYPE_CARDS])];
    const deck=JSON.stringify(stored.deck||[])===JSON.stringify(PRE_ARCHER_DEFAULT)?DEFAULT_DECK.slice():(stored.deck||[]);
    return {deck,unlocked};
  }
  let workerIndex=0;
  const deck=(stored.deck||[]).map(id=>id==='peasant'?WORKERS[workerIndex++%WORKERS.length]:id);
  const unlocked=[...new Set([...(stored.unlocked||INITIAL_UNLOCKED).filter(id=>id!=='peasant'&&CARDS[id]&&!CARDS[id].token),...WORKERS,'firesapper','archer',...TIER_TWO,...ARCHETYPE_CARDS])];
  const staleDefault=(stored.deck||[]).includes('peasant')||JSON.stringify(stored.deck||[])===JSON.stringify(PRE_TIER_TWO_DECK);
  return {deck:staleDefault?DEFAULT_DECK.slice():deck,unlocked};
}
function loadMeta(){
  const stored=readStore();
  const hasSavedDeckState=Array.isArray(stored.decks)||Array.isArray(stored.deck);
  const legacy=stored.version===SAVE_VERSION?null:migrateSave(stored);
  const unlocked=normaliseCollection(legacy?legacy.unlocked:stored.unlocked);
  // Saves before v5 held a single deck; fold it into the deck list as the first banner.
  const rawDecks=Array.isArray(stored.decks)&&stored.decks.length?stored.decks:[{name:'First Banner',cards:legacy?legacy.deck:stored.deck}];
  meta={version:SAVE_VERSION,unlocked,decks:[],activeDeckId:stored.activeDeckId||null,packWeek:stored.packWeek||null,winWeek:stored.winWeek||null};
  meta.decks=rawDecks.slice(0,12).map((d,i)=>({id:typeof d?.id==='string'&&d.id?d.id:newDeckId(),name:deckName(d?.name||`Banner ${i+1}`),cards:sanitizeDeck(d?.cards,unlocked)}));
  if(!meta.decks.length)meta.decks=[makeDeck('First Banner',buildDefaultDeck(unlocked))];
  // A first run has no stored deck, so the opening banner must be dealt a legal 20 or the player
  // lands on an empty deck and cannot start a game.
  if(!hasSavedDeckState&&!meta.decks[0].cards.length)meta.decks[0].cards=buildDefaultDeck(unlocked);
  if(!meta.decks.some(d=>d.id===meta.activeDeckId))meta.activeDeckId=meta.decks[0].id;
  // Existing call sites keep using meta.deck; it proxies to the active deck and stays out of storage.
  Object.defineProperty(meta,'deck',{get:()=>activeDeck().cards,set(v){activeDeck().cards=v},enumerable:false,configurable:true});
  saveMeta();
}
loadMeta();
if(meta)devDeck=readDevDeck();

function showScreen(name){
  $$('.screen').forEach(s=>s.classList.toggle('active',s.id===`${name}Screen`));
  $$('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.screen===name));
  document.body.dataset.screen=name;
  // A battle takes the whole viewport: the site nav is redundant next to the screen's own back arrow.
  document.body.classList.toggle('in-battle',name==='game');
  document.body.classList.toggle('in-hall',name==='home');
  if(name==='deck')renderDeckBuilder(); if(name==='collection')renderCollection();
  window.scrollTo(0,0);
}
function setHallMode(mode){
  const chosen=mode==='online'?'online':'solo';localStorage.setItem('kingdom-hall-mode',chosen);
  $$('[data-play-mode]').forEach(button=>{const active=button.dataset.playMode===chosen;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active))});
  $$('[data-mode-panel]').forEach(panel=>{const active=panel.dataset.modePanel===chosen;panel.classList.toggle('active',active);panel.hidden=!active});
}

const RESOURCE_NAMES={food:'Food',material:'Wood',metal:'Metal',gold:'Gold'};
const RESOURCE_GLYPHS={food:'<path d="M8 14V2M8 5C5 5 4 3 3 2c3 0 5 1 5 3Zm0 4c3 0 4-2 5-3-3 0-5 1-5 3Zm0 3c-3 0-4-2-5-3 3 0 5 1 5 3Z"/>',material:'<path d="M3 5h10v7H3zM3 8h10M5 5V3h6v2"/><circle cx="5" cy="8" r="1.5"/>',metal:'<path d="m4 4 8-1 3 9H1l3-8Z"/><path d="M4 4h8l-2 4H6L4 4Z"/>',gold:'<circle cx="8" cy="8" r="6"/><path d="m8 4 1.2 2.8L12 8 9.2 9.2 8 12 6.8 9.2 4 8l2.8-1.2L8 4Z"/>'};
// The realm's palette: food is harvest green, wood is warm timber, metal is cold steel,
// gold is the radiant centre. Wood used to share food's green, which made the two blur.
const RES_COLORS={food:'#8fb04e',material:'#c2884b',metal:'#92a6ba',gold:'#e9b54c'};
function resourceIcon(type){return `<svg class="resource-icon" viewBox="0 0 16 16" aria-hidden="true">${RESOURCE_GLYPHS[type]}</svg>`}
function costsHtml(cost={}){return Object.entries(cost).map(([k,v])=>`<span class="cost ${k}" title="${v} ${RESOURCE_NAMES[k]}">${resourceIcon(k)}<b>${v}</b></span>`).join('')}
const CARD_ART={
  logging:'assets/cards/logging-camp.webp',mining:'assets/cards/mining-camp.webp',farm:'assets/cards/farm.webp',goldmine:'assets/cards/gold-mine.webp',
  townhall:'assets/cards/town-hall.webp',university:'assets/cards/university.webp',lumbermill:'assets/cards/sawmill.webp',
  foundry:'assets/cards/forge.webp',granary:'assets/cards/mill.webp',market:'assets/cards/market.webp',watchtower:'assets/cards/watchtower.webp',
  soldier:'assets/cards/soldier.webp',farmer:'assets/cards/farmer.webp',lumberjack:'assets/cards/lumberjack.webp',miner:'assets/cards/miner.webp',
  firesapper:'assets/cards/fire-sapper.webp',knight:'assets/cards/knight.webp',archer:'assets/cards/archer.webp',pikeman:'assets/cards/pikeman.webp',
  merchant:'assets/cards/merchant.webp',ranger:'assets/cards/ranger.webp',champion:'assets/cards/champion.webp',militia:'assets/cards/militia.webp',
  peasant:'assets/cards/peasant.webp',villagecommons:'assets/cards/village-commons.webp',peasantmob:'assets/cards/peasant-mob.webp',
  manatarms:'assets/cards/man-at-arms.webp',gatehouse:'assets/cards/reinforced-gatehouse.webp',batteringram:'assets/cards/battering-ram.webp',
  rabblerouser:'assets/cards/rabble-rouser.webp',boarriders:'assets/cards/boar-riders.webp',palisade:'assets/cards/palisade.webp',
  wallwarden:'assets/cards/wall-warden.webp',royalguard:'assets/cards/royal-guard.webp',armoury:'assets/cards/armoury.webp',
  huntsman:'assets/cards/huntsman.webp',huntinglodge:'assets/cards/hunting-lodge.webp',ballista:'assets/cards/ballista-emplacement.webp',
  paviseguard:'assets/cards/pavise-guard.webp',mason:'assets/cards/mason.webp'
};
function cardHtml(id,opts={}){
  const c=CARDS[id],art=CARD_ART[id];
  return `<article class="game-card card-${c.type} ${art?'illustrated':''} ${opts.className||''}" data-card="${id}" ${opts.uid?`data-uid="${opts.uid}"`:''} ${opts.free?'data-free="1"':''} style="--accent:${c.accent};${art?`--card-art:url('${art}')`:''}"><div class="card-art ${art?'painted':''}"><span class="card-type">${c.token?'token':c.type}</span><span class="card-glyph">${c.icon}</span></div><div class="costs">${opts.free?'<span class="cost granted" title="Granted — costs nothing to deploy">✦</span>':costsHtml(effectiveCost(id))}</div><h3>${c.name}</h3>${c.text?`<p>${c.text}</p>`:''}${c.power!==undefined?`<span class="power">⚔ ${c.power}</span>`:''}${opts.extra||''}</article>`;
}
// No decree currently rewrites a printed cost, but every purchase reads through here, so this
// is where one would.
function effectiveCost(id){return {...CARDS[id].cost}}
// A particular copy may be granted rather than bought — a Town Hall's recruit turns up ready
// to deploy. The grant belongs to that copy in hand, not to the design, so it is read from the
// hand card wherever a price is actually charged.
function handCost(hc){return hc?.free?{}:effectiveCost(hc.cardId)}

const selectedRule=value=>value==='calendar'?calendarRule():ruleById(value)||calendarRule();
function setupRuleSelector(){
  const select=$('#devRuleSelect');if(!select)return;
  if(!DEV_BUILD){currentRule=calendarRule();return}
  select.innerHTML=`<option value="calendar">Calendar rotation — ${calendarRule().name}</option>`
    +[...META_RULES,NO_RULE].map(rule=>`<option value="${rule.id}">${rule.icon} ${rule.name}</option>`).join('');
  const saved=localStorage.getItem('kingdom-dev-rule')||'calendar';
  select.value=saved==='calendar'||ruleById(saved)?saved:'calendar';
  currentRule=devMode?selectedRule(select.value):calendarRule();
  select.onchange=()=>{localStorage.setItem('kingdom-dev-rule',select.value);currentRule=selectedRule(select.value);refreshRuleViews()};
}
function refreshRuleViews(){setupMetaRule();if($('#deckCards'))renderDeckBuilder();if($('#collectionCards'))renderCollection()}
// Leaving dev mode drops any override so the build behaves exactly like a player's.
function applyDevMode(){
  const toggle=$('#devModeToggle');
  if(toggle){toggle.hidden=!DEV_BUILD;toggle.setAttribute('aria-pressed',String(devMode));toggle.classList.toggle('on',devMode);toggle.textContent=devMode?'DEV ON':'DEV'}
  $$('[data-dev-only]').forEach(el=>{el.hidden=!devMode});
  currentRule=devMode?selectedRule($('#devRuleSelect')?.value||'calendar'):calendarRule();
  refreshRuleViews();
}

function setupMetaRule(){
  $('#weekNumber').textContent=weekIndex();
  ['home','rules','game'].forEach(prefix=>{const icon=$(`#${prefix}RuleIcon`),name=$(`#${prefix}RuleName`),text=$(`#${prefix}RuleText`);if(icon)icon.textContent=currentRule.icon;if(name)name.textContent=currentRule.name;if(text)text.textContent=currentRule.text});
  const f=$('#homeRuleFlavour');if(f)f.textContent=currentRule.flavour;
  const archive=$('#decreeArchive');if(archive)archive.innerHTML=META_RULES.map(rule=>`<article class="${rule.id===currentRule.id?'active':''}"><span>${rule.icon}</span><div><h3>${rule.name}</h3><p>${rule.text}</p></div></article>`).join('');
  renderCountdown();if(!countdownTimer)countdownTimer=setInterval(renderCountdown,60000);
}
// The decree turns over at midnight on Sunday, the same boundary weekKey() steps on.
function renderCountdown(){
  const now=new Date(),end=new Date(now.getFullYear(),now.getMonth(),now.getDate()+(7-now.getDay()));
  const ms=Math.max(0,end-now),el=$('#weekCountdown');
  if(el)el.textContent=devMode&&$('#devRuleSelect')?.value!=='calendar'?'DEV OVERRIDE':`${Math.floor(ms/86400000)}d ${Math.floor(ms/3600000)%24}h`;
}

// Both deck pickers (deck screen and hall) share one option list so they never disagree.
function renderDeckOptions(){
  const active=activeDeck();
  const opts=meta.decks.map(d=>{const cards=deckCards(d);return `<option value="${d.id}"${d.id===active.id?' selected':''}>${esc(d.name)} · ${devMode?`${cards.length} cards · DEV`:`${cards.length}/${DECK_SIZE}${deckIsPlayable(d)?'':' · incomplete'}`}</option>`}).join('');
  ['#deckSelect','#homeDeckSelect','#onlineDeckSelect'].forEach(sel=>{const el=$(sel);if(el)el.innerHTML=opts});
  const del=$('#deleteDeck');if(del)del.disabled=meta.decks.length<2;
  const add=$('#newDeck');if(add)add.disabled=meta.decks.length>=12;
}
function renderDeckBuilder(){
  const active=activeDeck(),cards=deckCards(active);
  const ids=availableDesigns().filter(id=>deckFilter==='all'||CARDS[id].type===deckFilter);
  $('#deckCards').innerHTML=ids.map(id=>cardHtml(id,{className:cards.includes(id)?'in-deck':'',extra:`<div class="deck-controls"><button data-minus="${id}">−</button><b>${cards.filter(x=>x===id).length}</b><button data-plus="${id}">+</button></div>`})).join('');
  $('#deckCount').textContent=cards.length;
  $('#deckLimitLabel').textContent=`/ ${DECK_SIZE} CARDS`;
  $('#deckRuleText').textContent=devMode?`Every card is unlocked for testing. Choose exactly ${DECK_SIZE}, with no more than four copies of any design.`:`Choose exactly ${DECK_SIZE} cards. No more than four copies of any card.`;
  const counts={};cards.forEach(id=>counts[id]=(counts[id]||0)+1);
  $('#deckList').innerHTML=Object.entries(counts).map(([id,n])=>`<div class="deck-row"><span>${CARDS[id].name}</span><b>×${n}</b></div>`).join('')||`<p class="deck-empty">Empty banner — add ${DECK_SIZE} cards from ${devMode?'the full card pool':'your collection'}.</p>`;
  $('#deckUnique').textContent=`${new Set(cards).size} unique · ${cards.length}/${DECK_SIZE} cards${devMode?' · DEV':''}`;
  const nameInput=$('#deckNameInput');if(nameInput&&document.activeElement!==nameInput)nameInput.value=active.name;
  $('#saveDeck').disabled=cards.length!==DECK_SIZE;
  renderDeckOptions();
}
function adjustDeck(id,amount){
  const cards=deckCards(activeDeck()),count=cards.filter(x=>x===id).length;
  if(amount>0&&count<MAX_COPIES&&cards.length<DECK_SIZE)cards.push(id);
  if(amount<0&&count>0)cards.splice(cards.indexOf(id),1);
  if(devMode)saveDevDeck();else saveMeta();renderDeckBuilder();
}
function selectDeck(id){if(meta.decks.some(d=>d.id===id)){meta.activeDeckId=id;if(devMode)resetDevDeck();saveMeta();renderDeckBuilder()}}
let collectionView='owned';
function renderCollection(){
  $('#packStatus').textContent=devMode?'Every card is unlocked while dev mode is on. Weekly packs resume in normal mode.':meta.packWeek===weekKey()?'This week’s pack has been claimed. Return when the decree changes.':meta.winWeek===weekKey()?'Victory earned: your weekly pack is ready. Choose a discovery and sacrifice an old design.':'Win one match this week to earn a new pack.';
  $('#openPackButton').disabled=devMode||meta.packWeek===weekKey()||meta.winWeek!==weekKey();
  const owned=availableDesigns().filter(id=>CARDS[id]),undiscovered=COLLECTIBLE_IDS.length-owned.length;
  $('#collectionCount').textContent=`${owned.length} / ${devMode?COLLECTIBLE_IDS.length:COLLECTION_SIZE}`;
  $('#archiveNote').textContent=collectionView==='owned'
    ?devMode?'All card designs are available. Your normal collection is unchanged.':`These ${owned.length} designs are the only ones your decks can draw on. A pack swaps one in for one out.`
    :`Every design in Kingdom: ${owned.length} in your collection, ${undiscovered} still undiscovered.`;
  const ids=collectionView==='owned'?owned:COLLECTIBLE_IDS;
  $('#collectionCards').innerHTML=ids.map(id=>{const has=devMode||meta.unlocked.includes(id);
    return cardHtml(id,{className:has?'':'locked',extra:`<span class="owned">${has?'IN COLLECTION':'UNDISCOVERED'}</span>`})}).join('');
  $$('[data-collection]').forEach(b=>b.classList.toggle('active',b.dataset.collection===collectionView));
  $$('.collection-grid .locked').forEach(el=>{el.style.filter='grayscale(1)';el.style.opacity='.48'});
  renderDevCollectionNote();
}
function renderDevCollectionNote(){
  const note=$('#devCollectionNote');if(!note)return;
  note.hidden=!devMode;if(!devMode)return;
  note.innerHTML=`<span>DEV · ALL CARDS UNLOCKED</span> Build a standard ${DECK_SIZE}-card deck from any design in the game. Your normal collection and saved decks stay untouched.`;
}

function openPack(){
  const locked=COLLECTIBLE_IDS.filter(id=>!meta.unlocked.includes(id));
  if(!locked.length)return showModal('<h2>Archive complete</h2><p>You have discovered every card design in the current set.</p>');
  const offers=shuffle(locked).slice(0,3);
  showModal(`<p class="eyebrow">WEEKLY SPOILS</p><h2>Choose a discovery</h2><p>Choose one card design. You’ll then sacrifice an existing design to make room in your collection.</p><div class="pack-options">${offers.map(id=>cardHtml(id)).join('')}</div>`);
  $$('.pack-options .game-card').forEach(el=>el.onclick=()=>chooseSacrifice(el.dataset.card));
}
function chooseSacrifice(newId){
  const copies=id=>meta.decks.reduce((n,d)=>n+d.cards.filter(x=>x===id).length,0);
  $('#modalContent').innerHTML=`<p class="eyebrow">THE PRICE OF PROGRESS</p><h2>Sacrifice a design</h2><p>Your collection stays at ${COLLECTION_SIZE} designs. Every copy across all your decks will be replaced by ${CARDS[newId].name}.</p><div class="sacrifice-list">${meta.unlocked.map(id=>`<button class="sacrifice-button" data-sacrifice="${id}">${CARDS[id].icon} ${CARDS[id].name} · ${copies(id)} in decks</button>`).join('')}</div>`;
  $$('[data-sacrifice]').forEach(b=>b.onclick=()=>{const old=b.dataset.sacrifice;meta.unlocked=meta.unlocked.filter(x=>x!==old);meta.unlocked.push(newId);meta.decks.forEach(d=>{d.cards=d.cards.map(x=>x===old?newId:x)});meta.packWeek=weekKey();saveMeta();closeModal();renderCollection();showModal(`<p class="eyebrow">NEW DESIGN</p><h2>${CARDS[newId].name} joins your realm</h2>${CARDS[newId].text?`<p>${CARDS[newId].text}</p>`:''}<div class="modal-actions"><button class="button primary" data-go-deck>Review deck</button></div>`);$('[data-go-deck]').onclick=()=>{closeModal();showScreen('deck')}});
}

// A banner is split into two piles at the start of a battle. Nothing moves between them: a card
// always returns to the pile its type belongs to.
function createSide(deck){
  const cards=deck.slice();
  return {health:10,fortification:0,resources:{food:1,metal:1,material:1,gold:0},
    structures:shuffle(cards.filter(id=>CARDS[id].type==='building')),
    units:shuffle(cards.filter(id=>CARDS[id].type==='unit')),
    discard:[],hand:[],pendingDraws:0,board:Array.from({length:4},()=>({building:null,unit:null}))}
}
function startGame(){
  const chosen=activeDeck();
  if(!deckIsPlayable(chosen)){showScreen('deck');const cards=deckCards(chosen);$('#deckMessage').textContent=devMode?`The dev deck holds ${cards.length}/${DECK_SIZE} cards. Complete it before entering battle.`:`“${chosen.name}” holds ${cards.length}/${DECK_SIZE} cards. Complete it before entering battle.`;return}
  const aiProfile=$('#aiDeckSelect').value||Object.keys(AI_DECKS)[0],aiDifficulty=$('#aiDifficultySelect').value||'normal';
  game={round:1,player:createSide(deckCards(chosen)),ai:createSide(AI_DECKS[aiProfile]||Object.values(AI_DECKS)[0]),aiProfile,aiDifficulty,blockedLane:currentRule.id==='river'?3:null,locked:false,logs:[]};
  $('#aiProfileLabel').textContent=`${AI_PROFILE_NAMES[aiProfile]||AI_PROFILE_NAMES.general} · ${aiDifficulty.toUpperCase()}`;
  drawOpeningHand(game.player);drawOpeningHand(game.ai);showScreen('game');setLog(false);renderGame();log('The rulers begin planning in secret.');if(game.blockedLane!==null)log('The river floods the eastern lane. Only three lanes remain.');
}
function startOnlineGame(state,seat,names={}){
  game=JSON.parse(JSON.stringify(state));
  const rule=ruleById(game.decreeId);if(rule)currentRule=rule;
  if(seat==='guest')[game.player,game.ai]=[game.ai,game.player];
  game.onlineSeat=seat;game.locked=false;selectedUid=null;
  $('#aiProfileLabel').textContent=`${String((seat==='host'?names.guest:names.host)||'Opponent').toUpperCase()} · ONLINE`;
  showScreen('game');setLog(false);renderGame();
}
function onlineCanonicalState(){
  const state=JSON.parse(JSON.stringify(game));
  if(game.onlineSeat==='guest')[state.player,state.ai]=[state.ai,state.player];
  delete state.onlineSeat;state.locked=false;return state;
}
function resolveOnlinePlans(hostSide,guestSide){
  game.player=JSON.parse(JSON.stringify(hostSide));game.ai=JSON.parse(JSON.stringify(guestSide));game.onlineSeat='host';
  game.locked=true;selectedUid=null;commitReplacements(game.player);commitReplacements(game.ai);
  log('Plans revealed. The four lanes clash.');resolveOnBuild(game.player,'Your');resolveOnBuild(game.ai,'Rival');renderGame(true);beginClash();
}
// The armies visibly lunge at each other before the outcome lands: the pause is the wind-up.
// ?slow=N stretches the whole theatre N× for tuning the choreography frame by frame.
const THEATRE_SPEED=(()=>{try{const s=Number(new URLSearchParams(location.search).get('slow'));return s>=1&&s<=20?s:1}catch(e){return 1}})();
function beginClash(){
  const wrap=$('#battlefieldWrap');
  if(wrap){wrap.classList.add('clashing');setTimeout(()=>wrap.classList.remove('clashing'),1150*THEATRE_SPEED)}
  setTimeout(resolveRound,1100*THEATRE_SPEED);
}
function laneIsActive(lane){return game?.blockedLane!==lane}
const PILES=['structures','units'];
const PILE_LABELS={structures:'structures',units:'units'};
const pileOf=id=>CARDS[id].type==='building'?'structures':'units';
const otherPile=pile=>pile==='structures'?'units':'structures';
// A pile reclaims its own share of the discard before it counts as exhausted.
function refillPile(side,pile){
  if(side[pile].length)return true;
  const returning=side.discard.filter(id=>pileOf(id)===pile);
  if(!returning.length)return false;
  side.discard=side.discard.filter(id=>pileOf(id)!==pile);side[pile]=shuffle(returning);return true;
}
function pileCount(side,pile){return side[pile].length+side.discard.filter(id=>pileOf(id)===pile).length}
// Asking for an exhausted pile falls back to the other one, so a draw is never simply lost —
// unless the hand is already at its limit, in which case the draw is negated and the card
// stays on its pile.
function drawFromPile(side,pile){
  if(side.hand.length>=HAND_LIMIT)return null;
  let from=pile;
  if(!refillPile(side,from)){from=otherPile(pile);if(!refillPile(side,from))return null}
  const id=side[from].pop();if(id)side.hand.push(makeHandCard(id));return id;
}
// Generated cards respect the same ceiling: a full hand turns them away too. A granted card is
// also free to deploy, which is what makes a Town Hall's recruit worth the hall.
function gainBonusCard(side,cardId,free=false){if(side.hand.length<HAND_LIMIT)side.hand.push(makeHandCard(cardId,true,free))}
function countBuilding(side,special){return side.board.filter(l=>l.building&&CARDS[l.building.cardId].special===special).length}
function randomWorker(){return WORKERS[Math.floor(Math.random()*WORKERS.length)]}
function openingHandSize(){return currentRule.id==='longmuster'?3:5}
function turnDrawCount(){return currentRule.id==='leancourt'?1:currentRule.id==='longmuster'?3:2}
// The opening hand is dealt rather than chosen: three structures and two units at the usual five.
function openingSplit(){const size=openingHandSize(),structures=Math.ceil(size*.6);return {structures,units:size-structures}}
function drawOpeningHand(side){
  const split=openingSplit();
  for(let i=0;i<split.structures;i++)drawFromPile(side,'structures');
  for(let i=0;i<split.units;i++)drawFromPile(side,'units');
}
function turnDrawTotal(side){return turnDrawCount()+countBuilding(side,'university')}
// Generated cards arrive regardless of which pile the ruler chooses; they are not part of the choice.
function drawTurnBonuses(side){
  for(let i=0;i<countBuilding(side,'townhall');i++)gainBonusCard(side,randomWorker(),true);
  for(let i=0;i<countBuilding(side,'commons');i++)gainBonusCard(side,'peasant');
}
function makeHandCard(cardId,bonus=false,free=false){return {cardId,uid:`${Date.now()}-${Math.random()}`,bonus,free}}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
// With both piles spent — or a full hand turning every draw away — there is nothing left to
// choose, so the ruler is not held at the prompt.
function settleDraws(side){if(side.pendingDraws&&(side.hand.length>=HAND_LIMIT||!pileCount(side,'structures')&&!pileCount(side,'units')))side.pendingDraws=0}
// The draw dialog covers the battlefield, so a ruler can fold it away to study the board
// and their hand before committing to a pile. Kept out of `game` because that object is
// serialised to the other client in an online duel; this is one viewer's screen state.
let drawMinimised=false;
function setDrawMinimised(state){drawMinimised=state;renderGame()}
// What the last draw turned up, held just long enough to inform the next choice.
let drawReveal=null;
function chooseDraw(pile){
  const side=game?.player;if(!side||game.locked||!side.pendingDraws)return;
  const id=drawFromPile(side,pile);side.pendingDraws--;
  if(id){
    const landed=pileOf(id);
    drawReveal={cardId:id,uid:side.hand[side.hand.length-1]?.uid||null,fallback:landed!==pile};
    log(`You draw ${CARDS[id].name}${landed===pile?` from the ${PILE_LABELS[pile]} pile`:` — the ${PILE_LABELS[pile]} pile was spent, so the draw came from your ${PILE_LABELS[landed]}`}.`);
  }
  settleDraws(side);
  // On the last draw the dialog closes, so the reveal has nowhere to sit and the card takes
  // its bow in hand instead. Noted before the render, which clears the reveal as it goes.
  const lastUid=!side.pendingDraws&&drawReveal?drawReveal.uid:null;
  renderGame();
  if(lastUid){
    const card=$(`#playerHand .game-card[data-uid="${lastUid}"]`);
    if(card){card.classList.add('just-drawn');card.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'})}
  }
}
// The AI leans towards whichever pile its position is shorter on: open lanes and a thin castle pull for
// units, empty building ground and the early ramp pull for structures.
function aiDrawChoice(side){
  const openLanes=side.board.filter((lane,index)=>laneIsActive(index)&&!lane.unit).length;
  const openGround=side.board.filter((lane,index)=>laneIsActive(index)&&!lane.building).length;
  const unitsHeld=side.hand.filter(hc=>CARDS[hc.cardId].type==='unit').length;
  const structuresHeld=side.hand.filter(hc=>CARDS[hc.cardId].type==='building').length;
  const unitPull=openLanes*1.5+(side.health<=5?2:0)-unitsHeld*1.2;
  const structurePull=openGround*1.5+(game.round<4?2:0)-structuresHeld*1.2;
  return unitPull>structurePull?'units':'structures';
}
function aiDrawTurn(side){settleDraws(side);while(side.pendingDraws>0){drawFromPile(side,aiDrawChoice(side));side.pendingDraws--;settleDraws(side)}}

function canAfford(side,cost){let shortage=0;for(const r of ['food','metal','material'])shortage+=Math.max(0,(cost[r]||0)-side.resources[r]);return side.resources.gold-(cost.gold||0)>=shortage}
function payCost(side,cost){
  const spent={food:0,metal:0,material:0,gold:0};
  for(const r of ['food','metal','material']){const needed=cost[r]||0,take=Math.min(needed,side.resources[r]);side.resources[r]-=take;spent[r]+=take;const missing=needed-take;side.resources.gold-=missing;spent.gold+=missing}
  const g=cost.gold||0;side.resources.gold-=g;spent.gold+=g;
  return spent;
}
function refund(side,spent){Object.entries(spent).forEach(([r,n])=>side.resources[r]+=n)}

function selectHand(uid){if(game.locked)return;selectedUid=selectedUid===uid?null:uid;renderGame()}
function slotClick(lane,type){
  if(game.locked||game.player.pendingDraws||!laneIsActive(lane))return;const slot=game.player.board[lane][type];
  if(slot?.round===game.round){game.player.hand.push(slot.handCard);refund(game.player,slot.spent);game.player.board[lane][type]=slot.replaced||null;selectedUid=null;renderGame();return}
  if(!selectedUid)return;
  const idx=game.player.hand.findIndex(x=>x.uid===selectedUid);if(idx<0)return;const hc=game.player.hand[idx],card=CARDS[hc.cardId];if(card.type!==type||!canAfford(game.player,handCost(hc)))return;
  const spent=payCost(game.player,handCost(hc));game.player.hand.splice(idx,1);game.player.board[lane][type]={cardId:hc.cardId,round:game.round,spent,handCard:hc,replaced:slot||null};selectedUid=null;renderGame();
}

function aiVisiblePlayerSlot(lane,type){const slot=game.player.board[lane][type];return slot?.round===game.round?(slot.replaced||null):slot}
function aiCardValue(id){
  const c=CARDS[id];
  if(['ram','boarriders'].includes(c.special))return 5;
  if(['sapper','mob','gatehouse','pavise'].includes(c.special)||id==='royalguard')return 3.5;
  // A Knight is a 2 that fights as a 4, and a worker is a 1 that pays every round it lives —
  // both are worth more than the number printed on them.
  if(c.special==='knight')return 3.5;
  // A Pikeman is a 2 that becomes the biggest thing on the field if it is left alone.
  if(c.special==='entrench')return 3.5;
  if(c.special==='worker')return 3;
  // A Mason banks keep integrity every round it lives, which outlasts any single clash.
  if(c.special==='mason')return 3;
  if(['commons','university','townhall','rabble','palisade','armoury','huntinglodge','ballista'].includes(c.special))return 3;
  if(c.type==='unit')return c.power||0;if(c.produce)return Object.values(c.produce).reduce((a,b)=>a+b,0);return c.special?1.5:1
}
// Hard and Hardcore both take the best-scoring line rather than a random pick off the top of the list.
const aiPlaysBest=d=>d==='hard'||d==='hardcore';
// Every card the banner has not committed to the board. The discard belongs here: a pile
// reclaims its own discards when it runs dry, so a spent card is not gone, only queued. Leaving
// it out made the AI believe answers it would certainly see again were its last.
function aiPending(side){return side.structures.concat(side.units,side.discard,side.hand.map(hc=>hc.cardId))}
const aiProducerCount=(ids,resource)=>ids.filter(id=>CARDS[id].produce?.[resource]).length;
const aiBoardProducers=(side,resource,except)=>side.board.filter(l=>l.building&&l.building!==except&&CARDS[l.building.cardId].produce?.[resource]).length;
// Spending a resource the banner cannot replace should hurt more than spending a renewable one.
function aiScarcity(side,resource){
  if(aiBoardProducers(side,resource,null))return 1;
  return aiProducerCount(aiPending(side),resource)?1.6:2.6;
}
// Sacrificing a standing card costs more than its face value. A producer keeps paying for every round
// it stays up, card-advantage buildings compound, and the banner may hold no second copy to rebuild with.
function aiReplacementCost(side,old,incoming){
  const oldCard=CARDS[old.cardId];let penalty=aiCardValue(old.cardId)*1.7;
  // Swapping a card for its own twin gains nothing and throws the standing copy away.
  if(old.cardId===incoming)penalty+=8;
  else if(aiCardValue(incoming)<aiCardValue(old.cardId))penalty+=6;
  // Buildings do not fight, so an equal-value swap only makes sense for a lane-specific effect.
  else if(CARDS[incoming].type==='building'&&aiCardValue(incoming)===aiCardValue(old.cardId)&&!CARDS[incoming].special)penalty+=4;
  if(['university','townhall'].includes(oldCard.special))penalty+=4;
  if(oldCard.produce){
    const pending=aiPending(side);
    for(const [r,n] of Object.entries(oldCard.produce)){
      penalty+=n*2;
      // Tearing down the last source of a resource is bad; doing it with no replacement left to draw is worse.
      if(!aiBoardProducers(side,r,old))penalty+=aiProducerCount(pending,r)?4:8;
    }
  }
  return penalty;
}
function aiActionScore(hc,lane,difficulty){
  const side=game.ai,c=CARDS[hc.cardId],cost=handCost(hc),old=side.board[lane][c.type];
  let score=aiCardValue(hc.cardId)*2-Object.entries(cost).reduce((a,[r,n])=>a+n*aiScarcity(side,r),0)*.3;
  if(old)score-=aiReplacementCost(side,old,hc.cardId);
  if(c.type==='unit'){
    const enemy=aiVisiblePlayerSlot(lane,'unit'),enemyBuilding=aiVisiblePlayerSlot(lane,'building');
    // A Knight reads as a 2 on the card and fights as a 4, so weigh it against what it will
    // actually meet in the lane rather than against its printed number.
    const power=(c.power||0)+(c.special==='knight'&&enemy?2:0);
    if(c.special==='sapper')score+=enemy?7+aiCardValue(enemy.cardId):-5;
    else if(enemy){const ec=CARDS[enemy.cardId],enemyPower=(ec.power||0)+(ec.special==='knight'?2:0)+(ec.special==='entrench'?Math.min(ENTRENCH_CAP,Math.max(0,game.round-enemy.round)):0);score+=power>enemyPower?6+(power-enemyPower):power===enemyPower?2:-5-(enemyPower-power)}
    else score+=power*1.25+(game.player.health+(game.player.fortification||0)<=power?8:0);
    if(c.special==='ram'&&enemyBuilding)score+=6;
    if(c.special==='wallwarden'&&side.board[lane].building)score+=4;
    if(c.special==='huntsman'&&enemy&&(c.power||0)>=(CARDS[enemy.cardId].power||0))score+=2;
    if(c.special==='pavise')score+=enemy?3:1;
    // A Mason only lays stone from a lane it holds, so it wants quiet ground like any worker.
    if(c.special==='mason')score+=enemy?-3:3;
    // Mob units want a neighbour on each side, so value the lane by how many flanks are already held.
    if(MOB_SPECIALS.includes(c.special))score+=adjacentAllies(side,lane)*2.5;
    if(side.board[lane].building)score+=1;
  }else{
    if(c.produce)score+=Object.values(c.produce).reduce((a,b)=>a+b,0)*(aiPlaysBest(difficulty)?2.2:1.5);
    if(['university','townhall'].includes(c.special))score+=game.round<5?3:1;
    if(['watchtower','gatehouse'].includes(c.special)&&side.board[lane].unit)score+=3;
    if(c.special==='palisade'&&!aiVisiblePlayerSlot(lane,'unit'))score+=3;
    if(c.special==='armoury'&&side.board[lane].unit)score+=3;
    if(c.special==='huntinglodge'&&side.board[lane].unit&&!aiVisiblePlayerSlot(lane,'unit'))score+=4;
    if(c.special==='ballista'){
      const enemy=aiVisiblePlayerSlot(lane,'unit');score+=enemy&&(CARDS[enemy.cardId].power||0)>=4?8:-2;
    }
    // A Commons pays a Peasant a round whatever the board looks like, so it is worth most
    // while there are rounds left for it to pay out over.
    if(c.special==='commons')score+=game.round<6?3:1.5;
    // Fortification is banked ahead of the blow rather than spent healing after it, so it is
    // worth raising early; a thin keep still wants it most.
    if(c.special==='gatehouse')score+=side.health<=7?4:2;
  }
  if(game.aiProfile==='strikesteel'){
    // No tricks in the banner at all: mine metal, put the biggest body available in the way,
    // and keep swinging. Camps come first because everything else is priced in metal.
    if(hc.cardId==='mining')score+=game.round<5?4:2;
    if(c.special==='worker')score+=aiVisiblePlayerSlot(lane,'unit')?-2:3;
    // An Armoury is only worth its slot beside a body, and the deck has bodies to spare.
    if(c.special==='armoury')score+=side.board[lane].unit?3:-3;
    // A lane the rival has left open is a lane that hits the keep, and that is the whole plan.
    if(c.type==='unit'&&!aiVisiblePlayerSlot(lane,'unit'))score+=(c.power||0)>=3?4:1;
  }
  if(game.aiProfile==='forestfire'){
    // The banner buys a back row before it buys a fight: two Universities to keep the hand
    // full and Sawmills to pay for it. Everything after that is answers, drawn faster than
    // the rival can present threats — which is why the setup is worth being slow for.
    const halls=countBuilding(side,'university');
    if(c.special==='university')score+=halls<2?7:2;
    if(hc.cardId==='lumbermill')score+=game.round<8?4:2;
    if(hc.cardId==='logging')score+=aiBoardProducers(side,'material',null)?1:4;
    // A Sawmill wants food, and the two Farms are the only source of it.
    if(hc.cardId==='farm')score+=aiBoardProducers(side,'food',null)?0:5;
    // The lone Wall Warden is the whole clock, and it is only a threat behind a building.
    if(c.special==='wallwarden')score+=side.board[lane].building?6:-4;
    // Three Universities turn the banner over quickly, so a Sapper is a renewable answer
    // rather than a treasure. Spending one on a guess costs less than the strike it would
    // have stopped — provided more are still to come, which is the condition to check.
    const facing=aiVisiblePlayerSlot(lane,'unit');
    if(c.special==='sapper'){
      const spare=aiPending(side).filter(id=>CARDS[id].special==='sapper').length;
      score+=facing?3:(spare>=2?5:-3);
    }
    // A body thrown in front of a real threat buys the keep a round. This banner would
    // rather spend a Lumberjack than take the hit, because the draw replaces the body and
    // nothing replaces the health.
    if(c.type==='unit'&&facing&&!old){
      const fc=CARDS[facing.cardId],incoming=(fc.power||0)+(fc.special==='knight'?2:0)+(fc.special==='entrench'?Math.min(ENTRENCH_CAP,Math.max(0,game.round-facing.round)):0);
      // What a block is worth depends on what the keep can still afford. Comfortable, it
      // takes the open lane and the harvest; pressed, a body is cheaper than the damage.
      const pressed=side.health+(side.fortification||0)<=6;
      if(incoming>=2)score+=incoming*(pressed?3:1.2);
    }
    // The endgame line: a played card returns to its pile when the discard is reclaimed, so
    // every non-Sapper it commits dilutes the next unit draw. Once the back row is up it keeps
    // the others in hand and lets the units pile silt up with Sappers, which is what makes the
    // cycle reliable. It still spends them to block — peeling is why the control matters.
    const settled=halls>=2&&aiBoardProducers(side,'material',null)>=2;
    if(settled&&c.type==='unit'&&c.special!=='sapper'&&!facing&&side.hand.length<HAND_LIMIT-1)score-=3;
    if(c.special==='worker'&&!facing)score+=2;
  }
  if(game.aiProfile==='uprising'){
    // The uprising wins by mass, so what prints bodies matters more than any single body.
    if(['villagecommons','rabblerouser'].includes(hc.cardId))score+=game.round<6?4:2;
    if(hc.cardId==='farm')score+=aiBoardProducers(side,'food',null)<2?3:1;
    // Mobs pay for a contiguous line, so a body beside a body is worth more than a body alone.
    if(c.type==='unit')score+=adjacentAllies(side,lane)*1.2;
    if(MOB_SPECIALS.includes(c.special))score+=2;
  }
  if(game.aiProfile==='metal'&&['mining','foundry','manatarms','knight','gatehouse','batteringram','royalguard','armoury','ballista','paviseguard'].includes(hc.cardId))score+=2;
  if(game.aiProfile==='timber'){
    // Sawmills carry the only food cost in the banner, so a Farm has to land before they can.
    // Protecting that Farm afterwards is left to the generic last-producer rule above.
    if(hc.cardId==='farm')score+=aiBoardProducers(side,'food',null)?1:6;
    if(['logging','lumbermill'].includes(hc.cardId))score+=game.round<6?4:2;
    if(c.special==='university')score+=game.round<6?5:2;
    // Archers are the whole clock: worth most pointed at an open lane.
    if(hc.cardId==='archer')score+=aiVisiblePlayerSlot(lane,'unit')?1:3;
    // A Lumberjack only pays out if it lives, so it wants a quiet lane and an early round.
    if(c.special==='worker')score+=aiVisiblePlayerSlot(lane,'unit')?-3:(game.round<5?4:1);
    if(c.special==='sapper'){
      const enemy=aiVisiblePlayerSlot(lane,'unit');
      // A Sapper waits in hand for something worth trading up into. The exception is a thin castle,
      // where an unseen attacker has to be answered before it lands rather than after.
      if(enemy)score+=aiCardValue(enemy.cardId)>=3?4:0;
      else score+=side.health<=5?7:-4;
    }
  }
  if(game.aiProfile==='siege'){
    // The train runs on metal: camps before all else while the Rams are still in the pile.
    if(hc.cardId==='mining')score+=game.round<5?4:2;
    if(['manatarms','paviseguard'].includes(hc.cardId))score+=2;
    // A Ram is a siege engine, not a soldier: it wants a lane where a building stands
    // unguarded, and settles for fighting only when nothing better is on offer.
    if(c.special==='ram'){
      const wall=aiVisiblePlayerSlot(lane,'building'),guard=aiVisiblePlayerSlot(lane,'unit');
      score+=wall?(guard?1:6):0;
    }
    // A Sapper here is a siege tool too — burning the guard off a walled lane tonight
    // is what lets a Ram through it tomorrow.
    if(c.special==='sapper'&&aiVisiblePlayerSlot(lane,'unit')&&aiVisiblePlayerSlot(lane,'building'))score+=5;
  }
  if(currentRule.id==='winter'){if(c.special==='worker')score+=3;if(c.produce&&c.type==='building'&&!c.produce.gold)score-=2}
  if(currentRule.id==='tradefair'&&['goldmine','market','merchant'].includes(hc.cardId))score+=3;
  if(currentRule.id==='leancourt'&&c.special==='university')score+=2;
  // Hardcore takes no jitter at all, so its ranking is purely the evaluation.
  return score+Math.random()*(difficulty==='hardcore'?0:aiPlaysBest(difficulty)?0.35:4.5);
}
function aiPlan(){
  // Four lanes times a building and a unit slot is every placement the rules allow in one round, and
  // a slot filled this round is skipped below, so Hardcore's ceiling is simply the whole board.
  const side=game.ai,difficulty=game.aiDifficulty||'normal',limit=difficulty==='hardcore'?8:difficulty==='hard'?4:2;let actions=0;
  while(actions<limit){
    const options=[];
    for(const hc of side.hand){
      const c=CARDS[hc.cardId];if(!canAfford(side,handCost(hc)))continue;
      for(let lane=0;lane<4;lane++){if(!laneIsActive(lane))continue;const old=side.board[lane][c.type];if(old?.round===game.round)continue;if(old&&aiCardValue(hc.cardId)<=aiCardValue(old.cardId)&&!aiPlaysBest(difficulty))continue;options.push({hc,lane,score:aiActionScore(hc,lane,difficulty)})}
    }
    if(!options.length)break;
    // Options are built lane by lane and sort is stable, so equal scores kept their insertion
    // order and the westmost lane won every tie — on an empty board that meant the first unit
    // always landed in lane one. Shuffling first leaves the ranking alone and lets genuine
    // ties fall out at random, so a ruler with no reason to prefer a lane does not telegraph one.
    shuffle(options);options.sort((a,b)=>b.score-a.score);
    const choice=aiPlaysBest(difficulty)?options[0]:options[Math.floor(Math.random()*Math.min(3,options.length))];if(choice.score<0)break;
    const c=CARDS[choice.hc.cardId],idx=side.hand.findIndex(x=>x.uid===choice.hc.uid),old=side.board[choice.lane][c.type],spent=payCost(side,handCost(choice.hc));side.hand.splice(idx,1);side.board[choice.lane][c.type]={cardId:choice.hc.cardId,round:game.round,spent,handCard:choice.hc,replaced:old||null};actions++;
  }
}
function commitReplacements(side){side.board.forEach(lane=>['building','unit'].forEach(type=>{const slot=lane[type];if(slot?.round===game.round&&slot.replaced){if(!slot.replaced.handCard?.bonus)side.discard.push(slot.replaced.cardId);slot.replaced=null}}))}
function resolveOnBuild(side,label){
  side.board.forEach((lane,index)=>{
    const building=lane.building;
    if(building?.round===game.round&&CARDS[building.cardId].special==='gatehouse'&&!building.effectResolved){
      side.fortification=(side.fortification||0)+2;building.effectResolved=true;
      log(`${label} ${CARDS[building.cardId].name} raises 2 fortification over the keep from lane ${index+1}.`)
    }
    const unit=lane.unit;
    if(unit?.round===game.round&&CARDS[unit.cardId].special==='rabble'&&!unit.effectResolved){
      unit.effectResolved=true;
      if(side.hand.length<HAND_LIMIT){gainBonusCard(side,'peasant');log(`${label} Rabble-Rouser gathers a Peasant to the cause.`)}
      else log(`${label} Rabble-Rouser finds no room in a full hand.`)
    }
  })
}
function commitTurn(){
  if(game.locked||game.player.pendingDraws)return;if(window.kingdomMultiplayer?.active)return window.kingdomMultiplayer.commit();game.locked=true;selectedUid=null;aiPlan();commitReplacements(game.player);commitReplacements(game.ai);log('Plans revealed. The four lanes clash.');resolveOnBuild(game.player,'Your');resolveOnBuild(game.ai,'Rival');renderGame(true);beginClash();
}
// Mob units draw strength from the neighbours flanking them, so a contiguous line beats a spread one.
// Counting neighbours rather than the whole board keeps these cards working when a decree closes a lane.
const MOB_SPECIALS=['mob','boarriders'];
// How far a Pikeman may dig in. Three rounds of service is a 5-power unit — worth answering,
// and still inside what a Ballista or a Fire Sapper can take off the board.
const ENTRENCH_CAP=3;
function adjacentAllies(side,lane){return [lane-1,lane+1].filter(i=>i>=0&&i<4&&laneIsActive(i)&&side.board[i].unit).length}
function unitPower(side,lane){
  const u=side.board[lane].unit;if(!u)return 0;const card=CARDS[u.cardId];let p=['ram','pavise'].includes(card.special)&&u.damaged?1:card.power||0;
  if(MOB_SPECIALS.includes(card.special))p+=adjacentAllies(side,lane);
  const building=side.board[lane].building;
  if(card.special==='wallwarden'&&building)p+=2;
  // The Armoury, Watchtower and Gatehouse all arm the lane they stand in, and all by the same 1.
  if(building&&['watchtower','gatehouse','armoury'].includes(CARDS[building.cardId].special))p++;
  const enemySide=side===game.player?game.ai:game.player,enemy=enemySide.board[lane].unit;
  // A Knight is a duellist, not a raider: strong against anything that stands in its lane,
  // ordinary when the lane is open and it rides at the ruler instead.
  if(card.special==='knight'&&enemy)p+=2;
  // Ground held is ground dug in: a lane it still occupies is a round it survived, so the
  // rounds elapsed since it deployed are exactly its service, with no extra bookkeeping.
  // Capped, so a lane left alone becomes a problem to answer rather than an unanswerable one.
  if(card.special==='entrench')p+=Math.min(ENTRENCH_CAP,Math.max(0,game.round-u.round));
  if(currentRule.id==='tradefair'&&card.special==='merchant')p++;
  return p;
}
function discardBuilding(side,lane){const building=side.board[lane].building;if(building){fx.push({t:'razed',who:fxSide(side),lane,cardId:building.cardId});if(!building.handCard?.bonus)side.discard.push(building.cardId)}side.board[lane].building=null}
function resolveRam(attacker,defender,lane,label){const ram=attacker.board[lane].unit;if(!ram||CARDS[ram.cardId].special!=='ram'||!defender.board[lane].building)return false;const target=CARDS[defender.board[lane].building.cardId].name;discardBuilding(defender,lane);ram.damaged=true;log(`Lane ${lane+1}: ${label} Battering Ram destroys ${target} and is reduced to 1 power.`);return true}
function resolveBallistas(p,a,pPowers,aPowers){
  const shots=[];
  for(let lane=0;lane<4;lane++){
    if(!laneIsActive(lane))continue;
    if(CARDS[p.board[lane].building?.cardId]?.special==='ballista'&&a.board[lane].unit&&aPowers[lane]>=4)shots.push({owner:p,target:a,lane,label:'Your'});
    if(CARDS[a.board[lane].building?.cardId]?.special==='ballista'&&p.board[lane].unit&&pPowers[lane]>=4)shots.push({owner:a,target:p,lane,label:'Rival'});
  }
  for(const shot of shots){
    const target=shot.target.board[shot.lane].unit,ballista=shot.owner.board[shot.lane].building;
    if(ballista&&CARDS[ballista.cardId].special==='ballista')discardBuilding(shot.owner,shot.lane);
    if(target){const name=CARDS[target.cardId].name;discardUnit(shot.target,shot.lane);log(`Lane ${shot.lane+1}: ${shot.label} Ballista Emplacement destroys ${name} and collapses.`)}
  }
}
function combatDefeat(side,lane){
  const unit=side.board[lane].unit;
  if(unit&&CARDS[unit.cardId].special==='pavise'&&!unit.damaged){unit.damaged=true;return false}
  discardUnit(side,lane);return true
}
function rewardClashWinner(side,unit,lane,label){
  if(CARDS[unit?.cardId]?.special==='huntsman'&&side.board[lane].unit===unit){side.resources.material++;log(`Lane ${lane+1}: ${label} Huntsman salvages 1 wood.`)}
}
function directStrike(attacker,defender,lane,power,label,ramLabel){
  const unit=attacker.board[lane].unit,card=CARDS[unit.cardId];
  if(resolveRam(attacker,defender,lane,ramLabel))return;
  const dmg=dealDamage(defender,power,lane);
  if(card.special==='merchant')attacker.resources.gold++;
  if(dmg>0&&CARDS[attacker.board[lane].building?.cardId]?.special==='huntinglodge'){
    attacker.resources.food++;log(`Lane ${lane+1}: ${label==='You'?'Your':'The rival’s'} Hunting Lodge supplies 1 food.`)
  }
  log(`Lane ${lane+1}: ${label.toLowerCase()} ${label==='You'?'strike':'strikes'} for ${dmg} damage.`)
}
function resolveRound(){
  const p=game.player,a=game.ai;
  const pPowers=[0,1,2,3].map(lane=>unitPower(p,lane)),aPowers=[0,1,2,3].map(lane=>unitPower(a,lane));
  resolveBallistas(p,a,pPowers,aPowers);
  for(let lane=0;lane<4;lane++){
    if(!laneIsActive(lane))continue;
    const pu=p.board[lane].unit,au=a.board[lane].unit,pp=pPowers[lane],ap=aPowers[lane];
    const pSapper=pu&&CARDS[pu.cardId].special==='sapper',aSapper=au&&CARDS[au.cardId].special==='sapper';
    if(pSapper||aSapper){
      const pTakes=pSapper&&au&&!aSapper,aTakes=aSapper&&pu&&!pSapper;
      if(pSapper)discardUnit(p,lane);if(aSapper)discardUnit(a,lane);
      if(pTakes)discardUnit(a,lane);if(aTakes)discardUnit(p,lane);
      const note=pSapper&&aSapper?'both Fire Sappers burn out'
        :pSapper?(pTakes?`your Fire Sapper destroys ${CARDS[au.cardId].name}`:'your Fire Sapper burns out with no one to take with it')
        :(aTakes?`the rival Fire Sapper destroys ${CARDS[pu.cardId].name}`:'the rival Fire Sapper burns out with no one to take with it');
      log(`Lane ${lane+1}: ${note}.`);continue;
    }
    if(pu&&au){
      // A Ram only breaks the wall when the lane is clear of defenders, so winning a clash does not also fell the building.
      if(pp>ap){const fell=combatDefeat(a,lane);log(`Lane ${lane+1}: ${CARDS[pu.cardId].name} wins ${pp}–${ap}${fell?'.':', but the rival Pavise Guard endures at 1 power.'}`);rewardClashWinner(p,pu,lane,'Your')}
      else if(ap>pp){const fell=combatDefeat(p,lane);log(`Lane ${lane+1}: rival ${CARDS[au.cardId].name} wins ${ap}–${pp}${fell?'.':', but your Pavise Guard endures at 1 power.'}`);rewardClashWinner(a,au,lane,'Rival')}
      else{
        const pFell=combatDefeat(p,lane),aFell=combatDefeat(a,lane);
        const survivors=[!pFell?'your Pavise Guard':null,!aFell?'the rival Pavise Guard':null].filter(Boolean);
        log(`Lane ${lane+1}: ${survivors.length?`${survivors.join(' and ')} endure at 1 power after a ${pp}–${ap} tie`:`both units fall at ${pp} power`}.`)
      }
    }else if(pu)directStrike(p,a,lane,pp,'You','your');
    else if(au)directStrike(a,p,lane,ap,'The rival','the rival');
  }
  harvest(p,'Your');harvest(a,'Rival');renderGame(true);playFx();
  if(p.health<=0||a.health<=0){const result=a.health<=0&&p.health>0?'win':p.health<=0&&a.health>0?'loss':'draw';if(window.kingdomMultiplayer?.active)return setTimeout(()=>window.kingdomMultiplayer.resolved(result),450);setTimeout(()=>endGame(result),450);return}
  // The aftermath holds long enough for the ghosts and damage numbers to finish telling it;
  // nextRound's re-render wipes any overlay still standing.
  // The host opens the next round locally, but the table only has it once the write lands.
  // Unlocking before then let a quick host commit a plan for a round the database had not
  // started, which the plan guard refuses outright. Hold the board until it is published.
  if(window.kingdomMultiplayer?.active)return setTimeout(()=>{
    nextRound();game.locked=true;renderGame();
    Promise.resolve(window.kingdomMultiplayer.resolved(null)).finally(()=>{game.locked=false;renderGame()});
  },1800*THEATRE_SPEED);
  setTimeout(nextRound,1800*THEATRE_SPEED);
}
// ---- Battle effects. The resolvers below report what happened as they compute it;
// playFx then tells the story on the freshly rendered board: fallen cards linger as
// fading ghosts, damage floats up in numbers, palisades flash when they absorb. ----
let fx=[];
const fxSide=side=>side===game.player?'player':'ai';
function playFx(){
  if(!fx.length)return;
  const boards={player:'#playerBoard',ai:'#aiBoard'},hurt={player:0,ai:0};
  for(const e of fx){
    const slotType=e.t==='razed'||e.t==='absorb'?'building':'unit';
    const slot=$(`${boards[e.who]} .slot.${slotType}[data-lane="${e.lane}"]`);
    if(e.t==='slain'||e.t==='razed'){
      if(!slot)continue;const c=CARDS[e.cardId],burn=c.special==='sapper';
      slot.insertAdjacentHTML('beforeend',`<span class="fx-slain${burn?' fx-burnout':''}"><i>${c.icon}</i><b>${esc(c.name)}</b><small>${e.t==='razed'?'razed':burn?'burns out':'falls'}</small></span>`);
    }else if(e.t==='hit'){
      hurt[e.who]+=e.dmg;
      if(slot)slot.insertAdjacentHTML('beforeend',`<span class="fx-dmg">−${e.dmg}</span>`);
    }else if(e.t==='absorb'&&slot)slot.insertAdjacentHTML('beforeend','<span class="fx-absorb">◈</span>');
    // Stone taking the blow reads differently from the keep taking it: no red, no quake.
    else if(e.t==='fort'&&slot)slot.insertAdjacentHTML('beforeend',`<span class="fx-fort">▚${e.amount}</span>`);
  }
  for(const who of ['player','ai']){
    if(!hurt[who])continue;
    const el=$(who==='player'?'#playerHealth':'#aiHealth');
    if(el){el.classList.add('hp-hit');setTimeout(()=>el.classList.remove('hp-hit'),900)}
  }
  const gs=$('#gameScreen');
  if(gs&&(hurt.player||hurt.ai)){gs.classList.add('quake');setTimeout(()=>gs.classList.remove('quake'),450)}
  setTimeout(()=>$$('.fx-slain,.fx-dmg,.fx-absorb').forEach(x=>x.remove()),1700*THEATRE_SPEED);
  fx=[];
}
function discardUnit(side,lane){const unit=side.board[lane].unit;if(unit){fx.push({t:'slain',who:fxSide(side),lane,cardId:unit.cardId});if(!unit.handCard?.bonus)side.discard.push(unit.cardId)}side.board[lane].unit=null}
// Per-round damage reduction. Palisades stamp the building instance; High Walls support remains
// compatible with decree rotations that include it without adding it back to the current archive.
function adjustedDamage(side,amount,lane){
  let damage=amount;
  if(game.damageRound!==game.round){game.damageRound=game.round;game.wallUsed={player:false,ai:false}}
  const target=side===game.player?'player':'ai';
  if(currentRule.id==='walls'&&!game.wallUsed[target])damage=Math.max(0,damage-1);
  // A lane resolves once a round, so a Palisade cannot be asked to hold twice — it needs no
  // once-per-round guard, and its text needs no "first".
  if(CARDS[side.board[lane]?.building?.cardId]?.special==='palisade')damage=Math.max(0,damage-2);
  return damage
}
function dealDamage(side,amount,lane){
  const dmg=adjustedDamage(side,amount,lane);
  const target=side===game.player?'player':'ai';
  // Fortification is spent stone: it takes the blow before the keep does, and unlike health it
  // is not capped at ten, so a well-walled ruler can stand above their starting integrity.
  const held=Math.min(side.fortification||0,dmg);
  if(held){side.fortification-=held;fx.push({t:'fort',who:target,lane,amount:held})}
  side.health-=dmg-held;
  if(dmg<amount)fx.push({t:'absorb',who:target,lane});
  if(dmg-held>0)fx.push({t:'hit',who:target,lane,dmg:dmg-held});
  if(currentRule.id==='walls')game.wallUsed[target]=true;
  return dmg
}
function harvest(side,label){
  side.board.forEach((lane,index)=>{
    if(!laneIsActive(index))return;
    if(lane.building){const c=CARDS[lane.building.cardId];if(c.produce)Object.entries(c.produce).forEach(([r,n])=>{let gain=n;if(currentRule.id==='winter'&&r!=='gold')gain=Math.max(0,gain-1);if(currentRule.id==='tradefair'&&r==='gold')gain++;side.resources[r]+=gain});if(c.special==='goldmine'&&(currentRule.id==='tradefair'||game.round>lane.building.round&&(game.round-lane.building.round)%2===1))side.resources.gold++}
    // A worker pays out at the end of every round it lives through, the round it arrives included.
    if(lane.unit){
      const worker=CARDS[lane.unit.cardId];
      if(worker.special==='worker')Object.entries(worker.produce).forEach(([r,n])=>{const gain=n+(currentRule.id==='winter'?1:0);side.resources[r]+=gain;log(`${label} ${worker.name} produces ${gain} ${RESOURCE_NAMES[r].toLowerCase()}.`)});
      // A Mason lays stone rather than gathering: the yield goes on the keep, not into the stores.
      if(worker.special==='mason'){side.fortification=(side.fortification||0)+1;log(`${label} ${worker.name} raises 1 fortification.`)}
    }
  });log(`${label} realm gathers its harvest.`)
}
function nextRound(){
  game.round++;game.locked=false;
  drawTurnBonuses(game.player);drawTurnBonuses(game.ai);
  game.player.pendingDraws=turnDrawTotal(game.player);game.ai.pendingDraws=turnDrawTotal(game.ai);
  // Online, the rival is a person who resolves their own draws on their own client.
  if(window.kingdomMultiplayer?.active)settleDraws(game.ai);else aiDrawTurn(game.ai);
  settleDraws(game.player);
  const draws=game.player.pendingDraws;renderGame();
  log(`Round ${game.round} begins. ${draws?`Choose ${draws===1?'one card':draws===2?'two cards':`${draws} cards`} from your structures or your units.`
    :game.player.hand.length>=HAND_LIMIT?`Your hand is full at ${HAND_LIMIT}; this round's draws are forfeited.`
    :'Both piles are spent; no cards are drawn.'}`);
}
function endGame(result){if(result==='win')meta.winWeek=weekKey();saveMeta();const title=result==='win'?'Victory for your kingdom':result==='loss'?'Your banner has fallen':'The realms lie in ruin';const text=result==='win'?'You have earned the right to open this week’s pack.':'Reshape your deck, learn the rival’s habits, and return to the field.';showModal(`<p class="eyebrow">BATTLE CONCLUDED</p><h2>${title}</h2><p>${text}</p><div class="modal-actions"><button class="button primary" data-after="again">Play again</button><button class="button ghost" data-after="${result==='win'?'collection':'home'}">${result==='win'?'Claim pack':'Return to hall'}</button></div>`);$$('[data-after]').forEach(b=>b.onclick=()=>{const go=b.dataset.after;closeModal();if(go==='again')startGame();else showScreen(go)})}

function productionForecastHtml(slot){
  const card=CARDS[slot?.cardId];if(!card)return'';
  let resource,gain=0;
  if(card.produce){
    [resource,gain]=Object.entries(card.produce)[0];
    if(card.special==='worker'){
      if(currentRule.id==='winter')gain++;
    }else{
      if(currentRule.id==='winter'&&resource!=='gold')gain=Math.max(0,gain-1);
      if(currentRule.id==='tradefair'&&resource==='gold')gain++;
    }
  }else if(card.special==='goldmine'&&(currentRule.id==='tradefair'||game.round>slot.round&&(game.round-slot.round)%2===1)){
    resource='gold';gain=1;
  }else if(card.special==='mason'){
    // A Mason's yield never reaches the stores, so it needs its own cue rather than a resource one.
    const label='Raises 1 fortification after this clash';
    return `<span class="production-cue fortify" title="${label}" aria-label="${label}"><i>▚</i><b>+1</b></span>`;
  }
  if(!resource||gain<=0)return'';
  const name=RESOURCE_NAMES[resource].toLowerCase(),label=`Produces ${gain} ${name} after this clash`;
  return `<span class="production-cue ${resource}" title="${label}" aria-label="${label}">${resourceIcon(resource)}<b>+${gain}</b></span>`;
}
function slotCardHtml(slot,hidden=false,power=null,forecast=''){if(!slot)return'';const c=CARDS[slot.cardId];if(hidden)return'<div class="slot-card hidden">?</div>';const art=CARD_ART[slot.cardId],damaged=['ram','pavise'].includes(c.special)&&slot.damaged;const name=damaged?(c.special==='ram'?'Damaged Ram':'Damaged Pavise Guard'):c.name;return `<div class="slot-card ${art?'board-painted':''} ${damaged?'damaged':''}" data-card="${slot.cardId}" style="--accent:${c.accent};${art?`--board-art:url('${art}')`:''}"><span class="slot-icon">${c.icon}</span>${forecast?`<span class="forecast-stack">${forecast}</span>`:''}<div class="slot-card-copy"><b>${name}</b><small>${c.type}</small></div>${power!==null?`<span class="slot-power"><i>⚔</i><b>${power}</b></span>`:''}</div>`}
function boardHtml(side,isAi,reveal=false){return side.board.map((lane,i)=>laneIsActive(i)?`<div class="lane"><div class="slot building ${lane.building?'occupied':''}" data-lane="${i}" data-type="building">${slotCardHtml(lane.building,isAi&&!reveal&&lane.building?.round===game.round,null,productionForecastHtml(lane.building))}</div><div class="slot unit ${lane.unit?'occupied':''}" data-lane="${i}" data-type="unit">${slotCardHtml(lane.unit,isAi&&!reveal&&lane.unit?.round===game.round,unitPower(side,i),productionForecastHtml(lane.unit))}</div></div>`:'').join('')}
// The realm sigil: three resources at the points of a triangle, gold at its heart.
// The spokes are the rule made visible — gold flows out to stand in for any of the three.
// The same mark, without counts, is the game's logo in the top bar and the favicon.
function resourceEmblemHtml(resources,opts={}){
  const counts=!opts.logo;
  const V={food:[60,30],material:[22,96],metal:[98,96]},CHIP={food:[60,10],material:[11,108],metal:[109,108]},CX=60,CY=74;
  const chrome=`
    <circle cx="${CX}" cy="${CY}" r="27" fill="${RES_COLORS.gold}" opacity=".07"/>
    <circle cx="${CX}" cy="${CY}" r="22" fill="${RES_COLORS.gold}" opacity=".07"/>
    <path d="M60 30 22 96h76Z" fill="none" stroke="#d3ad5d" stroke-width="1.4" opacity=".45"/>
    <path d="M60 30 22 96h76Z" fill="none" stroke="#d3ad5d" stroke-width="4" opacity=".08"/>
    <path d="M${CX} ${CY}L60 30M${CX} ${CY}L22 96M${CX} ${CY}L98 96" stroke="#e6ca85" stroke-width="1.6" opacity=".4"/>
    <path d="M41 63l3.2 3.2-3.2 3.2-3.2-3.2Z M79 63l3.2 3.2-3.2 3.2-3.2-3.2Z M60 92.8l3.2 3.2-3.2 3.2-3.2-3.2Z" fill="#d3ad5d" opacity=".5"/>`;
  const vertex=r=>{
    const [x,y]=V[r],[gx,gy]=CHIP[r],col=RES_COLORS[r];
    return `<g class="em-node ${counts&&!resources[r]?'empty':''}"><title>${RESOURCE_NAMES[r]}: ${resources[r]}</title>
      <circle cx="${x}" cy="${y}" r="15" fill="#16241a" stroke="${col}" stroke-width="2"/>
      ${counts?`<text x="${x}" y="${y+5.5}" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="15" font-weight="700" fill="#f2ecda">${resources[r]}</text>`
        :`<g fill="none" stroke="${col}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" transform="translate(${x-8},${y-8})">${RESOURCE_GLYPHS[r]}</g>`}
      <circle cx="${gx}" cy="${gy}" r="8.5" fill="#16241a" stroke="${col}" stroke-width="1.5"/>
      <g fill="none" stroke="${col}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" transform="translate(${gx-5.6},${gy-5.6}) scale(.7)">${RESOURCE_GLYPHS[r]}</g></g>`;
  };
  const gold=`<g class="em-node gold ${counts&&!resources.gold?'empty':''}"><title>Gold: ${resources.gold} — spends as any missing resource</title>
      <circle cx="${CX}" cy="${CY}" r="18" fill="#1d2b1f" stroke="${RES_COLORS.gold}" stroke-width="2.2"/>
      <circle cx="${CX}" cy="${CY}" r="14.5" fill="none" stroke="${RES_COLORS.gold}" stroke-width=".9" opacity=".55"/>
      ${counts?`<text x="${CX}" y="${CY+6.5}" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="18" font-weight="700" fill="#f3d489">${resources.gold}</text>`
        :`<g fill="none" stroke="${RES_COLORS.gold}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" transform="translate(${CX-8},${CY-8})">${RESOURCE_GLYPHS.gold}</g>`}</g>`;
  return `<svg class="resource-emblem" viewBox="0 0 120 120" role="img" aria-hidden="${opts.logo?'true':'false'}">${chrome}${vertex('food')}${vertex('material')}${vertex('metal')}${gold}</svg>`;
}
function renderResources(el,resources){
  el.setAttribute('aria-label',`Food ${resources.food}, Wood ${resources.material}, Metal ${resources.metal}, Gold ${resources.gold}. Gold can replace any other resource.`);
  el.innerHTML=resourceEmblemHtml(resources);
}
function renderHealth(el,value,owner,fortification=0){
  const health=Math.max(0,value),maximum=10,fort=Math.max(0,fortification);
  el.setAttribute('aria-label',`${owner} keep integrity: ${health} of ${maximum}${fort?`, behind ${fort} fortification`:''}`);
  // Fortification pips sit ahead of the keep's own, because that is the order damage meets them.
  const pips=Array.from({length:fort},()=>'<i class="fortified"></i>').join('')
    +Array.from({length:maximum},(_,i)=>`<i class="${i<health?'standing':'fallen'}"></i>`).join('');
  el.innerHTML=`<span class="keep-caption">KEEP</span><strong>${health}${fort?`<em>+${fort}</em>`:''}</strong><span class="keep-pips" aria-hidden="true">${pips}</span>`;
}
function renderGame(reveal=false){
  if(!game)return;$('#roundNumber').textContent=game.round;renderHealth($('#playerHealth'),game.player.health,'Your',game.player.fortification);renderHealth($('#aiHealth'),game.ai.health,'Rival',game.ai.fortification);renderResources($('#playerResources'),game.player.resources);renderResources($('#aiResources'),game.ai.resources);$('#aiHandCount').textContent=`${game.ai.hand.length} cards`;
  const riverActive=game.blockedLane!==null;$('#playerBoard').classList.toggle('three-lanes',riverActive);$('#aiBoard').classList.toggle('three-lanes',riverActive);$('#battlefieldWrap').classList.toggle('river-week',riverActive);$('#riverNotice').hidden=!riverActive;
  $('#playerBoard').innerHTML=boardHtml(game.player,false,reveal);$('#aiBoard').innerHTML=boardHtml(game.ai,true,reveal);
  $('#playerHand').innerHTML=game.player.hand.map(h=>cardHtml(h.cardId,{uid:h.uid,className:`${selectedUid===h.uid?'selected':''} ${canAfford(game.player,handCost(h))?'':'unaffordable'}`,free:h.free})).join('');
  $$('#playerHand .game-card').forEach(el=>el.onclick=()=>selectHand(el.dataset.uid));
  const selected=game.player.hand.find(x=>x.uid===selectedUid);if(selected){$$(`#playerBoard .slot.${CARDS[selected.cardId].type}`).forEach(s=>s.classList.add('valid'))}
  $$('#playerBoard .slot').forEach(s=>s.onclick=()=>slotClick(Number(s.dataset.lane),s.dataset.type));
  settleDraws(game.player);
  const pending=game.player.pendingDraws||0,drawing=Boolean(pending)&&!game.locked;
  if(!drawing){drawMinimised=false;drawReveal=null}
  $('#drawPrompt').hidden=!drawing||drawMinimised;
  $('#drawRestore').hidden=!drawing||!drawMinimised;
  $('#drawRestoreCount').textContent=pending===1?'1 draw left':`${pending} draws left`;
  $('#drawRemaining').textContent=pending===1?'1 draw left':`${pending} draws left`;
  // A card already turned up is shown inside the dialog, so it can inform the next pick.
  const revealBox=$('#drawReveal');revealBox.hidden=!drawReveal;
  if(drawReveal){
    revealBox.innerHTML=`<span class="reveal-label">YOU DREW</span>${cardHtml(drawReveal.cardId)}${drawReveal.fallback?'<em>That pile was spent, so it came from the other.</em>':''}`;
    revealBox.classList.remove('flash');void revealBox.offsetWidth;revealBox.classList.add('flash');
  }
  PILES.forEach(pile=>{
    const button=$(`#drawPrompt [data-pile="${pile}"]`),remaining=pileCount(game.player,pile);
    button.disabled=!remaining;button.querySelector('small').textContent=`${remaining} left`;
    button.onclick=()=>chooseDraw(pile);
  });
  $('#handHint').textContent=pending?'Draw before you plan — pick a pile above':'Select a card, then choose a slot';
  $('#commitButton').disabled=game.locked||pending>0;$('#commitButton').innerHTML=game.locked?'Resolving…':'Commit plans <span>⚔</span>';
}
function renderLog(){
  const entries=$('#gameLogEntries');if(!entries||!game)return;
  $('#logRoundLabel').textContent=`ROUND ${game.round}`;
  entries.innerHTML=game.logs.length?game.logs.map((entry,i)=>`<article class="log-entry ${i===0?'latest':''}"><span class="log-round">R${entry.round}</span><p>${entry.text}</p>${i===0?'<b>LATEST</b>':''}</article>`).join(''):'<p class="log-empty">The scribes await the first move.</p>';
  entries.scrollTop=0;
}
function log(text){game.logs.unshift({text,round:game.round});game.logs=game.logs.slice(0,24);renderLog()}
// The chronicle slides out of the battlefield and can be dismissed from either control.
// The chronicle opens as a rail beside the battlefield rather than on top of it: the screen makes room.
function setLog(open){$('#gameLog').classList.toggle('show',open);$('#gameLog').setAttribute('aria-hidden',String(!open));$('#logToggle').setAttribute('aria-pressed',String(open));$('#gameScreen').classList.toggle('log-open',open)}

function showModal(html){$('#modalContent').innerHTML=html;$('#modal').classList.add('open');$('#modal').setAttribute('aria-hidden','false')}
function closeModal(){$('#modal').classList.remove('open');$('#modal').setAttribute('aria-hidden','true')}

$$('[data-screen]').forEach(b=>b.addEventListener('click',()=>showScreen(b.dataset.screen)));
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{deckFilter=b.dataset.filter;$$('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderDeckBuilder()}));
$('#deckCards').addEventListener('click',e=>{const plus=e.target.dataset.plus,minus=e.target.dataset.minus;if(plus)adjustDeck(plus,1);if(minus)adjustDeck(minus,-1)});
$$('[data-collection]').forEach(b=>b.addEventListener('click',()=>{collectionView=b.dataset.collection;renderCollection()}));
$('#devModeToggle').onclick=()=>{devMode=!devMode;if(devMode)resetDevDeck();localStorage.setItem('kingdom-dev-mode',devMode?'1':'0');applyDevMode()};
$('#resetDeck').onclick=()=>{if(devMode)clearDevDeck();else{activeDeck().cards=[];saveMeta()}renderDeckBuilder();$('#deckMessage').textContent='Deck emptied — choose 20 cards for this banner.'};
$('#saveDeck').onclick=()=>{if(devMode)saveDevDeck();else saveMeta();$('#deckMessage').textContent=devMode?'Dev deck saved. Your normal banner is unchanged.':`“${activeDeck().name}” saved to the royal archive.`};
$('#deckSelect').onchange=e=>selectDeck(e.target.value);
$('#homeDeckSelect').onchange=e=>{selectDeck(e.target.value);renderDeckOptions()};
$('#onlineDeckSelect').onchange=e=>{selectDeck(e.target.value);renderDeckOptions()};
$('#deckNameInput').oninput=e=>{activeDeck().name=deckName(e.target.value);saveMeta();renderDeckOptions()};
$('#newDeck').onclick=()=>{if(meta.decks.length>=12)return;const d=makeDeck(`Banner ${meta.decks.length+1}`,[]);meta.decks.push(d);meta.activeDeckId=d.id;saveMeta();renderDeckBuilder();$('#deckMessage').textContent=`New banner started — add ${DECK_SIZE} cards.`};
$('#duplicateDeck').onclick=()=>{if(meta.decks.length>=12)return;const a=activeDeck(),d=makeDeck(`${a.name} copy`,a.cards.slice());meta.decks.push(d);meta.activeDeckId=d.id;saveMeta();renderDeckBuilder();$('#deckMessage').textContent='Banner duplicated.'};
$('#deleteDeck').onclick=()=>{if(meta.decks.length<2)return;const gone=activeDeck();meta.decks=meta.decks.filter(d=>d.id!==gone.id);meta.activeDeckId=meta.decks[0].id;saveMeta();renderDeckBuilder();$('#deckMessage').textContent=`“${gone.name}” disbanded.`};
$('#playButton').onclick=startGame;$('#restartGame').onclick=startGame;$('#leaveGame').onclick=()=>showScreen('home');$('#commitButton').onclick=commitTurn;$('#openPackButton').onclick=openPack;$('#closeModal').onclick=closeModal;$('#modal').onclick=e=>{if(e.target.id==='modal')closeModal()};$('#gameRuleBadge').onclick=()=>showModal(`<p class="eyebrow">WEEKLY DECREE</p><h2>${currentRule.icon} ${currentRule.name}</h2><p>${currentRule.text}</p>`);$('#logToggle').onclick=()=>setLog(!$('#gameLog').classList.contains('show'));$('#logClose').onclick=()=>setLog(false);$$('[data-play-mode]').forEach(button=>button.onclick=()=>setHallMode(button.dataset.playMode));
$('#drawMinimise').onclick=()=>setDrawMinimised(true);$('#drawRestore').onclick=()=>setDrawMinimised(false);
// Escape folds the dialog away rather than dismissing a decision that still has to be made.
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&game?.player.pendingDraws&&!game.locked)setDrawMinimised(!drawMinimised)});
// The realm sigil doubles as the game's mark in the top bar.
$$('.brand-mark').forEach(el=>{el.textContent='';el.innerHTML=resourceEmblemHtml({food:'',material:'',metal:'',gold:''},{logo:true})});
// ---- Card tooltip: hover any card on the battlefield or in hand and it tells you what it does. ----
function cardTipHtml(id,granted=false){
  const c=CARDS[id],cost=granted?{}:effectiveCost(id);
  return `<div class="tip-head"><b>${esc(c.name)}</b><span>${c.token?'token':c.type}</span></div>
    ${c.power!==undefined?`<div class="tip-power">⚔ ${c.power} power</div>`:''}
    ${Object.keys(cost).length?`<div class="tip-cost">${costsHtml(cost)}</div>`:`<div class="tip-cost free">${granted?'Granted — costs nothing to deploy':'Free to play'}</div>`}
    ${c.text?`<p>${esc(c.text)}</p>`:''}`;
}
document.addEventListener('mouseover',ev=>{
  const tip=$('#cardTip');if(!tip||!document.body.classList.contains('in-battle'))return;
  const t=ev.target.closest?.('[data-card]');
  if(!t||t.classList.contains('hidden')||!CARDS[t.dataset.card]){tip.hidden=true;return}
  tip.innerHTML=cardTipHtml(t.dataset.card,t.dataset.free==='1');tip.hidden=false;
  const r=t.getBoundingClientRect(),tw=tip.offsetWidth;
  tip.style.left=Math.min(Math.max(10,r.left+r.width/2-tw/2),innerWidth-tw-10)+'px';
  const above=r.top-tip.offsetHeight-10;
  tip.style.top=(above<8?r.bottom+10:above)+'px';
});
document.addEventListener('mouseout',ev=>{const tip=$('#cardTip');if(tip&&!ev.relatedTarget?.closest?.('[data-card]'))tip.hidden=true});
setupRuleSelector();applyDevMode();renderDeckBuilder();setHallMode(localStorage.getItem('kingdom-hall-mode')||'solo');showScreen('home');
