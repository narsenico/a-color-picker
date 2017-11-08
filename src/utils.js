'use strict';

const COLOR_NAMES = { 'aliceblue': '#F0F8FF', 'antiquewhite': '#FAEBD7', 'aqua': '#00FFFF', 'aquamarine': '#7FFFD4', 'azure': '#F0FFFF', 'beige': '#F5F5DC', 'bisque': '#FFE4C4', 'black': '#000000', 'blanchedalmond': '#FFEBCD', 'blue': '#0000FF', 'blueviolet': '#8A2BE2', 'brown': '#A52A2A', 'burlywood': '#DEB887', 'cadetblue': '#5F9EA0', 'chartreuse': '#7FFF00', 'chocolate': '#D2691E', 'coral': '#FF7F50', 'cornflowerblue': '#6495ED', 'cornsilk': '#FFF8DC', 'crimson': '#DC143C', 'cyan': '#00FFFF', 'darkblue': '#00008B', 'darkcyan': '#008B8B', 'darkgoldenrod': '#B8860B', 'darkgray': '#A9A9A9', 'darkgrey': '#A9A9A9', 'darkgreen': '#006400', 'darkkhaki': '#BDB76B', 'darkmagenta': '#8B008B', 'darkolivegreen': '#556B2F', 'darkorange': '#FF8C00', 'darkorchid': '#9932CC', 'darkred': '#8B0000', 'darksalmon': '#E9967A', 'darkseagreen': '#8FBC8F', 'darkslateblue': '#483D8B', 'darkslategray': '#2F4F4F', 'darkslategrey': '#2F4F4F', 'darkturquoise': '#00CED1', 'darkviolet': '#9400D3', 'deeppink': '#FF1493', 'deepskyblue': '#00BFFF', 'dimgray': '#696969', 'dimgrey': '#696969', 'dodgerblue': '#1E90FF', 'firebrick': '#B22222', 'floralwhite': '#FFFAF0', 'forestgreen': '#228B22', 'fuchsia': '#FF00FF', 'gainsboro': '#DCDCDC', 'ghostwhite': '#F8F8FF', 'gold': '#FFD700', 'goldenrod': '#DAA520', 'gray': '#808080', 'grey': '#808080', 'green': '#008000', 'greenyellow': '#ADFF2F', 'honeydew': '#F0FFF0', 'hotpink': '#FF69B4', 'indianred ': '#CD5C5C', 'indigo ': '#4B0082', 'ivory': '#FFFFF0', 'khaki': '#F0E68C', 'lavender': '#E6E6FA', 'lavenderblush': '#FFF0F5', 'lawngreen': '#7CFC00', 'lemonchiffon': '#FFFACD', 'lightblue': '#ADD8E6', 'lightcoral': '#F08080', 'lightcyan': '#E0FFFF', 'lightgoldenrodyellow': '#FAFAD2', 'lightgray': '#D3D3D3', 'lightgrey': '#D3D3D3', 'lightgreen': '#90EE90', 'lightpink': '#FFB6C1', 'lightsalmon': '#FFA07A', 'lightseagreen': '#20B2AA', 'lightskyblue': '#87CEFA', 'lightslategray': '#778899', 'lightslategrey': '#778899', 'lightsteelblue': '#B0C4DE', 'lightyellow': '#FFFFE0', 'lime': '#00FF00', 'limegreen': '#32CD32', 'linen': '#FAF0E6', 'magenta': '#FF00FF', 'maroon': '#800000', 'mediumaquamarine': '#66CDAA', 'mediumblue': '#0000CD', 'mediumorchid': '#BA55D3', 'mediumpurple': '#9370DB', 'mediumseagreen': '#3CB371', 'mediumslateblue': '#7B68EE', 'mediumspringgreen': '#00FA9A', 'mediumturquoise': '#48D1CC', 'mediumvioletred': '#C71585', 'midnightblue': '#191970', 'mintcream': '#F5FFFA', 'mistyrose': '#FFE4E1', 'moccasin': '#FFE4B5', 'navajowhite': '#FFDEAD', 'navy': '#000080', 'oldlace': '#FDF5E6', 'olive': '#808000', 'olivedrab': '#6B8E23', 'orange': '#FFA500', 'orangered': '#FF4500', 'orchid': '#DA70D6', 'palegoldenrod': '#EEE8AA', 'palegreen': '#98FB98', 'paleturquoise': '#AFEEEE', 'palevioletred': '#DB7093', 'papayawhip': '#FFEFD5', 'peachpuff': '#FFDAB9', 'peru': '#CD853F', 'pink': '#FFC0CB', 'plum': '#DDA0DD', 'powderblue': '#B0E0E6', 'purple': '#800080', 'rebeccapurple': '#663399', 'red': '#FF0000', 'rosybrown': '#BC8F8F', 'royalblue': '#4169E1', 'saddlebrown': '#8B4513', 'salmon': '#FA8072', 'sandybrown': '#F4A460', 'seagreen': '#2E8B57', 'seashell': '#FFF5EE', 'sienna': '#A0522D', 'silver': '#C0C0C0', 'skyblue': '#87CEEB', 'slateblue': '#6A5ACD', 'slategray': '#708090', 'slategrey': '#708090', 'snow': '#FFFAFA', 'springgreen': '#00FF7F', 'steelblue': '#4682B4', 'tan': '#D2B48C', 'teal': '#008080', 'thistle': '#D8BFD8', 'tomato': '#FF6347', 'turquoise': '#40E0D0', 'violet': '#EE82EE', 'wheat': '#F5DEB3', 'white': '#FFFFFF', 'whitesmoke': '#F5F5F5', 'yellow': '#FFFF00', 'yellowgreen': '#9ACD32' };
const PALETTE_MATERIAL_500 = ['#F44336', '#E91E63', '#E91E63', '#9C27B0', '#9C27B0', '#673AB7', '#673AB7', '#3F51B5', '#3F51B5', '#2196F3', '#2196F3', '#03A9F4', '#03A9F4', '#00BCD4', '#00BCD4', '#009688', '#009688', '#4CAF50', '#4CAF50', '#8BC34A', '#8BC34A', '#CDDC39', '#CDDC39', '#FFEB3B', '#FFEB3B', '#FFC107', '#FFC107', '#FF9800', '#FF9800', '#FF5722', '#FF5722', '#795548', '#795548', '#9E9E9E', '#9E9E9E', '#607D8B', '#607D8B'];
const PALETTE_MATERIAL_CHROME = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#9e9e9e', '#607d8b']

function limit(value, min, max) {
    value = +value;
    return isNaN(value) ? min : value < min ? min : value > max ? max : value;
}

/**
 * Converte il colore da [r,g,b] al formato RGB HEX.
 *
 * @param      {number}  r       rosso (0-255)
 * @param      {number}  g       verde (0-255)
 * @param      {number}  b       blu (0-255)
 * @return     {string}  colore nel fomrato RGB HX (es: #ffdd00)
 */
function rgbToHex(r, g, b) {
    [r, g, b] = [limit(r, 0, 255), limit(g, 0, 255), limit(b, 0, 255)];
    return "#" + ("000000" + ((r << 16) | (g << 8) | b).toString(16)).slice(-6);
}

/**
 * Converte da HSL a RGB.
 * @see https://gist.github.com/mjackson/5311256
 *
 * @param      {number}                   h       hue 0-360
 * @param      {number}                   s       saturaion 0-100
 * @param      {(Function|number)}        l       luminance 0-100
 * @return     {Array}  un array con R(0-255) G(0-255) B(0-255)
 */
function hslToRgb(h, s, l) {
    let r, g, b;
    [h, s, l] = [limit(h, 0, 360) / 360, limit(s, 0, 100) / 100, limit(l, 0, 100) / 100];

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255].map(Math.round);
}

/**
 * Converte da RGB a HSL.
 * @see https://gist.github.com/mjackson/5311256
 * 
 * @param      {number}  r       rosso 0-255
 * @param      {number}  g       veerde 0-255
 * @param      {number}  b       blu 0-255
 * @return     {Array}   un array con H(0-360) S(0-100) L(0-100)
 */
function rgbToHsl(r, g, b) {
    [r, g, b] = [limit(r, 0, 255) / 255, limit(g, 0, 255) / 255, limit(b, 0, 255) / 255];

    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
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

        h /= 6;
    }

    return [h * 360, s * 100, l * 100].map(Math.round);
}

function rgbToInt(r, g, b) {
    return r << 16 | g << 8 | b;
}

function intToRgb(int) {
    return [
        (int >> 16) & 255, //r
        (int >> 8) & 255, //g
        int & 255 //b
    ];
}

export {
    COLOR_NAMES,
    PALETTE_MATERIAL_500,
    PALETTE_MATERIAL_CHROME,
    rgbToHex,
    hslToRgb,
    rgbToHsl,
    rgbToInt,
    intToRgb
}