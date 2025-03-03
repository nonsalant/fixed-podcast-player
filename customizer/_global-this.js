/* * */

globalThis.customizer = globalThis.customizer ?? {};

function setupPropListener(el, propName, unit) {
    el.setAttribute ("oninput", `
        globalThis.customizer.setProp('${propName}', this.value + '${unit}');
        this.nextElementSibling.innerText = this.value + '${unit}';
    `);
}
globalThis.customizer.setupPropListener = setupPropListener;

function setupAttListener(el, attName) {
    el.setAttribute ("oninput", globalThis.customizer.commonTemplate(attName) + `
        currentPlayer.shadowRoot.querySelector('.podcast-player').setAttribute('${attName}', this.value);
    `);
}
globalThis.customizer.setupAttListener = setupAttListener;

/**/

function setupContentListener(el, templateFunctionName, attName = "") {
    globalThis.customizer[templateFunctionName](el, attName);
}
globalThis.customizer.setupContentListener = setupContentListener;

function commonTemplate(attName, alsoPlayerAtt = false) {
    return `
        currentPlayer = document.querySelector('podcast-player');
        currentPlayer.setAttribute('${attName}', this.value);
        ${ alsoPlayerAtt ?
            `currentPlayer.shadowRoot.querySelector('.podcast-player').setAttribute('${attName}', this.value);`
        : ""}
    `;
}
globalThis.customizer.commonTemplate = commonTemplate;

function titleTemplate(el, attName) {
    attName = attName || "data-title";
    el.setAttribute("oninput", globalThis.customizer.commonTemplate(attName, true) + `
        currentPlayer.shadowRoot.querySelector('h3').setAttribute('title', this.value);
        currentPlayer.shadowRoot.querySelector('h3').innerText = this.value;
    `);
}
globalThis.customizer.titleTemplate = titleTemplate;

function thumbTemplate(el, attName) {
    attName = attName || "data-thumb";
    el.setAttribute("oninput", globalThis.customizer.commonTemplate(attName, true) + `
        currentPlayer.shadowRoot.querySelector('header').style.backgroundImage = 'url('+this.value+')';
    `);
}
globalThis.customizer.thumbTemplate = thumbTemplate;

function srcTemplate(el, attName) {
    attName = attName || "data-src";
    el.setAttribute("oninput", globalThis.customizer.commonTemplate(attName, true) + `
        currentPlayer.shadowRoot.querySelector('audio').src = this.value;
        currentPlayer.shadowRoot.querySelector('a')?.setAttribute('href', this.value);
    `);
}
globalThis.customizer.srcTemplate = srcTemplate;

// Init the customizer

// Trigger an input event once to update the oninput attributes
const triggerableElements = document.querySelectorAll("fieldset [oninput]");
triggerableElements.forEach(el => {
    el.dispatchEvent(new Event("input", { bubbles: true }));
});