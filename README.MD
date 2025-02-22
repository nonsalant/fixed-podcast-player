# Fixed Podcast Player

Web Component for an audio player and a <em>Play</em> button. The player is revealed when the button is scrolled into view.

## Preview
- **[Preview on Netlify](https://fixed-podcast-player.netlify.app/)**
- <a href="https://codepen.io/nonsalant/full/pvoyRmZ" target="_blank">View on CodePen</a>

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
| `svg-base` | `''` | The base URL to the <a href="https://ryantrimble.com/blog/what-the-heck-is-an-svg-sprite-sheet.html" target="_blank">SVG sprite sheet</a> for the icons. |