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
        const simpleOptionAtts = ["data-variation", "data-position"];
        const isSimple = simpleOptionAtts.includes(attName);

        if (isSimple) {
            new.target.setupAttListener(el, attName);
        }
        else {
            new.target[methodName](el, attName);
        }
    }

    static commonCode(attName) {
        return `
            const pp = document.querySelector('podcast-player');
            const $ = (sel) => pp.shadow.querySelector(sel);
            pp.setAttribute('${attName}', this.value);
        `;
    }

    static setupAttListener(el, attName) {
        el.setAttribute("oninput", this.commonCode(attName) + `
            const div = $('.podcast-player');
            div.setAttribute('${attName}', this.value);
        `);
    }

    static dataTitle(el, attName) {
        el.setAttribute("oninput", this.commonCode(attName) + `
            const h3 = $('h3');
            h3.setAttribute('title', this.value);
            h3.innerText = this.value;
        `);
    }

    static dataThumb(el, attName) {
        el.setAttribute("oninput", this.commonCode(attName) + `
            const header = $('header');
            header.style.backgroundImage = 'url('+this.value+')';
        `);
    }

    static dataSrc(el, attName) {
        el.setAttribute("oninput", this.commonCode(attName) + `
            const audio = $('audio');
            const a = $('a');
            audio.src = this.value;
            a?.setAttribute('href', this.value);
        `);
    }
    
}
