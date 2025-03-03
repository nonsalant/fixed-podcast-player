globalThis.customizer = globalThis.customizer ?? {};

globalThis.customizer.setProp = function(propName, propValue) { document.documentElement.style.setProperty(propName, propValue); }

globalThis.customizer.getProp = function(propName) { return getComputedStyle(document.documentElement).getPropertyValue(propName).trim(); }

/* used in customizer/index.html */
globalThis.customizer.setupPropListener = function(el, propName, unit) {
    el.setAttribute ("oninput", `
        globalThis.customizer.setProp('${propName}', this.value + '${unit}');
        this.nextElementSibling.innerText = this.value + '${unit}';
    `);
}

/* used in customizer/index.html */
globalThis.customizer.setupAttListener = function(el, attName) {
    el.setAttribute ("oninput", globalThis.customizer.setupContentListener.commonTemplate(attName) + `
        currentPlayer.shadowRoot.querySelector('.podcast-player').setAttribute('${attName}', this.value);
    `);
}

/* used in customizer/index.html */
globalThis.customizer.setupContentListener = class {
    constructor(el, templateFunctionName, attName = "") {
        globalThis.customizer.setupContentListener[templateFunctionName](el, attName);
    }

    static commonTemplate(attName, alsoPlayerAtt = false) {
        return `
            currentPlayer = document.querySelector('podcast-player');
            currentPlayer.setAttribute('${attName}', this.value);
        ${alsoPlayerAtt ?
            `currentPlayer.shadowRoot.querySelector('.podcast-player').setAttribute('${attName}', this.value);`
            : ""}
        `;
    }

    static titleTemplate(el, attName) {
        attName = attName || "data-title";
        el.setAttribute("oninput", this.commonTemplate(attName, true) + `
            currentPlayer.shadowRoot.querySelector('h3').setAttribute('title', this.value);
            currentPlayer.shadowRoot.querySelector('h3').innerText = this.value;
        `);
    }

    static thumbTemplate(el, attName) {
        attName = attName || "data-thumb";
        el.setAttribute("oninput", this.commonTemplate(attName, true) + `
            currentPlayer.shadowRoot.querySelector('header').style.backgroundImage = 'url('+this.value+')';
        `);
    }

    static srcTemplate(el, attName) {
        attName = attName || "data-src";
        el.setAttribute("oninput", this.commonTemplate(attName, true) + `
            currentPlayer.shadowRoot.querySelector('audio').src = this.value;
            currentPlayer.shadowRoot.querySelector('a')?.setAttribute('href', this.value);
        `);
    }
}




