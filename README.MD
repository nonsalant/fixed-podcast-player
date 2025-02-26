# Fixed Podcast Player

[![Netlify Status](https://api.netlify.com/api/v1/badges/add63bda-b777-4889-95d9-68e936a82751/deploy-status)](https://app.netlify.com/sites/fixed-podcast-player/deploys)

Web Component for an audio player and a <em>Play</em> button. The player is revealed when the button is scrolled into view.

## Preview
- **[Preview on Netlify](https://fixed-podcast-player.netlify.app/)**
- [View on CodePen](https://codepen.io/nonsalant/pen/pvoyRmZ)

## Usage

### 1. Include the assets in the `<head>`

Adjust the paths below as needed:

```html
<!-- Podcast Player Assets (CSS, JS, SVG) -->
<link rel="stylesheet" class="fpp" href="./assets/build/podcast-player.min.css">
<script src="./assets/build/podcast-player.min.js" type="module"></script>
<link rel="icon-sprite-sheet" class="fpp" href="./assets/icons.svg">
```
<details>
<summary><b>Icon Sprite Sheet</b> (3rd <code>&lt;link&gt;</code> item)</summary>
<p>The <code>&lt;link rel="icon-sprite-sheet"&gt;</code> above sets the URL for the <a href="https://ryantrimble.com/blog/what-the-heck-is-an-svg-sprite-sheet.html">SVG sprite sheet</a> used for the icons.</p>
<p>This can be omitted by setting the following attribute on the <code>&lt;podcast-player&gt;</code> element:
<br><code>svg-base="./assets/icons.svg"</code></p>
</details>

### 2. Add the `<podcast-player>` element in the `<body>`

Note the data attributes, and the `href` of `.show-and-play` which is the audio source (i.e. the mp3 URL):

```html
<podcast-player data-title="Episode Title" data-thumb="thumbnail.jpg">
  <a class="show-and-play" href="audio.mp3">
    <div><i icon-name="play-circle-solid"></i><b>Play</b></div>
    <div><i icon-name="pause-circle"></i><span>Pause</span></div>
    <div><i icon-name="play-circle"></i><span>Resume</span></div>
  </a>
</podcast-player>
```


## Attributes for the `<podcast-player>` element
| Attribute | Default | Description |
| --- | --- | --- |
| `data-title` | `""` | The title of the episode |
| `data-thumb` | `""` | The URL to the thumbnail image |
| `data-position` | `"bottom"` | The position of the player: `top` or `bottom` |
| `data-variation` | `""` | Player will not touch the edge on large screens if set to `floating` |
| `show-on` | `"scroll"` | The button event that triggers the player to show: `scroll` (when the button is scrolled into view for the first time), `click`, `load`, or `hover` |

## Overridable CSS Variables

You can add variables to your CSS to override the default values. 

For example, you can easily change the color of the Play button and the intensity of  the player's gradient background:
```css
:root {
  --pp-hue: 205deg;
  --pp-sat: 35%;
  --pp-lig: 40%;
  --pp-gradient-hue-difference: 15deg;
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

## Build Commands

Install (if not done yet) and run the dev command (asset watch only, no server):
```bash
pnpm install
pnpm run dev
```

Build only command (no watch):
```bash
pnpm run build
```


