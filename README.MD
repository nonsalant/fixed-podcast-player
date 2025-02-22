# Fixed Podcast Player
[Preview the web component on CodePen](https://codepen.io/nonsalant/full/pvoyRmZ)

## Build Commands

Install (if not done yet) and run dev (asset watch only, no server):
```bash
pnpm install
pnpm run dev
```

Build only command (no watch):
```bash
pnpm run build
```

## Options
| Option | Default | Description |
| --- | --- | --- |
| `data-title` | `''` | The title of the episode. |
| `data-position` | `bottom` | The position of the player. Can be `top` or `bottom`. |
| `data-variation` | `''` | Player will not touch the edge on large screens if set to `floating`. |
| `data-src` | `''` | The URL to the mp3 file. |
| `data-thumb` | `''` | The URL to the thumbnail image. |
| `svg-base` | `''` | The base URL to the SVG sprite sheet for the icons. |