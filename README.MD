# Fixed Podcast Player

Web Component for an audio player and a <em>Play</em> button. The player is revealed when the button is scrolled into view.

## Preview
- **[Preview on Netlify](https://fixed-podcast-player.netlify.app/)**
- [View on CodePen](https://codepen.io/nonsalant/pen/pvoyRmZ)

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

## Attributes for the `<podcast-player>` element
| Option | Default | Description |
| --- | --- | --- |
| `data-title` | `""` | The title of the episode |
| `data-position` | `"bottom"` | The position of the player: `top` or `bottom` |
| `data-variation` | `""` | Player will not touch the edge on large screens if set to `floating` |
| `data-src` | `""` | The URL to the mp3 file |
| `data-thumb` | `""` | The URL to the thumbnail image |
| `show-on` | `"scroll"` | The button event that triggers the player to show: `scroll`, `click`, `load`, or `hover` |
| `svg-base` | `""` | The URL to the <a href="https://ryantrimble.com/blog/what-the-heck-is-an-svg-sprite-sheet.html" target="_blank">SVG sprite sheet</a> for the icons |

## Overridable CSS Variables
Add these variables to your CSS to override the default values:
```css
:root {
    --pp-offset-top: 0px;
    --pp-offset-top-small: 0px;
    --pp-content-width: 40rem;
    --pp-radius: 1.25rem / 1rem;
    --pp-hue: 205deg;
    --pp-sat: 35%;
    --pp-lig: 40%;
    --pp-gradient-hue-difference: 15deg;
    --body-offset-for-player: 110px;
}
```
| Variable | Default | Description |
| --- | --- | --- |
| `--pp-offset-top` | `0px` | Account for any sticky header or navigation |
| `--pp-offset-top-small` | `0px` | Account for any sticky header or navigation on small screens |
| `--pp-content-width` | `40rem` | The "content" width of the player |
| `--pp-radius` | `1.25rem / 1rem` | The border radius of the player. The `x / y` format means the corners will be more oval (when `x` is different from `y`) instead of circular |
| `--pp-hue` | `205deg` | The hue of the Play button's background color |
| `--pp-sat` | `35%` | The saturation of the Play button's background color |
| `--pp-lig` | `40%` | The lightness of the Play button's background color |
| `--pp-gradient-hue-difference` | `15deg` | The difference in hue between the two colors of the player's background gradient |
| `--body-offset-for-player` | `110px` | Extra padding for the body (at the top or at the bottom) to make space for the player |