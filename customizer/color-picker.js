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
            <li>${renderRangeCustomProp('hue', '--pp-hue', 'hue',        0, 360, 1, 205, 'deg')}</li>
            <li>${renderRangeCustomProp('sat', '--pp-sat', 'saturation', 0, 100, 1, 35, '%')}</li>
            <li>${renderRangeCustomProp('lig', '--pp-lig', 'lightness',  0, 100, 1, 40, '%')}</li>
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

globalThis.__hslToHex = function(h, s, l) {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    b = Math.round((b + m) * 255).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
}

function renderRangeCustomProp(id, propName, label, min, max, step, value, unit) {
    return `
    <label for="${id}">
    <span>${label}</span>
    <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}"
            oninput="
                this.nextElementSibling.innerText = this.value+'${unit}';
                document.documentElement.style.setProperty('${propName}', this.value+'${unit}');

                const hex = globalThis.__hslToHex(
                    document.documentElement.style.getPropertyValue('--pp-hue').replace(/deg$/, ''),
                    document.documentElement.style.getPropertyValue('--pp-sat').replace(/%$/, ''),
                    document.documentElement.style.getPropertyValue('--pp-lig').replace(/%$/, '')
                );

                document.documentElement.style.setProperty('--pp-color', hex);
                document.getElementById('color-picker').value = hex;
            "
        >
        <code>${value}${unit}</code>
    </label>
    `;
}