setupFieldsetListener("#customize", codeTemplate1);
setupFieldsetListener("#attributes", codeTemplate2);

function setupFieldsetListener(selector, templateFunction) {
    document.querySelector(selector).addEventListener("input", () => {
        templateFunction(selector);
    });
}

function codeTemplate1(selector) {
    const fieldset = document.querySelector("fieldset" + selector);
    
    const hue = fieldset.querySelector("#hue").value;
    const sat = fieldset.querySelector("#sat").value;
    const lig = fieldset.querySelector("#lig").value;
    const gradientDifference = fieldset.querySelector("#gradient-difference").value;
    const contentWidth = fieldset.querySelector("#content-width").value;
    const borderRadius = fieldset.querySelector("#border-radius").value;

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
    
    document.querySelector(`fieldset${selector} code-block`).innerHTML = `&lt;podcast-player 
    data-title="${title || "…"}"
    data-thumb="${thumb || "…"}"
    data-position="${position || ""}"
    data-variation="${variation || ""}"
&gt;
    &lt;a class="show-and-play" href="${src || "…"}"&gt;Play&lt;/a&gt;
&lt;/podcast-player&gt;`;
}
