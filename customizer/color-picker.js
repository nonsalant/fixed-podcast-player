// const setProp = globalThis.customizer.setProp.bind(globalThis.customizer);
// const getProp = globalThis.customizer.getProp.bind(globalThis.customizer);
// Sometimes color-picker.js loads before _global-this.js
function setProp(propName, propValue) { document.documentElement.style.setProperty(propName, propValue); }
function getProp(propName) { return getComputedStyle(document.documentElement).getPropertyValue(propName).trim(); }

// Render a control with a range input connected to a custom property
function renderRangeCustomProp(id, propName, label, min, max, step, value, unit) {
    return `
    <label class="control" for="${id}">
        <span>${label}</span>
        <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}"
        oninput="
            this.nextElementSibling.innerText = this.value+'${unit}';
            globalThis.customizer.setProp('${propName}', this.value+'${unit}');
            globalThis.customizer.colorPicker.handleRange();
        ">
        <code>${value}${unit}</code>
    </label>
    `;
}

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

        this.querySelector("output").innerHTML = `
        <ul>
            <li>${renderRangeCustomProp('hue', '--pp-hue', 'hue',        0, 360, 1, hsl.h, 'deg')}</li>
            <li>${renderRangeCustomProp('sat', '--pp-sat', 'saturation', 0, 100, 1, hsl.s, '%')}</li>
            <li>${renderRangeCustomProp('lig', '--pp-lig', 'lightness',  0, 100, 1, hsl.l, '%')}</li>
        </ul>
        `;
    }
}
customElements.define("color-picker", ColorPicker);

// Helper Function

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
