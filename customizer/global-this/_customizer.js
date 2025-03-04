globalThis.customizer = globalThis.customizer ?? {};

globalThis.customizer.setProp = function(propName, propValue) { document.documentElement.style.setProperty(propName, propValue); }
globalThis.customizer.getProp = function(propName) { return getComputedStyle(document.documentElement).getPropertyValue(propName).trim(); }

// Render fns for inline handlers (`oninput` attribute)

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
        const methodName = this.kebabToCamel(attName);
        const attsOnDiv = ["data-variation", "data-position"];
        const isAttOnDiv = attsOnDiv.includes(attName);

        this.commonCode = this.minDom + this.setMainAtt(attName);
        
        if (isAttOnDiv) { this.attributeOnDiv(el, attName); }
        else { this["_"+methodName](el, attName); }
    }

    _dataTitle(el) {el.setAttribute("oninput", `
        ${this.commonCode}
        $('h3').title = value;
        $('h3').innerText = value;
    `)}

    _dataThumb(el) {el.setAttribute("oninput", `
        ${this.commonCode}
        $('header').style.backgroundImage = 'url('+value+')';
    `)}

    _dataSrc(el) {el.setAttribute("oninput", `
        ${this.commonCode}
        $('audio').src = value;
        lightDom('a')?.setAttribute('href', value);
    `)}

    attributeOnDiv(el, attName) {el.setAttribute("oninput",`
        ${this.commonCode}
        $('.podcast-player').setAttribute('${attName}', value);
    `)}
    
    minDom = `
        const pp = document.querySelector('podcast-player');
        const lightDom = (sel) => pp.querySelector(sel);
        const $ = (sel) => pp.shadowRoot.querySelector(sel);
    `;

    setMainAtt(attName) { return `
        pp.setAttribute('${attName}', value);
    `}

    kebabToCamel(str) { return str.replace(/-./g, (match) => match.charAt(1).toUpperCase()); }

}
