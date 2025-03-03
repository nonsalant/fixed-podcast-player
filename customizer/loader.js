(async () => {
    const scriptTag = document.getElementById("customizer-script");
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has("customize")) return;

    // Load customizer
    const response = await fetch("./customizer/index.html");
    const container = Object.assign(document.createElement("div"), { innerHTML: await response.text() });
    scriptTag.replaceWith(...container.childNodes);


    // Load customizer scripts (css files are inside the HTML)
    const localScripts = [
        "./fieldsets.js",
        "./color-picker.js"
    ];
    await Promise.all(localScripts.map(src => import(src)));
    
    // Load external scripts (copy-to-clipboard and html-code-block-element)
    const scripts = [
        "https://cdn.jsdelivr.net/npm/@parsonic/copy-to-clipboard/min.js",
        "https://cdn.jsdelivr.net/npm/@heppokofrontend/html-code-block-element/lib/html-code-block-element.common.min.js"
    ];
    await Promise.all(scripts.map(src => import(src)));
    
    // Change the link
    const link = document.getElementById("customizer-link");
    const url = new URL(window.location); url.searchParams.delete("customize");
    Object.assign(link, { href: url.toString(), textContent: "Close Customizer" });

    // Scroll to the element before the <podcast-player>
    document.querySelector("*:has(+ podcast-player)").scrollIntoView({ behavior: "smooth" });
})();