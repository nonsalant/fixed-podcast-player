(async () => {
    const scriptTag = document.getElementById("customizer-script");
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has("customize")) return;

    // Change the link
    const link = document.getElementById("customizer-link");
    const url = new URL(window.location); url.searchParams.delete("customize");
    Object.assign(link, { href: url.toString(), textContent: "Close Customizer" });

    // Load customizer
    const response = await fetch("./customizer/customizer.html");
    const container = Object.assign(document.createElement("div"), { innerHTML: await response.text() });
    scriptTag.replaceWith(...container.childNodes);

    // Load customizer scripts (css files are referenced inside)
    const localScripts = [
        "./_global-this.js",
        "./fieldsets.js",
        "./_global-this-color-picker.js",
        "./color-picker.js",
    ];
    await Promise.all(localScripts.map(src => import(src)));
    
    // Load external scripts (copy-to-clipboard and html-code-block-element)
    // https://github.com/heppokofrontend/html-code-block-element
    // https://github.com/p-m-p/parsonic/tree/main/packages/copy-to-clipboard
    // ! Bug: the word "copy" is being copied at the start of the copied text
    const scripts = [
        "https://cdn.jsdelivr.net/npm/@heppokofrontend/html-code-block-element/lib/html-code-block-element.common.min.js",
        "https://cdn.jsdelivr.net/npm/@parsonic/copy-to-clipboard/min.js",
    ];
    await Promise.all(scripts.map(src => import(src)));

    // Init the customizer: Trigger an input event once to update any oninput attributes
    const triggerableElements = document.querySelectorAll("fieldset [oninput]");
    triggerableElements.forEach(el => {
        el.dispatchEvent(new Event("input", { bubbles: true }));
    });

    // Scroll to the element before the <podcast-player>
    document.querySelector("*:has(+ podcast-player)").scrollIntoView({ behavior: "smooth" });

})();