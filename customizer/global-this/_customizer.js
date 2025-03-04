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
        const attsOnDiv = ["data-variation", "data-position"];
        const isAttOnDiv = attsOnDiv.includes(attName);

        this.commonCode = this.minDom + this.setMainAtt(attName);
        
        if (isAttOnDiv) { this.attributeOnDiv(el, attName); }
        else { this[methodName](el, attName); }
    }

    // Render fns for inline handlers (`oninput` attribute)

    attributeOnDiv(el, attName) {
        el.setAttribute("oninput",  `
            ${this.commonCode}
            $('.podcast-player').attr('${attName}', this.value);
        `);
    }

    dataTitle(el, attName) {
        el.setAttribute("oninput",  `
            ${this.commonCode}
            $('h3').attr('title', this.value);
            $('h3').innerText = this.value;
        `);
    }

    dataThumb(el, attName) {
        el.setAttribute("oninput",  `
            ${this.commonCode}
            $('header').style.backgroundImage = 'url('+this.value+')';
        `);
    }

    dataSrc(el, attName) {
        el.setAttribute("oninput",  `
            ${this.commonCode}
            $('audio').src = this.value;
            $('a')?.attr('href', this.value);
        `);
    }

    minDom = `
        const pp = document.querySelector('podcast-player');
        const $ = (sel) => pp.shadowRoot.querySelector(sel);
        Element.prototype.attr = function(name, value) {
            // define .attr() for getting and setting attributes
            return value === undefined
            ? this.getAttribute(name)
            : this.setAttribute(name, value);
        };
    `;

    setMainAtt(attName) { `pp.attr('${attName}', this.value);`; }
}
