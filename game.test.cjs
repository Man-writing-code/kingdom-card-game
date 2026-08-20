const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

let source=fs.readFileSync('game.js','utf8').replace('loadMeta();','');
source=source.slice(0,source.indexOf("$$('[data-screen]')"));

const tests=`
renderGame=()=>{};renderLog=()=>{};
currentRule={id:'none'};

function testSide(){return {health:MAX_KEEP_HEALTH,fortification:0,resources:{food:0,metal:0,material:0,gold:0},structures:[],units:[],discard:[],hand:[],pendingDraws:0,board:Array.from({length:4},()=>({building:null,unit:null}))}}
function pileUp(side,ids){for(const id of ids)side[pileOf(id)].push(id);return side}
function testSlot(cardId,round=0,extra={}){return {cardId,round,handCard:{cardId,bonus:false},...extra}}
function resetGame(round=2){game={round,player:testSide(),ai:testSide(),logs:[],wallUsed:{}};return game}

assert.equal(COLLECTIBLE_IDS.length,51,'global collectible pool includes all six tier-two resource routes');
assert.equal(Object.keys(CARDS).length,52,'collectibles plus Peasant token');
assert.equal(MAX_KEEP_HEALTH,20,'keeps begin with and display twenty health');
assert.equal(createSide([]).health,MAX_KEEP_HEALTH,'new rulers enter battle at full keep health');
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

// The Granary provisions the whole realm: every friendly unit gains 1 power per standing
// Granary, whatever it costs and wherever it is deployed.
assert.deepEqual(CARDS.foodgranary.cost,{food:5},'the Granary costs 5 food');
resetGame();game.player.board[3].building=testSlot('foodgranary');
game.player.board[0].unit=testSlot('farmer');assert.equal(unitPower(game.player,0),2,'a food-only worker is provisioned across lanes');
game.player.board[1].unit=testSlot('knight');assert.equal(unitPower(game.player,1),3,'a mixed-cost unit is provisioned too');
game.player.board[2].unit=testSlot('archer');assert.equal(unitPower(game.player,2),3,'a unit without a food cost is provisioned too');
game.player.board[2].building=testSlot('foodgranary');assert.equal(unitPower(game.player,0),3,'multiple Granaries stack');

// A lane resolves once a round, so the Palisade has no once-per-round limit to track: it simply
// blunts direct damage through its lane, every time it is asked.
resetGame();game.player.board[0].building=testSlot('palisade');
assert.equal(dealDamage(game.player,3,0),1,'a Palisade takes 2 off the strike');
assert.equal(dealDamage(game.player,3,0),1,'and does not tire within a round');
game.round++;assert.equal(dealDamage(game.player,3,0),1,'nor across one');
assert.equal(dealDamage(game.player,1,0),0,'and never turns a strike into healing');
// High Walls is per ruler rather than per lane, so it does still spend for the round.
resetGame();currentRule={id:'walls'};game.player.board[0].building=testSlot('palisade');
assert.equal(dealDamage(game.player,4,0),1,'Palisade stacks with High Walls');
assert.equal(dealDamage(game.player,4,0),2,'the walls having been spent, the Palisade holds alone');
game.round++;assert.equal(dealDamage(game.player,4,0),1,'and the walls return with the round');currentRule={id:'none'};

resetGame();const hunter=testSlot('huntsman');game.player.board[0].unit=hunter;rewardClashWinner(game.player,hunter,0,'Your');assert.equal(game.player.resources.material,1);
game.player.board[0].unit=null;rewardClashWinner(game.player,hunter,0,'Your');assert.equal(game.player.resources.material,1,'defeated Huntsman earns nothing');

resetGame();game.player.board[0].unit=testSlot('soldier',1);game.player.board[0].building=testSlot('huntinglodge');directStrike(game.player,game.ai,0,2,'You','your');assert.equal(game.ai.health,18);assert.equal(game.player.resources.food,1);
resetGame();game.player.board[0].unit=testSlot('soldier',1);game.player.board[0].building=testSlot('huntinglodge');game.ai.board[0].building=testSlot('palisade');directStrike(game.player,game.ai,0,2,'You','your');assert.equal(game.ai.health,MAX_KEEP_HEALTH);assert.equal(game.player.resources.food,0,'Lodge needs positive direct damage');

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

assert.deepEqual(CARDS.trebuchet.cost,{material:3,metal:1},'the Trebuchet costs 3 wood and 1 metal');
assert.equal(CARDS.trebuchet.power,2,'the Trebuchet has 2 power');
resetGame();game.player.board[0].unit=testSlot('trebuchet');game.ai.board[2].building=testSlot('mining');resolveRound();
assert.equal(game.ai.board[2].building,null,'a surviving Trebuchet destroys an enemy building after the clash');
assert(game.player.board[0].unit,'the Trebuchet remains on the battlefield');
resetGame();game.player.board[0].unit=testSlot('trebuchet');game.ai.board[0].unit=testSlot('royalguard');game.ai.board[1].building=testSlot('mining');resolveRound();
assert.equal(game.player.board[0].unit,null,'a defeated Trebuchet falls during combat');
assert(game.ai.board[1].building,'and does not fire after being defeated');

resetGame();game.player.board[0].unit=testSlot('paviseguard');assert.equal(combatDefeat(game.player,0),'pavise');assert.equal(unitPower(game.player,0),1);assert.equal(combatDefeat(game.player,0),'fell');assert.equal(game.player.board[0].unit,null);
resetGame();game.player.board[0].unit=testSlot('paviseguard');game.ai.board[0].unit=testSlot('soldier');resolveRound();assert(game.player.board[0].unit?.damaged);assert.equal(game.ai.board[0].unit,null,'Pavise Guard survives a normal tie');
resetGame();game.player.board[0].unit=testSlot('paviseguard');game.ai.board[0].unit=testSlot('firesapper');resolveRound();assert.equal(game.player.board[0].unit,null,'Fire Sapper bypasses Pavise resilience');

// Card revisions.
assert.deepEqual(CARDS.archer.cost,{material:2},'Archer costs 2 wood');
assert.deepEqual(CARDS.goldmine.cost,{},'the Gold Mine is free to raise');
assert.deepEqual(CARDS.farmer.cost,{food:1},'each worker is bought with what it produces');
assert.deepEqual(CARDS.lumberjack.cost,{material:1});
assert.deepEqual(CARDS.miner.cost,{metal:1});
for(const id of ['farmer','lumberjack','miner'])assert.equal(Object.keys(CARDS[id].produce)[0],Object.keys(CARDS[id].cost)[0],id+' pays in its own coin');
assert.deepEqual(CARDS.tradingpost.cost,{},'the Trading Post is a free tier-one building');
resetGame();game.player.board[0].building=testSlot('tradingpost');harvest(game.player,'Your');
assert.equal(game.player.resources.food+game.player.resources.material+game.player.resources.metal,1,'the Trading Post supplies exactly one basic resource');
assert.equal(game.player.resources.gold,0,'the Trading Post never supplies gold');
currentRule={id:'winter'};resetGame();game.player.board[0].building=testSlot('tradingpost');harvest(game.player,'Your');
assert.equal(game.player.resources.food+game.player.resources.material+game.player.resources.metal,0,'Long Winter reduces its basic-resource yield to zero');
currentRule={id:'none'};
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
assert.deepEqual(CARDS.foreignmercenary.cost,{gold:1},'the Mercenary costs 1 gold');
assert.equal(CARDS.foreignmercenary.power,3,'the Mercenary has 3 power');
assert.equal(CARDS.foreignmercenary.name,'Mercenary','the card title does not label the mercenary as foreign');
assert.equal(CARDS.foreignmercenary.special,'mercenary');
resetGame();game.player.board[0].unit=testSlot('foreignmercenary',game.round);
resolveRound();assert(game.player.board[0].unit,'the Mercenary remains after its first clash');
assert.equal(game.player.board[0].unit.clashes,1);
game.round++;resolveRound();assert.equal(game.player.board[0].unit,null,'the Mercenary leaves after its second clash');
assert.deepEqual(game.player.discard,['foreignmercenary'],'the completed contract returns the card to its pile normally');

assert.deepEqual(CARDS.cutpurse.cost,{gold:1},'the Cutpurse costs 1 gold');
assert.equal(CARDS.cutpurse.power,1,'the Cutpurse has 1 power');
assert.match(CARDS.cutpurse.text,/food, wood, or metal/,'the card face states that only basic resources can be stolen');
resetGame();game.player.board[0].unit=testSlot('cutpurse');game.ai.resources.metal=1;
directStrike(game.player,game.ai,0,1,'You','your');
assert.equal(game.player.resources.metal,1,'a successful direct hit transfers one stocked resource');
assert.equal(game.ai.resources.metal,0);
resetGame();game.player.board[0].unit=testSlot('cutpurse');game.ai.resources.food=1;game.ai.board[0].building=testSlot('palisade');
directStrike(game.player,game.ai,0,1,'You','your');
assert.equal(game.player.resources.food,0,'a fully prevented hit steals nothing');
assert.equal(game.ai.resources.food,1);
resetGame();game.player.board[0].unit=testSlot('cutpurse');game.ai.resources.gold=1;
directStrike(game.player,game.ai,0,1,'You','your');
assert.equal(game.player.resources.gold,0,'the Cutpurse cannot steal gold');
assert.equal(game.ai.resources.gold,1);

assert.deepEqual(CARDS.assassin.cost,{gold:2},'the Assassin costs 2 gold');
assert.equal(CARDS.assassin.power,5,'the Assassin has 5 power');
resetGame();const assassinCopy={uid:'assassin-copy',cardId:'assassin',bonus:false};
game.player.board[0].unit=testSlot('assassin',game.round,{handCard:assassinCopy});resolveRound();
assert.equal(game.player.board[0].unit,null,'a surviving Assassin leaves the board after the clash');
assert.equal(game.player.hand[0],assassinCopy,'the same Assassin copy returns to hand');
assert.deepEqual(game.player.discard,[],'returning is not a defeat');
resetGame();game.player.board[0].unit=testSlot('assassin');game.ai.board[0].unit=testSlot('champion');resolveRound();
assert.equal(game.player.hand.length,0,'an Assassin destroyed in the clash does not return');
assert.deepEqual(game.player.discard,['assassin']);

assert.deepEqual(CARDS.taxcollector.cost,{gold:1},'the Tax Collector costs 1 gold');
assert.equal(CARDS.taxcollector.power,1,'the Tax Collector has 1 power');
resetGame(3);game.player.board[0].unit=testSlot('taxcollector',3);harvest(game.player,'Your');
assert.equal(game.player.resources.gold,1,'the Tax Collector harvests on its deployment clash');
harvest(game.player,'Your');assert.equal(game.player.resources.gold,2,'and again after every clash it survives');
currentRule={id:'tradefair'};resetGame();game.player.board[0].unit=testSlot('taxcollector');harvest(game.player,'Your');
assert.equal(game.player.resources.gold,1,'the Grand Fair does not increase the Tax Collector beyond its printed yield');
currentRule={id:'none'};

resetGame(3);game.player.board[0].unit=testSlot('merchant',3);game.player.resources.material=1;harvest(game.player,'Your');
assert.equal(game.player.resources.material,0,'the Merchant spends an available basic resource');
assert.equal(game.player.resources.gold,1,'and converts it into gold on its deployment clash');
resetGame();game.player.board[0].unit=testSlot('merchant');game.player.resources.gold=2;harvest(game.player,'Your');
assert.equal(game.player.resources.gold,2,'the Merchant does nothing when no basic resource is available');
resetGame();game.player.board[0].unit=testSlot('merchant');directStrike(game.player,game.ai,0,1,'You','your');
assert.equal(game.player.resources.gold,0,'the Merchant no longer creates gold from an unblocked hit');

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
// at the keep maximum, so a walled ruler stands above their starting integrity.
resetGame();game.player.fortification=3;
assert.equal(dealDamage(game.player,2,0),2,'the strike still lands at full weight');
assert.equal(game.player.health,MAX_KEEP_HEALTH,'but the keep is untouched');
assert.equal(game.player.fortification,1,'the stone wore instead');
dealDamage(game.player,3,0);
assert.equal(game.player.fortification,0,'stone is spent before flesh');
assert.equal(game.player.health,18,'and the remainder carries through to the keep');

// The Mason lays stone every round it holds its lane — a worker whose yield goes on the keep.
assert.deepEqual(CARDS.mason.cost,{metal:1});assert.equal(CARDS.mason.power,1);
assert(COLLECTIBLE_IDS.includes('mason'),'the Mason joins the pack pool');
resetGame(3);game.player.board[0].unit=testSlot('mason',3);
harvest(game.player,'Your');
assert.equal(game.player.fortification,1,'a Mason lays stone the round it arrives');
assert.deepEqual(game.player.resources,{food:0,metal:0,material:0,gold:0},'and nothing reaches the stores');
harvest(game.player,'Your');assert.equal(game.player.fortification,2,'and again each round it holds');
// Stone laid is stone that takes the blow, so it stacks past the keep's own maximum.
game.player.fortification=1;assert.equal(dealDamage(game.player,3,0),3);
assert.equal(game.player.fortification,0);assert.equal(game.player.health,18,'the stone spends first');

// The Town Guard is a shield that is spent: when a neighbour would be destroyed, it dies in
// their place and they stand. It gives no power, so a sheltered unit is unchanged until it needs it.
assert.deepEqual(CARDS.townguard.cost,{food:1,metal:1});assert.equal(CARDS.townguard.power,2);
resetGame();game.player.board[0].unit=testSlot('miner',1);game.player.board[1].unit=testSlot('townguard',1);
assert.equal(unitPower(game.player,0),1,'a sheltered unit gets no buff from the Guard');
assert.equal(combatDefeat(game.player,0,'Your'),'guarded','the Guard takes the blow');
assert(game.player.board[0].unit,'and the unit it sheltered stands');
assert.equal(game.player.board[1].unit,null,'while the Guard is spent');
assert.equal(combatDefeat(game.player,0,'Your'),'fell','with the Guard gone the next blow lands');

// It shelters either side, but only the lanes next to it.
resetGame();game.player.board[1].unit=testSlot('townguard',1);
game.player.board[0].unit=testSlot('farmer',1);game.player.board[2].unit=testSlot('farmer',1);game.player.board[3].unit=testSlot('farmer',1);
assert.equal(combatDefeat(game.player,3,'Your'),'fell','two lanes away is beyond its reach');
assert.equal(combatDefeat(game.player,2,'Your'),'guarded','but either neighbour is not');

// A Pavise saves itself first, so a Guard is not spent on a unit that would have lived.
resetGame();game.player.board[0].unit=testSlot('paviseguard',1);game.player.board[1].unit=testSlot('townguard',1);
assert.equal(combatDefeat(game.player,0,'Your'),'pavise','the Pavise endures under its own rule');
assert(game.player.board[1].unit,'and the Guard is still standing');
assert.equal(combatDefeat(game.player,0,'Your'),'guarded','only spent once the Pavise is out of lives');

// It covers a Sapper's burst and a Ballista's bolt, since those are the enemy killing too.
resetGame();game.player.board[0].unit=testSlot('soldier',1);game.player.board[1].unit=testSlot('townguard',1);
game.ai.board[0].unit=testSlot('firesapper',1);resolveRound();
assert(game.player.board[0].unit,'the Guard eats the Fire Sapper for its neighbour');
assert.equal(game.player.board[1].unit,null,'and is spent doing it');
resetGame();game.player.board[0].unit=testSlot('royalguard',1);game.player.board[1].unit=testSlot('townguard',1);
game.ai.board[0].building=testSlot('ballista');
resolveBallistas(game.ai,game.player,[0,0,0,0],[4,0,0,0]);
assert(game.player.board[0].unit,'and turns aside a Ballista bolt');
assert.equal(game.player.board[1].unit,null);

// A unit leaving of its own accord is not a kill, so no Guard is spent on it.
resetGame();game.player.board[0].unit=testSlot('firesapper',1);game.player.board[1].unit=testSlot('townguard',1);
game.ai.board[0].unit=testSlot('soldier',1);resolveRound();
assert.equal(game.player.board[0].unit,null,'a Sapper still burns itself out');
assert(game.player.board[1].unit,'and the Guard is not spent on its own side effect');

// A Guard is spent on the first neighbour that needs it. Lanes resolve west to east, so with
// friends on both sides only the westmost is saved and the other falls.
resetGame();
game.player.board[0].unit=testSlot('farmer',1);game.player.board[1].unit=testSlot('townguard',1);game.player.board[2].unit=testSlot('farmer',1);
game.ai.board[0].unit=testSlot('royalguard',1);game.ai.board[2].unit=testSlot('royalguard',1);
resolveRound();
assert(game.player.board[0].unit,'the western neighbour is saved');
assert.equal(game.player.board[1].unit,null,'the Guard is spent doing it');
assert.equal(game.player.board[2].unit,null,'and the eastern one falls unaided');

// Spending the Guard empties its lane before that lane resolves, so an enemy standing there
// walks through to the keep. The save is not free.
resetGame();
game.player.board[0].unit=testSlot('farmer',1);game.player.board[1].unit=testSlot('townguard',1);
game.ai.board[0].unit=testSlot('royalguard',1);game.ai.board[1].unit=testSlot('royalguard',1);
resolveRound();
assert(game.player.board[0].unit,'the neighbour lives');
assert.equal(game.player.health,MAX_KEEP_HEALTH-4,'but the lane it left open strikes the keep');

// It cannot save itself: a Guard losing its own clash falls like anything else.
resetGame();game.player.board[1].unit=testSlot('townguard',1);game.ai.board[1].unit=testSlot('royalguard',1);
resolveRound();
assert.equal(game.player.board[1].unit,null,'a lone Guard dies to its own clash');

// Two Guards side by side do shelter each other, since a Guard is a friendly unit like any other.
resetGame();
game.player.board[1].unit=testSlot('townguard',1);game.player.board[2].unit=testSlot('townguard',1);
game.ai.board[1].unit=testSlot('royalguard',1);game.ai.board[2].unit=testSlot('royalguard',1);
resolveRound();
assert(game.player.board[1].unit,'the western Guard is saved by the eastern one');
assert.equal(game.player.board[2].unit,null,'which is spent in its place');

// Flanked by two Guards, only one is spent — the west — and the other still stands.
resetGame();
game.player.board[0].unit=testSlot('townguard',1);game.player.board[1].unit=testSlot('farmer',1);game.player.board[2].unit=testSlot('townguard',1);
game.ai.board[1].unit=testSlot('royalguard',1);
resolveRound();
assert(game.player.board[1].unit,'the sheltered unit lives');
assert.equal(game.player.board[0].unit,null,'the western Guard paid for it');
assert(game.player.board[2].unit,'and the eastern Guard is untouched');

// A closed lane breaks the line, as it does for every other adjacency in the game.
resetGame();game.blockedLane=1;game.player.board[1].unit=testSlot('townguard',1);game.player.board[2].unit=testSlot('miner',1);
assert.equal(combatDefeat(game.player,2,'Your'),'fell','a Guard in a flooded lane shelters nobody');

assert.equal(CARDS.gatehouse.name,'Gatehouse','the Gatehouse keeps a name a card face can hold');
assert.deepEqual(CARDS.gatehouse.cost,{material:1,metal:2},'and is priced to be built, not saved for');
// A Gatehouse raises fortification rather than repairing, so it is worth building at full health.
resetGame(1);game.player.board[0].building=testSlot('gatehouse',1);resolveOnBuild(game.player,'Your');
assert.equal(game.player.health,MAX_KEEP_HEALTH,'a full keep is not healed');
assert.equal(game.player.fortification,2,'it is walled instead');
assert.equal(game.player.health+game.player.fortification,22,'which carries a ruler above twenty');
resolveOnBuild(game.player,'Your');assert.equal(game.player.fortification,2,'and it raises its wall once');
resetGame(1);game.player.health=4;game.player.board[0].building=testSlot('gatehouse',1);resolveOnBuild(game.player,'Your');
assert.equal(game.player.health,4,'a wounded keep is not repaired either');assert.equal(game.player.fortification,2);

// A Palisade still blunts the strike before the stone is asked to hold it.
resetGame();game.player.fortification=5;game.player.board[0].building=testSlot('palisade');
assert.equal(dealDamage(game.player,3,0),1,'the Palisade takes 2 off first');
assert.equal(game.player.fortification,4,'so only 1 reaches the fortification');
assert.equal(game.player.health,MAX_KEEP_HEALTH);

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

assert.deepEqual(CARDS.cathedral.cost,{material:4,metal:4},'the Cathedral costs 4 wood and 4 metal');
resetGame(1);game.player.board[0].building=testSlot('cathedral',1);resolveOnBuild(game.player,'Your');
assert.equal(game.player.fortification,6,'the Cathedral raises 6 fortification when revealed');
resolveOnBuild(game.player,'Your');assert.equal(game.player.fortification,6,'the Cathedral fortifies only once');
drawTurnBonuses(game.player);assert.equal(game.player.hand.length,1,'a Cathedral recruits one unit each round');
assert.equal(CARDS[game.player.hand[0].cardId].type,'unit');
assert(!CARDS[game.player.hand[0].cardId].token,'the Cathedral recruits collectible units rather than tokens');
assert(game.player.hand[0].free,'the Cathedral recruit is free to deploy');
assert.deepEqual(handCost(game.player.hand[0]),{});
game.player.hand=Array.from({length:HAND_LIMIT},()=>makeHandCard('soldier'));drawTurnBonuses(game.player);
assert.equal(game.player.hand.length,HAND_LIMIT,'a full hand turns away Cathedral recruits');

// Every tier-two engine is bought with 2 of what it harvests, so an archetype can ramp itself.
currentRule={id:'none'};
for(const [id,resource] of [['granary','food'],['swinecroft','food'],['lumbermill','material'],['carpentersyard','material'],['foundry','metal'],['bloomery','metal']]){
  assert.equal(CARDS[id].cost[resource],2,id+' is paid for in what it makes');
  assert.equal(Object.values(CARDS[id].produce)[0],2,id+' harvests two of it');
  const own={food:0,metal:0,material:0,gold:0};own[resource]=2;
  assert(!canAfford({resources:own},effectiveCost(id)),id+' still owes its secondary cost');
  const secondary=Object.keys(CARDS[id].cost).find(r=>r!==resource);own[secondary]=(own[secondary]||0)+1;
  assert(canAfford({resources:own},effectiveCost(id)),'a realm on its own harvest can raise '+id);
}
assert.deepEqual(CARDS.bloomery.cost,{metal:2,material:1},'the Bloomery opens the metal-to-wood route');
assert.deepEqual(CARDS.carpentersyard.cost,{material:2,metal:1},"the Carpenter's Yard opens the wood-to-metal route");
assert.deepEqual(CARDS.swinecroft.cost,{food:2,metal:1},"the Swineherd's Croft opens the food-to-metal route");
assert.equal(TIER_TWO.length,6,'both secondary-resource routes are represented where intended');
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
assert.deepEqual(AI_DECKS.strikesteel.reduce((m,id)=>(m[id]=(m[id]||0)+1,m),{}),
  {royalguard:4,manatarms:4,armoury:2,mining:4,miner:4,foundry:1,goldmine:1},'Strike Steel runs the requested list');
// It is a body deck: an open lane is the plan, and a big body is worth more there than a small one.
resetGame();game.aiProfile='strikesteel';game.ai.resources={food:9,metal:9,material:9,gold:9};
const ssGuard={uid:'sg',cardId:'royalguard',bonus:false},ssArmoury={uid:'sa',cardId:'armoury',bonus:false};
assert(aiActionScore(ssGuard,0,'hardcore')>0,'a Royal Guard wants the open lane');
const bare=aiActionScore(ssArmoury,0,'hardcore');
game.ai.board[0].unit=testSlot('manatarms',1);
assert(aiActionScore(ssArmoury,0,'hardcore')>bare,'an Armoury waits for a body to arm');

assert.deepEqual(AI_DECKS.forestfire.reduce((m,id)=>(m[id]=(m[id]||0)+1,m),{}),
  {firesapper:4,logging:4,lumbermill:3,farm:2,university:3,lumberjack:3,wallwarden:1},'Forest Fire runs the requested list');
// Its whole plan rests on a back row, so the scoring must want that before it wants a fight.
resetGame();game.aiProfile='forestfire';game.ai.resources={food:9,metal:9,material:9,gold:9};
const ffHall={uid:'fh',cardId:'university',bonus:false},ffWarden={uid:'fw',cardId:'wallwarden',bonus:false};
const firstHall=aiActionScore(ffHall,0,'hardcore');
game.ai.board[0].building=testSlot('university');game.ai.board[1].building=testSlot('university');
assert(firstHall>aiActionScore(ffHall,2,'hardcore'),'a third University is worth far less than the first two');
// The Warden is the only clock, and only behind a building.
assert(aiActionScore(ffWarden,0,'hardcore')>aiActionScore(ffWarden,3,'hardcore'),'the Wall Warden wants a built lane');

// It cycles hard enough to spend a Sapper on a guess — while it still has Sappers to spare.
resetGame();game.aiProfile='forestfire';game.ai.resources={food:9,metal:9,material:9,gold:9};
const ffSapper={uid:'fs',cardId:'firesapper',bonus:false};
pileUp(game.ai,['firesapper','firesapper']);
assert(aiActionScore(ffSapper,0,'hardcore')>0,'a spare Sapper is worth playing into an empty lane');
game.ai.units=[];
assert(aiActionScore(ffSapper,0,'hardcore')<0,'the last Sapper is held for a real target');

// A cheap body is spent to peel a real threat away from the keep.
resetGame();game.aiProfile='forestfire';game.ai.resources={food:9,metal:9,material:9,gold:9};
const ffJack={uid:'fj',cardId:'lumberjack',bonus:false};
game.player.board[0].unit=testSlot('royalguard',1);
assert(aiActionScore(ffJack,0,'hardcore')>0,'a Lumberjack will stand in front of a 4-power threat');
assert(aiActionScore(ffJack,1,'hardcore')>aiActionScore(ffJack,0,'hardcore'),'though a whole keep would rather take the open lane and the harvest');
game.ai.health=5;
assert(aiActionScore(ffJack,0,'hardcore')>aiActionScore(ffJack,1,'hardcore'),'but a pressed one spends the body to peel the strike');
game.ai.health=5;game.ai.fortification=6;
assert(aiActionScore(ffJack,1,'hardcore')>aiActionScore(ffJack,0,'hardcore'),'fortification counts as keep enough to go back to farming');

// A spent card is queued, not gone: the pile reclaims its own discards, so the AI must count
// them when asking whether it will see another.
resetGame();const recycler2=testSide();recycler2.discard=['firesapper','logging'];
assert.equal(aiPending(recycler2).filter(id=>id==='firesapper').length,1,'a discarded Sapper is still to come');
assert.equal(aiScarcity(recycler2,'material'),1.6,'and a discarded Logging Camp still counts as drawable');

// Endgame: with the back row up, it keeps non-Sappers in hand so the units pile silts up with
// Sappers — but it still spends one to block when something is standing opposite.
resetGame(7);game.aiProfile='forestfire';game.ai.resources={food:9,metal:9,material:9,gold:9};
game.ai.board[0].building=testSlot('university');game.ai.board[1].building=testSlot('university');
game.ai.board[2].building=testSlot('lumbermill');game.ai.board[3].building=testSlot('lumbermill');
const lateJack={uid:'lj',cardId:'lumberjack',bonus:false};
const idle=aiActionScore(lateJack,0,'hardcore');
game.player.board[0].unit=testSlot('royalguard',1);game.ai.health=5;
assert(aiActionScore(lateJack,0,'hardcore')>idle,'a body still goes in the way when there is something to peel');

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
  // Hardcore is decided by the evaluation, not by chance — the same cards come out every
  // time — but which lane a tie lands in is not part of that and must not be predictable.
  const cardsOf=side=>side.board.flatMap(l=>[l.building?.cardId,l.unit?.cardId]).filter(Boolean).sort().join(',');
  assert.equal(cardsOf(hardcore),cardsOf(stockedAI(profile,'hardcore')),profile+' commits the same cards on Hardcore');
  assert.equal(placements(stockedAI(profile,'hard')),4,profile+' on Hard still stops at four');
}
assert.equal(aiPlaysBest('hardcore'),true);assert.equal(aiPlaysBest('hard'),true);assert.equal(aiPlaysBest('normal'),false);

// An empty board gives every lane the same score. The westmost must not win every time, or the
// opening is readable before it is played.
const openingLanes=new Set();
for(let i=0;i<60;i++){
  resetGame(1);game.aiProfile='strikesteel';game.aiDifficulty='hardcore';
  game.ai.resources={food:9,metal:9,material:9,gold:9};
  game.ai.hand=[{uid:'o1',cardId:'manatarms',bonus:false}];
  aiPlan();
  const lane=game.ai.board.findIndex(l=>l.unit);
  if(lane>=0)openingLanes.add(lane);
}
assert(openingLanes.size>1,'the opening body does not always take the same lane');
assert(openingLanes.size>=3,'and spreads across the board rather than favouring one end');

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

// A guest taking over an expired resolver lease must see their own side as the player, while
// the state written back to Supabase remains in canonical host/guest order.
resetGame();const hostSide=testSide(),guestSide=testSide();hostSide.health=9;guestSide.health=7;
resolveOnlinePlans(hostSide,guestSide,'guest',4);
assert.equal(game.player.health,7);assert.equal(game.ai.health,9);assert.equal(game.round,4);assert.equal(game.onlineSeat,'guest');
const canonical=onlineCanonicalState();assert.equal(canonical.player.health,9);assert.equal(canonical.ai.health,7);assert.equal(canonical.onlineSeat,undefined);
`;

const context={assert,fs,console:{log:()=>{},warn:()=>{},error:console.error},setTimeout:()=>{},clearTimeout:()=>{},localStorage:{getItem:()=>null,setItem:()=>{}},document:{querySelector:()=>null,querySelectorAll:()=>[]},window:{scrollTo:()=>{}},Date,Math};
vm.createContext(context);
vm.runInContext(source+tests,context,{filename:'game.js'});
console.log('Kingdom rules: all tests passed');
