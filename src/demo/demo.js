import './demo.css';
const AColorPicker = require('../main.js');

console.log(AColorPicker);

const body = document.querySelector('body');
const pickers = [...document.querySelectorAll('.picker')].map((el, index) => {
    const picker = AColorPicker.createPicker({
        attachTo: el,
        color: 'darkblue',
        showRGB: true,
        showHSL: true,
        showHEX: true,
        showAlpha: true,
        palette: /no-palette/.test(el.className) ? null : AColorPicker.PALETTE_MATERIAL_CHROME,
        paletteEditable: true
    });
    picker.onchange = (picker) => {
        console.log(index, 'changed', picker.color);
        body.style.backgroundColor = picker.color;
    };
    picker.oncoloradd = (picker, color) => {
        console.log(index, 'coloradd', color);
    };
    picker.oncolorremove = (picker, color) => {
        console.log(index, 'colorremove', color);
    };
    return (window['p' + index] = picker);
});

function printColor(picker) {
    console.info('rgb', picker.rgb, 'hsl', picker.hsl, 'hex', picker.color);
}

document.querySelector('#btnGetColor').addEventListener('click', () => {
    pickers.forEach(printColor);
});

[...document.querySelectorAll('.txt-color')].forEach(txt => txt.addEventListener('keyup', function(e) {
    if (e.which !== 13) return;
    const prop = this.getAttribute('data-prop');
    switch (prop) {
        case 'rgb':
            pickers.forEach((p) => {
                p.rgb = this.value.split(/[\s,;]/);
            });
            break;
        case 'rgba':
            pickers.forEach((p) => {
                p.rgba = this.value.split(/[\s,;]/);
            });
            break;
        case 'hsl':
            pickers.forEach((p) => {
                p.hsl = this.value.split(/[\s,;]/);
            });
            break;
        case 'hsla':
            pickers.forEach((p) => {
                p.hsla = this.value.split(/[\s,;]/);
            });
            break;
        case 'color':
            pickers.forEach((p) => {
                p.color = this.value;
            });
            break;
    }
}));
window.$pickers = pickers;