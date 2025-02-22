// General utilities

export function formatTime(time) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return hours > 0
        ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function isIOS() {
    return /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) && !window.MSStream && (navigator.maxTouchPoints && navigator.maxTouchPoints > 1);
}

// sets the new value if previous value returns falsy
export function initLocalStorageItem(k, val) {
    if (!localStorage.getItem(k)) { localStorage.setItem(k, val); }
}

// throttles a function to ensure it only runs once 
// per specified limit (in milliseconds)
export function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function (...args) {
        const context = this;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function () {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

export function updateCss(css, id = 'js-added-style', injectionSite = document.head) {
    let styleTag;
    if (injectionSite.querySelector(`#${id}`)) { // overwrites existing
        styleTag = injectionSite.querySelector(`#${id}`);
        styleTag.textContent = css;
    } else { // creates new
        styleTag = document.createElement('style');
        styleTag.id = id;
        // injectionSite.appendChild(styleTag);
        injectionSite.insertBefore(styleTag, injectionSite.firstChild);
        styleTag.textContent = css;
    }
}

// export function injectCss(css, id = 'js-added-style', injectionSite = document.head) {
//     if (injectionSite.querySelector(`#${id}`)) return; // only do this it once
//     const styleTag = document.createElement('style');
//     styleTag.id = id;
//     // injectionSite.appendChild(styleTag);
//     injectionSite.insertBefore(styleTag, injectionSite.firstChild);
//     styleTag.textContent = css;
// }

// export function ejectCss(id = 'js-added-style', injectionSite = document.head) {
//     const styleTag = injectionSite.querySelector(`#${id}`);
//     if (styleTag) styleTag.remove();
// }

// export function slugify(string) {
//     return string.toString().toLowerCase()
//         .normalize('NFD')
//         .replace(/[\u0300-\u036f]/g, '')
//         .replace(/\s+/g, '-')
//         .replace(/&/g, '-and-')
//         .replace(/[^\w\-]+/g, '')
//         .replace(/\-\-+/g, '-')
//         .replace(/^-+/, '')
//         .replace(/-+$/, '');
// }
