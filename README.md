# a-color-picker
A color picker for web app

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![live demo](https://img.shields.io/badge/demo-codepen-yellow.svg)](https://codepen.io/narsenico/pen/xPxNeE)

![a-color-picker screenshot](/screenshot.png)

## Usage
1. Include `acolorpicker.js`
    ```html
    <script type="text/javascript" src="acolorpicker.js"></script>
    ```
    or require `a-color-picker`
    ```js
    const AColorPicker = require('a-color-picker');
    ```
2. Call this JavaScript function
    ```js
    AColorPicker.createPicker('div.container');
    ```

## How to
### Create a color picker
Call AColorPicker.createPicker() function.
```js
// passing a valid css selector 
AColorPicker.createPicker('div.container');

// or HTML element
AColorPicker.createPicker(document.querySelector('div.container'));

// or options
AColorPicker.createPicker({
	attachTo: 'div.container',
	color: 'green'
});
```
Options:
- `attachTo`: (*String|Object*) Where to attach the picker top element. Can be HTMLElement or css selector. Default **body**.
- `showHSL`: (*Boolean*) If falsy hide the HSL inputs. Default **true**.
- `showRGB`: (*Boolean*) If falsy hide the RGB inputs. Default **true**.
- `showHEX`: (*Boolean*) If falsy hide the RGB HEX inputs. Default **true**.
- `color`: (*Boolean*) Initial color. Default **#ff0000**.

### Listen for color change
Set onchange property with a handler function.
```js
AColorPicker.createPicker('div.container')
	.onchange = (picker) => {
		alert(picker.color);
	};
```
The single argument passed to the specified function is the picker.

### Get current color
Using the properties of the picker.
```js
const picker = AColorPicker.createPicker({
	attachTo: 'div.container',
	color: 'green'
});
// rgb array
picker.rgb; // return [0, 128, 0]
// hsl array
picker.hsl; // return [120, 100 ,25]
// rgb hex format
picker.color; // return '#008000'
```

### Set current color
Using the properties of the picker.
```js
const picker = AColorPicker.createPicker({
	attachTo: 'div.container',
	color: 'green'
});
// rgb array
picker.rgb = [0, 128, 0];
// hsl array
picker.hsl = [120, 100 ,25];
// rgb hex format
picker.color = '#008000';
picker.color = '#fd0';
// color name
picker.color = 'green';
```

## Utilities
`COLOR_NAMES`: Object where key is the color name, and value is the rgb hex value.
```js
AColorPicker.COLOR_NAMES['seagreen']; // return #2E8B57
```
`hslToRgb(h, s, l)`: h is a number between 0 and 360; s and l between 0 and 100.
```js
AColorPicker.hslToRgb(106, 60, 48); // return [83, 196, 49]
```
`rgbToHsl(r, g, b)`: r, g and b are number between 0 and 255.
```js
AColorPicker.rgbToHsl(83, 196, 49); // return [106, 60, 48]
```
`rgbToHex(r, g, b)`: r, g and b are number between 0 and 255.
```js
AColorPicker.rgbToHex(83, 196, 49); // return '#53c431'
```
`rgbToInt(r, g, b)`: r, g and b are number between 0 and 255.
```js
AColorPicker.rgbToInt(83, 196, 49); // return 5489713
```
`intToRgb(int)`: int is a number between 0 and 16777215.
```js
AColorPicker.intToRgb(5489713); // return [83, 196, 49]
```