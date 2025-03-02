document.querySelector("fieldset#customize").addEventListener("input", (e) => {
    processCustomize("#customize");
});
document.querySelector("fieldset#attributes").addEventListener("input", (e) => {
    processAttributes("#attributes");
});

function processCustomize(selector) {
    const fieldset = document.querySelector("fieldset"+selector);
    const colorPicker = fieldset.querySelector("#color-picker").value;
    const gradientDifference = fieldset.querySelector("#gradient-difference").value;
    const contentWidth = fieldset.querySelector("#content-width").value;
    const borderRadius = fieldset.querySelector("#border-radius").value;
    // console.log({colorPicker, gradientDifference, contentWidth, borderRadius});
    renderCss();
}
function processAttributes(selector) {
    const fieldset = document.querySelector("fieldset"+selector);
    const variation = fieldset.querySelector("#variation").value;
    const position = fieldset.querySelector("#position").value;
    const title = fieldset.querySelector("#title").value;
    const thumb = fieldset.querySelector("#thumb").value;
const src = fieldset.querySelector("#src").value;
    document.querySelector("fieldset#attributes code-block").innerHTML = `&lt;podcast-player 
    data-title="${title || "…"}"
    data-thumb="${thumb || "…"}"
    data-position="${position || ""}"
    data-variation="${variation || ""}"
&gt;
    &lt;a class="show-and-play" href="${src || "…"}"&gt;Play&lt;/a&gt;
&lt;/podcast-player&gt;`;
}

function renderCss() {
    // console.log(document.querySelector("fieldset#customize code pre"))
    document.querySelector("fieldset#customize code-block").innerHTML = `:root {
    --pp-hue: ${document.documentElement.style.getPropertyValue("--pp-hue")};
    --pp-sat: ${document.documentElement.style.getPropertyValue("--pp-sat")};
    --pp-lig: ${document.documentElement.style.getPropertyValue("--pp-lig")};
    --pp-gradient-hue-difference: ${document.documentElement.style.getPropertyValue("--pp-gradient-hue-difference") || "15deg"};
    --pp-content-width: ${document.documentElement.style.getPropertyValue("--pp-content-width") || "640px"};
    --pp-radius: ${document.documentElement.style.getPropertyValue("--pp-radius") || "24px"};
}`;
}
