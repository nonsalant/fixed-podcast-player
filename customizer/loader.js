document.getElementById('customizer-link').addEventListener('click', function(event) {
    event.preventDefault();
    document.startViewTransition(() => {
        window.location.href = event.target.href;
    });
});

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
        "./global-this/_customizer.js",
        "./global-this/_color-picker.js",
        "./fieldsets.js",
        "./color-picker.js",
    ];
    await Promise.all(localScripts.map(src => import(src)));
    
    // Load external scripts (copy-to-clipboard and html-code-block-element)
    const scripts = [
        // https://github.com/p-m-p/parsonic/tree/main/packages/copy-to-clipboard
        "https://cdn.jsdelivr.net/npm/@heppokofrontend/html-code-block-element/lib/html-code-block-element.common.min.js",
        // https://github.com/heppokofrontend/html-code-block-element
        "https://cdn.jsdelivr.net/npm/@parsonic/copy-to-clipboard/min.js", // ! Bug: the word "copy" is being copied too
    ];
    await Promise.all(scripts.map(src => import(src)));

    // Init Customizer fields: Trigger an input event once to hydrate the oninput attributes
    const triggerableElements = document.querySelectorAll("fieldset [oninput]");
    triggerableElements.forEach(el => {
        el.dispatchEvent(new Event("input", { bubbles: true }));
    });
    /*  e.g: oninput="new globalThis.customizer.setupContentListener(this, 'data-variation');"
    becomes: oninput="const pp=document.querySelector('podcast-player'); pp.setAttribute('data-variation', this.value);
            pp.shadowRoot.querySelector('.podcast-player').setAttribute('data-variation', this.value);"
    */
    
    // Scroll to the element before the <podcast-player>
    document.querySelector("*:has(+ podcast-player)").scrollIntoView({ behavior: "smooth" });

})();