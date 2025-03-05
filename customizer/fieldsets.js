// globalThis.customizer = globalThis.customizer ?? {};

// globalThis.customizer.setProp = function(propName, propValue) { document.documentElement.style.setProperty(propName, propValue); }
// globalThis.customizer.getProp = function (propName) { return getComputedStyle(document.documentElement).getPropertyValue(propName).trim(); }

setupFieldsetListener("#customize", codeTemplate1);
setupFieldsetListener("#attributes", codeTemplate2);

function setupFieldsetListener(selector, templateFunction) {
    document.querySelector(selector).addEventListener("input", () => {
        templateFunction(selector);
    });
}

function codeTemplate1(selector) {
    // const fieldset = document.querySelector("fieldset" + selector);
    
    const hue = globalThis.customizer.getProp("--pp-hue");
    const sat = globalThis.customizer.getProp("--pp-sat");
    const lig = globalThis.customizer.getProp("--pp-lig");
    const gradientDifference = globalThis.customizer.getProp("--pp-gradient-hue-difference");
    const contentWidth = globalThis.customizer.getProp("--pp-content-width");
    const borderRadius = globalThis.customizer.getProp("--pp-radius");

    document.querySelector(`fieldset${selector} code-block`).innerHTML = `:root {
    --pp-hue: ${hue};
    --pp-sat: ${sat};
    --pp-lig: ${lig};
    --pp-gradient-hue-difference: ${gradientDifference || "15deg"};
    --pp-content-width: ${contentWidth || "640px"};
    --pp-radius: ${borderRadius || "24px"};
}`;
}

function codeTemplate2(selector) {
    const fieldset = document.querySelector("fieldset" + selector);

    const variation = fieldset.querySelector("#variation").value;
    const position = fieldset.querySelector("#position").value;
    const title = fieldset.querySelector("#title").value;
    const thumb = fieldset.querySelector("#thumb").value;
    const src = fieldset.querySelector("#src").value;

    document.querySelector(`fieldset${selector} code-block`).innerHTML = `&lt;podcast-player data-title="${title || '…'}"  data-position="${position || ''}"  data-variation="${variation || ''}"  data-thumb="${thumb || '…'}"&gt;
    &lt;a class="show-and-play" href="${src || "…"}"&gt;Play&lt;/a&gt;
&lt;/podcast-player&gt;`;
}
