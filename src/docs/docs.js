import './docs.css';
const AColorPicker = require('../main.js');
const body = document.querySelector('body');

[...document.querySelectorAll('.picker')].forEach((el) => {
    AColorPicker.createPicker(el)
        .on('change', (picker) => {
            // body.style.backgroundColor = picker.color;
        });
});