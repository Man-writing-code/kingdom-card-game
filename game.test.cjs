const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

let source=fs.readFileSync('game.js','utf8').replace('loadMeta();','');
source=source.slice(0,source.indexOf("$$('[data-screen]')"));

const tests=`
renderGame=()=>{};renderLog=()=>{};
currentRule={id:'none'};

function testSide(){return {health:10,fortification:0,resources:{food:0,metal:0,material:0,gold:0},structures:[],units:[],discard:[],hand:[],pendingDraws:0,board:Array.from({length:4},()=>({building:null,unit:null}))}}
function pileUp(side,ids){for(const id of ids)side[pileOf(id)].push(id);return side}
function testSlot(cardId,round=0,extra={}){return {cardId,round,handCard:{cardId,bonus:false},...extra}}
function resetGame(round=2){game={round,player:testSide(),ai:testSide(),logs:[],wallUsed:{}};return game}

assert.equal(COLLECTIBLE_IDS.length,38,'global collectible pool (Charge designs shelved)');
assert.equal(Object.keys(CARDS).length,39,'collectibles plus Peasant token');
for(const id of Object.keys(CARDS)){assert(CARD_ART[id],id+' has an art mapping');assert(fs.existsSync(CARD_ART[id]),CARD_ART[id]+' exists')}
for(const id of ['rabblerouser','boarriders','palisade','wallwarden','royalguard','armoury','huntsman','huntinglodge','ballista','paviseguard'])assert(COLLECTIBLE_IDS.includes(id),id+' joins packs');
for(const id of ['lancer','bannercaptain'])assert(!CARDS[id],id+' stays shelved');
assert.deepEqual(sanitizeDeck(['lancer','soldier','bannercaptain','archer'],['soldier','archer']),['soldier','archer'],'old saves shed shelved designs');

resetGame(1);game.player.board[0].unit=testSlot('rabblerouser',1);resolveOnBuild(game.player,'Your');
assert.equal(game.player.hand.length,1);assert.equal(game.player.hand[0].cardId,'peasant');assert.equal(game.player.hand[0].bonus,true);
resolveOnBuild(game.player,'Your');assert.equal(game.player.hand.length,1,'Rabble-Rouser resolves once');

resetGame();game.player.board[0].unit=testSlot('peasant',1,{handCard:{cardId:'peasant',bonus:true}});discardUnit(game.player,0);assert.deepEqual(game.player.discard,[],'generated Peasant vanishes');

resetGame();game.player.board[0].unit=testSlot('wallwarden');assert.equal(unitPower(game.player,0),1);game.player.board[0].building=testSlot('logging');assert.equal(unitPower(game.player,0),3);
// The Armoury and the Watchtower are the metal and wood halves of one idea: 2 of a resource
// for +1 power in the lane, asking nothing of the unit that stands there.
assert.deepEqual(CARDS.armoury.cost,{metal:2},'the Armoury is 2 metal');
assert.deepEqual(CARDS.watchtower.cost,{material:2},'and the Watchtower its 2 wood counterpart');
assert.equal(CARDS.armoury.text,CARDS.watchtower.text,'and they now say the same thing');
for(const yard of ['armoury','watchtower']){
  game.player.board[0].building=testSlot(yard);
  game.player.board[0].unit=testSlot('manatarms');assert.equal(unitPower(game.player,0),4,yard+' arms a metal unit');
  game.player.board[0].unit=testSlot('knight');assert.equal(unitPower(game.player,0),3,yard+' arms a mixed-cost unit too');
  game.player.board[0].unit=testSlot('miner');assert.equal(unitPower(game.player,0),2,yard+' even arms a worker');
}

resetGame();game.player.board[0].building=testSlot('palisade');assert.equal(dealDamage(game.player,3,0),1);assert.equal(dealDamage(game.player,3,0),3);game.round++;assert.equal(dealDamage(game.player,3,0),1,'Palisade refreshes next round');
resetGame();currentRule={id:'walls'};game.player.board[0].building=testSlot('palisade');assert.equal(dealDamage(game.player,4,0),1,'Palisade stacks with High Walls');assert.equal(dealDamage(game.player,4,0),4);game.round++;assert.equal(dealDamage(game.player,4,0),1);currentRule={id:'none'};

resetGame();const hunter=testSlot('huntsman');game.player.board[0].unit=hunter;rewardClashWinner(game.player,hunter,0,'Your');assert.equal(game.player.resources.material,1);
game.player.board[0].unit=null;rewardClashWinner(game.player,hunter,0,'Your');assert.equal(game.player.resources.material,1,'defeated Huntsman earns nothing');

resetGame();game.player.board[0].unit=testSlot('soldier',1);game.player.board[0].building=testSlot('huntinglodge');directStrike(game.player,game.ai,0,2,'You','your');assert.equal(game.ai.health,8);assert.equal(game.player.resources.food,1);
resetGame();game.player.board[0].unit=testSlot('soldier',1);game.player.board[0].building=testSlot('huntinglodge');game.ai.board[0].building=testSlot('palisade');directStrike(game.player,game.ai,0,2,'You','your');assert.equal(game.ai.health,10);assert.equal(game.player.resources.food,0,'Lodge needs positive direct damage');

resetGame();game.player.board[1].unit=testSlot('boarriders',1);assert.equal(unitPower(game.player,1),3,'Boar Riders alone hold base power');
game.player.board[0].unit=testSlot('peasant',1);assert.equal(unitPower(game.player,1),4,'one flank adds 1');
game.player.board[2].unit=testSlot('peasant',1);assert.equal(unitPower(game.player,1),5,'both flanks add 2');
game.player.board[3].unit=testSlot('peasant',1);assert.equal(unitPower(game.player,1),5,'only neighbouring lanes count');
resetGame();game.player.board[0].unit=testSlot('peasantmob',1);assert.equal(unitPower(game.player,0),2,'an edge lane with no neighbour stays at base');
game.player.board[1].unit=testSlot('peasantmob',1);assert.equal(unitPower(game.player,0),3);assert.equal(unitPower(game.player,1),3,'adjacent mobs strengthen each other');
resetGame();game.blockedLane=3;game.player.board[1].unit=testSlot('peasant',1);game.player.board[2].unit=testSlot('peasantmob',1);assert.equal(unitPower(game.player,2),3,'adjacency still pays when a decree closes a lane');

resetGame();game.player.board[0].building=testSlot('ballista');game.ai.board[0].unit=testSlot('royalguard');resolveBallistas(game.player,game.ai,[0,0,0,0],[4,0,0,0]);assert.equal(game.player.board[0].building,null);assert.equal(game.ai.board[0].unit,null);
resetGame();game.player.board[0].building=testSlot('ballista');game.ai.board[0].building=testSlot('ballista');game.player.board[0].unit=testSlot('royalguard');game.ai.board[0].unit=testSlot('royalguard');resolveBallistas(game.player,game.ai,[4,0,0,0],[4,0,0,0]);assert.equal(game.player.board[0].unit,null);assert.equal(game.ai.board[0].unit,null);assert.equal(game.player.board[0].building,null);assert.equal(game.ai.board[0].building,null);
resetGame();game.player.board[0].building=testSlot('ballista');game.ai.board[0].unit=testSlot('batteringram',1,{damaged:true});resolveBallistas(game.player,game.ai,[0,0,0,0],[unitPower(game.ai,0),0,0,0]);assert(game.player.board[0].building);assert(game.ai.board[0].unit,'Ballista ignores a 1-power Damaged Ram');
resetGame();game.player.board[0].building=testSlot('ballista');game.ai.board[0].unit=testSlot('firesapper');resolveBallistas(game.player,game.ai,[0,0,0,0],[0,0,0,0]);assert(game.player.board[0].building);assert(game.ai.board[0].unit,'Ballista ignores Fire Sappers');

resetGame();game.player.board[0].unit=testSlot('batteringram',1);game.ai.board[0].building=testSlot('watchtower');resolveRound();
assert.equal(game.ai.board[0].building,null,'an unopposed Ram breaks the building');assert(game.player.board[0].unit?.damaged);
resetGame();game.player.board[0].unit=testSlot('batteringram',1);game.ai.board[0].building=testSlot('watchtower');game.ai.board[0].unit=testSlot('peasant',1);resolveRound();
assert(game.ai.board[0].building,'a Ram that wins a clash leaves the building standing');assert.equal(game.ai.board[0].unit,null);assert(!game.player.board[0].unit?.damaged);

resetGame();game.player.board[0].unit=testSlot('paviseguard');assert.equal(combatDefeat(game.player,0),false);assert.equal(unitPower(game.player,0),1);assert.equal(combatDefeat(game.player,0),true);assert.equal(game.player.board[0].unit,null);
resetGame();game.player.board[0].unit=testSlot('paviseguard');game.ai.board[0].unit=testSlot('soldier');resolveRound();assert(game.player.board[0].unit?.damaged);assert.equal(game.ai.board[0].unit,null,'Pavise Guard survives a normal tie');
resetGame();game.player.board[0].unit=testSlot('paviseguard');game.ai.board[0].unit=testSlot('firesapper');resolveRound();assert.equal(game.player.board[0].unit,null,'Fire Sapper bypasses Pavise resilience');

// Card revisions.
assert.deepEqual(CARDS.archer.cost,{material:2},'Archer costs 2 wood');
assert.deepEqual(CARDS.goldmine.cost,{},'the Gold Mine is free to raise');
assert.deepEqual(CARDS.farmer.cost,{food:1},'each worker is bought with what it produces');
assert.deepEqual(CARDS.lumberjack.cost,{material:1});
assert.deepEqual(CARDS.miner.cost,{metal:1});
for(const id of ['farmer','lumberjack','miner'])assert.equal(Object.keys(CARDS[id].produce)[0],Object.keys(CARDS[id].cost)[0],id+' pays in its own coin');
// Workers and resource buildings harvest on the same beat, so they say it the same way.
for(const id of ['farmer','lumberjack','miner','farm','logging','mining'])
  assert.match(CARDS[id].text,/^Harvest 1 (food|wood|metal) after each clash\.$/,id+' uses the shared harvest wording');
// Rules text earns its place: a card that only fights says nothing, since the power badge
// already says it. Anything with a special or a yield must explain itself.
for(const [id,c] of Object.entries(CARDS)){
  const carriesRules=Boolean(c.special||c.produce);
  if(carriesRules)assert(c.text,id+' has an effect and must describe it');
  else assert.equal(c.text,'',id+' only fights, so it should carry no flavour text');
}
assert.equal(CARDS.soldier.text,'');assert.equal(CARDS.champion.text,'');assert.equal(CARDS.royalguard.text,'');

// A worker pays out at the end of every round it survives, the round it arrives included.
resetGame(3);game.player.board[0].unit=testSlot('lumberjack',3);harvest(game.player,'Your');
assert.equal(game.player.resources.material,1,'a worker produces the round it is deployed');
harvest(game.player,'Your');assert.equal(game.player.resources.material,2,'and again the next round');

// A Knight fights as a 4 and raids as a 2.
resetGame();game.player.board[0].unit=testSlot('knight',1);
assert.equal(unitPower(game.player,0),2,'a Knight facing an open lane hits for its base');
game.ai.board[0].unit=testSlot('soldier',1);
assert.equal(unitPower(game.player,0),4,'and gains 2 against anything standing in its way');
game.ai.board[0].unit=null;assert.equal(unitPower(game.player,0),2,'the bonus leaves with the defender');
// A Pikeman digs in: every round it holds the lane is another point of power.
resetGame(2);game.player.board[0].unit=testSlot('pikeman',2);
assert.equal(unitPower(game.player,0),2,'a Pikeman starts on its base the round it deploys');
game.round=3;assert.equal(unitPower(game.player,0),3,'a round held adds one');
game.round=5;assert.equal(unitPower(game.player,0),5,'three rounds held is its ceiling');
game.round=12;assert.equal(unitPower(game.player,0),5,'and it digs no deeper than that');
assert.equal(CARDS.pikeman.text.includes('Knight'),false,'its rule no longer hangs on one rival card');
// The old holder of this slot lost nothing else: a fresh copy is still just a 2.
resetGame(4);game.player.board[0].unit=testSlot('pikeman',4);assert.equal(unitPower(game.player,0),2);

// A granted card is free to deploy; a drawn copy of the same design is not.
const granted=makeHandCard('lumberjack',true,true),bought=makeHandCard('lumberjack');
assert.deepEqual(handCost(granted),{},'a Town Hall recruit costs nothing');
assert.deepEqual(handCost(bought),{material:1},'a drawn worker still pays');
resetGame();game.player.resources={food:0,metal:0,material:0,gold:0};
assert(canAfford(game.player,handCost(granted)),'a bankrupt realm can still deploy its recruit');
assert(!canAfford(game.player,handCost(bought)),'but cannot buy one');
// Fortification is stone in front of the keep: it takes the blow first, and it is not capped
// at ten, so a walled ruler stands above their starting integrity.
resetGame();game.player.fortification=3;
assert.equal(dealDamage(game.player,2,0),2,'the strike still lands at full weight');
assert.equal(game.player.health,10,'but the keep is untouched');
assert.equal(game.player.fortification,1,'the stone wore instead');
dealDamage(game.player,3,0);
assert.equal(game.player.fortification,0,'stone is spent before flesh');
assert.equal(game.player.health,8,'and the remainder carries through to the keep');

// A Gatehouse raises fortification rather than repairing, so it is worth building at full health.
resetGame(1);game.player.board[0].building=testSlot('gatehouse',1);resolveOnBuild(game.player,'Your');
assert.equal(game.player.health,10,'a full keep is not healed');
assert.equal(game.player.fortification,2,'it is walled instead');
assert.equal(game.player.health+game.player.fortification,12,'which carries a ruler above ten');
resolveOnBuild(game.player,'Your');assert.equal(game.player.fortification,2,'and it raises its wall once');
resetGame(1);game.player.health=4;game.player.board[0].building=testSlot('gatehouse',1);resolveOnBuild(game.player,'Your');
assert.equal(game.player.health,4,'a wounded keep is not repaired either');assert.equal(game.player.fortification,2);

// A Palisade still blunts the strike before the stone is asked to hold it.
resetGame();game.player.fortification=5;game.player.board[0].building=testSlot('palisade');
assert.equal(dealDamage(game.player,3,0),1,'the Palisade takes 2 off first');
assert.equal(game.player.fortification,4,'so only 1 reaches the fortification');
assert.equal(game.player.health,10);

// A Commons pays regardless of the board: it no longer waits for an empty lane.
resetGame();game.player.board[0].building=testSlot('villagecommons',1);
game.player.board.forEach(l=>{l.unit=testSlot('soldier',1)});
drawTurnBonuses(game.player);
assert.equal(game.player.hand.length,1,'a full front line still earns its Peasant');
assert.equal(game.player.hand[0].cardId,'peasant');
resetGame();game.player.board[0].building=testSlot('villagecommons',1);game.player.board[1].building=testSlot('villagecommons',1);
drawTurnBonuses(game.player);assert.equal(game.player.hand.length,2,'each Commons pays its own Peasant');
resetGame();game.player.board[0].building=testSlot('villagecommons',1);
game.player.hand=Array.from({length:HAND_LIMIT},()=>makeHandCard('soldier'));
drawTurnBonuses(game.player);assert.equal(game.player.hand.length,HAND_LIMIT,'but a full hand still turns it away');

resetGame();game.player.board[0].building=testSlot('townhall',1);drawTurnBonuses(game.player);
assert.equal(game.player.hand.length,1,'a Town Hall recruits');
assert(game.player.hand[0].free,'and the recruit arrives granted');
assert(WORKERS.includes(game.player.hand[0].cardId),'and it is a worker');

// Every tier-two engine is bought with 2 of what it harvests, so an archetype can ramp itself.
currentRule={id:'none'};
for(const [id,resource] of [['granary','food'],['lumbermill','material'],['foundry','metal']]){
  assert.equal(CARDS[id].cost[resource],2,id+' is paid for in what it makes');
  assert.equal(Object.values(CARDS[id].produce)[0],2,id+' harvests two of it');
  const own={food:0,metal:0,material:0,gold:0};own[resource]=2;
  assert(!canAfford({resources:own},effectiveCost(id)),id+' still owes its secondary cost');
  const secondary=Object.keys(CARDS[id].cost).find(r=>r!==resource);own[secondary]=(own[secondary]||0)+1;
  assert(canAfford({resources:own},effectiveCost(id)),'a realm on its own harvest can raise '+id);
}
// Costs are printed costs: no decree rewrites them, and effectiveCost hands back a copy so a
// caller cannot scribble on the card definition itself.
for(const rule of [...META_RULES,{id:'none'}]){
  currentRule=rule;
  for(const id of TIER_TWO)assert.deepEqual(effectiveCost(id),CARDS[id].cost,id+' costs its printed price under '+rule.id);
}
currentRule={id:'none'};
const scribble=effectiveCost('granary');scribble.food=99;
assert.equal(CARDS.granary.cost.food,2,'effectiveCost returns a copy, not the card');

// Every decree must bite for any collection; none may hinge on holding particular designs.
assert(!META_RULES.some(r=>r.id==='guilds'),'Guild Charters is retired from the rotation');
assert(META_RULES.length>=5,'the calendar still has a full rotation to draw from');
for(const rule of META_RULES)assert(rule.name&&rule.text&&rule.icon&&rule.flavour,rule.id+' is fully described');

const original=Array.from({length:20},(_,i)=>COLLECTIBLE_IDS[i]);assert.deepEqual(normaliseCollection(original),original,'existing 20-design collections remain unchanged');

loadMeta();devMode=false;assert.equal(meta.unlocked.length,COLLECTION_SIZE,'a first run opens with a full collection');
assert.equal(meta.decks.length,1);assert.equal(activeDeck().cards.length,DECK_SIZE,'a first run is dealt a playable opening banner');
assert(deckIsPlayable(activeDeck()),'the opening banner only uses owned designs');

devMode=true;resetDevDeck();
assert.equal(availableDesigns().length,COLLECTIBLE_IDS.length,'dev mode unlocks every collectible design');
assert.equal(deckCards(activeDeck()).length,DECK_SIZE,'the dev deck starts with a full 20 cards');
assert.deepEqual(deckCards(activeDeck()),activeDeck().cards,'the dev deck starts from the active normal banner');
assert.equal(sanitizeDevDeck([...COLLECTIBLE_IDS,'logging']).length,DECK_SIZE,'the dev deck keeps the normal 20-card cap');
assert(deckIsPlayable(activeDeck()),'a full dev deck remains playable');
devMode=false;
assert.equal(availableDesigns().length,COLLECTION_SIZE,'normal mode restores the saved 20-design collection');
assert.equal(deckCards(activeDeck()).length,DECK_SIZE,'normal mode restores the saved 20-card banner');
assert(deckIsPlayable(activeDeck()),'the restored normal banner uses the normal validation rules');
devMode=true;resetDevDeck();

localStorage.getItem=()=>JSON.stringify({version:SAVE_VERSION,unlocked:INITIAL_UNLOCKED,decks:[{id:'empty',name:'Empty Banner',cards:[]}],activeDeckId:'empty'});
loadMeta();assert.equal(activeDeck().cards.length,0,'a deliberately emptied saved banner stays empty after reload');
localStorage.getItem=()=>null;

for(const [profile,deck] of Object.entries(AI_DECKS)){
  assert.equal(deck.length,DECK_SIZE,profile+' fields a legal 20-card banner');
  assert(AI_PROFILE_NAMES[profile],profile+' has a display name');
  const counts=deck.reduce((m,id)=>(m[id]=(m[id]||0)+1,m),{});
  for(const [id,n] of Object.entries(counts)){assert(COLLECTIBLE_IDS.includes(id),id+' is a real design');assert(n<=4,profile+' keeps '+id+' to four copies')}
}
assert.deepEqual(AI_DECKS.timber.reduce((m,id)=>(m[id]=(m[id]||0)+1,m),{}),
  {logging:4,lumbermill:3,farm:2,university:2,lumberjack:1,archer:4,firesapper:4},'Timber Scholars runs the requested list');
assert(AI_DECKS.timber.some(id=>CARDS[id].produce?.food),'the banner can pay its own Sawmill food');

assert.deepEqual(AI_DECKS.uprising.reduce((m,id)=>(m[id]=(m[id]||0)+1,m),{}),
  {farm:4,farmer:2,rabblerouser:4,peasantmob:4,villagecommons:2,granary:2,lumberjack:2},'the Village Uprising runs the requested list');
for(const gone of ['general','wood','food'])assert(!AI_DECKS[gone],gone+' is retired from the roster');
assert(Object.keys(AI_DECKS).every(k=>AI_PROFILE_NAMES[k]),'every surviving banner still has a display name');

assert.deepEqual(AI_DECKS.siege.reduce((m,id)=>(m[id]=(m[id]||0)+1,m),{}),
  {mining:4,logging:2,foundry:1,batteringram:4,manatarms:4,paviseguard:2,firesapper:3},'the Siege Train runs the requested list');

// A Ram hunts walls: an unguarded enemy building beats an empty lane, and a guarded one
// still beats nothing at all. A Sapper burns the guard off a walled lane to open it.
resetGame();game.aiProfile='siege';game.ai.resources={food:9,metal:9,material:9,gold:9};
const siegeRam={uid:'sr',cardId:'batteringram',bonus:false},siegeSap={uid:'ss',cardId:'firesapper',bonus:false};
game.player.board[0].building=testSlot('watchtower',1);
game.player.board[1].building=testSlot('watchtower',1);game.player.board[1].unit=testSlot('soldier',1);
const openWall=aiActionScore(siegeRam,0,'hardcore'),guardedWall=aiActionScore(siegeRam,1,'hardcore'),bareLane=aiActionScore(siegeRam,2,'hardcore');
assert(openWall>guardedWall&&openWall>bareLane,'a Ram wants the unguarded wall above all');
assert(aiActionScore(siegeSap,1,'hardcore')>aiActionScore(siegeSap,2,'hardcore'),'a Sapper opens the guarded wall rather than an empty lane');

resetGame();game.aiProfile='timber';game.ai.resources={food:2,metal:0,material:4,gold:0};
const timberFarm={uid:'tf',cardId:'farm',bonus:false},timberMill={uid:'tm',cardId:'lumbermill',bonus:false};
const firstFarm=aiActionScore(timberFarm,0,'hard');game.ai.board[1].building=testSlot('farm');
assert(firstFarm>aiActionScore(timberFarm,0,'hard'),'the first Farm outranks a second');
assert(aiActionScore(timberMill,1,'hard')<aiActionScore(timberMill,0,'hard'),'a Sawmill avoids paving the last Farm');

resetGame();game.aiProfile='timber';game.ai.resources={food:2,metal:0,material:4,gold:0};
const timberJack={uid:'tj',cardId:'lumberjack',bonus:false};
const quietLane=aiActionScore(timberJack,0,'hard');game.player.board[0].unit=testSlot('knight',1);
assert(quietLane>aiActionScore(timberJack,0,'hard'),'the Lumberjack keeps out of a contested lane');

resetGame();game.aiProfile='timber';game.ai.resources={food:0,metal:0,material:3,gold:0};
const timberSapper={uid:'ts',cardId:'firesapper',bonus:false};
assert(aiActionScore(timberSapper,0,'hard')<0,'a healthy Timber AI holds the Fire Sapper for value');
game.ai.health=4;assert(aiActionScore(timberSapper,0,'hard')>0,'a thin castle deploys it proactively');
game.ai.health=10;game.player.board[0].unit=testSlot('knight',1);
assert(aiActionScore(timberSapper,0,'hard')>0,'a visible threat draws the Sapper out regardless of health');
const timberArcher={uid:'ta',cardId:'archer',bonus:false};
resetGame();game.aiProfile='timber';game.ai.resources={food:0,metal:0,material:3,gold:0};
const openLane=aiActionScore(timberArcher,0,'hard');game.player.board[0].unit=testSlot('knight',1);
assert(openLane>aiActionScore(timberArcher,0,'hard'),'Archers prefer an undefended lane');
game.aiProfile=null;

// Replacement discipline: a standing producer is worth more than its face value.
resetGame();game.aiProfile='timber';game.ai.resources={food:9,metal:9,material:9,gold:9};
const logCamp={uid:'lc',cardId:'logging',bonus:false};
game.ai.board[0].building=testSlot('university');game.ai.board[1].building=testSlot('lumbermill');
assert(aiActionScore(logCamp,0,'hardcore')<0,'a Logging Camp will not pave a University');
assert(aiActionScore(logCamp,1,'hardcore')<0,'a Logging Camp will not pave a Sawmill');
assert(aiActionScore(logCamp,2,'hardcore')>0,'but it still wants the empty lane');
assert(aiActionScore(logCamp,2,'hardcore')>aiActionScore(logCamp,0,'hardcore'),'empty ground beats a downgrade');
const millUp={uid:'mu',cardId:'lumbermill',bonus:false};
resetGame();game.aiProfile='timber';game.ai.resources={food:9,metal:9,material:9,gold:9};
// A banner with more timber to draw can afford to trade its camp up; with none left it should not,
// so the pile is stocked deliberately rather than left empty.
pileUp(game.ai,['logging','logging']);game.ai.board[0].building=testSlot('logging');
assert(aiActionScore(millUp,0,'hardcore')>0,'a genuine Sawmill upgrade over a Logging Camp still goes ahead');
game.ai.structures=[];
assert(aiActionScore(millUp,0,'hardcore')<0,'but not when that camp is the last wood in the realm');
assert(aiActionScore(logCamp,0,'hardcore')<0,'and a Logging Camp will not pave an identical Logging Camp');

// Deck awareness: the same replacement is judged against what is left to draw.
function farmPaveScore(pending){
  resetGame();game.aiProfile=null;game.ai.resources={food:9,metal:9,material:9,gold:9};
  pileUp(game.ai,pending);game.ai.board[0].building=testSlot('farm');
  return aiActionScore({uid:'kn',cardId:'townhall',bonus:false},0,'hardcore');
}
assert(farmPaveScore(['farm','soldier'])>farmPaveScore(['soldier','soldier']),'paving the last Farm is worse when no Farm remains to draw');
assert.equal(aiScarcity(testSide(),'food'),2.6,'an unproducible resource is hoarded');
assert.equal(aiScarcity(pileUp(testSide(),['farm']),'food'),1.6,'a drawable producer softens that');
resetGame();game.ai.board[0].building=testSlot('farm');
assert.equal(aiScarcity(game.ai,'food'),1,'a standing producer makes it renewable');

function stockedAI(profile,difficulty){
  resetGame();game.aiProfile=profile;game.aiDifficulty=difficulty;
  game.ai.resources={food:9,metal:9,material:9,gold:9};
  game.ai.hand=AI_DECKS[profile].map((cardId,i)=>({uid:'h'+i,cardId,bonus:false}));
  aiPlan();return game.ai;
}
const boardPrint=side=>side.board.map(l=>(l.building?.cardId||'-')+'/'+(l.unit?.cardId||'-')).join(',');
const placements=side=>side.board.reduce((n,l)=>n+(l.building?1:0)+(l.unit?1:0),0);

for(const profile of Object.keys(AI_DECKS)){
  const hardcore=stockedAI(profile,'hardcore');
  assert(placements(hardcore)>4,profile+' on Hardcore commits past the four-action Hard cap');
  assert(placements(hardcore)<=8,profile+' on Hardcore still fits inside the eight board slots');
  for(const r of ['food','metal','material','gold'])assert(hardcore.resources[r]>=0,profile+' never overspends '+r+' on Hardcore');
  assert(hardcore.board.every(l=>['building','unit'].every(t=>!l[t]||l[t].round===game.round||!l[t].replaced)),profile+' fills each slot once per round');
  assert.equal(boardPrint(hardcore),boardPrint(stockedAI(profile,'hardcore')),profile+' plays deterministically on Hardcore');
  assert.equal(placements(stockedAI(profile,'hard')),4,profile+' on Hard still stops at four');
}
assert.equal(aiPlaysBest('hardcore'),true);assert.equal(aiPlaysBest('hard'),true);assert.equal(aiPlaysBest('normal'),false);

// Split piles and the chosen draw.
const splitSide=createSide(AI_DECKS.timber);
assert.equal(splitSide.structures.length,11,'structures pile takes every building');
assert.equal(splitSide.units.length,9,'units pile takes every unit');
assert.equal(splitSide.structures.length+splitSide.units.length,DECK_SIZE,'the two piles are the whole banner');
assert(splitSide.structures.every(id=>CARDS[id].type==='building')&&splitSide.units.every(id=>CARDS[id].type==='unit'),'piles never mix types');

const opener=createSide(AI_DECKS.timber);drawOpeningHand(opener);
assert.equal(opener.hand.length,5,'the opening hand is still five cards');
assert.equal(opener.hand.filter(hc=>CARDS[hc.cardId].type==='building').length,3,'three of them are structures');
assert.equal(opener.hand.filter(hc=>CARDS[hc.cardId].type==='unit').length,2,'and two are units');

resetGame();const drawer=testSide();drawer.units.push('archer');
assert.equal(drawFromPile(drawer,'structures'),'archer','an empty pile falls back to the other');
assert.equal(drawFromPile(drawer,'structures'),null,'with both piles spent the draw yields nothing');
const recycler=testSide();recycler.discard=['farm','soldier'];
assert.equal(drawFromPile(recycler,'structures'),'farm','a pile reclaims its own discards');
assert.deepEqual(recycler.discard,['soldier'],'and leaves the other type in the discard');

resetGame(1);game.player=createSide(AI_DECKS.timber);game.ai=createSide(AI_DECKS.timber);
game.aiProfile='timber';game.aiDifficulty='hardcore';
nextRound();
assert.equal(game.round,2);
assert.equal(game.player.pendingDraws,turnDrawCount(),'the player is left a choice to make');
assert.equal(game.ai.pendingDraws,0,'the AI resolves its own draws immediately');
assert.equal(game.ai.hand.length,turnDrawCount(),'and actually took them');
const handBefore=game.player.hand.length;
commitTurn();assert.equal(game.locked,false,'planning is blocked until the draws are spent');
chooseDraw('structures');
assert.equal(game.player.hand.length,handBefore+1);
assert.equal(CARDS[game.player.hand[handBefore].cardId].type,'building','the chosen pile is the one that pays out');
chooseDraw('units');
assert.equal(game.player.pendingDraws,0);
assert.equal(CARDS[game.player.hand[handBefore+1].cardId].type,'unit');

// A ruler is never held at the prompt with nothing left to draw.
resetGame();game.player=testSide();game.player.pendingDraws=2;settleDraws(game.player);
assert.equal(game.player.pendingDraws,0,'empty piles clear the prompt');

// The hand holds ten; draws and gifts beyond that are turned away.
resetGame();const packed=testSide();packed.structures=['farm','farm'];
for(let i=0;i<10;i++)packed.hand.push({uid:'p'+i,cardId:'soldier',bonus:false});
assert.equal(drawFromPile(packed,'structures'),null,'a full hand negates the draw');
assert.equal(packed.hand.length,10);assert.equal(packed.structures.length,2,'the negated card stays on its pile');
gainBonusCard(packed,'peasant');assert.equal(packed.hand.length,10,'bonus cards respect the limit');
packed.pendingDraws=2;settleDraws(packed);assert.equal(packed.pendingDraws,0,'a full hand clears the prompt');
packed.hand.pop();gainBonusCard(packed,'peasant');assert.equal(packed.hand.length,10,'one seat free admits one card');
game.player=packed;game.player.board[0].unit=testSlot('rabblerouser',2);resolveOnBuild(game.player,'Your');
assert.equal(game.player.hand.length,10,'a Rabble-Rouser cannot overfill the hand');

// The AI reaches for units when its lanes are bare and structures while it is still ramping.
resetGame();game.ai=testSide();
assert.equal(aiDrawChoice(game.ai),'structures','an empty board in the early rounds ramps first');
game.ai.board.forEach(l=>l.building=testSlot('logging',1));
assert.equal(aiDrawChoice(game.ai),'units','bare lanes behind a built economy pull for units');
game.ai.board.forEach(l=>l.unit=testSlot('archer',1));
assert.equal(aiDrawChoice(game.ai),'structures','a held front line pulls back to structures');
game.ai.board.forEach(l=>{l.unit=null});game.ai.health=4;game.ai.hand=[{uid:'x',cardId:'archer'},{uid:'y',cardId:'archer'}];
assert.equal(aiDrawChoice(game.ai),'units','a thin castle reaches for defenders even holding units');

assert.equal(ruleById('none').id,'none','the blank modifier resolves by id for multiplayer');
assert(!META_RULES.some(r=>r.id==='none'),'the blank modifier stays out of the calendar rotation');
`;

const context={assert,fs,console:{log:()=>{},warn:()=>{},error:console.error},setTimeout:()=>{},clearTimeout:()=>{},localStorage:{getItem:()=>null,setItem:()=>{}},document:{querySelector:()=>null,querySelectorAll:()=>[]},window:{scrollTo:()=>{}},Date,Math};
vm.createContext(context);
vm.runInContext(source+tests,context,{filename:'game.js'});
console.log('Kingdom rules: all tests passed');
