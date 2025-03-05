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
    // Change the link
    const link = document.getElementById("customizer-link");
    const url = new URL(window.location); url.searchParams.delete("customize");
    Object.assign(link, { href: url.toString(), textContent: "Close Customizer" });

    // Load the Customizer
    (async () => {

        // Load customizer HTML (CSS is referenced inside)
        const response = await fetch("./customizer/customizer.html");
        const container = Object.assign(document.createElement("div"), {innerHTML: await response.text()});
        const scriptTag = document.getElementById("customizer-script");
        scriptTag.replaceWith(...container.childNodes);

        // Load customizer scripts
        await import("./global-this/_customizer.js");
        await import("./fieldsets.js");
        await import("./global-this/_color-picker.js");
        await import("./color-picker.js");
        
        // Init Customizer fields
        document.querySelectorAll("fieldset [oninput]").forEach(el => { el.dispatchEvent(new Event("input",{bubbles:true})); });
        /* Trigger an input event once to hydrate the oninput attributes */
        /*  e.g: `oninput="new …(…);"` becomes: `oninput="const pp=…; const $=(…)=>…; pp.setAttribute(…); etc."` */
        
        // Scroll to the element before the <podcast-player>
        document.querySelector("*:has(+ podcast-player)").scrollIntoView({ behavior: "smooth" });
        
        // Load external scripts (copy-to-clipboard and html-code-block-element)
        const scripts = [
            // https://github.com/p-m-p/parsonic/tree/main/packages/copy-to-clipboard
            "https://cdn.jsdelivr.net/npm/@heppokofrontend/html-code-block-element/lib/html-code-block-element.common.min.js",
            // https://github.com/heppokofrontend/html-code-block-element
            "https://cdn.jsdelivr.net/npm/@parsonic/copy-to-clipboard/min.js", // ! Bug: the word "copy" is being copied too
        ];
        await Promise.all(scripts.map(src => import(src)));

    })();
}