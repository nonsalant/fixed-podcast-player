/**
 * A function that returns the HTML string for a podcast player.
 * @param {string} src - The source URL of the audio file.
 * @param {string} title - The title of the episode.
 * @param {string} thumb - The thumbnail image URL.
 * @param {string} totalTime - The total time duration.
 * @param {string} position - The position of the player.
 * @param {string} variation - The variation of the player.
 * @returns {string} The HTML string for the podcast player.
 */
export default function podcastPlayerTemplate(props) {
    const { src, title, thumb, totalTime = '', position = '', variation = '', svgBase } = props;
    return `
    <div class="pp-wrapper">
        <div>
            ${renderShowAndPlay(src, svgBase)}
        </div>

        <audio preload="metadata" src="${src}"></audio>
        
        <div class="podcast-player" data-variation="${variation}" data-position="${position}" inert>
            ${renderHeader(thumb)}
            ${renderMain(title, totalTime, svgBase)}
            ${renderFooter(svgBase)}
        </div>
    </div>
`;}

function renderHeader(thumb) {
    return thumb ? `<header style="background-image: url('${thumb}')"></header>` : '';
}

function renderFooter(svgBase) {
    return `
        <footer class="flex space-between">
            <button title="Close player" class="invert | podcast-icon circle-small icon-close" id="icon-close">
                <svg style="width: 1.5rem; height: 1.5rem; scale: .75;">
                    <use href="${svgBase}#close-icon"></use>
                </svg>
            </button>
            <button title="Change position" type="button" class="invert | podcast-icon circle-small icon-move">
                <svg style="height:1.5rem; width:1.5rem; scale: .6;">
                    <use href="${svgBase}#move-icon"></use>
                </svg>
            </button>
        </footer>`;
}

function renderShowAndPlay(src, svgBase) {
    return `
        <a href="${src}" class="show-and-play">
            <div>
                <svg aria-hidden="true"><use href="${svgBase}#play-circle-solid"></use></svg>
                <b>Play</b>
            </div>
            <div>
                <svg aria-hidden="true"><use href="${svgBase}#pause-circle"></use></svg>
                <span>Pause</span>
            </div>
            <div>
                <svg aria-hidden="true"><use href="${svgBase}#play-circle"></use></svg>
                <span>Resume</span>
            </div>
        </a>`;
}

function renderMain(title, totalTime, svgBase) {
    return `
        <div class="main controls flex width-100">
            <section>
                <button class="play-pause icon-button circle podcast-icon">
                    <div>
                        <svg><use href="${svgBase}#play-solid"></use></svg>
                        <span class="visually-hidden">Play</span>
                    </div>
                    <div>
                        <svg><use href="${svgBase}#pause-solid"></use></svg>
                        <span class="visually-hidden">Pause</span>
                    </div>
                </button>
                <div id="time-display-current" class="controls-surface flex">
                    <time>00:00</time>
                    <button type="button" title="Share with current timestamp" style="color: hsl(var(--clr-hue) var(--clr-sat) 12.5% / 100%); border-radius: 8px;" class="share-button | ghost icon-button">
                        <div class="bg-icon" style="background-image: url(${svgBase}#share-icon);">
                            <span class="visually-hidden">Share</span>
                        </div>
                    </button>
                </div>
                <label for="scrubber" class="flex">
                    <span class="visually-hidden">Seek Bar</span>
                    <input type="range" id="scrubber" min="0" max="0" value="0">
                </label>
                <div id="time-display-end" class="controls-surface mr-small"><time>${totalTime || ' --&thinsp;:&thinsp;-- '}</time></div>
            </section>
            <section>
                <h3 class="audio-title" title="${title}">${title}</h3>
                <div class="controls-surface-2 flex">
                    <button class="mute podcast-icon">
                        <svg class="button-icon mute-svg" aria-label="Mute"><use href="${svgBase}#unmute-icon"></use></svg>
                        <svg class="button-icon unmute-svg hidden" aria-label="Unmute"><use href="${svgBase}#mute-icon"></use></svg>
                    </button>
                    <div class="flex | volume-group | controls-surface" style="margin-block: 1px;">
                        <label for="volume-control" class="visually-hidden">Volume</label>
                        <input data-size="small" type="range" id="volume-control" class="volume" value=".35" min="0" max="1" step="0.01" title="Volume">
                    </div>
                    <div class="flex">
                        <label for="speed-control" class="visually-hidden">Speed</label>
                        <select title="Playback speed" data-size="small" id="speed-control" class="podcast-icon">
                            <option value="0.2">0.2x</option><option value="0.5">0.5x</option>
                            <option value="1" selected>1.0x</option><option value="1.2">1.2x</option><option value="1.5">1.5x</option><option value="1.7">1.7x</option>
                            <option value="2">2.0x</option><option value="2.2">2.2x</option><option value="2.5">2.5x</option><option value="2.7">2.7x</option>
                        </select>
                    </div>
                </div>
            </section>
        </div>`;
}