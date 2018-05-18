import './demo.css';
const AColorPicker = require('../main.js');

console.log(AColorPicker);

const body = document.querySelector('body');
const pickers = AColorPicker.from('.picker')
    .on('change', (picker, color) => {
        console.log(picker.index, 'changed', color);
    })
    .on('change', (picker, color) => {
        body.style.backgroundColor = color;
    })
    .on('coloradd', (picker, color) => {
        console.log(picker.index, 'coloradd', color);
    })
    .on('colorremove', (picker, color) => {
        console.log(picker.index, 'colorremove', color);
    });

function printColor(picker) {
    console.info('rgb', picker.rgb, 'hsl', picker.hsl, 'hex', picker.color);
}

document.querySelector('#btnGetColor').addEventListener('click', () => {
    pickers.forEach(printColor);
});

[...document.querySelectorAll('.txt-color')].forEach(txt => txt.addEventListener('keyup', function (e) {
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