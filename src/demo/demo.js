import './demo.css';
const AColorPicker = require('../main.js');

const body = document.querySelector('body');
const pickers = [...document.querySelectorAll('.picker')].map((el, index) => {
	const picker = AColorPicker.createPicker({
		attachTo: el,
		color: 'brown',
		showRGB: true,
		showHSL: true,
		showHEX: true
	});
	picker.onchange = () => {
		// console.log(index, 'changed', picker.color);
		body.style.backgroundColor = picker.color;
	};
	return (window['p' + index] = picker);
});

function printColor(picker) {
	console.info('rgb', picker.rgb, 'hsl', picker.hsl, 'hex', picker.color);
}

document.querySelector('#btnGetColor').addEventListener('click', () => {
	pickers.forEach(printColor);
});