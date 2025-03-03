// Global Functions
globalThis.customizer = globalThis.customizer ?? {};
globalThis.customizer.colorPicker = {};

function setProp(propName, propValue) { document.documentElement.style.setProperty(propName, propValue); }
globalThis.customizer.setProp = setProp;

function getProp(propName) { return getComputedStyle(document.documentElement).getPropertyValue(propName).trim(); }
globalThis.customizer.getProp = getProp;

function hslToHex(h, s, l) {
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
globalThis.customizer.hslToHex = hslToHex;

function getHslValues() {
    return {
        h: globalThis.customizer.getProp('--pp-hue').replace(/deg$/, ''),
        s: globalThis.customizer.getProp('--pp-sat').replace(/%$/, ''),
        l: globalThis.customizer.getProp('--pp-lig').replace(/%$/, '')
    };
}
globalThis.customizer.getHslValues = getHslValues;

function handleRange() {
    const hsl = globalThis.customizer.getHslValues();
    const hex = globalThis.customizer.hslToHex(hsl.h, hsl.s, hsl.l);

    globalThis.customizer.setProp('--pp-color', hex);
    document.getElementById('color-picker').value = hex;
}
globalThis.customizer.colorPicker.handleRange = handleRange;