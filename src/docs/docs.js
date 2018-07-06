import './docs.css';
const AColorPicker = require('../acolorpicker.js');
const $title = document.querySelector('.title');

const pickers = AColorPicker.from('.picker')
    .on('change', (picker, color) => {
        console.log(color)
        $title.style.backgroundColor = color;
        if (AColorPicker.getLuminance(...picker.rgb) < .5) {
            $title.style.color = '#fff';
        } else {
            $title.style.color = '#333';
        }
    })
    .on('coloradd', (picker, color) => {
        console.log(color)
    })
    .on('colorremove', (picker, color) => {
        console.log(color)
    });
// console.log(pickers[0].color = '#fd0a');
// console.log(pickers[0].color);
// // console.log(pickers[0].getColor('hex'));
// console.log(AColorPicker.parseColor(pickers[0].color, 'hex'));