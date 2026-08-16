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
- For testing, choose a Village Uprising, Forest Fire, Metal Iron Crown, Timber Scholars, or Metal Siege Train opponent and Normal, Hard, or Hardcore decision-making before entering battle. (The General, Wood Architect and Commons Rush banners are retired for now; their cards remain in the pool.)
- Village Uprising is the food swarm: Farms and Mills to feed it, Village Commons and Rabble-Rousers printing Peasants every round, and Peasant Mobs that pay for standing shoulder to shoulder. It plays for a contiguous line rather than a single strong lane.
- The Siege Train mines metal into Men-at-Arms and Battering Rams. Its Rams hunt unguarded buildings rather than fights, its Fire Sappers burn the guard off a walled lane to open it for the next Ram, and Pavise Guards hold its own lanes while the engines do their work.
- Normal commits two actions a round off a noisy, near-random shortlist. Hard commits four and takes the best line it can see. Hardcore drops the action cap entirely — it will fill every building and unit slot it can afford in a single round, and its ranking carries no randomness at all. It plays strictly within the rules and sees no more of your board than the other difficulties do; it simply never wastes a placement.
- Every opponent weighs a replacement against what it is tearing down rather than against the incoming card alone. A standing producer is priced with the output it would keep earning, card-advantage buildings cost extra to pave, straight downgrades and swaps for an identical design are rejected outright, and demolishing the last source of a resource is penalised further when the banner holds no replacement left to draw. Resources the deck can no longer produce are also treated as dearer to spend.
- Timber Scholars opens on free Farms and Logging Camps, upgrades lanes into Sawmills once the food is covered, converts the wood into Archer damage, and banks Universities for card advantage. Its Lumberjack goes down early in a quiet lane, and it will not pave over its last Farm. Its Fire Sappers stay in hand until a worthwhile target appears, or come down pre-emptively once the castle drops to 5 health or less.
- Development builds expose the weekly decree pool: The Grand Fair, The Long Winter, The Lean Court, The Long Muster, and The River Runs High. Choose Calendar Rotation or override it while balancing.
- A decree has to reshape the week for every banner. Guild Charters was retired for failing that test: it only ever discounted the three tier-two engines, so a week could land on it and change nothing at all for a collection holding none of them.
- Units clash lane by lane. Higher power survives; ties destroy both, except where a card says otherwise — the Pavise Guard survives its first defeat permanently damaged at 1 power.
- An unblocked unit deals its power as direct damage. Rulers begin at 10 health.
- A banner splits into two piles when a battle begins: structures and units. Cards always return to the pile their type belongs to, and neither pile is shuffled into the other.
- Each ruler is dealt three structures and two units to open, keeps unplayed cards, and then **chooses** where each new draw comes from. A round opens on the draw step and planning stays locked until every draw is spent. Two base draws a round, plus one per University; weekly decrees may change the base number, and Town Hall workers and Commons Peasants arrive on top of the choice rather than as part of it.
- Choosing an exhausted pile reshuffles that pile's own discards first, and falls back to the other pile if there is genuinely nothing left, so a draw is never lost. Because a pile reclaims what it spent, a banner that keeps its other units in hand and only ever commits one design will find that pile silting up with it — thinning by omission, and the basis of a late-game control line. A banner with no structures or no units is legal and simply always draws from the pile it has.
- A hand holds at most ten cards. Draws into a full hand are negated — the card stays on its pile — and generated workers and Peasants are turned away the same; a full hand skips the draw step entirely.
- Occupied unit and building slots may be replaced; the old card is sacrificed to the discard pile on commitment.
- Tier-two resource buildings harvest two per round and are each bought with two of the very resource they make, so any realm can ramp on its own harvest: the Mill costs 2 food + 1 wood, the Sawmill 2 wood + 1 food, and the Forge 2 metal + 1 food. With a free Farm, Logging Camp or Mining Camp down on round one, its matching engine is affordable on round two. These are printed costs; no decree rewrites them.
- Farmers, Lumberjacks, and Miners are 1-power workers bought with the very resource they make — a Lumberjack costs 1 wood, a Miner 1 metal — and each harvests 1 after each clash, on the same beat as a Farm or a Logging Camp. A Town Hall recruits one at random each round, and that recruit costs nothing to deploy.
- The Knight carries 2 power and gains +2 while an opposing unit stands in its lane, so it is a duellist rather than a raider: 4 against anything that blocks it, 2 through an open lane.
- The 1-building-material Fire Sapper burns itself out at the clash and destroys any opposing unit in its lane.
- The Archer costs 2 wood and has a flat 2 power, following normal tie rules.
- Village Commons add a temporary Peasant to your hand at the start of each round, whatever the board looks like. Peasant Mobs and Boar Riders each gain 1 power per friendly unit in an adjacent lane, so a contiguous line beats a scattered one.
- **Fortification** is stone raised in front of the keep. It takes damage before health does, and unlike health it is not capped at 10 — a Reinforced Gatehouse raises 2 when revealed, so a walled ruler can stand at an effective 12 or more. A Palisade still blunts a strike before the fortification is asked to hold it.
- Metal decks gain 3-power Men-at-Arms, fortifying Reinforced Gatehouses, and 4-power Battering Rams. A Ram only breaks the opposing building when its lane holds no defending unit, damaging itself to 1 power in the process; blocked, it simply fights.
- The 38-design global pool supports six identities: Food swarms and Boar Rider finishers; Wood Palisade defence; pure-Metal elites; Food–Wood hunting engines; Metal–Wood Ballista and Pavise fortifications; and Metal–Food ground that is held rather than taken. (The Charge mechanic that once occupied Metal–Food is shelved; old saves shed those cards automatically.)
- The Pikeman is the Metal–Food idea in one card: 2 power, and +1 for every round it has held its lane, up to +3. Fed and armed, it is worth little the turn it lands and a 5-power problem three rounds later, so it asks the rival to spend something on a lane they would rather have walked past — while staying inside what a Ballista or a Fire Sapper can answer.
- Ballistas fire before normal combat, while Palisades blunt the first direct strike through their lane each round.
- The numbers behind those: a Palisade absorbs 2, and a Ballista removes one opposing unit of 4 or more power and collapses.
- The Armoury and the Watchtower are the same idea in two resources: 2 metal or 2 wood for +1 power to whatever friendly unit stands in their lane. Neither asks anything of the unit, so a deck picks whichever resource it already has.
- Other lane pairings: the Hunting Lodge pays food when its lane connects, Wall Wardens gain 2 power beside any friendly building, Huntsmen salvage wood for winning a clash, and Rabble-Rousers add a Peasant to hand when revealed.
- Gold automatically substitutes for missing food, metal, or wood.
- The weekly decree is chosen deterministically from the calendar week.
- Winning unlocks one weekly pack. Adding its new design requires sacrificing an old one, so the collection stays at 20 and every deck swaps its copies over automatically.

Progress, deck choices, discoveries, and weekly pack state are stored locally in the browser.

## Online multiplayer beta

Kingdom supports private two-player rooms backed by Supabase. Players sign in anonymously, create or join with a six-character code, and submit plans to separate row-level-secured records. Plans are revealed only after both rulers commit; the room host resolves the clash and publishes the next round.

To configure a new Supabase project:

1. Enable **Anonymous Sign-Ins** under Authentication settings.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor.
3. Set the project URL and publishable browser key at the top of `multiplayer.js`.

The current beta is host-authoritative, so the host must keep the room open. Account-based matchmaking, server-authoritative combat, and long-term match history are intentionally deferred.

Full-resolution card-art studies are saved under `assets/concepts/`. Optimized browser versions live under `assets/cards/`. Every current card design is illustrated, and played cards retain the same art on the battlefield.

Run `node game.test.cjs` to execute the card-pool and combat regression checks.
