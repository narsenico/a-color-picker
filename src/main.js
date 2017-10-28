import './main.css';

'use strict';

const DEFAULT = {
    attachTo: 'body',
    showHSL: true,
    showRGB: true,
    showHEX: true,
    color: '#ff0000'
};

const NAMED_COLORS = { 'aliceblue': '#F0F8FF', 'antiquewhite': '#FAEBD7', 'aqua': '#00FFFF', 'aquamarine': '#7FFFD4', 'azure': '#F0FFFF', 'beige': '#F5F5DC', 'bisque': '#FFE4C4', 'black': '#000000', 'blanchedalmond': '#FFEBCD', 'blue': '#0000FF', 'blueviolet': '#8A2BE2', 'brown': '#A52A2A', 'burlywood': '#DEB887', 'cadetblue': '#5F9EA0', 'chartreuse': '#7FFF00', 'chocolate': '#D2691E', 'coral': '#FF7F50', 'cornflowerblue': '#6495ED', 'cornsilk': '#FFF8DC', 'crimson': '#DC143C', 'cyan': '#00FFFF', 'darkblue': '#00008B', 'darkcyan': '#008B8B', 'darkgoldenrod': '#B8860B', 'darkgray': '#A9A9A9', 'darkgrey': '#A9A9A9', 'darkgreen': '#006400', 'darkkhaki': '#BDB76B', 'darkmagenta': '#8B008B', 'darkolivegreen': '#556B2F', 'darkorange': '#FF8C00', 'darkorchid': '#9932CC', 'darkred': '#8B0000', 'darksalmon': '#E9967A', 'darkseagreen': '#8FBC8F', 'darkslateblue': '#483D8B', 'darkslategray': '#2F4F4F', 'darkslategrey': '#2F4F4F', 'darkturquoise': '#00CED1', 'darkviolet': '#9400D3', 'deeppink': '#FF1493', 'deepskyblue': '#00BFFF', 'dimgray': '#696969', 'dimgrey': '#696969', 'dodgerblue': '#1E90FF', 'firebrick': '#B22222', 'floralwhite': '#FFFAF0', 'forestgreen': '#228B22', 'fuchsia': '#FF00FF', 'gainsboro': '#DCDCDC', 'ghostwhite': '#F8F8FF', 'gold': '#FFD700', 'goldenrod': '#DAA520', 'gray': '#808080', 'grey': '#808080', 'green': '#008000', 'greenyellow': '#ADFF2F', 'honeydew': '#F0FFF0', 'hotpink': '#FF69B4', 'indianred ': '#CD5C5C', 'indigo ': '#4B0082', 'ivory': '#FFFFF0', 'khaki': '#F0E68C', 'lavender': '#E6E6FA', 'lavenderblush': '#FFF0F5', 'lawngreen': '#7CFC00', 'lemonchiffon': '#FFFACD', 'lightblue': '#ADD8E6', 'lightcoral': '#F08080', 'lightcyan': '#E0FFFF', 'lightgoldenrodyellow': '#FAFAD2', 'lightgray': '#D3D3D3', 'lightgrey': '#D3D3D3', 'lightgreen': '#90EE90', 'lightpink': '#FFB6C1', 'lightsalmon': '#FFA07A', 'lightseagreen': '#20B2AA', 'lightskyblue': '#87CEFA', 'lightslategray': '#778899', 'lightslategrey': '#778899', 'lightsteelblue': '#B0C4DE', 'lightyellow': '#FFFFE0', 'lime': '#00FF00', 'limegreen': '#32CD32', 'linen': '#FAF0E6', 'magenta': '#FF00FF', 'maroon': '#800000', 'mediumaquamarine': '#66CDAA', 'mediumblue': '#0000CD', 'mediumorchid': '#BA55D3', 'mediumpurple': '#9370DB', 'mediumseagreen': '#3CB371', 'mediumslateblue': '#7B68EE', 'mediumspringgreen': '#00FA9A', 'mediumturquoise': '#48D1CC', 'mediumvioletred': '#C71585', 'midnightblue': '#191970', 'mintcream': '#F5FFFA', 'mistyrose': '#FFE4E1', 'moccasin': '#FFE4B5', 'navajowhite': '#FFDEAD', 'navy': '#000080', 'oldlace': '#FDF5E6', 'olive': '#808000', 'olivedrab': '#6B8E23', 'orange': '#FFA500', 'orangered': '#FF4500', 'orchid': '#DA70D6', 'palegoldenrod': '#EEE8AA', 'palegreen': '#98FB98', 'paleturquoise': '#AFEEEE', 'palevioletred': '#DB7093', 'papayawhip': '#FFEFD5', 'peachpuff': '#FFDAB9', 'peru': '#CD853F', 'pink': '#FFC0CB', 'plum': '#DDA0DD', 'powderblue': '#B0E0E6', 'purple': '#800080', 'rebeccapurple': '#663399', 'red': '#FF0000', 'rosybrown': '#BC8F8F', 'royalblue': '#4169E1', 'saddlebrown': '#8B4513', 'salmon': '#FA8072', 'sandybrown': '#F4A460', 'seagreen': '#2E8B57', 'seashell': '#FFF5EE', 'sienna': '#A0522D', 'silver': '#C0C0C0', 'skyblue': '#87CEEB', 'slateblue': '#6A5ACD', 'slategray': '#708090', 'slategrey': '#708090', 'snow': '#FFFAFA', 'springgreen': '#00FF7F', 'steelblue': '#4682B4', 'tan': '#D2B48C', 'teal': '#008080', 'thistle': '#D8BFD8', 'tomato': '#FF6347', 'turquoise': '#40E0D0', 'violet': '#EE82EE', 'wheat': '#F5DEB3', 'white': '#FFFFFF', 'whitesmoke': '#F5F5F5', 'yellow': '#FFFF00', 'yellowgreen': '#9ACD32' };

const SL_BAR_SIZE = [200, 150],
    HUE_BAR_SIZE = [150, 16],
    HUE = 'H',
    SATURATION = 'S',
    LUMINANCE = 'L',
    RGBA = 'RGBA',
    RED = 'R',
    GREEN = 'G',
    BLUE = 'B',
    RGBHEX = 'RGBHEX',
    COLOR = 'COLOR';

const HTML_BOX = `<div class="a-color-picker-row a-color-picker-stack">
                            <canvas class="a-color-picker-sl"></canvas>
                            <div class="a-color-picker-dot"></div>
                        </div>
                        <div class="a-color-picker-row">
                            <div class="a-color-picker-preview"><input class="a-color-picker-clipbaord" type="text"></div>
                            <div class="a-color-picker-stack">
                                <canvas class="a-color-picker-h"></canvas>
                                <div class="a-color-picker-dot"></div>
                            </div>
                        </div>
                        <div class="a-color-picker-row a-color-picker-hsl">
                            <label>H</label>
                            <input name="H" type="number" maxlength="3" min="0" max="360" value="0">
                            <label>S</label>
                            <input name="S" type="number" maxlength="3" min="0" max="100" value="0">
                            <label>L</label>
                            <input name="L" type="number" maxlength="3" min="0" max="100" value="0">
                        </div>
                        <div class="a-color-picker-row a-color-picker-rgb">
                            <label>R</label>
                            <input name="R" type="number" maxlength="3" min="0" max="255" value="0">
                            <label>G</label>
                            <input name="G" type="number" maxlength="3" min="0" max="255" value="0">
                            <label>B</label>
                            <input name="B" type="number" maxlength="3" min="0" max="255" value="0">
                        </div>
                        <div class="a-color-picker-row a-color-picker-single-input">
                            <label>HEX</label>
                            <input name="RGBHEX" type="text" maxlength="7">
                        </div>`;

function parseElemnt(element, defaultElement, fallToDefault) {
    if (!element) {
        return defaultElement;
    } else if (element instanceof HTMLElement) {
        return element;
    } else if (element instanceof NodeList) {
        return element[0];
    } else if (typeof element == 'string') {
        return document.querySelector(element);
        // } else if ($ && element.jquery) {
        //     return element.get(0);
    } else if (fallToDefault) {
        return defaultElement;
    } else {
        return null;
    }
}

function canvasHelper(canvas) {
    const ctx = canvas.getContext('2d'),
        width = +canvas.width,
        height = +canvas.height;
    // questo gradiente da bianco (alto) a nero (basso) viene applicato come sfondo al canvas
    const whiteBlackGradient = ctx.createLinearGradient(1, 1, 1, height - 1);
    whiteBlackGradient.addColorStop(0, 'white');
    whiteBlackGradient.addColorStop(1, 'black');
    return {
        setHue(hue) {
            // gradiente con il colore relavito a lo HUE da sinistra a destra partendo da trasparente a opaco
            // la combinazione del gradiente bianco/nero e questo permette di avere un canvas dove 
            // sull'asse delle ordinate è espressa la saturazione, e sull'asse delle ascisse c'è la luminosità
            const colorGradient = ctx.createLinearGradient(0, 0, width - 1, 0);
            colorGradient.addColorStop(0, `hsla(${hue}, 100%, 50%, 0)`);
            colorGradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 1)`);
            // applico i gradienti
            ctx.fillStyle = whiteBlackGradient;
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = colorGradient;
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'source-over';
        },

        grabColor(x, y) {
            // recupera il colore del pixel in formato RGBA
            return ctx.getImageData(x, y, 1, 1).data;
        },

        findColor(r, g, b) {
            // TODO: se la luminosità è bassa posso controllare prima la parte inferiore
            const rowLen = width * 4,
                // visto che non sono sicuro di trovare il colore esatto considero un gap in + e - su tutti i 3 valori
                gap = 5,
                // array contenente tutti i pixel, ogni pixel sono 4 byte RGBA (quindi è grande w*h*4)
                data = ctx.getImageData(0, 0, width, height).data;
            let coord = [-1, -1];
            // console.log(data.length, r, g, b)
            // console.log(data)
            // console.time('findColor');
            // scorro l'array di pixel, ogni 4 byte c'è un pixel nuovo
            for (let ii = 0; ii < data.length; ii += 4) {
                if (Math.abs(data[ii] - r) <= gap &&
                    Math.abs(data[ii + 1] - g) <= gap &&
                    Math.abs(data[ii + 2] - b) <= gap) {
                    // console.log('found', ii, Math.floor(ii/rowLen), (ii%rowLen)/4);
                    coord = [(ii % rowLen) / 4, Math.floor(ii / rowLen)];
                    break;
                }
            }
            // console.timeEnd('findColor');
            return coord;
        }
    }
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
    if (r > 255 || g > 255 || b > 255)
        throw 'Invalid color component';
    return "#" + ("000000" + ((r << 16) | (g << 8) | b).toString(16)).slice(-6);
}

function cssColorToRgb(color) {
    if (color) {
        const colorByName = NAMED_COLORS[color.toString().toLowerCase()];
        // considero sia il formato esteso #RRGGGBB che quello corto #RGB
        // provo a estrarre i valori da colorByName solo se questo è valorizzato, altrimenti uso direttamente color
        const [, , , r, g, b, , rr, gg, bb] = /^\s*#?((([0-9A-F])([0-9A-F])([0-9A-F]))|(([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})))\s*$/i.exec(colorByName || color) || [];
        if (r !== undefined) return [parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16)];
        else if (rr !== undefined) return [parseInt(rr, 16), parseInt(gg, 16), parseInt(bb, 16)];
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
        return color;
    } else {
        const parsed = cssColorToRgb(color);
        if (parsed) {
            return parsed;
        } else {
            // TODO: considerare il formato rgb(), rgba(), hsl() e hsla()
        }
    }
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
    [r, g, b] = [r / 255, g / 255, b / 255];

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
    var r, g, b;
    [h, s, l] = [h / 360, s / 100, l / 100];

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

function rgbToInt(r, g, b) {
    r = (r << 16) & 0x00FF0000;
    g = (g << 8) & 0x0000FF00;
    b = b & 0x000000FF;
    return 0xFF000000 | r | g | b;
}

function intToRgb(value) {
    return [
        (value >> 16) & 255, //r
        (value >> 8) & 255, //g
        value & 255 //b
    ];
}

function limit(value, min, max) {
    return value < min ? min : value > max ? max : value;
}

class ColorPicker {
    constructor(options) {
        this.options = Object.assign({}, DEFAULT, options);
        this.H = 0;
        this.S = 0;
        this.L = 0;
        this.R = 0;
        this.G = 0;
        this.B = 0;

        // creo gli elementi HTML e li aggiungo al container
        const container = parseElemnt(this.options.attachTo);
        if (container) {
            const box = document.createElement('div');
            box.className = 'a-color-picker';
            // se falsy viene nascosto .a-color-picker-rgb
            if (!this.options.showRGB) box.className += ' hide-rgb';
            // se falsy viene nascosto .a-color-picker-hsl
            if (!this.options.showHSL) box.className += ' hide-hsl';
            // se falsy viene nascosto .a-color-picker-single-input (css hex)
            if (!this.options.showHEX) box.className += ' hide-single-input';
            box.innerHTML = HTML_BOX;
            container.appendChild(box);
            // preparo il canvas con tutto lo spettro del HUE (da 0 a 360)
            // in base al valore selezionato su questo canvas verrà disegnato il canvas per SL
            const hueBar = container.querySelector('.a-color-picker-h');
            this.setupHueCanvas(hueBar);
            this.hueBarHelper = canvasHelper(hueBar);
            this.huePointer = container.querySelector('.a-color-picker-h+.a-color-picker-dot');
            // preparo il canvas per SL (saturation e luminance)
            const slBar = container.querySelector('.a-color-picker-sl');
            this.setupSlCanvas(slBar);
            this.slBarHelper = canvasHelper(slBar);
            this.slPointer = container.querySelector('.a-color-picker-sl+.a-color-picker-dot');
            // preparo il box della preview
            this.preview = container.querySelector('.a-color-picker-preview');
            this.setupClipboard(this.preview.querySelector('.a-color-picker-clipbaord'));
            // prearo gli input box
            this.setupInput(this.inputH = container.querySelector('.a-color-picker-hsl>input[name=H]'));
            this.setupInput(this.inputS = container.querySelector('.a-color-picker-hsl>input[name=S]'));
            this.setupInput(this.inputL = container.querySelector('.a-color-picker-hsl>input[name=L]'));
            this.setupInput(this.inputR = container.querySelector('.a-color-picker-rgb>input[name=R]'));
            this.setupInput(this.inputG = container.querySelector('.a-color-picker-rgb>input[name=G]'));
            this.setupInput(this.inputB = container.querySelector('.a-color-picker-rgb>input[name=B]'));
            // preparo l'input per il formato hex css
            this.setupInput(this.inputRGBHEX = container.querySelector('input[name=RGBHEX]'));
            // imposto il colore iniziale
            this.onValueChanged(COLOR, this.options.color);
        } else {
            throw `Container not found: ${this.options.attachTo}`;
        }
    }

    setupHueCanvas(canvas) {
        canvas.width = HUE_BAR_SIZE[0];
        canvas.height = HUE_BAR_SIZE[1];
        // disegno sul convas applicando un gradiente lineare che copra tutti i possibili valori di HUE
        //  quindi ci vogliono 361 stop (da 0 a 360), mantendo fisse S e L
        const ctx = canvas.getContext('2d'),
            gradient = ctx.createLinearGradient(0, 0, HUE_BAR_SIZE[0], 0),
            step = 1 / 360;
        // aggiungo tutti i 361 step al gradiente
        for (let ii = 0; ii <= 1; ii += step) {
            gradient.addColorStop(ii, `hsl(${360 * ii}, 100%, 50%)`);
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, HUE_BAR_SIZE[0], HUE_BAR_SIZE[1]);
        // gestisco gli eventi per la selezione del valore e segnalo il cambiamento tramite callbak
        // una volta che il puntatore è premuto sul canvas (mousedown) 
        // intercetto le variazioni nella posizione del puntatore (mousemove)
        // relativamente al document, in modo che il puntatore in movimento possa uscire dal canvas
        // una volta sollevato (mouseup) elimino i listener
        const onMouseMove = (e) => {
            const x = limit(e.clientX - canvas.getBoundingClientRect().x, 0, HUE_BAR_SIZE[0]),
                hue = Math.round(x * 360 / HUE_BAR_SIZE[0]);
            this.huePointer.style.left = (x - 7) + 'px';
            this.onValueChanged(HUE, hue);
        };
        // mouse down sul canvas: intercetto il movimento, smetto appena il mouse viene sollevato
        canvas.addEventListener('mousedown', (e) => {
            onMouseMove(e);
            document.addEventListener('mousemove', onMouseMove);
            // il mouse up mi basta che venga intercettato solo una volta
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', onMouseMove);
            }, { once: true });
        });
    }

    setupSlCanvas(canvas) {
        canvas.width = SL_BAR_SIZE[0];
        canvas.height = SL_BAR_SIZE[1];
        // gestisco gli eventi per la selezione del valore e segnalo il cambiamento tramite callbak
        // una volta che il puntatore è premuto sul canvas (mousedown) 
        // intercetto le variazioni nella posizione del puntatore (mousemove)
        // relativamente al document, in modo che il puntatore in movimento possa uscire dal canvas
        // una volta sollevato (mouseup) elimino i listener
        const onMouseMove = (e) => {
            const x = limit(e.clientX - canvas.getBoundingClientRect().x, 0, SL_BAR_SIZE[0] - 1),
                y = limit(e.clientY - canvas.getBoundingClientRect().y, 0, SL_BAR_SIZE[1] - 1),
                c = this.slBarHelper.grabColor(x, y);
            // console.log('grab', x, y, c)
            this.slPointer.style.left = (x - 7) + 'px';
            this.slPointer.style.top = (y - 7) + 'px';
            this.onValueChanged(RGBA, c);
        };
        // mouse down sul canvas: intercetto il movimento, smetto appena il mouse viene sollevato
        canvas.addEventListener('mousedown', (e) => {
            onMouseMove(e);
            document.addEventListener('mousemove', onMouseMove);
            // il mouse up mi basta che venga intercettato solo una volta
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', onMouseMove);
            }, { once: true });
        });
    }

    setupInput(input) {
        const min = +input.min,
            max = +input.max,
            prop = input.name;
        if (input.type === 'text') {
            input.addEventListener('change', () => {
                this.onValueChanged(prop, input.value);
            });
        } else {
            input.addEventListener('change', () => {
                const value = +input.value;
                this.onValueChanged(prop, limit(value, min, max));
            });
        }
    }

    setupClipboard(input) {
        // l'input ricopre completamente la preview ma è totalmente trasparente
        input.title = 'click to copy';
        input.addEventListener('click', e => {
            // non uso direttamente inputRGBHEX perchè potrebbe contenere un colore non valido
            input.value = rgbToHex(this.R, this.G, this.B);
            input.select();
            document.execCommand('copy');
        });
    }

    onValueChanged(prop, value) {
        // console.log(prop, value);
        switch (prop) {
            case HUE:
                // imposto il valore dello HUE al canvas dedicato a saturazione/luminosità
                this.slBarHelper.setHue(value);
                this.H = value;
                [this.R, this.G, this.B] = hslToRgb(this.H, this.S, this.L);
                this.updatePointerH(this.H);
                this.updateInputHSL(this.H, this.S, this.L);
                this.updateInputRGB(this.R, this.G, this.B);
                this.updateInputRGBHEX(this.R, this.G, this.B);
                this.onColorChanged(this.H, this.S, this.L);
                break;
            case SATURATION:
                this.S = value;
                [this.R, this.G, this.B] = hslToRgb(this.H, this.S, this.L);
                this.updatePointerSL(this.H, this.S, this.L);
                this.updateInputHSL(this.H, this.S, this.L);
                this.updateInputRGB(this.R, this.G, this.B);
                this.updateInputRGBHEX(this.R, this.G, this.B);
                this.onColorChanged(this.H, this.S, this.L);
                break;
            case LUMINANCE:
                this.L = value;
                [this.R, this.G, this.B] = hslToRgb(this.H, this.S, this.L);
                this.updatePointerSL(this.H, this.S, this.L);
                this.updateInputHSL(this.H, this.S, this.L);
                this.updateInputRGB(this.R, this.G, this.B);
                this.updateInputRGBHEX(this.R, this.G, this.B);
                this.onColorChanged(this.H, this.S, this.L);
                break;
            case RED:
                this.R = value;
                [this.H, this.S, this.L] = rgbToHsl(this.R, this.G, this.B);
                this.slBarHelper.setHue(this.H);
                this.updatePointerH(this.H);
                this.updatePointerSL(this.H, this.S, this.L);
                this.updateInputHSL(this.H, this.S, this.L);
                this.updateInputRGBHEX(this.R, this.G, this.B);
                this.onColorChanged(this.H, this.S, this.L);
                break;
            case GREEN:
                this.G = value;
                [this.H, this.S, this.L] = rgbToHsl(this.R, this.G, this.B);
                this.slBarHelper.setHue(this.H);
                this.updatePointerH(this.H);
                this.updatePointerSL(this.H, this.S, this.L);
                this.updateInputHSL(this.H, this.S, this.L);
                this.updateInputRGBHEX(this.R, this.G, this.B);
                this.onColorChanged(this.H, this.S, this.L);
                break;
            case BLUE:
                this.B = value;
                [this.H, this.S, this.L] = rgbToHsl(this.R, this.G, this.B);
                this.slBarHelper.setHue(this.H);
                this.updatePointerH(this.H);
                this.updatePointerSL(this.H, this.S, this.L);
                this.updateInputHSL(this.H, this.S, this.L);
                this.updateInputRGBHEX(this.R, this.G, this.B);
                this.onColorChanged(this.H, this.S, this.L);
                break;
            case RGBA:
                [this.H, this.S, this.L] = rgbToHsl(...value);
                [this.R, this.G, this.B] = value;
                this.updateInputHSL(this.H, this.S, this.L);
                this.updateInputRGB(this.R, this.G, this.B);
                this.updateInputRGBHEX(this.R, this.G, this.B);
                this.onColorChanged(this.H, this.S, this.L);
                break;
            case RGBHEX:
                [this.R, this.G, this.B] = cssColorToRgb(value) || [this.R, this.G, this.B];
                [this.H, this.S, this.L] = rgbToHsl(this.R, this.G, this.B);
                this.slBarHelper.setHue(this.H);
                this.updatePointerH(this.H);
                this.updatePointerSL(this.H, this.S, this.L);
                this.updateInputHSL(this.H, this.S, this.L);
                this.updateInputRGB(this.R, this.G, this.B);
                this.onColorChanged(this.H, this.S, this.L);
                break;
            case COLOR:
                [this.R, this.G, this.B] = parseColorToRgb(value) || [0, 0, 0];
                [this.H, this.S, this.L] = rgbToHsl(this.R, this.G, this.B);
                this.slBarHelper.setHue(this.H);
                this.updatePointerH(this.H);
                this.updatePointerSL(this.H, this.S, this.L);
                this.updateInputHSL(this.H, this.S, this.L);
                this.updateInputRGB(this.R, this.G, this.B);
                this.updateInputRGBHEX(this.R, this.G, this.B);
                this.onColorChanged(this.H, this.S, this.L);
                break;
        }
    }

    onColorChanged(h, s, l) {
        this.preview.style.backgroundColor = `hsl(${h},${s}%,${l}%)`
        // TODO: scatenare listener esterni
        this.onchange && this.onchange();
    }

    updateInputHSL(h, s, l) {
        this.inputH.value = h;
        this.inputS.value = s;
        this.inputL.value = l;
    }

    updateInputRGB(r, g, b) {
        this.inputR.value = r;
        this.inputG.value = g;
        this.inputB.value = b;
    }

    updateInputRGBHEX(r, g, b) {
        this.inputRGBHEX.value = rgbToHex(r, g, b);
    }

    updatePointerH(h) {
        const x = HUE_BAR_SIZE[0] * h / 360;
        this.huePointer.style.left = (x - 7) + 'px';
    }

    updatePointerSL(h, s, l) {
        const [r, g, b] = hslToRgb(h, s, l);
        const [x, y] = this.slBarHelper.findColor(r, g, b);
        if (x >= 0) {
            this.slPointer.style.left = (x - 7) + 'px';
            this.slPointer.style.top = (y - 7) + 'px';
        }
    }
}

/**
 * Crea il color picker.
 * Le opzioni sono:
 * - attachTo: elemento DOM al quale aggiungere il picker (default 'body')
 * - showHSL: indica se mostrare i campi per la definizione del colore in formato HSL (default true)
 * - showRGB: indica se mostrare i campi per la definizione del colore in formato RGB (default true)
 * - showHEX: indica se mostrare i campi per la definizione del colore in formato RGB HEX (default true)
 * - color: colore iniziale (default '#ff0000')
 *
 * @param      {Object}          options  Le opzioni di creazione
 * @return     {Object}          ritorna un controller per impostare e recuperare il colore corrente del picker
 */
function createPicker(options) {
    const picker = new ColorPicker(options);
    let cbOnChange;
    return {
        get rgb() {
            return [picker.R, picker.G, picker.B];
        },

        get hsl() {
            return [picker.H, picker.S, picker.L];
        },

        get rgbhex() {
            return rgbToHex(picker.R, picker.G, picker.B);
        },

        /**
         * Ritorna il colore corrente nel formato RGB HEX.
         *
         * @return     {string}  colorre corrente (es: #ffdd00)
         */
        get color() {
            return this.rgbhex;
        },

        /**
         * Imposta il colore corrente.
         * Accetta:
         * - il nome di un colore (https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)
         * - un colore espresso nel formato RGB HEX sia esteso (#ffdd00) che compatto (#fd0)
         * - un array di interi [R,G,B]
         *
         * @param      {string|array}  color   il colore
         */
        set color(color) {
            picker.onValueChanged(COLOR, color);
        },

        get onchange() {
            return cbOnChange;
        },

        set onchange(cb) {
            if (cb && typeof cb === 'function') {
                cbOnChange = cb;
                picker.onchange = () => {
                    cb(this);
                };
            } else {
                cbOnChange = null;
                picker.onchange = null;
            }
        }

    }
}

export {
    createPicker,
    rgbToHex,
    parseColorToRgb,
    rgbToHsl,
    hslToRgb,
    rgbToInt,
    intToRgb
}