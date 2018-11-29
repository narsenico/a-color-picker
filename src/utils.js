/**
 * a-color-picker - utility library
 * https://github.com/narsenico/a-color-picker
 * 
 * Copyright (c) 2017-2018, Gianfranco Caldi.
 * Released under the MIT License.
 */

import isPlainObject from 'is-plain-object';

const COLOR_NAMES = { 'aliceblue': '#F0F8FF', 'antiquewhite': '#FAEBD7', 'aqua': '#00FFFF', 'aquamarine': '#7FFFD4', 'azure': '#F0FFFF', 'beige': '#F5F5DC', 'bisque': '#FFE4C4', 'black': '#000000', 'blanchedalmond': '#FFEBCD', 'blue': '#0000FF', 'blueviolet': '#8A2BE2', 'brown': '#A52A2A', 'burlywood': '#DEB887', 'cadetblue': '#5F9EA0', 'chartreuse': '#7FFF00', 'chocolate': '#D2691E', 'coral': '#FF7F50', 'cornflowerblue': '#6495ED', 'cornsilk': '#FFF8DC', 'crimson': '#DC143C', 'cyan': '#00FFFF', 'darkblue': '#00008B', 'darkcyan': '#008B8B', 'darkgoldenrod': '#B8860B', 'darkgray': '#A9A9A9', 'darkgrey': '#A9A9A9', 'darkgreen': '#006400', 'darkkhaki': '#BDB76B', 'darkmagenta': '#8B008B', 'darkolivegreen': '#556B2F', 'darkorange': '#FF8C00', 'darkorchid': '#9932CC', 'darkred': '#8B0000', 'darksalmon': '#E9967A', 'darkseagreen': '#8FBC8F', 'darkslateblue': '#483D8B', 'darkslategray': '#2F4F4F', 'darkslategrey': '#2F4F4F', 'darkturquoise': '#00CED1', 'darkviolet': '#9400D3', 'deeppink': '#FF1493', 'deepskyblue': '#00BFFF', 'dimgray': '#696969', 'dimgrey': '#696969', 'dodgerblue': '#1E90FF', 'firebrick': '#B22222', 'floralwhite': '#FFFAF0', 'forestgreen': '#228B22', 'fuchsia': '#FF00FF', 'gainsboro': '#DCDCDC', 'ghostwhite': '#F8F8FF', 'gold': '#FFD700', 'goldenrod': '#DAA520', 'gray': '#808080', 'grey': '#808080', 'green': '#008000', 'greenyellow': '#ADFF2F', 'honeydew': '#F0FFF0', 'hotpink': '#FF69B4', 'indianred ': '#CD5C5C', 'indigo ': '#4B0082', 'ivory': '#FFFFF0', 'khaki': '#F0E68C', 'lavender': '#E6E6FA', 'lavenderblush': '#FFF0F5', 'lawngreen': '#7CFC00', 'lemonchiffon': '#FFFACD', 'lightblue': '#ADD8E6', 'lightcoral': '#F08080', 'lightcyan': '#E0FFFF', 'lightgoldenrodyellow': '#FAFAD2', 'lightgray': '#D3D3D3', 'lightgrey': '#D3D3D3', 'lightgreen': '#90EE90', 'lightpink': '#FFB6C1', 'lightsalmon': '#FFA07A', 'lightseagreen': '#20B2AA', 'lightskyblue': '#87CEFA', 'lightslategray': '#778899', 'lightslategrey': '#778899', 'lightsteelblue': '#B0C4DE', 'lightyellow': '#FFFFE0', 'lime': '#00FF00', 'limegreen': '#32CD32', 'linen': '#FAF0E6', 'magenta': '#FF00FF', 'maroon': '#800000', 'mediumaquamarine': '#66CDAA', 'mediumblue': '#0000CD', 'mediumorchid': '#BA55D3', 'mediumpurple': '#9370DB', 'mediumseagreen': '#3CB371', 'mediumslateblue': '#7B68EE', 'mediumspringgreen': '#00FA9A', 'mediumturquoise': '#48D1CC', 'mediumvioletred': '#C71585', 'midnightblue': '#191970', 'mintcream': '#F5FFFA', 'mistyrose': '#FFE4E1', 'moccasin': '#FFE4B5', 'navajowhite': '#FFDEAD', 'navy': '#000080', 'oldlace': '#FDF5E6', 'olive': '#808000', 'olivedrab': '#6B8E23', 'orange': '#FFA500', 'orangered': '#FF4500', 'orchid': '#DA70D6', 'palegoldenrod': '#EEE8AA', 'palegreen': '#98FB98', 'paleturquoise': '#AFEEEE', 'palevioletred': '#DB7093', 'papayawhip': '#FFEFD5', 'peachpuff': '#FFDAB9', 'peru': '#CD853F', 'pink': '#FFC0CB', 'plum': '#DDA0DD', 'powderblue': '#B0E0E6', 'purple': '#800080', 'rebeccapurple': '#663399', 'red': '#FF0000', 'rosybrown': '#BC8F8F', 'royalblue': '#4169E1', 'saddlebrown': '#8B4513', 'salmon': '#FA8072', 'sandybrown': '#F4A460', 'seagreen': '#2E8B57', 'seashell': '#FFF5EE', 'sienna': '#A0522D', 'silver': '#C0C0C0', 'skyblue': '#87CEEB', 'slateblue': '#6A5ACD', 'slategray': '#708090', 'slategrey': '#708090', 'snow': '#FFFAFA', 'springgreen': '#00FF7F', 'steelblue': '#4682B4', 'tan': '#D2B48C', 'teal': '#008080', 'thistle': '#D8BFD8', 'tomato': '#FF6347', 'turquoise': '#40E0D0', 'violet': '#EE82EE', 'wheat': '#F5DEB3', 'white': '#FFFFFF', 'whitesmoke': '#F5F5F5', 'yellow': '#FFFF00', 'yellowgreen': '#9ACD32' };
const PALETTE_MATERIAL_500 = ['#F44336', '#E91E63', '#E91E63', '#9C27B0', '#9C27B0', '#673AB7', '#673AB7', '#3F51B5', '#3F51B5', '#2196F3', '#2196F3', '#03A9F4', '#03A9F4', '#00BCD4', '#00BCD4', '#009688', '#009688', '#4CAF50', '#4CAF50', '#8BC34A', '#8BC34A', '#CDDC39', '#CDDC39', '#FFEB3B', '#FFEB3B', '#FFC107', '#FFC107', '#FF9800', '#FF9800', '#FF5722', '#FF5722', '#795548', '#795548', '#9E9E9E', '#9E9E9E', '#607D8B', '#607D8B'];
const PALETTE_MATERIAL_CHROME = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#9e9e9e', '#607d8b'];

function limit(value, min, max) {
    value = +value;
    return isNaN(value) ? min : (value < min ? min : (value > max ? max : value));
}

function nvl(value, def) {
    return value === null || value === undefined ? def : value;
}

function ensureArray(arrayLike) {
    if (!arrayLike) return [];
    return Array.from(arrayLike);
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
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = (2 * l) - q;

        r = hue2rgb(p, q, h + (1 / 3));
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - (1 / 3));
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

    const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d) + (g < b ? 6 : 0);
                break;
            case g:
                h = ((b - r) / d) + 2;
                break;
            case b:
                h = ((r - g) / d) + 4;
                break;
        }

        h /= 6;
    }

    return [h * 360, s * 100, l * 100].map(Math.round);
}


/**
 * Converte from RGB to HSV.
 * 
 * @param      {number}  r       rosso 0-255
 * @param      {number}  g       veerde 0-255
 * @param      {number}  b       blu 0-255
 * @return     {Array}   un array con H(0-360) S(0-100) V(0-100)
 */
function rgbToHsv(r, g, b) {
    [r, g, b] = [limit(r, 0, 255) / 255, limit(g, 0, 255) / 255, limit(b, 0, 255) / 255];
    const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h, s, v = max;
    let d = max - min;
    s = max === 0 ? 0 : d / max;
    if(max == min) {
        h = 0;
    } else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, v];
}

function rgbToInt(r, g, b) {
    return (r << 16) | (g << 8) | b;
}

function intToRgb(int) {
    return [
        (int >> 16) & 255, //r
        (int >> 8) & 255, //g
        int & 255 //b
    ];
}

/**
 * @deprecated  usare cssColorToRgba()
 * @param {string} color 
 */
function cssColorToRgb(color) {
    if (color) {
        const colorByName = COLOR_NAMES[color.toString().toLowerCase()];
        // considero sia il formato esteso #RRGGGBB che quello corto #RGB
        // provo a estrarre i valori da colorByName solo se questo è valorizzato, altrimenti uso direttamente color
        const [, , , r, g, b, , rr, gg, bb] = /^\s*#?((([0-9A-F])([0-9A-F])([0-9A-F]))|(([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})))\s*$/i.exec(colorByName || color) || [];
        if (r !== undefined) {
            return [
                parseInt(r + r, 16),
                parseInt(g + g, 16),
                parseInt(b + b, 16)
            ];
        } else if (rr !== undefined) {
            return [
                parseInt(rr, 16),
                parseInt(gg, 16),
                parseInt(bb, 16)
            ];
        }
    }
    return undefined;
}

function cssColorToRgba(color) {
    if (color) {
        const colorByName = COLOR_NAMES[color.toString().toLowerCase()];
        // considero sia il formato esteso #RRGGGBB[AA] che quello corto #RGB[A]
        // provo a estrarre i valori da colorByName solo se questo è valorizzato, altrimenti uso direttamente color
        const [, , , r, g, b, a, , rr, gg, bb, aa] = /^\s*#?((([0-9A-F])([0-9A-F])([0-9A-F])([0-9A-F])?)|(([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})?))\s*$/i.exec(colorByName || color) || [];
        if (r !== undefined) {
            return [
                parseInt(r + r, 16),
                parseInt(g + g, 16),
                parseInt(b + b, 16),
                a ? +((parseInt(a + a, 16)) / 255).toFixed(2) : 1
            ];
        } else if (rr !== undefined) {
            return [
                parseInt(rr, 16),
                parseInt(gg, 16),
                parseInt(bb, 16),
                aa ? +((parseInt(aa, 16)) / 255).toFixed(2) : 1
            ];
        }
    }
    return undefined;
}

/**
 * @deprecated  usare cssRgbaToRgba()
 * @param {string} rgb 
 */
function cssRgbToRgb(rgb) {
    if (rgb) {
        // rgb(int, int, int)
        const [m, r, g, b] = /^rgb\((\d+)[\s,](\d+)[\s,](\d+)\)/i.exec(rgb) || [];
        return m ? [limit(r, 0, 255), limit(g, 0, 255), limit(b, 0, 255)] : undefined;
    }
    return undefined;
}

function cssRgbaToRgba(rgba) {
    if (rgba) {
        // in CSS Colors Level 4 rgba() è un alias di rgb()
        // rgb[a](int, int, int[, dec])
        const [m, r, g, b, , a] = /^rgba?\((\d+)\s*[\s,]\s*(\d+)\s*[\s,]\s*(\d+)(\s*[\s,]\s*(\d*(.\d+)?))?\)/i.exec(rgba) || [];
        return m ? [limit(r, 0, 255), limit(g, 0, 255), limit(b, 0, 255), limit(nvl(a, 1), 0, 1)] : undefined;
    }
    return undefined;
}

/**
 * Converte il colore in ingresso nel formato [r,g,b].
 * Color può assumere questi valori:
 * - array con [r,g,b] (viene ritornato così come è)
 * - nome del colore
 * - colore nel formato RGB HEX sia compatto che esteso
 *
 * @param      {string|array}    color   Il colore da convertire
 * @return     {array}  colore nel formato [r,g,b] o undefined se non valido
 */
function parseColorToRgb(color) {
    if (Array.isArray(color)) {
        color = [limit(color[0], 0, 255), limit(color[1], 0, 255), limit(color[2], 0, 255)];
        return color;
    } else {
        return cssColorToRgb(color) || cssRgbToRgb(color);
    }
}

function parseColorToRgba(color) {
    if (Array.isArray(color)) {
        color = [
            limit(color[0], 0, 255),
            limit(color[1], 0, 255),
            limit(color[2], 0, 255),
            limit(nvl(color[3], 1), 0, 1)
        ];
        return color;
    } else {
        const parsed = cssColorToRgba(color) || cssRgbaToRgba(color);
        if (parsed && parsed.length === 3) {
            parsed.push(1);
        }
        return parsed;
    }
}

/**
 * @deprecated  usare cssHslaToHsla()
 * @param {string} hsl 
 */
function cssHslToHsl(hsl) {
    if (hsl) {
        // hsl(int, int, int)
        const [m, h, s, l] = /^hsl\((\d+)[\s,](\d+)[\s,](\d+)\)/i.exec(hsl) || [];
        return m ? [limit(h, 0, 360), limit(s, 0, 100), limit(l, 0, 100)] : undefined;
    }
    return undefined;
}

function cssHslaToHsla(hsla) {
    if (hsla) {
        // in CSS Colors Level 4 hsla() è un alias di hsl()
        // hsl[a](int, int, int[, dec])
        const [m, h, s, l, , a] = /^hsla?\((\d+)\s*[\s,]\s*(\d+)\s*[\s,]\s*(\d+)(\s*[\s,]\s*(\d*(.\d+)?))?\)/i.exec(hsla) || [];
        return m ? [limit(h, 0, 255), limit(s, 0, 255), limit(l, 0, 255), limit(nvl(a, 1), 0, 1)] : undefined;
    }
    return undefined;
}

function parseColorToHsl(color) {
    if (Array.isArray(color)) {
        color = [limit(color[0], 0, 360), limit(color[1], 0, 100), limit(color[2], 0, 100)];
        return color;
    } else {
        return cssHslToHsl(color);
    }
}

function parseColorToHsla(color) {
    if (Array.isArray(color)) {
        color = [
            limit(color[0], 0, 360),
            limit(color[1], 0, 100),
            limit(color[2], 0, 100),
            limit(nvl(color[3], 1), 0, 1)
        ];
        return color;
    } else {
        const parsed = cssHslaToHsla(color);
        if (parsed && parsed.length === 3) {
            parsed.push(1);
        }
        return parsed;
    }
}

/**
 * TODO: i formati *css4 devono restituire alpha solo se questa è < 1
 * 
 * outFormat può assumere questi valori:
 * rgb (default), rgbcss, rgbcss4, rgba, rgbacss, hsl, hslcss, hslcss4, hsla, hslacss, hex, hexcss4, int
 * 
 * se outFormat è un oggetto (typeof 'object') gli vengono aggiunte tante proprietà 
 * quanti sono i formati supportati e i rispettivi valori
 * 
 * @param   {any} color 
 * @param   {String|Object} outFormat formato output
 * @return  {String} colore formattato o undefined se non riconosciuto
 */
function parseColor(color, outFormat) {
    outFormat = (outFormat || 'rgb');
    if (color !== null && color !== undefined) {
        let pp;
        if ((pp = parseColorToRgba(color)) ||
            ((pp = parseColorToHsla(color)) && (pp = [...hslToRgb(...pp), pp[3]]))) {

            // se outFormat è un plain object quindi {} oppure new Object()
            // if (typeof outFormat === 'object') {
            if (isPlainObject(outFormat)) {
                return ['rgb', 'rgbcss', 'rgbcss4', 'rgba', 'rgbacss',
                    'hsl', 'hslcss', 'hslcss4', 'hsla', 'hslacss',
                    'hex', 'hexcss4', 'int'].reduce((m, f) => { m[f] = formatColor(pp, f); return m; }, outFormat || {});
            } else {
                // per sicurezza trasformo in stringa (potrebbe essere un numero)
                return formatColor(pp, outFormat.toString().toLowerCase());
            }
        }
    }

    return undefined;
}

/**
 * 
 * @private
 * @param {Array} pp rgba
 * @param {String} outFormat 
 */
function formatColor(pp, outFormat) {
    switch (outFormat) {
        case 'rgb':
        default:
            return pp.slice(0, 3);
        case 'rgbcss':
            return `rgb(${pp[0]}, ${pp[1]}, ${pp[2]})`;
        case 'rgbcss4':
            return `rgb(${pp[0]}, ${pp[1]}, ${pp[2]}, ${pp[3]})`;
        case 'rgba':
            return pp;
        case 'rgbacss':
            return `rgba(${pp[0]}, ${pp[1]}, ${pp[2]}, ${pp[3]})`;
        case 'hsl':
            return rgbToHsl(...pp);
        case 'hslcss':
            pp = rgbToHsl(...pp);
            return `hsl(${pp[0]}, ${pp[1]}, ${pp[2]})`;
        case 'hslcss4':
            const hh = rgbToHsl(...pp);
            return `hsl(${hh[0]}, ${hh[1]}, ${hh[2]}, ${pp[3]})`;
        case 'hsla':
            return [...rgbToHsl(...pp), pp[3]];
        case 'hslacss':
            const ha = rgbToHsl(...pp);
            return `hsla(${ha[0]}, ${ha[1]}, ${ha[2]}, ${pp[3]})`;
        case 'hex':
            return rgbToHex(...pp);
        case 'hexcss4':
            return rgbToHex(...pp) + ('00' + parseInt(pp[3] * 255).toString(16)).slice(-2);
        case 'int':
            return rgbToInt(...pp);
    }
}

/**
 * Più il risultato tende a 1 e più è luminoso.
 * 
 * @param       {number} r red
 * @param       {number} g green
 * @param       {number} b blue
 * @return      {number} la luminosità da 0 (scuro) a 1 (chiaro)
 */
function getLuminance(r, g, b) {
    r = r / 255;
    r = r < 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    g = g / 255;
    g = g < 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    b = b / 255;
    b = b < 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    return (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
}

export {
    COLOR_NAMES,
    PALETTE_MATERIAL_500,
    PALETTE_MATERIAL_CHROME,
    rgbToHex,
    hslToRgb,
    rgbToHsl,
    rgbToHsv,
    rgbToInt,
    intToRgb,
    cssColorToRgb,
    cssColorToRgba,
    cssRgbToRgb,
    cssRgbaToRgba,
    parseColorToRgb,
    parseColorToRgba,
    cssHslToHsl,
    cssHslaToHsla,
    parseColorToHsl,
    parseColorToHsla,
    parseColor,
    getLuminance,
    limit,
    ensureArray,
    nvl
};