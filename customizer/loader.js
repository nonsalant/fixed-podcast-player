// View Transitions
document.getElementById("customizer-link").addEventListener("click", function(e) {
    e.preventDefault();
    document.startViewTransition(() => {
        window.location.href = e.target.href;
    });
});

// Continue only if the ?customize parameter is present in the URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("customize")) {
    // Change the link (to Close Customizer)
    const link = document.getElementById("customizer-link");
    const url = new URL(window.location); url.searchParams.delete("customize");
    Object.assign(link, { href: url.toString(), textContent: "Close Customizer" });

    // Load the Customizer
    loadCustomizer();
}

async function loadCustomizer() {
    const cacheBuster = Date.now();
    // Load customizer HTML (CSS is referenced inside)
    const response = await fetch("./customizer/customizer.html?"+cacheBuster);
    const container = Object.assign(document.createElement("div"), {innerHTML: await response.text()});
    const scriptTag = document.getElementById("customizer-script");
    scriptTag.replaceWith(...container.childNodes);

    // Load Customizer scripts
    await import("./global-this/_customizer.js?"+cacheBuster);
    await import("./fieldsets.js?"+cacheBuster);
    await import("./global-this/_color-picker.js?"+cacheBuster);
    await import("./color-picker.js?"+cacheBuster);
    
    // Init Customizer fields
    document.querySelectorAll("fieldset [oninput]").forEach(el => { el.dispatchEvent(new Event("input",{bubbles:true})); });
    /* Trigger an input event once to hydrate the oninput attributes */
    /*  e.g: `oninput="new …(…);"` becomes: `oninput="const pp=…; const $=(…)=>…; pp.setAttribute(…); etc."` */
    
    // Scroll to the element before the <podcast-player>
    document.querySelector("*:has(+ podcast-player)").scrollIntoView({ behavior: "smooth" });
    
    // Load external scripts (copy-to-clipboard and html-code-block-element)
    const scripts = [
        // https://github.com/p-m-p/parsonic/tree/main/packages/copy-to-clipboard
        // "https://cdn.jsdelivr.net/npm/@heppokofrontend/html-code-block-element/lib/html-code-block-element.common.min.js",
        // https://github.com/heppokofrontend/html-code-block-element
        "https://cdn.jsdelivr.net/npm/@parsonic/copy-to-clipboard/min.js", // ! Bug: the word "copy" is being copied too
        // https://github.com/github/clipboard-copy-element
        "https://unpkg.com/@github/clipboard-copy-element@latest"
    ];
    await Promise.all(scripts.map(src => import(src)));
}