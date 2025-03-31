# Fixed Podcast Player

[![Netlify Status](https://api.netlify.com/api/v1/badges/add63bda-b777-4889-95d9-68e936a82751/deploy-status)](https://app.netlify.com/sites/fixed-podcast-player/deploys)

Web Component for a sticky audio player and its *Play* button.

## Demo
- **[fixed-podcast-player.netlify.app](https://fixed-podcast-player.netlify.app/)**

## Usage

### 1. Include the assets

Adjust the paths below as needed—the ones below are the ones used by the demo in the `index.html` file:

```html
<!-- Podcast Player Assets (CSS, JS, SVG) -->
<link rel="stylesheet" class="fpp" href="./assets/build/podcast-player.min.css">
<script src="./assets/build/podcast-player.min.js" type="module"></script>
<link rel="icon-sprite-sheet" class="fpp" href="./assets/icons.svg">
```
<details>
<summary><b>Icon sprite sheet?</b> (the 3rd asset above)</summary>
<p>The <code>&lt;link rel="icon-sprite-sheet"&gt;</code> above sets the URL for the <a href="https://ryantrimble.com/blog/what-the-heck-is-an-svg-sprite-sheet.html">SVG sprite sheet</a> used for the icons.</p>
<p>This can be omitted from here if setting the following attribute on the <code>&lt;podcast-player&gt;</code> element:
<br><code>svg-base="./assets/icons.svg"</code></p>
</details>

### 2. Add the `<podcast-player>` element

#### Example 1: Basic Usage
Note the `data-title` and `data-thumb` attributes on the element:
```html
<podcast-player data-title="Episode Title" data-thumb="thumbnail.jpg">
  <a class="show-and-play" href="audio.mp3">
    Play
  </a>
</podcast-player>
```
Also note the audio source (i.e. the mp3 URL) in the `href` of `<a class="show-and-play">`

#### Example 2: Change the *Pause* and *Resume* text
You can also set the text for each state of the button with this more explicit markup:
```html
<podcast-player data-title="Episode Title" data-thumb="thumbnail.jpg">
  <a class="show-and-play" href="audio.mp3">
    <span>Play</span>
    <span>Pause</span>
    <span>Resume</span>
  </a>
</podcast-player>
```

#### Example 3: Define the button text + icons
Or set the text and the icon (from the `assets/icons.svg` [sprite sheet](https://ryantrimble.com/blog/what-the-heck-is-an-svg-sprite-sheet.html)) used for each state of the button:
```html
<podcast-player data-title="Episode Title" data-thumb="thumbnail.jpg">
  <a class="show-and-play" href="audio.mp3">
    <span icon-name="play-circle-solid">Play</span>
    <span icon-name="pause-circle">Pause</span>
    <span icon-name="play-circle">Resume</span>
  </a>
</podcast-player>
```

#### Example 4: Using a `<button>` element
If you'd like the button to be a `button` element and not a link:
```html
<podcast-player data-src="audio.mp3" data-title="Episode Title" data-thumb="thumbnail.jpg">
  <button class="show-and-play" type="button">Play</button>
</podcast-player>
```
Note the `data-src` attribute that is now used for the audio source.

## Attributes for the `<podcast-player>` element
| Attribute | Default | Description |
| --- | --- | --- |
| `data-title` | `""` | The title of the episode |
| `data-thumb` | `""` | The URL to the thumbnail image |
| `data-position` | `"bottom"` | The position of the player: `top` or `bottom` |
| `data-variation` | `""` | Player will not touch the edge on large screens if set to `floating` |
| `show-on` | `"scroll"` | The button event that triggers the player to show: `scroll` (when the button is scrolled into view for the first time), `click`, `load`, or `hover` |
| `data-src` | `undefined` | Set this value to the audio URL if not using a link with a `href` (e.g: if using a `button` element) |
| `svg-base` | `undefined` | Setting this to the URL of the SVG sprite sheet allows you to omit `<link rel="icon-sprite-sheet">` from the assets (see *1. Include the assets* above). |

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
| `--pp-offscreen-radius` | `3px` | The player's border radius for the corners touching the top or bottom edges of the screen. |
| `--pp-hue` | `205deg` | The hue of the base color |
| `--pp-sat` | `35%` | The saturation of the base color |
| `--pp-lig` | `40%` | The lightness of the base color |
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


