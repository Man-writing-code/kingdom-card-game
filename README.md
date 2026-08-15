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
- For testing, choose a General, Wood Architect, Food Commons, Metal Iron Crown, or Timber Scholars opponent and Normal or Hard decision-making before entering battle.
- Timber Scholars ramps wood through Logging Camps and Sawmills, converts it into Archer damage, and banks Universities for card advantage. Its Fire Sappers stay in hand until a worthwhile target appears, or come down pre-emptively once the castle drops to 5 health or less.
- Development builds expose the weekly decree pool, including Guild Charters, The Grand Fair, The Long Winter, The Lean Court, The Long Muster, and The River Runs High. Choose Calendar Rotation or override it while balancing.
- Units clash lane by lane. Higher power survives; ties destroy both, except where a card says otherwise — the Pavise Guard survives its first defeat permanently damaged at 1 power.
- An unblocked unit deals its power as direct damage. Rulers begin at 10 health.
- Each ruler normally starts with five cards, keeps unplayed cards, and draws two each new round; weekly decrees may change those base draw numbers.
- Occupied unit and building slots may be replaced; the old card is sacrificed to the discard pile on commitment.
- Tier-two resource buildings produce two per round: the Mill costs 2 wood + 1 metal, while the Forge and Sawmill cost 2 wood + 1 food.
- Farmers, Lumberjacks, and Miners are 1-power workers that produce their matching resource after surviving a full round, then every second round.
- The 1-building-material Fire Sapper burns itself out at the clash and destroys any opposing unit in its lane.
- The Archer costs 3 wood and has a flat 2 power, following normal tie rules.
- Village Commons generate temporary Peasants to refill empty unit lanes. Peasant Mobs and Boar Riders each gain 1 power per friendly unit in an adjacent lane, so a contiguous line beats a scattered one.
- Metal decks gain 3-power Men-at-Arms, healing Reinforced Gatehouses, and 4-power Battering Rams. A Ram only breaks the opposing building when its lane holds no defending unit, damaging itself to 1 power in the process; blocked, it simply fights.
- The 40-design global pool now supports six identities: Food swarms and Boar Rider finishers; Wood Palisade defence; pure-Metal elites; Food–Wood hunting engines; Metal–Wood Ballista and Pavise fortifications; and Metal–Food Charge attacks.
- Charge adds direct damage only on the unit's deployment round. Ballistas fire before normal combat, while Palisades blunt the first direct strike through their lane each round.
- The numbers behind those: a Palisade absorbs 2, a Ballista removes one opposing unit of 4 or more power and collapses, the Lancer carries Charge 2, and a Banner Captain grants Charge 1 to the other units deployed alongside it.
- Other lane pairings: the Armoury adds 2 power to a metal-only unit beside it, the Hunting Lodge pays food when its lane connects, Wall Wardens gain 2 power beside any friendly building, Huntsmen salvage wood for winning a clash, and Rabble-Rousers add a Peasant to hand when revealed.
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
