globalThis.customizer = globalThis.customizer ?? {};

globalThis.customizer.setProp = function(propName, propValue) { document.documentElement.style.setProperty(propName, propValue); }
globalThis.customizer.getProp = function(propName) { return getComputedStyle(document.documentElement).getPropertyValue(propName).trim(); }

/* used in customizer/customizer.html */
globalThis.customizer.setupPropListener = function(el, propName, unit) {
    el.setAttribute ("oninput", `
        globalThis.customizer.setProp('${propName}', this.value + '${unit}');
        this.nextElementSibling.innerText = this.value + '${unit}';
    `);
}

/* used in customizer/customizer.html */
globalThis.customizer.setupContentListener = class {

    constructor(el, attName) {
        const kebabToCamel = (str) => str.replace(/-./g, (match) => match.charAt(1).toUpperCase());
        const methodName = kebabToCamel(attName);
        const nonContentAtts = ["data-variation", "data-position"];

        if (nonContentAtts.includes(attName)) new.target.setupAttListener(el, attName);
        else new.target[methodName](el, attName);
    }

    static commonCode(attName) {
        return `
            const pp = document.querySelector('podcast-player');
            pp.setAttribute('${attName}', this.value);
            pp.shadowRoot.querySelector('.podcast-player').setAttribute('${attName}', this.value);
        `;
    }

    static setupAttListener(el, attName) {
        el.setAttribute("oninput", this.commonCode(attName));
    }

    static dataTitle(el, attName) {
        el.setAttribute("oninput", this.commonCode(attName) + `
            pp.shadowRoot.querySelector('h3').setAttribute('title', this.value);
            pp.shadowRoot.querySelector('h3').innerText = this.value;
        `);
    }

    static dataThumb(el, attName) {
        el.setAttribute("oninput", this.commonCode(attName) + `
            pp.shadowRoot.querySelector('header').style.backgroundImage = 'url('+this.value+')';
        `);
    }

    static dataSrc(el, attName) {
        el.setAttribute("oninput", this.commonCode(attName) + `
            pp.shadowRoot.querySelector('audio').src = this.value;
            pp.shadowRoot.querySelector('a')?.setAttribute('href', this.value);
        `);
    }
    
}
