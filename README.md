# Kingdom

A self-contained browser prototype for a weekly deckbuilding card game.

## Play

Open `index.html` in a modern browser, or serve this folder locally:

```powershell
python -m http.server 4173
```

Then visit `http://127.0.0.1:4173`.

## Prototype rules

- Your collection is a fixed roster of 20 unique designs out of the full card pool. The Collection screen shows those 20, or every card in the game with the undiscovered ones greyed out.
- Build an exactly 20-card deck from that collection, with up to four copies of a design — so a deck may run 20 uniques or as few as five.
- Keep several named decks ("banners"), up to twelve. Create, rename, duplicate, and delete them on the Deck screen, and pick which one you are taking into battle from the Hall.
- Each player has four building slots and four corresponding unit slots.
- Plan against an AI rival whose choices remain hidden until commitment.
- Forest Fire is the slow one: two Universities and a pair of Sawmills bought before it will trade at all, and once that back row stands it draws answers faster than a rival can raise threats — four Fire Sappers cycling on whatever steps forward, Lumberjacks paying for them, and a single Wall Warden behind a building as the only clock. Because it draws so hard it will spend a Sapper on a guess rather than hoard it, keeping the last one back for a certainty, and it will throw a Lumberjack in front of a real threat once the keep can no longer afford to take the hit. Punishing late, fragile while it builds.
- Strike Steel is the blunt one: Mining Camps and Miners for metal, then Men-at-Arms and Royal Guards put in the way of anything, with a pair of Armouries to sharpen whichever lane they land in. No tricks — it simply asks whether you can answer a 4-power body every round.
- For testing, choose a Village Uprising, Forest Fire, Strike Steel, Metal Iron Crown, Timber Scholars, or Metal Siege Train opponent and Normal, Hard, or Hardcore decision-making before entering battle. (The General, Wood Architect and Commons Rush banners are retired for now; their cards remain in the pool.)
- Village Uprising is the food swarm: Farms and Mills to feed it, Village Commons and Rabble-Rousers printing Peasants every round, and Peasant Mobs that pay for standing shoulder to shoulder. It plays for a contiguous line rather than a single strong lane.
- The Siege Train mines metal into Men-at-Arms and Battering Rams. Its Rams hunt unguarded buildings rather than fights, its Fire Sappers burn the guard off a walled lane to open it for the next Ram, and Pavise Guards hold its own lanes while the engines do their work.
- Normal commits two actions a round off a noisy, near-random shortlist. Hard commits four and takes the best line it can see. Hardcore drops the action cap entirely — it will fill every building and unit slot it can afford in a single round, and its ranking carries no randomness at all. It plays strictly within the rules and sees no more of your board than the other difficulties do; it simply never wastes a placement.
- Every opponent weighs a replacement against what it is tearing down rather than against the incoming card alone. A standing producer is priced with the output it would keep earning, card-advantage buildings cost extra to pave, straight downgrades and swaps for an identical design are rejected outright, and demolishing the last source of a resource is penalised further when the banner holds no replacement left to draw. Resources the deck can no longer produce are also treated as dearer to spend.
- Timber Scholars opens on free Farms and Logging Camps, upgrades lanes into Sawmills once the food is covered, converts the wood into Archer damage, and banks Universities for card advantage. Its Lumberjack goes down early in a quiet lane, and it will not pave over its last Farm. Its Fire Sappers stay in hand until a worthwhile target appears, or come down pre-emptively once the castle drops to 5 health or less.
- Development builds expose the weekly decree pool: The Grand Fair, The Long Winter, The Lean Court, The Long Muster, and The River Runs High. Choose Calendar Rotation or override it while balancing.
- A decree has to reshape the week for every banner. Guild Charters was retired for failing that test: it only ever discounted the tier-two engines, so a week could land on it and change nothing at all for a collection holding none of them.
- Units clash lane by lane. Higher power survives; ties destroy both, except where a card says otherwise — the Pavise Guard survives its first defeat permanently damaged at 1 power.
- An unblocked unit deals its power as direct damage. Rulers begin at 20 health.
- A banner splits into two piles when a battle begins: structures and units. Cards always return to the pile their type belongs to, and neither pile is shuffled into the other.
- Each ruler is dealt three structures and two units to open, keeps unplayed cards, and then **chooses** where each new draw comes from. A round opens on the draw step and planning stays locked until every draw is spent. Two base draws a round, plus one per University; weekly decrees may change the base number, and Town Hall workers and Commons Peasants arrive on top of the choice rather than as part of it.
- Choosing an exhausted pile reshuffles that pile's own discards first, and falls back to the other pile if there is genuinely nothing left, so a draw is never lost. Because a pile reclaims what it spent, a banner that keeps its other units in hand and only ever commits one design will find that pile silting up with it — thinning by omission, and the basis of a late-game control line. A banner with no structures or no units is legal and simply always draws from the pile it has.
- A hand holds at most ten cards. Draws into a full hand are negated — the card stays on its pile — and generated workers and Peasants are turned away the same; a full hand skips the draw step entirely.
- Occupied unit and building slots may be replaced; the old card is sacrificed to the discard pile on commitment.
- Tier-two resource buildings harvest two per round and are each bought with two of the very resource they make, so any realm can ramp on its own harvest. Each resource now has two secondary-resource routes: the Mill costs 2 food + 1 wood while the Swineherd's Croft costs 2 food + 1 metal; the Sawmill costs 2 wood + 1 food while the Carpenter's Yard costs 2 wood + 1 metal; and the Forge costs 2 metal + 1 food while the Bloomery costs 2 metal + 1 wood. These are printed costs; no decree rewrites them.
- Farmers, Lumberjacks, and Miners are 1-power workers bought with the very resource they make — a Lumberjack costs 1 wood, a Miner 1 metal — and each harvests 1 after each clash, on the same beat as a Farm or a Logging Camp. A Town Hall recruits one at random each round, and that recruit costs nothing to deploy.
- The Town Guard costs 1 food and 1 metal for 2 power and is destroyed in place of one adjacent friendly unit, which survives. It gives no power away — it is a shield that is spent, once, and it covers a lost clash, a Fire Sapper and a Ballista bolt alike. A unit leaving of its own accord is not a kill, so nothing is spent on a Sapper burning out or a Mercenary walking away, and a Pavise Guard takes its own reprieve first so no Guard is wasted on a unit that would have lived.
- Guards are spent **before any blow lands**, so a Guard dies for its neighbour even when its own lane would have fallen the same round, whichever side of it that neighbour stands. Only one unit is sheltered per Guard, and with friends falling either side the westmost is taken; flanked by two Guards, only the western one pays. A Guard offers shelter and never seeks it, so it cannot save itself and two standing side by side shield neither each other nor themselves — they simply trade. **The save is not free:** the Guard leaves its lane empty for that round's clash, so an enemy standing opposite walks through to the keep. A unit currently under a Guard's protection wears a shield dome on the battlefield.
- The Knight carries 2 power and gains +2 while an opposing unit stands in its lane, so it is a duellist rather than a raider: 4 against anything that blocks it, 2 through an open lane.
- The 1-building-material Fire Sapper burns itself out at the clash and destroys any opposing unit in its lane.
- The Archer costs 2 wood and has a flat 2 power, following normal tie rules.
- Village Commons add a temporary Peasant to your hand at the start of each round, whatever the board looks like. Peasant Mobs and Boar Riders each gain 1 power per friendly unit in an adjacent lane, so a contiguous line beats a scattered one.
- The Mason is a 1-power unit costing 1 metal that raises 1 fortification after each clash — a worker whose yield goes onto the keep rather than into the stores, and the only way to build fortification round on round rather than in a single lump.
- **Fortification** is stone raised in front of the keep. It takes damage before health does, and unlike health it is not capped at 20 — a Gatehouse raises 2 when revealed, so a walled ruler can stand at an effective 22 or more. A Palisade still blunts a strike before the fortification is asked to hold it.
- Metal decks gain 3-power Men-at-Arms, fortifying Gatehouses, and 4-power Battering Rams. A Ram only breaks the opposing building when its lane holds no defending unit, damaging itself to 1 power in the process; blocked, it simply fights.
- The 50-design global pool supports six identities: Food swarms, realm-wide Granary support, and Boar Rider finishers; Wood Palisade defence; pure-Metal elites; Food–Wood hunting engines; Metal–Wood Ballista and Pavise fortifications; and Metal–Food ground that is held rather than taken. The Mercenary offers any realm a 3-power unit for 1 gold, then leaves after its second clash. The 5-power Assassin costs 2 gold and returns to hand after every clash it survives. (The Charge mechanic that once occupied Metal–Food is shelved; old saves shed those cards automatically.)
- The Pikeman is the Metal–Food idea in one card: 2 power, and +1 for every round it has held its lane, up to +3. Fed and armed, it is worth little the turn it lands and a 5-power problem three rounds later, so it asks the rival to spend something on a lane they would rather have walked past — while staying inside what a Ballista or a Fire Sapper can answer.
- Ballistas fire before normal combat, while Palisades blunt direct damage through their lane. A lane resolves once a round, so a Palisade is never asked to hold twice and carries no per-round limit.
- The numbers behind those: a Palisade absorbs 2, and a Ballista removes one opposing unit of 4 or more power and collapses.
- The Armoury and the Watchtower are the same idea in two resources: 2 metal or 2 wood for +1 power to whatever friendly unit stands in their lane. Neither asks anything of the unit, so a deck picks whichever resource it already has.
- The Granary costs 5 food and gives +1 power to every friendly unit, whatever it costs and wherever it stands. Multiple Granaries stack.
- Other lane pairings: the Hunting Lodge pays food when its lane connects, Wall Wardens gain 2 power beside any friendly building, Huntsmen salvage wood for winning a clash, and Rabble-Rousers add a Peasant to hand when revealed.
- Gold automatically substitutes for missing food, metal, or wood.
- The free Trading Post is a flexible tier-one resource building. After each clash it randomly supplies 1 food, wood, or metal; Long Winter reduces that yield to zero like the other basic-resource buildings.
- The 1-power Cutpurse costs 1 gold. Whenever an unblocked strike deals damage, it steals 1 random food, wood, or metal that the opposing ruler currently has; it cannot steal gold, and a fully prevented strike steals nothing.
- The 1-power Tax Collector costs 1 gold and harvests 1 gold after every clash it survives, including the clash in which it is deployed.
- The Merchant converts 1 randomly chosen food, wood, or metal into 1 gold after every clash it survives. With no basic resource in its owner’s stores, it converts nothing.
- The Cathedral costs 4 wood and 4 metal. When revealed it raises 6 fortification, then at the start of every round it recruits one random collectible unit as a temporary copy that costs nothing to deploy. The normal hand limit still applies.
- The 2-power Trebuchet costs 3 wood and 1 metal. After every clash it survives, it destroys one randomly selected enemy building anywhere on the active battlefield.
- The weekly decree is chosen deterministically from the calendar week.
- Winning unlocks one weekly pack. Adding its new design requires sacrificing an old one, so the collection stays at 20 and every deck swaps its copies over automatically.

Progress, deck choices, discoveries, and weekly pack state are stored locally in the browser.

## Online multiplayer beta

Kingdom supports private two-player rooms backed by Supabase. Players sign in anonymously, create or join with a six-character code, and submit plans to separate row-level-secured records. Plans are revealed only after both rulers commit. The host gets the first chance to resolve the clash; a database lease lets the guest safely take over if the host disconnects or sleeps, and a match-version guard prevents both browsers from publishing the same clash.

To configure a new Supabase project:

1. Enable **Anonymous Sign-Ins** under Authentication settings.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor. The file is idempotent and can also be rerun to upgrade an existing project with the resolver-lease functions.
3. Set the project URL and publishable browser key at the top of `multiplayer.js`.

The current beta resolves combat in one player's browser, with automatic guest failover if that browser disappears. Account-based matchmaking, fully server-authoritative combat, and long-term match history are intentionally deferred.

Full-resolution card-art studies are saved under `assets/concepts/`. Optimized browser versions live under `assets/cards/`. Every current card design is illustrated, and played cards retain the same art on the battlefield.

Run `node game.test.cjs` to execute the card-pool and combat regression checks.
