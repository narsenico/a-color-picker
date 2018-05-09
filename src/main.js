import './main.css';
import {
    COLOR_NAMES,
    PALETTE_MATERIAL_500,
    PALETTE_MATERIAL_CHROME,
    rgbToHex,
    hslToRgb,
    rgbToHsl,
    rgbToInt,
    intToRgb,
    getLuminance,
    limit,
    ensureArray,
    nvl
} from './utils.js';
import { WSAVERNOTSUPPORTED } from 'constants';

const IS_EDGE = window.navigator.userAgent.indexOf('Edge') > -1,
    IS_IE11 = window.navigator.userAgent.indexOf('rv:') > -1;

const DEFAULT = {
    attachTo: 'body',
    showHSL: true,
    showRGB: true,
    showHEX: true,
    showAlpha: false,
    color: '#ff0000',
    palette: null,
    paletteEditable: false
};

const SL_BAR_SIZE = [200, 150],
    HUE_BAR_SIZE = [150, 16],
    ALPHA_BAR_SIZE = HUE_BAR_SIZE,
    HUE = 'H',
    SATURATION = 'S',
    LUMINANCE = 'L',
    RGB = 'RGB',
    RED = 'R',
    GREEN = 'G',
    BLUE = 'B',
    RGBHEX = 'RGBHEX',
    COLOR = 'COLOR',
    RGBA_USER = 'RGBA_USER',
    HSLA_USER = 'HSLA_USER',
    ALPHA = 'ALPHA';

const HTML_BOX = `<div class="a-color-picker-row a-color-picker-stack">
                            <canvas class="a-color-picker-sl a-color-picker-transparent"></canvas>
                            <div class="a-color-picker-dot"></div>
                        </div>
                        <div class="a-color-picker-row">
                            <div class="a-color-picker-stack a-color-picker-transparent a-color-picker-circle">
                                <div class="a-color-picker-preview">
                                    <input class="a-color-picker-clipbaord" type="text">
                                </div>
                            </div>
                            <div class="a-color-picker-column">
                                <div class="a-color-picker-cell a-color-picker-stack">
                                    <canvas class="a-color-picker-h"></canvas>
                                    <div class="a-color-picker-dot"></div>
                                </div>
                                <div class="a-color-picker-cell a-color-picker-stack" show-on-alpha>
                                    <canvas class="a-color-picker-a a-color-picker-transparent"></canvas>
                                    <div class="a-color-picker-dot"></div>
                                </div>
                            </div>
                        </div>
                        <div class="a-color-picker-row a-color-picker-hsl" show-on-hsl>
                            <label>H</label>
                            <input name="H" type="number" maxlength="3" min="0" max="360" value="0">
                            <label>S</label>
                            <input name="S" type="number" maxlength="3" min="0" max="100" value="0">
                            <label>L</label>
                            <input name="L" type="number" maxlength="3" min="0" max="100" value="0">
                        </div>
                        <div class="a-color-picker-row a-color-picker-rgb" show-on-rgb>
                            <label>R</label>
                            <input name="R" type="number" maxlength="3" min="0" max="255" value="0">
                            <label>G</label>
                            <input name="G" type="number" maxlength="3" min="0" max="255" value="0">
                            <label>B</label>
                            <input name="B" type="number" maxlength="3" min="0" max="255" value="0">
                        </div>
                        <div class="a-color-picker-row a-color-picker-single-input" show-on-single-input>
                            <label>HEX</label>
                            <input name="RGBHEX" type="text" select-on-focus>
                        </div>
                        <div class="a-color-picker-row a-color-picker-palette"></div>`;

function parseElement(element, defaultElement, fallToDefault) {
    if (!element) {
        return defaultElement;
    } else if (element instanceof HTMLElement) {
        return element;
    } else if (element instanceof NodeList) {
        return element[0];
    } else if (typeof element == 'string') {
        return document.querySelector(element);
    } else if (element.jquery) {
        return element.get(0); //TODO: da testare
    } else if (fallToDefault) {
        return defaultElement;
    } else {
        return null;
    }
}

function parseElements(selector) {
    if (!selector) {
        return [];
    } else if (Array.isArray(selector)) {
        return selector;
    } else if (selector instanceof HTMLElement) {
        return [selector];
    } else if (selector instanceof NodeList) {
        return [...selector];
    } else if (typeof selector == 'string') {
        return [...document.querySelectorAll(selector)];
    } else if (selector.jquery) {
        return selector.get(); //TODO: da testare
    } else {
        return [];
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
    };
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
 * TODO: questa funzione andra à sostituire tutte le varie parseColorToXXX
 * 
 * @param {any} color 
 * @param {String} outFormat rgb (default), rgba, hsl, hsla, hex
 */
function parseColor(color,
    outFormat = (outFormat || 'rgb').toLowerCase()) {
    if (color !== null && color !== undefined) {
        let pp;
        if ((pp = parseColorToRgba(color)) ||
            ((pp = parseColorToHsla(color)) && (pp = [...hslToRgb(...pp), pp[3]]))) {

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
            }
        }
    }

    return undefined;
}

function parseAttrBoolean(value, ifNull, ifEmpty) {
    if (value === null) {
        return ifNull;
    } else if (/^\s*$/.test(value)) {
        return ifEmpty;
    } else if (/true|yes|1/i.test(value)) {
        return true;
    } else if (/false|no|0/i.test(value)) {
        return false;
    } else {
        return ifNull;
    }
}

function copyOptionsFromElement(options, element, attrPrefix = 'acp-') {
    // getAttribute() dovrebbe restituire null se l'attr non esiste, ma le vecchie specifiche prevedono il ritorno di una stringa vuota
    //  quindi è meglio verificare l'esistenza dell'attr con hasAttribute()
    if (element.hasAttribute(attrPrefix + 'show-hsl')) {
        options.showHSL = parseAttrBoolean(element.getAttribute(attrPrefix + 'show-hsl'), DEFAULT.showHSL, true);
    }
    if (element.hasAttribute(attrPrefix + 'show-rgb')) {
        options.showRGB = parseAttrBoolean(element.getAttribute(attrPrefix + 'show-rgb'), DEFAULT.showRGB, true);
    }
    if (element.hasAttribute(attrPrefix + 'show-hex')) {
        options.showHEX = parseAttrBoolean(element.getAttribute(attrPrefix + 'show-hex'), DEFAULT.showHEX, true);
    }
    if (element.hasAttribute(attrPrefix + 'show-alpha')) {
        options.showAlpha = parseAttrBoolean(element.getAttribute(attrPrefix + 'show-alpha'), DEFAULT.showAlpha, true);
    }
    if (element.hasAttribute(attrPrefix + 'palette-editable')) {
        options.paletteEditable = parseAttrBoolean(element.getAttribute(attrPrefix + 'palette-editable'), DEFAULT.paletteEditable, true);
    }
    if (element.hasAttribute(attrPrefix + 'palette')) {
        const palette = element.getAttribute(attrPrefix + 'palette');
        switch (palette) {
            case 'PALETTE_MATERIAL_500':
                options.palette = PALETTE_MATERIAL_500;
                break;
            case 'PALETTE_MATERIAL_CHROME':
            case '':
                options.palette = PALETTE_MATERIAL_CHROME;
                break;
            default:
                options.palette = palette.split(/[;\|]/);
                break;
        }
    }
    if (element.hasAttribute(attrPrefix + 'color')) {
        options.color = element.getAttribute(attrPrefix + 'color');
    }
}

class ColorPicker {
    constructor(container, options) {
        if (!options) {
            if (container && container.attachTo) {
                // se non trovo options e container è un {} con almeno la proprietà attachTo
                //  lo considero il vero options
                this.options = Object.assign({}, DEFAULT, container);
                container = parseElement(this.options.attachTo);
            } else {
                // altrimenti uso le opzioni di default
                this.options = Object.assign({}, DEFAULT);
                container = parseElement(container);
            }
        } else {
            container = parseElement(container);
            this.options = Object.assign({}, DEFAULT, options);
        }

        /*         if (container) {
                    // se viene passato al costrutto un elemento HTML uso le opzioni di default
                    this.options = Object.assign({}, DEFAULT, { attachTo: options });
                } else {
                    // altrimenti presumo che sia indicato nelle opzioni qual'è il contenitore
                    this.options = Object.assign({}, DEFAULT, options);
                    container = parseElement(this.options.attachTo);
                }
         */
        if (container) {
            // le opzioni possono essere specificate come attributi dell'elemento contenitore
            // quelle presenti sostituiranno le corrispondenti passate con il parametro options
            copyOptionsFromElement(this.options, container);

            this.H = 0;
            this.S = 0;
            this.L = 0;
            this.R = 0;
            this.G = 0;
            this.B = 0;
            this.A = 1;
            // andrà a contenere la palette di colori effettivamente usata
            // compresi i colori aggiunti o rimossi dall'utente, non sarà modificabile dirretamente dall'utente
            this.palette = { /*<color>: boolean*/ };

            // creo gli elementi HTML e li aggiungo al container
            this.element = document.createElement('div');
            this.element.className = 'a-color-picker';
            // se falsy viene nascosto .a-color-picker-rgb
            if (!this.options.showRGB) this.element.className += ' hide-rgb';
            // se falsy viene nascosto .a-color-picker-hsl
            if (!this.options.showHSL) this.element.className += ' hide-hsl';
            // se falsy viene nascosto .a-color-picker-single-input (css hex)
            if (!this.options.showHEX) this.element.className += ' hide-single-input';
            // se falsy viene nascosto .a-color-picker-a
            if (!this.options.showAlpha) this.element.className += ' hide-alpha';
            this.element.innerHTML = HTML_BOX;
            container.appendChild(this.element);
            // preparo il canvas con tutto lo spettro del HUE (da 0 a 360)
            // in base al valore selezionato su questo canvas verrà disegnato il canvas per SL
            const hueBar = this.element.querySelector('.a-color-picker-h');
            this.setupHueCanvas(hueBar);
            this.hueBarHelper = canvasHelper(hueBar);
            this.huePointer = this.element.querySelector('.a-color-picker-h+.a-color-picker-dot');
            // preparo il canvas per SL (saturation e luminance)
            const slBar = this.element.querySelector('.a-color-picker-sl');
            this.setupSlCanvas(slBar);
            this.slBarHelper = canvasHelper(slBar);
            this.slPointer = this.element.querySelector('.a-color-picker-sl+.a-color-picker-dot');
            // preparo il box della preview
            this.preview = this.element.querySelector('.a-color-picker-preview');
            this.setupClipboard(this.preview.querySelector('.a-color-picker-clipbaord'));
            // prearo gli input box
            this.setupInput(this.inputH = this.element.querySelector('.a-color-picker-hsl>input[name=H]'));
            this.setupInput(this.inputS = this.element.querySelector('.a-color-picker-hsl>input[name=S]'));
            this.setupInput(this.inputL = this.element.querySelector('.a-color-picker-hsl>input[name=L]'));
            this.setupInput(this.inputR = this.element.querySelector('.a-color-picker-rgb>input[name=R]'));
            this.setupInput(this.inputG = this.element.querySelector('.a-color-picker-rgb>input[name=G]'));
            this.setupInput(this.inputB = this.element.querySelector('.a-color-picker-rgb>input[name=B]'));
            // preparo l'input per il formato hex css
            this.setupInput(this.inputRGBHEX = this.element.querySelector('input[name=RGBHEX]'));
            // preparo la palette con i colori predefiniti
            this.setPalette(this.element.querySelector('.a-color-picker-palette'));
            // preparo in canvas per l'opacità
            this.setupAlphaCanvas(this.element.querySelector('.a-color-picker-a'));
            this.alphaPointer = this.element.querySelector('.a-color-picker-a+.a-color-picker-dot');
            // imposto il colore iniziale
            this.onValueChanged(COLOR, this.options.color);
        } else {
            throw `Container not found: ${this.options.attachTo}`;
        }
    }

    setupHueCanvas(canvas) {
        canvas.width = HUE_BAR_SIZE[0];
        canvas.height = HUE_BAR_SIZE[1];
        // disegno sul canvas applicando un gradiente lineare che copra tutti i possibili valori di HUE
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
            const x = limit(e.clientX - canvas.getBoundingClientRect().left, 0, HUE_BAR_SIZE[0]),
                hue = Math.round(x * 360 / HUE_BAR_SIZE[0]);
            this.huePointer.style.left = (x - 7) + 'px';
            this.onValueChanged(HUE, hue);
        };
        const onMouseUp = () => {
            // rimuovo i listener, verranno riattivati al prossimo mousedown
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        // mouse down sul canvas: intercetto il movimento, smetto appena il mouse viene sollevato
        canvas.addEventListener('mousedown', (e) => {
            onMouseMove(e);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
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
            const x = limit(e.clientX - canvas.getBoundingClientRect().left, 0, SL_BAR_SIZE[0] - 1),
                y = limit(e.clientY - canvas.getBoundingClientRect().top, 0, SL_BAR_SIZE[1] - 1),
                c = this.slBarHelper.grabColor(x, y);
            // console.log('grab', x, y, c)
            this.slPointer.style.left = (x - 7) + 'px';
            this.slPointer.style.top = (y - 7) + 'px';
            this.onValueChanged(RGB, c);
        };
        const onMouseUp = () => {
            // rimuovo i listener, verranno riattivati al prossimo mousedown
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        // mouse down sul canvas: intercetto il movimento, smetto appena il mouse viene sollevato
        canvas.addEventListener('mousedown', (e) => {
            onMouseMove(e);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    setupAlphaCanvas(canvas) {
        canvas.width = ALPHA_BAR_SIZE[0];
        canvas.height = ALPHA_BAR_SIZE[1];
        // disegno sul canvas con un gradiente che va dalla piena trasparenza al pieno opaco
        const ctx = canvas.getContext('2d'),
            gradient = ctx.createLinearGradient(0, 0, canvas.width - 1, 0);
        gradient.addColorStop(0, `hsla(0, 0%, 50%, 0)`);
        gradient.addColorStop(1, `hsla(0, 0%, 50%, 1)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ALPHA_BAR_SIZE[0], ALPHA_BAR_SIZE[1]);
        // gestisco gli eventi per la selezione del valore e segnalo il cambiamento tramite callbak
        // una volta che il puntatore è premuto sul canvas (mousedown) 
        // intercetto le variazioni nella posizione del puntatore (mousemove)
        // relativamente al document, in modo che il puntatore in movimento possa uscire dal canvas
        // una volta sollevato (mouseup) elimino i listener
        const onMouseMove = (e) => {
            const x = limit(e.clientX - canvas.getBoundingClientRect().left, 0, ALPHA_BAR_SIZE[0]),
                alpha = +(x / ALPHA_BAR_SIZE[0]).toFixed(2);
            this.alphaPointer.style.left = (x - 7) + 'px';
            this.onValueChanged(ALPHA, alpha);
        };
        const onMouseUp = () => {
            // rimuovo i listener, verranno riattivati al prossimo mousedown
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        // mouse down sul canvas: intercetto il movimento, smetto appena il mouse viene sollevato
        canvas.addEventListener('mousedown', (e) => {
            onMouseMove(e);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    setupInput(input) {
        const min = +input.min,
            max = +input.max,
            prop = input.name;
        if (input.hasAttribute('select-on-focus')) {
            input.addEventListener('focus', () => {
                //non funziona in IE/Edge
                input.select();
            });
        }
        if (input.type === 'text') {
            input.addEventListener('change', () => {
                this.onValueChanged(prop, input.value);
            });
        } else {
            if (IS_EDGE || IS_IE11) {
                // edge modifica il valore con le frecce MA non scatena l'evento change
                // quindi le intercetto impostando e.returnValue a false in modo
                // che non il valore non venga modificato anche da edge subito dopo il keydown
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Up') {
                        input.value = limit((+input.value) + 1, min, max);
                        this.onValueChanged(prop, input.value);
                        e.returnValue = false;
                    } else if (e.key === 'Down') {
                        input.value = limit((+input.value) - 1, min, max);
                        this.onValueChanged(prop, input.value);
                        e.returnValue = false;
                    }
                });
            }
            input.addEventListener('change', () => {
                const value = +input.value;
                this.onValueChanged(prop, limit(value, min, max));
            });
        }
    }

    setupClipboard(input) {
        // l'input ricopre completamente la preview ma è totalmente trasparente
        input.title = 'click to copy';
        input.addEventListener('click', () => {
            // non uso direttamente inputRGBHEX perchè potrebbe contenere un colore non valido
            input.value = rgbToHex(this.R, this.G, this.B);
            input.select();
            document.execCommand('copy');
        });
    }

    setPalette(row) {
        // palette è una copia di this.options.palette
        const palette = ensureArray(this.options.palette);
        if (this.options.paletteEditable || palette.length > 0) {
            const addColorToPalette = (hex, refElement, fire) => {
                // se il colore è già presente, non creo un nuovo <div> ma sposto quello esistente in coda
                const el = row.querySelector('.a-color-picker-palette-color[data-color="' + hex + '"]') ||
                    document.createElement('div');
                el.className = 'a-color-picker-palette-color';
                el.style.backgroundColor = hex;
                el.setAttribute('data-color', hex);
                el.title = hex;
                row.insertBefore(el, refElement);
                this.palette[hex] = true;
                if (fire) {
                    this.onPaletteColorAdd(hex);
                }
            };
            const removeColorToPalette = (element, fire) => {
                // se element è nullo elimino tutti i colori
                if (element) {
                    row.removeChild(element);
                    this.palette[element.getAttribute('data-color')] = false;
                    if (fire) {
                        this.onPaletteColorRemove(element.getAttribute('data-color'));
                    }
                } else {
                    row.querySelectorAll('.a-color-picker-palette-color[data-color]').forEach(el => {
                        row.removeChild(el);
                    });
                    Object.keys(this.palette).forEach(k => {
                        this.palette[k] = false;
                    });
                    if (fire) {
                        this.onPaletteColorRemove();
                    }
                }
            };
            // solo i colori validi vengono aggiunti alla palette
            let pp;
            palette
                // provo prima a interpretare il clore come RGB e se non ci riesco in HSL (a sua volta convertito in RGB)
                .map(p => p &&
                    ((pp = parseColorToRgb(p)) ||
                        ((pp = parseColorToHsl(p)) && (pp = hslToRgb(...pp)))))
                .filter(c => !!c)
                .forEach(c => addColorToPalette(rgbToHex(...c)));
            // in caso di palette editabile viene aggiunto un pulsante + che serve ad aggiungere il colore corrente
            if (this.options.paletteEditable) {
                const el = document.createElement('div');
                el.className = 'a-color-picker-palette-color a-color-picker-palette-add';
                el.innerHTML = '+';
                row.appendChild(el);
                // gestisco eventi di aggiunta/rimozione/selezione colori
                row.addEventListener('click', (e) => {
                    if (/a-color-picker-palette-add/.test(e.target.className)) {
                        if (e.shiftKey) {
                            // rimuove tutti i colori
                            removeColorToPalette(null, true);
                        } else {
                            // aggiungo il colore e triggero l'evento 'oncoloradd'
                            addColorToPalette(rgbToHex(this.R, this.G, this.B), e.target, true);
                        }
                    } else if (/a-color-picker-palette-color/.test(e.target.className)) {
                        if (e.shiftKey) {
                            // rimuovo il colore e triggero l'evento 'oncolorremove'
                            removeColorToPalette(e.target, true);
                        } else {
                            // visto che il colore letto da backgroundColor risulta nel formato rgb()
                            // devo usare il valore hex originale
                            this.onValueChanged(COLOR, e.target.getAttribute('data-color'));
                        }
                    }
                });
            } else {
                // gestisco il solo evento di selezione del colore
                row.addEventListener('click', (e) => {
                    if (/a-color-picker-palette-color/.test(e.target.className)) {
                        // visto che il colore letto da backgroundColor risulta nel formato rgb()
                        // devo usare il valore hex originale
                        this.onValueChanged(COLOR, e.target.getAttribute('data-color'));
                    }
                });
            }
        } else {
            // la palette con i colori predefiniti viene nasconsta se non ci sono colori
            row.style.display = 'none';
        }
    }

    onValueChanged(prop, value) {
        // console.log(prop, value);
        switch (prop) {
            case HUE:
                this.H = value;
                [this.R, this.G, this.B] = hslToRgb(this.H, this.S, this.L);
                this.slBarHelper.setHue(value);
                this.updatePointerH(this.H);
                this.updateInputHSL(this.H, this.S, this.L);
                this.updateInputRGB(this.R, this.G, this.B);
                this.updateInputRGBHEX(this.R, this.G, this.B);
                break;
            case SATURATION:
                this.S = value;
                [this.R, this.G, this.B] = hslToRgb(this.H, this.S, this.L);
                this.updatePointerSL(this.H, this.S, this.L);
                this.updateInputHSL(this.H, this.S, this.L);
                this.updateInputRGB(this.R, this.G, this.B);
                this.updateInputRGBHEX(this.R, this.G, this.B);
                break;
            case LUMINANCE:
                this.L = value;
                [this.R, this.G, this.B] = hslToRgb(this.H, this.S, this.L);
                this.updatePointerSL(this.H, this.S, this.L);
                this.updateInputHSL(this.H, this.S, this.L);
                this.updateInputRGB(this.R, this.G, this.B);
                this.updateInputRGBHEX(this.R, this.G, this.B);
                break;
            case RED:
                this.R = value;
                [this.H, this.S, this.L] = rgbToHsl(this.R, this.G, this.B);
                this.slBarHelper.setHue(this.H);
                this.updatePointerH(this.H);
                this.updatePointerSL(this.H, this.S, this.L);
                this.updateInputHSL(this.H, this.S, this.L);
                this.updateInputRGBHEX(this.R, this.G, this.B);
                break;
            case GREEN:
                this.G = value;
                [this.H, this.S, this.L] = rgbToHsl(this.R, this.G, this.B);
                this.slBarHelper.setHue(this.H);
                this.updatePointerH(this.H);
                this.updatePointerSL(this.H, this.S, this.L);
                this.updateInputHSL(this.H, this.S, this.L);
                this.updateInputRGBHEX(this.R, this.G, this.B);
                break;
            case BLUE:
                this.B = value;
                [this.H, this.S, this.L] = rgbToHsl(this.R, this.G, this.B);
                this.slBarHelper.setHue(this.H);
                this.updatePointerH(this.H);
                this.updatePointerSL(this.H, this.S, this.L);
                this.updateInputHSL(this.H, this.S, this.L);
                this.updateInputRGBHEX(this.R, this.G, this.B);
                break;
            case RGB:
                [this.R, this.G, this.B] = value;
                [this.H, this.S, this.L] = rgbToHsl(this.R, this.G, this.B);
                this.updateInputHSL(this.H, this.S, this.L);
                this.updateInputRGB(this.R, this.G, this.B);
                this.updateInputRGBHEX(this.R, this.G, this.B);
                break;
            case RGBA_USER:
                [this.R, this.G, this.B, this.A] = value;
                [this.H, this.S, this.L] = rgbToHsl(this.R, this.G, this.B);
                this.slBarHelper.setHue(this.H);
                this.updatePointerH(this.H);
                this.updatePointerSL(this.H, this.S, this.L);
                this.updateInputHSL(this.H, this.S, this.L);
                this.updateInputRGB(this.R, this.G, this.B);
                this.updateInputRGBHEX(this.R, this.G, this.B);
                this.updatePointerA(this.A);
                break;
            case HSLA_USER:
                [this.H, this.S, this.L, this.A] = value;
                [this.R, this.G, this.B] = hslToRgb(this.H, this.S, this.L);
                this.slBarHelper.setHue(this.H);
                this.updatePointerH(this.H);
                this.updatePointerSL(this.H, this.S, this.L);
                this.updateInputHSL(this.H, this.S, this.L);
                this.updateInputRGB(this.R, this.G, this.B);
                this.updateInputRGBHEX(this.R, this.G, this.B);
                this.updatePointerA(this.A);
                break;
            case RGBHEX:
                [this.R, this.G, this.B] = cssColorToRgb(value) || [this.R, this.G, this.B];
                [this.H, this.S, this.L] = rgbToHsl(this.R, this.G, this.B);
                this.slBarHelper.setHue(this.H);
                this.updatePointerH(this.H);
                this.updatePointerSL(this.H, this.S, this.L);
                this.updateInputHSL(this.H, this.S, this.L);
                this.updateInputRGB(this.R, this.G, this.B);
                break;
            case COLOR:
                // [this.R, this.G, this.B, this.A] = parseColorToRgba(value) || [0, 0, 0, 1];
                [this.R, this.G, this.B, this.A] = parseColor(value, 'rgba') || [0, 0, 0, 1];
                [this.H, this.S, this.L] = rgbToHsl(this.R, this.G, this.B);
                this.slBarHelper.setHue(this.H);
                this.updatePointerH(this.H);
                this.updatePointerSL(this.H, this.S, this.L);
                this.updateInputHSL(this.H, this.S, this.L);
                this.updateInputRGB(this.R, this.G, this.B);
                this.updateInputRGBHEX(this.R, this.G, this.B);
                this.updatePointerA(this.A);
                break;
            case ALPHA:
                this.A = value;
                break;
        }
        this.onColorChanged(this.R, this.G, this.B, this.A);
    }

    onColorChanged(r, g, b, a) {
        if (a === 1) {
            this.preview.style.backgroundColor = `rgb(${r},${g},${b})`;
        } else {
            this.preview.style.backgroundColor = `rgba(${r},${g},${b},${a})`;
        }
        // this.onchange && this.onchange();
        this.onchange && this.onchange(this.preview.style.backgroundColor);
    }

    onPaletteColorAdd(color) {
        this.oncoloradd && this.oncoloradd(color);
    }

    onPaletteColorRemove(color) {
        this.oncolorremove && this.oncolorremove(color);
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

    updatePointerA(a) {
        const x = ALPHA_BAR_SIZE[0] * a;
        this.alphaPointer.style.left = (x - 7) + 'px';
    }
}

function wrapEventCallback(ctrl, picker, eventName, cb) {
    if (cb && typeof cb === 'function') {
        picker['on' + eventName] = function () {
            cb.call(null, ctrl, ...arguments);
        };
    } else {
        picker['on' + eventName] = null;
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
 * @param      {Object}          element (opzionale) Un elemento HTML che andrà a contenere il picker
 * @param      {Object}          options  (opzionale) Le opzioni di creazione
 * @return     {Object}          ritorna un controller per impostare e recuperare il colore corrente del picker
 */
function createPicker(element, options) {
    const picker = new ColorPicker(element, options);
    const cbEvents = {};
    return {
        get element() {
            return picker.element;
        },

        get rgb() {
            return [picker.R, picker.G, picker.B];
        },

        set rgb([r, g, b]) {
            [r, g, b] = [limit(r, 0, 255), limit(g, 0, 255), limit(b, 0, 255)];
            picker.onValueChanged(RGBA_USER, [r, g, b, 1]);
        },

        get hsl() {
            return [picker.H, picker.S, picker.L];
        },

        set hsl([h, s, l]) {
            [h, s, l] = [limit(h, 0, 360), limit(s, 0, 100), limit(l, 0, 100)];
            picker.onValueChanged(HSLA_USER, [h, s, l, 1]);
        },

        get rgbhex() {
            return rgbToHex(picker.R, picker.G, picker.B);
        },

        get rgba() {
            return [picker.R, picker.G, picker.B, picker.A];
        },

        set rgba([r, g, b, a]) {
            [r, g, b, a] = [limit(r, 0, 255), limit(g, 0, 255), limit(b, 0, 255), limit(a, 0, 1)];
            picker.onValueChanged(RGBA_USER, [r, g, b, a]);
        },

        get hsla() {
            return [picker.H, picker.S, picker.L, picker.A];
        },

        set hsla([h, s, l, a]) {
            [h, s, l, a] = [limit(h, 0, 360), limit(s, 0, 100), limit(l, 0, 100), limit(a, 0, 1)];
            picker.onValueChanged(HSLA_USER, [h, s, l, a]);
        },

        /**
         * Ritorna il colore corrente nel formato RGB HEX.
         *
         * @return     {string}  colorre corrente (es: #ffdd00)
         */
        get color() {
            if (picker.A === 1) {
                return this.rgbhex;
            } else {
                return `rgba(${picker.R},${picker.G},${picker.B},${picker.A})`;
            }
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
            return cbEvents['change'];
        },

        set onchange(cb) {
            wrapEventCallback(this, picker, 'change', cb);
            cbEvents['change'] = cb;
        },

        get oncoloradd() {
            return cbEvents['coloradd'];
        },

        set oncoloradd(cb) {
            wrapEventCallback(this, picker, 'coloradd', cb);
            cbEvents['coloradd'] = cb;
        },

        get oncolorremove() {
            return cbEvents['colorremove'];
        },

        set oncolorremove(cb) {
            wrapEventCallback(this, picker, 'colorremove', cb);
            cbEvents['colorremove'] = cb;
        },

        /**
         * Ritorna la palette dei colori.
         *
         * @return     {Array}  array di colori in formato hex
         */
        get palette() {
            return Object.keys(picker.palette).filter(k => picker.palette[k]);
        },

        on(eventName, cb) {
            if (eventName) {
                wrapEventCallback(this, picker, eventName, cb);
                cbEvents[eventName] = cb;
            }
            return this;
        },

        off(eventName) {
            return this.on(eventName, null);
        }
    };
}

/**
 * 
 * @param {any} selector 
 * @param {object} options 
 * @return  un Array di controller così come restituito da createPicker()
 */
function from(selector, options) {
    // TODO: gestire eventuali errori nella creazione del picker
    const pickers = parseElements(selector).map((el, index) => {
        const picker = createPicker(el, options);
        picker.index = index;
        return picker;
    });
    pickers.on = function (eventName, cb) {
        pickers.forEach(picker => picker.on(eventName, cb));
        return this;
    };
    pickers.off = function (eventName) {
        return this.on(eventName, null);
    };
    return pickers;
}

export {
    createPicker,
    from,
    parseColorToRgb,
    parseColorToRgba,
    parseColorToHsl,
    parseColorToHsla,
    parseColor,
    rgbToHex,
    hslToRgb,
    rgbToHsl,
    rgbToInt,
    intToRgb,
    getLuminance,
    COLOR_NAMES,
    PALETTE_MATERIAL_500,
    PALETTE_MATERIAL_CHROME
};