![a-color-picker](https://github.com/Tobaloidee/a-color-picker/blob/master/screenshots/logotype.png)

A color picker for web app

[![npm version](https://badge.fury.io/js/a-color-picker.svg)](https://badge.fury.io/js/a-color-picker) [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![live demo](https://img.shields.io/badge/demo-codepen-yellow.svg)](https://codepen.io/narsenico/pen/xPxNeE)

![a-color-picker screenshot](/screenshots/screenshot.png)
![a-color-picker screenshot](/screenshots/screenshot_alpha.png)

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
- `palette`: (*Array*) Array of predefined colors. Default **null**.
- `paletteEditable`: (*Boolean*) If truly make the palette editable. Default **false**.
- `showAlpha`: (*Boolean*) If truly show control to change opacity. Default **false**.

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
// rgba array
picker.rgba; // return [0, 128, 0, 1]
// hsl array
picker.hsl; // return [120, 100 ,25]
// hsla array
picker.hsla; // return [120, 100 ,25, 1]
// rgb hex format
picker.color; // return '#008000'
// with alpha < 1
picker.color; // return 'rgba(0, 0, 139, 0.37)'

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
// rgba array
picker.rgba = [0, 128, 0, 1];
// hsl array
picker.hsl = [120, 100 ,25];
// hsla array
picker.hsla = [120, 100 ,25, 1];
// rgb hex format
picker.color = '#008000';
picker.color = '#fd0';
// rgba format
picker.color = 'rgba(0, 0, 139, 0.37)';
// color name
picker.color = 'green';
```

### Set up a palette of predefined colors
![a-color-picker palette screenshot](/screenshots/screenshot_palette.png)

Using a default palette.
```js
const picker = AColorPicker.createPicker({
    attachTo: 'div.container',
    palette: AColorPicker.PALETTE_MATERIAL_CHROME
    // palette: AColorPicker.PALETTE_MATERIAL_500
});
```
Or a custon one.
```js
const picker = AColorPicker.createPicker({
    attachTo: 'div.container',
    // color format: name, css hex, rgb array
    palette: ['lightgreen', '#fafafa', '#fdo', [255, 23, 46]]
});
```
With editable palette.

![a-color-picker palette editable screenshot](/screenshots/screenshot_palette_editable.png)
```js
const picker = AColorPicker.createPicker({
    attachTo: 'div.container',
    // color format: name, css hex, rgb array
    palette: ['lightgreen', '#fafafa', '#fdo', [255, 23, 46]],
    // click on + icon to add current color to palette
    // shift+click on color to remove it from palette
    // shift+click on + icon to remove all colors from palette
    paletteEditable: true
});
picker.oncoloradd = (picker, color) => {
    // fired when color is added on palette
}
picker.oncolorremove = (picker, color) => {
    // fired when color is removed from palette
}
// readonly property, return an array of hex colors
picker.palette;
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
`getLuminance(r, g, b)`: r, g and b are number between 0 and 255.
```js
AColorPicker.getLuminance(83, 196, 49); // return 0.41540606322787504
```
