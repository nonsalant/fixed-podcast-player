// Custom Element: color-picker

class ColorPicker extends HTMLElement {
    constructor() {
        super();
        this.defaultColor = this.getAttribute("default-color") ?? "#426c8a"; // darkblue
        this.propName = "--pp-color";
        this.hue = "--pp-hue";
        this.sat = "--pp-sat";
        this.lig = "--pp-lig";
    }

    connectedCallback() {
        this.picker = this.querySelector("input[type=color]");

        const initialColor = getProp(this.propName);
        this.picker.value = initialColor.startsWith("#")
            ? initialColor
            : this.defaultColor;

        this.setColor();
        this.picker.addEventListener("input", this.handleColorPicker.bind(this));
    }

    handleColorPicker() {
        this.setColor();
    }

    setColor() {
        setProp(this.propName, this.picker.value);
        const hsl = hexToHsl(this.picker.value);
        setProp(this.hue, hsl.h + "deg");
        setProp(this.sat, hsl.s + "%");
        setProp(this.lig, hsl.l + "%");
        // console.log(hsl);
        this.querySelector("output").innerHTML = `
        <ul>
            <li>hue: <code>${hsl.h}deg</code></li>
            <li>saturation: <code>${hsl.s}%</code></li>
            <li>lightnes: <code>${hsl.l}%</code></li>
        </ul>
        `;
    }
}

customElements.define("color-picker", ColorPicker);

function setProp(propName, propValue) {
    document.documentElement.style.setProperty(propName, propValue);
}

function getProp(propName) {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(propName)
        .trim();
}

function hexToHsl(hex) {
    // Remove '#' if present
    hex = hex.replace(/^#/, "");

    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h,
        s,
        l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // Grayscale
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h = Math.round(h * 60);
    }

    return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}
