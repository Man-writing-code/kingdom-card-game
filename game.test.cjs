const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

let source=fs.readFileSync('game.js','utf8').replace('loadMeta();','');
source=source.slice(0,source.indexOf("$$('[data-screen]')"));

const tests=`
renderGame=()=>{};renderLog=()=>{};
currentRule={id:'guilds'};

function testSide(){return {health:10,resources:{food:0,metal:0,material:0,gold:0},deck:[],discard:[],hand:[],board:Array.from({length:4},()=>({building:null,unit:null}))}}
function testSlot(cardId,round=0,extra={}){return {cardId,round,handCard:{cardId,bonus:false},...extra}}
function resetGame(round=2){game={round,player:testSide(),ai:testSide(),logs:[],wallUsed:{}};return game}

assert.equal(COLLECTIBLE_IDS.length,40,'global collectible pool');
assert.equal(Object.keys(CARDS).length,41,'collectibles plus Peasant token');
for(const id of Object.keys(CARDS)){assert(CARD_ART[id],id+' has an art mapping');assert(fs.existsSync(CARD_ART[id]),CARD_ART[id]+' exists')}
for(const id of ['rabblerouser','boarriders','palisade','wallwarden','royalguard','armoury','huntsman','huntinglodge','ballista','paviseguard','lancer','bannercaptain'])assert(COLLECTIBLE_IDS.includes(id),id+' joins packs');

resetGame(1);game.player.board[0].unit=testSlot('rabblerouser',1);resolveOnBuild(game.player,'Your');
assert.equal(game.player.hand.length,1);assert.equal(game.player.hand[0].cardId,'peasant');assert.equal(game.player.hand[0].bonus,true);
resolveOnBuild(game.player,'Your');assert.equal(game.player.hand.length,1,'Rabble-Rouser resolves once');

resetGame();game.player.board[0].unit=testSlot('peasant',1,{handCard:{cardId:'peasant',bonus:true}});discardUnit(game.player,0);assert.deepEqual(game.player.discard,[],'generated Peasant vanishes');

resetGame();game.player.board[0].unit=testSlot('wallwarden');assert.equal(unitPower(game.player,0),1);game.player.board[0].building=testSlot('logging');assert.equal(unitPower(game.player,0),3);
game.player.board[0].unit=testSlot('manatarms');game.player.board[0].building=testSlot('armoury');assert.equal(unitPower(game.player,0),5);
game.player.board[0].unit=testSlot('knight');assert.equal(unitPower(game.player,0),3,'Armoury excludes mixed-cost units');

resetGame();game.player.board[0].building=testSlot('palisade');assert.equal(dealDamage(game.player,3,0),1);assert.equal(dealDamage(game.player,3,0),3);game.round++;assert.equal(dealDamage(game.player,3,0),1,'Palisade refreshes next round');
resetGame();currentRule={id:'walls'};game.player.board[0].building=testSlot('palisade');assert.equal(dealDamage(game.player,4,0),1,'Palisade stacks with High Walls');assert.equal(dealDamage(game.player,4,0),4);game.round++;assert.equal(dealDamage(game.player,4,0),1);currentRule={id:'guilds'};

resetGame();const hunter=testSlot('huntsman');game.player.board[0].unit=hunter;rewardClashWinner(game.player,hunter,0,'Your');assert.equal(game.player.resources.material,1);
game.player.board[0].unit=null;rewardClashWinner(game.player,hunter,0,'Your');assert.equal(game.player.resources.material,1,'defeated Huntsman earns nothing');

resetGame();game.player.board[0].unit=testSlot('soldier',1);game.player.board[0].building=testSlot('huntinglodge');directStrike(game.player,game.ai,0,2,'You','your',0);assert.equal(game.ai.health,8);assert.equal(game.player.resources.food,1);
resetGame();game.player.board[0].unit=testSlot('soldier',1);game.player.board[0].building=testSlot('huntinglodge');game.ai.board[0].building=testSlot('palisade');directStrike(game.player,game.ai,0,2,'You','your',0);assert.equal(game.ai.health,10);assert.equal(game.player.resources.food,0,'Lodge needs positive direct damage');

resetGame();game.player.board[0].unit=testSlot('lancer',2);assert.equal(chargeBonus(game.player,0),2);game.player.board[1].unit=testSlot('bannercaptain',1);assert.equal(chargeBonus(game.player,0),3);game.player.board[2].unit=testSlot('bannercaptain',1);assert.equal(chargeBonus(game.player,0),3,'Captain bonuses do not stack');game.player.board[0].unit.round=1;assert.equal(chargeBonus(game.player,0),0,'Charge is deployment-round only');

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

const original=Array.from({length:20},(_,i)=>COLLECTIBLE_IDS[i]);assert.deepEqual(normaliseCollection(original),original,'existing 20-design collections remain unchanged');

loadMeta();assert.equal(meta.unlocked.length,COLLECTION_SIZE,'a first run opens with a full collection');
assert.equal(meta.decks.length,1);assert.equal(activeDeck().cards.length,DECK_SIZE,'a first run is dealt a playable opening banner');
assert(deckIsPlayable(activeDeck()),'the opening banner only uses owned designs');

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
  {logging:4,lumbermill:4,farm:2,university:2,archer:4,firesapper:4},'Timber Scholars runs the requested list');
assert(AI_DECKS.timber.some(id=>CARDS[id].produce?.food),'the banner can pay its own Sawmill food');

resetGame();game.aiProfile='timber';game.ai.resources={food:2,metal:0,material:4,gold:0};
const timberFarm={uid:'tf',cardId:'farm',bonus:false},timberMill={uid:'tm',cardId:'lumbermill',bonus:false};
const firstFarm=aiActionScore(timberFarm,0,'hard');game.ai.board[1].building=testSlot('farm');
assert(firstFarm>aiActionScore(timberFarm,0,'hard'),'the first Farm outranks a second');
assert(aiActionScore(timberMill,1,'hard')<aiActionScore(timberMill,0,'hard'),'a Sawmill avoids paving the last Farm');

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

assert.equal(ruleById('none').id,'none','the blank modifier resolves by id for multiplayer');
assert(!META_RULES.some(r=>r.id==='none'),'the blank modifier stays out of the calendar rotation');
`;

const context={assert,fs,console:{log:()=>{},warn:()=>{},error:console.error},setTimeout:()=>{},clearTimeout:()=>{},localStorage:{getItem:()=>null,setItem:()=>{}},document:{querySelector:()=>null,querySelectorAll:()=>[]},window:{scrollTo:()=>{}},Date,Math};
vm.createContext(context);
vm.runInContext(source+tests,context,{filename:'game.js'});
console.log('Kingdom rules: all tests passed');
