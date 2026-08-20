# Kingdom art style

Everything here is derived from the art already in `assets/cards/`. Keep new pieces
matching it rather than matching this description where the two ever disagree.

## Files and sizes

| what | size | format | lives in |
|---|---|---|---|
| card art, full study | 1024 x 1536 (2:3 portrait) | PNG | `assets/concepts/{name}-style-study.png` |
| card art, shipped | 512 x 768 (2:3 portrait) | WebP | `assets/cards/{name}.webp` |
| screen background | 1536 x 1024 (3:2 landscape) | WebP | `assets/ui/{name}.webp` |

`{name}` is the card's display name in lower-case kebab (`man-at-arms`, `fire-sapper`).
Add the path to `CARD_ART` in `game.js`; a test fails if any card lacks one or the file
is missing.

## The crop is the constraint

A card never shows the whole picture. It shows a short wide band, `background-size: cover`:

- **Units** anchor to `center top` — the band is the **top ~25-30%** of the image.
  A figure's head and shoulders must sit inside that or the card shows their chest.
- **Buildings** anchor to `center 39-42%` — the band is a slice through the **upper middle**.
  The structure's silhouette should peak around a third of the way down.

A dark gradient is laid over the lower half of the band for text legibility, so detail
near the bottom of the frame is both cropped and dimmed. Put nothing you care about there.

## The style

Painterly digital oil, in the manner of classic fantasy trading-card illustration.
Grounded medieval Europe, roughly 12th to 15th century - **not** high fantasy. No magic,
no glowing runes, no elves or orcs, no anachronism.

- **Light**: warm golden-hour sun, strong and directional, with atmospheric haze, dust or
  smoke catching in it.
- **Palette**: muted earths - ochre, oak brown, moss green, weathered steel, oxblood red,
  brass and gold accents. Rich but never saturated or neon.
- **Texture**: everything is worn and lived in. Scuffed leather, rusted mail, rough-hewn
  timber, moss on stone, mud, patina.
- **Depth**: shallow focus. The subject is crisp, the background softly blurred.
- **Background always establishes the world** - a curtain wall, a palisade, pine forest,
  scaffolding, other figures at work behind. Never an empty or plain backdrop.
- **No text, no border, no frame, no UI, no watermark, no signature.**

Units are a single figure, waist-up or three-quarter, mid-action with the tool or weapon
that defines them. Buildings are an environment: the structure in its landscape, people
incidental or absent.

## Prompt template

Replace the bracketed part and keep the rest verbatim.

> Painterly digital oil painting, classic fantasy trading card illustration, grounded
> medieval European realism circa 1300, no magic and no fantasy races. [SUBJECT]. Warm
> golden-hour sunlight, strong directional light, atmospheric haze. Muted earthy palette of
> ochre, oak brown, moss green, weathered steel and oxblood red with brass accents. Heavily
> textured, worn and lived-in surfaces. Shallow depth of field, crisp subject against a
> softly blurred background that establishes the setting. Rich detail, confident brushwork.
> Vertical 2:3 portrait composition. No text, no border, no frame, no watermark.

Add for a unit:

> Single figure, three-quarter view, waist-up, head and shoulders in the top quarter of the
> frame, mid-action.

Add for a building:

> The structure centred in its landscape, silhouette peaking about a third down the frame,
> figures incidental.

### Subjects already used, for reference

- Man-at-Arms - armoured infantryman with poleaxe and kite shield before a timber palisade
- Sawmill - water-wheel mill in a pine valley, cut logs stacked, stream running past
- Mason - stonecutter dressing a block with mallet and chisel, castle rising in scaffolding

## Screen backgrounds

Same treatment, 3:2 landscape, a wide establishing view of a room or place. Lower contrast
and darker overall than card art: interface panels and text sit directly on top, so the
middle band should stay quiet and free of busy detail.
