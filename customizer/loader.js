(async () => {
    const scriptTag = document.getElementById("customizer-script");
    if (!window.location.search.includes('?customize')) return;

    // Load customizer
    const response = await fetch("./customizer/index.html");
    const container = Object.assign(document.createElement('div'), { innerHTML: await response.text() });
    scriptTag.replaceWith(...container.childNodes);


    // Load customizer scripts (styles are inside the HTML)
    const localScripts = [
        "./script.js",
        "./color-picker.js"
    ];
    await Promise.all(localScripts.map(src => import(src)));
    const scripts = [
        "https://cdn.jsdelivr.net/npm/@parsonic/copy-to-clipboard/min.js",
        "https://cdn.jsdelivr.net/npm/@heppokofrontend/html-code-block-element/lib/html-code-block-element.common.min.js"
    ];
    await Promise.all(scripts.map(src => import(src)));
    
    // Change the link
    const link = document.getElementById("customizer-link");
    const url = new URL(window.location); url.searchParams.delete('customize');
    Object.assign(link, { href: url.toString(), textContent: "Close Customizer" });

    // Scroll to the element before the <podcast-player>
    document.querySelector("*:has(+ podcast-player)").scrollIntoView({ behavior: "smooth" });
})();