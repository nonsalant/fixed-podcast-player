import { updateCss } from "./utils.js";

export function hideScrubberThumb(thumbElement='#scrubber') { 
    updateCss(`
        ${thumbElement}::-webkit-slider-thumb { scale:0; opacity:0; transition: scale .2s ease-in-out, opacity .3s var(--back-out, ease-out); }
        ${thumbElement}::-moz-range-thumb     { scale:0; opacity:0; transition: scale .2s ease-in-out, opacity .3s var(--back-out, ease-out); }
    `);
}

export function showScrubberThumb(thumbElement='#scrubber') { 
    updateCss(`
        ${thumbElement}::-webkit-slider-thumb { scale: 1; opacity: 1; }
        ${thumbElement}::-moz-range-thumb     { scale: 1; opacity: 1; }
    `);
}
