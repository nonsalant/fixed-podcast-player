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
            <li><label for="hue"><span>hue</span>       <input type="range" id="hue" min="0" max="360" step="1" value="205" oninput="document.documentElement.style.setProperty('--pp-hue', this.value + 'deg'); this.nextElementSibling.innerText = this.value + 'deg'; document.getElementById('color-picker').value = window.hslToHex(document.documentElement.style.getPropertyValue('--pp-hue').replace(/deg$/, ''), document.documentElement.style.getPropertyValue('--pp-sat').replace(/%$/, ''), document.documentElement.style.getPropertyValue('--pp-lig').replace(/%$/, ''));"><code>${hsl.h}deg</code></label></li>
            <li><label for="sat"><span>saturation</span><input type="range" id="sat" min="0" max="100" step="1" value="35"  oninput="document.documentElement.style.setProperty('--pp-sat', this.value + '%');   this.nextElementSibling.innerText = this.value + '%';   document.getElementById('color-picker').value = window.hslToHex(document.documentElement.style.getPropertyValue('--pp-hue').replace(/deg$/, ''), document.documentElement.style.getPropertyValue('--pp-sat').replace(/%$/, ''), document.documentElement.style.getPropertyValue('--pp-lig').replace(/%$/, ''));"><code>${hsl.s}%</code></label></li>
            <li><label for="lig"><span>lightness</span> <input type="range" id="lig" min="0" max="100" step="1" value="40"  oninput="document.documentElement.style.setProperty('--pp-lig', this.value + '%');   this.nextElementSibling.innerText = this.value + '%';   document.getElementById('color-picker').value = window.hslToHex(document.documentElement.style.getPropertyValue('--pp-hue').replace(/deg$/, ''), document.documentElement.style.getPropertyValue('--pp-sat').replace(/%$/, ''), document.documentElement.style.getPropertyValue('--pp-lig').replace(/%$/, ''));"><code>${hsl.l}%</code></label></li>
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

window.hslToHex = function (h, s, l) {
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