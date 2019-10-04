// @ts-check
/*!
 * a-color-picker
 * https://github.com/narsenico/a-color-picker
 *
 * Copyright (c) 2017-2019, Gianfranco Caldi.
 * Released under the MIT License.
 */

import {
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
    parseColorToRgb,
    parseColorToRgba,
    parseColorToHsl,
    parseColorToHsla,
    parseColor,
    getLuminance,
    limit,
    ensureArray,
    nvl
} from './utils.js';
import isPlainObject from 'is-plain-object';
import HTML_BOX from './acolorpicker.html';

const VERSION = '1.2.1';

const IS_EDGE = typeof window !== 'undefined' && window.navigator.userAgent.indexOf('Edge') > -1,
    IS_IE11 = typeof window !== 'undefined' && window.navigator.userAgent.indexOf('rv:') > -1;

const DEFAULT = {
    id: null,
    attachTo: 'body',
    showHSL: true,
    showRGB: true,
    showHEX: true,
    showAlpha: false,
    color: '#ff0000',
    palette: null,
    paletteEditable: false,
    useAlphaInPalette: 'auto', //true|false|auto
    slBarSize: [232, 150],
    hueBarSize: [150, 11],
    alphaBarSize: [150, 11]
};

const HUE = 'H',
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
        return element.get(0); //TODO: da testare parseElement con jQuery
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
        return selector.get(); //TODO: da testare parseElements con jQuery
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
            const colorGradient = ctx.createLinearGradient(1, 0, width - 1, 0);
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
            const [, s, v] = rgbToHsv(r, g, b);
            const x = s * width;
            const y = height - (v * height);
            return [x, y];
        }
    };
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

function parseAttrDimensionArray(value, ifNull, ifEmpty) {
    if (value === null) {
        return ifNull;
    } else if (/^\s*$/.test(value)) {
        return ifEmpty;
    } else {
        const dimensions = value.split(',').map(Number);
        if (dimensions.length === 2 && dimensions[0] && dimensions[1]) {
            return dimensions
        }
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
    if (element.hasAttribute(attrPrefix + 'sl-bar-size')) {
        options.slBarSize = parseAttrDimensionArray(element.getAttribute(attrPrefix + 'sl-bar-size'), DEFAULT.slBarSize, [232, 150]);
    }
    if (element.hasAttribute(attrPrefix + 'hue-bar-size')) {
        options.hueBarSize = parseAttrDimensionArray(element.getAttribute(attrPrefix + 'hue-bar-size'), DEFAULT.hueBarSize, [150, 11]);
        options.alphaBarSize = options.hueBarSize
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
                options.palette = palette.split(/[;|]/);
                break;
        }
    }
    if (element.hasAttribute(attrPrefix + 'color')) {
        options.color = element.getAttribute(attrPrefix + 'color');
    }
}

class ColorPicker {
    constructor(container, options) {
        //controllo se siamo nel caso di options passato come primo parametro
        if (options) {
            container = parseElement(container);
            this.options = Object.assign({}, DEFAULT, options);
        } else if (container && isPlainObject(container)) {
            // se non trovo options e container è un {} lo considero il vero options
            this.options = Object.assign({}, DEFAULT, container);
            container = parseElement(this.options.attachTo);
        } else {
            // altrimenti uso le opzioni di default
            this.options = Object.assign({}, DEFAULT);
            // nel caso non vengano proprio passati parametri, considero attachTo di default
            container = parseElement(nvl(container, this.options.attachTo));
        }

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
            if (this.options.id) {
                this.element.id = this.options.id;
            }
            this.element.className = 'a-color-picker';
            // // se falsy viene nascosto .a-color-picker-rgb
            // if (!this.options.showRGB) this.element.className += ' hide-rgb';
            // // se falsy viene nascosto .a-color-picker-hsl
            // if (!this.options.showHSL) this.element.className += ' hide-hsl';
            // // se falsy viene nascosto .a-color-picker-single-input (css hex)
            // if (!this.options.showHEX) this.element.className += ' hide-single-input';
            // // se falsy viene nascosto .a-color-picker-a
            // if (!this.options.showAlpha) this.element.className += ' hide-alpha';
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
            if (this.options.showHSL) {
                this.setupInput(this.inputH = this.element.querySelector('.a-color-picker-hsl>input[nameref=H]'));
                this.setupInput(this.inputS = this.element.querySelector('.a-color-picker-hsl>input[nameref=S]'));
                this.setupInput(this.inputL = this.element.querySelector('.a-color-picker-hsl>input[nameref=L]'));
            } else {
                this.element.querySelector('.a-color-picker-hsl').remove();
            }
            if (this.options.showRGB) {
                this.setupInput(this.inputR = this.element.querySelector('.a-color-picker-rgb>input[nameref=R]'));
                this.setupInput(this.inputG = this.element.querySelector('.a-color-picker-rgb>input[nameref=G]'));
                this.setupInput(this.inputB = this.element.querySelector('.a-color-picker-rgb>input[nameref=B]'));
            } else {
                this.element.querySelector('.a-color-picker-rgb').remove();
            }
            // preparo l'input per il formato hex css
            if (this.options.showHEX) {
                this.setupInput(this.inputRGBHEX = this.element.querySelector('input[nameref=RGBHEX]'));
            } else {
                this.element.querySelector('.a-color-picker-rgbhex').remove();
            }
            // preparo la palette con i colori predefiniti
            //  (palette può contenere sia un Array che una stringa, entrambi con prop length)
            if (this.options.paletteEditable || (this.options.palette && this.options.palette.length > 0)) {
                this.setPalette(this.paletteRow = this.element.querySelector('.a-color-picker-palette'));
            } else {
                // #17 se l'elemento della palette è rimosso non posso modificarne il contenuto a posteriori
                // rimuovo l'elemento dal DOM ma non lo elimino, potrebbe servirmi in seguito
                this.paletteRow = this.element.querySelector('.a-color-picker-palette');
                this.paletteRow.remove();
            }
            // preparo in canvas per l'opacità
            if (this.options.showAlpha) {
                this.setupAlphaCanvas(this.element.querySelector('.a-color-picker-a'));
                this.alphaPointer = this.element.querySelector('.a-color-picker-a+.a-color-picker-dot');
            } else {
                this.element.querySelector('.a-color-picker-alpha').remove();
            }
            this.element.style.width = `${this.options.slBarSize[0]}px`;
            // imposto il colore iniziale
            this.onValueChanged(COLOR, this.options.color);
        } else {
            throw new Error(`Container not found: ${this.options.attachTo}`);
        }
    }

    setupHueCanvas(canvas) {
        canvas.width = this.options.hueBarSize[0];
        canvas.height = this.options.hueBarSize[1];
        // disegno sul canvas applicando un gradiente lineare che copra tutti i possibili valori di HUE
        //  quindi ci vogliono 361 stop (da 0 a 360), mantendo fisse S e L
        const ctx = canvas.getContext('2d'),
            gradient = ctx.createLinearGradient(0, 0, this.options.hueBarSize[0], 0),
            step = 1 / 360;
        // aggiungo tutti i 361 step al gradiente
        for (let ii = 0; ii <= 1; ii += step) {
            gradient.addColorStop(ii, `hsl(${360 * ii}, 100%, 50%)`);
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.options.hueBarSize[0], this.options.hueBarSize[1]);
        // gestisco gli eventi per la selezione del valore e segnalo il cambiamento tramite callbak
        // una volta che il puntatore è premuto sul canvas (mousedown)
        // intercetto le variazioni nella posizione del puntatore (mousemove)
        // relativamente al document, in modo che il puntatore in movimento possa uscire dal canvas
        // una volta sollevato (mouseup) elimino i listener
        const onMouseMove = (e) => {
            const x = limit(e.clientX - canvas.getBoundingClientRect().left, 0, this.options.hueBarSize[0]),
                hue = Math.round(x * 360 / this.options.hueBarSize[0]);
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
        canvas.width = this.options.slBarSize[0];
        canvas.height = this.options.slBarSize[1];
        // gestisco gli eventi per la selezione del valore e segnalo il cambiamento tramite callbak
        // una volta che il puntatore è premuto sul canvas (mousedown)
        // intercetto le variazioni nella posizione del puntatore (mousemove)
        // relativamente al document, in modo che il puntatore in movimento possa uscire dal canvas
        // una volta sollevato (mouseup) elimino i listener
        const onMouseMove = (e) => {
            const x = limit(e.clientX - canvas.getBoundingClientRect().left, 0, this.options.slBarSize[0] - 1),
                y = limit(e.clientY - canvas.getBoundingClientRect().top, 0, this.options.slBarSize[1] - 1),
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
        canvas.width = this.options.alphaBarSize[0];
        canvas.height = this.options.alphaBarSize[1];
        // disegno sul canvas con un gradiente che va dalla piena trasparenza al pieno opaco
        const ctx = canvas.getContext('2d'),
            gradient = ctx.createLinearGradient(0, 0, canvas.width - 1, 0);
        gradient.addColorStop(0, `hsla(0, 0%, 50%, 0)`);
        gradient.addColorStop(1, `hsla(0, 0%, 50%, 1)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.options.alphaBarSize[0], this.options.alphaBarSize[1]);
        // gestisco gli eventi per la selezione del valore e segnalo il cambiamento tramite callbak
        // una volta che il puntatore è premuto sul canvas (mousedown)
        // intercetto le variazioni nella posizione del puntatore (mousemove)
        // relativamente al document, in modo che il puntatore in movimento possa uscire dal canvas
        // una volta sollevato (mouseup) elimino i listener
        const onMouseMove = (e) => {
            const x = limit(e.clientX - canvas.getBoundingClientRect().left, 0, this.options.alphaBarSize[0]),
                alpha = +(x / this.options.alphaBarSize[0]).toFixed(2);
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
            prop = input.getAttribute("nameref");
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
            //  converto in hexcss4 quindi aggiunge anche il valore hex dell'alpha ma solo se significativo (0<=a<1)
            input.value = parseColor([this.R, this.G, this.B, this.A], 'hexcss4');
            input.select();
            document.execCommand('copy');
        });
    }

    setPalette(/** @type {Element} */ row) {
        // indica se considerare il canale alpha nei controlli della palette
        // se 'auto' dipende dall'opzione showAlpha (se true allora alpha è considerata anche nella palette)
        const useAlphaInPalette = this.options.useAlphaInPalette === 'auto' ? this.options.showAlpha : this.options.useAlphaInPalette;
        // palette è una copia di this.options.palette
        let palette = null;
        switch (this.options.palette) {
            case 'PALETTE_MATERIAL_500':
                palette = PALETTE_MATERIAL_500;
                break;
            case 'PALETTE_MATERIAL_CHROME':
                palette = PALETTE_MATERIAL_CHROME;
                break;
            default:
                palette = ensureArray(this.options.palette);
                break;
        }
        if (this.options.paletteEditable || palette.length > 0) {
            const addColorToPalette = (color, refElement, fire) => {
                // se il colore è già presente, non creo un nuovo <div> ma sposto quello esistente in coda
                const el = row.querySelector('.a-color-picker-palette-color[data-color="' + color + '"]') ||
                    document.createElement('div');
                el.className = 'a-color-picker-palette-color';
                el.style.backgroundColor = color;
                el.setAttribute('data-color', color);
                el.title = color;
                row.insertBefore(el, refElement);
                this.palette[color] = true;
                if (fire) {
                    this.onPaletteColorAdd(color);
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
            palette.map(c => parseColor(c, useAlphaInPalette ? 'rgbcss4' : 'hex'))
                .filter(c => !!c)
                .forEach(c => addColorToPalette(c));
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
                        } else if (useAlphaInPalette) {
                            // aggiungo il colore e triggero l'evento 'oncoloradd'
                            addColorToPalette(parseColor([this.R, this.G, this.B, this.A], 'rgbcss4'), e.target, true);
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

    updatePalette(palette) {
        // elimino tutti i riferimenti all'attuale palette
        this.paletteRow.innerHTML = '';
        this.palette = { };
        // se l'elemento contenitore della palette è stato rimosso (nel costruttore), lo reintegro
        if (!this.paletteRow.parentElement) {
            this.element.appendChild(this.paletteRow);
        }
        // aggiorno le opzioni e ricreo i controlli
        this.options.palette = palette;
        this.setPalette(this.paletteRow);
    }

    onValueChanged(prop, value, options = { silent: false }) {
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
        // this.onColorChanged(this.R, this.G, this.B, this.A);

        if (this.A === 1) {
            this.preview.style.backgroundColor = `rgb(${this.R},${this.G},${this.B})`;
        } else {
            this.preview.style.backgroundColor = `rgba(${this.R},${this.G},${this.B},${this.A})`;
        }
        // #21
        if (!options || !options.silent) {
            this.onchange && this.onchange(this.preview.style.backgroundColor);
        }
    }

    // onColorChanged(r, g, b, a) {
    //     if (a === 1) {
    //         this.preview.style.backgroundColor = `rgb(${r},${g},${b})`;
    //     } else {
    //         this.preview.style.backgroundColor = `rgba(${r},${g},${b},${a})`;
    //     }
    //     // this.onchange && this.onchange();
    //     this.onchange && this.onchange(this.preview.style.backgroundColor);
    // }

    onPaletteColorAdd(color) {
        this.oncoloradd && this.oncoloradd(color);
    }

    onPaletteColorRemove(color) {
        this.oncolorremove && this.oncolorremove(color);
    }

    updateInputHSL(h, s, l) {
        if (!this.options.showHSL) return;

        this.inputH.value = h;
        this.inputS.value = s;
        this.inputL.value = l;
    }

    updateInputRGB(r, g, b) {
        if (!this.options.showRGB) return;

        this.inputR.value = r;
        this.inputG.value = g;
        this.inputB.value = b;
    }

    updateInputRGBHEX(r, g, b) {
        if (!this.options.showHEX) return;

        this.inputRGBHEX.value = rgbToHex(r, g, b);
    }

    updatePointerH(h) {
        const x = this.options.hueBarSize[0] * h / 360;
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
        if (!this.options.showAlpha) return;

        const x = this.options.alphaBarSize[0] * a;
        this.alphaPointer.style.left = (x - 7) + 'px';
    }
}

class EventEmitter {
    constructor(name) {
        this.name = name;
        this.listeners = [];
    }
    on(callback) {
        if (callback) {
            this.listeners.push(callback);
        }
    }
    off(callback) {
        if (callback) {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        } else {
            this.listeners = [];
        }
    }
    emit(args, _this) {
        const listeners = this.listeners.slice(0);
        for (let ii = 0; ii < listeners.length; ii++) {
            listeners[ii].apply(_this, args);
        }
    }
}

// function wrapEventCallback(ctrl, picker, eventName, cb) {
//     if (cb && typeof cb === 'function') {
//         picker['on' + eventName] = () => {
//             cb.call(null, ctrl, ...arguments);
//         };
//     } else {
//         picker['on' + eventName] = null;
//     }
// }

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
    let picker = new ColorPicker(element, options);
    // gestione degli eventi: il "controller" assegna le callbak degli eventi ai rispettivi EventEmitter
    // quando il picker triggera un evento,
    //  il "controller" emette lo stesso evento tramite il rispettivo EventEmitter
    let cbEvents = {
        change: new EventEmitter('change'),
        coloradd: new EventEmitter('coloradd'),
        colorremove: new EventEmitter('colorremove')
    };
    let isChanged = true,
        // memoize per la proprietà all
        memAll = {};
    // non permetto l'accesso diretto al picker
    // ma ritorno un "controller" per eseguire solo alcune azioni (get/set colore, eventi, etc.)
    const controller = {
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
            // return rgbToHex(picker.R, picker.G, picker.B);
            return this.all.hex;
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
         * Ritorna il colore corrente nel formato RGB HEX,
         * oppure nella notazione rgba() con alpha != 1.
         *
         * @return     {string}  colore corrente
         */
        get color() {
            // if (picker.A === 1) {
            //     return this.rgbhex;
            // } else {
            //     return `rgba(${picker.R},${picker.G},${picker.B},${picker.A})`;
            // }
            return this.all.toString();
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

        /**
         * Importa il colore corrente.
         * E' possibile passare un secondo parametro per indicare
         * se si vuole impostare il colore in modo silente, cio senza scatenare eventi.
         *
         * @param {string|array} color il colore
         * @param {boolean} silent se true il colore viene cambiato senza scatenare eventi, false altrimenti
         */
        setColor(color, silent = false) {
            // modifico il colore senza scatenare alcun evento
            picker.onValueChanged(COLOR, color, { silent })
        },

        /**
         * @return  {Object}    oggetto contenente il colore corrente in tutti i formati noti a parseColor()
         */
        get all() {
            if (isChanged) {
                const rgba = [picker.R, picker.G, picker.B, picker.A];
                // la conversione in stringa segue le regole della proprietà color
                const ts = picker.A < 1 ? `rgba(${picker.R},${picker.G},${picker.B},${picker.A})` : rgbToHex(...rgba);
                // passando un oggetto a parseColor come secondo parametro, lo riempirà con tutti i formati disponibili
                memAll = parseColor(rgba, memAll);
                memAll.toString = () => ts;
                isChanged = false;
            }
            // devo per forza passare una copia, altrimenti memAll può esssere modificato dall'esterno
            return Object.assign({}, memAll);
        },

        /**
         * @deprecated
         */
        get onchange() {
            return cbEvents.change && cbEvents.change.listeners[0];
        },

        /**
         * @deprecated  usare on('change', cb)
         */
        set onchange(cb) {
            // wrapEventCallback(this, picker, 'change', cb);
            // cbEvents['change'] = cb;
            this.off('change').on('change', cb);
        },

        /**
         * @deprecated
         */
        get oncoloradd() {
            return cbEvents.coloradd && cbEvents.coloradd.listeners[0];
        },

        /**
         * @deprecated  usare on('coloradd', cb)
         */
        set oncoloradd(cb) {
            // wrapEventCallback(this, picker, 'coloradd', cb);
            // cbEvents['coloradd'] = cb;
            this.off('coloradd').on('coloradd', cb);
        },

        /**
         * @deprecated
         */
        get oncolorremove() {
            return cbEvents.colorremove && cbEvents.colorremove.listeners[0];
        },

        /**
         * @deprecated  usare on('colorremove', cb)
         */
        set oncolorremove(cb) {
            // wrapEventCallback(this, picker, 'colorremove', cb);
            // cbEvents['colorremove'] = cb;
            this.off('colorremove').on('colorremove', cb);
        },

        /**
         * Ritorna la palette dei colori.
         *
         * @return     {Array}  array di colori in formato hex
         */
        get palette() {
            return Object.keys(picker.palette).filter(k => picker.palette[k]);
        },

        /**
         * Imposta la palette di color
         */
        set palette(colors) {
            picker.updatePalette(colors);
        },

        /**
         * Mostra il picker.
         */
        show() {
            picker.element.classList.remove('hidden');
        },

        /**
         * Nasconde il picker
         */
        hide() {
            picker.element.classList.add('hidden');
        },

        /**
         * Mostra o nasconde il picker
         */
        toggle() {
            picker.element.classList.toggle('hidden');
        },

        on(eventName, cb) {
            if (eventName) {
                cbEvents[eventName] && cbEvents[eventName].on(cb);
            }
            return this;
        },

        off(eventName, cb) {
            if (eventName) {
                cbEvents[eventName] && cbEvents[eventName].off(cb);
            }
            return this;
        },

        destroy() {
            cbEvents.change.off()
            cbEvents.coloradd.off()
            cbEvents.colorremove.off()
            picker.element.remove()
            cbEvents = null
            picker = null
        }
    };
    // ogni volta che viene triggerato un evento, uso il corrispettivo EventEmitter per propagarlo a tutte le callback associate
    //  le callback vengono richiamate con il "controller" come "this"
    //  e il primo parametro è sempre il "controller" seguito da tutti i parametri dell'evento
    picker.onchange = (...args) => {
        isChanged = true; // così le proprietà in lettura dovranno ricalcolare il loro valore
        cbEvents.change.emit([controller, ...args], controller);
    };
    picker.oncoloradd = (...args) => {
        cbEvents.coloradd.emit([controller, ...args], controller);
    };
    picker.oncolorremove = (...args) => {
        cbEvents.colorremove.emit([controller, ...args], controller);
    };
    // TOOD: trovare un altro nome a ctrl, troppo comune
    // TODO: definirla come readonly
    picker.element.ctrl = controller;
    return controller;
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
        pickers.forEach(picker => picker.off(eventName));
        return this;
    };
    return pickers;
}

if (typeof window !== 'undefined') {
    // solo in ambiente browser inserisco direttamente nella pagina html il css
    //  per sicurezza controllo che non sia già presente
    if (!document.querySelector('head>style[data-source="a-color-picker"]')) {
        // eslint-disable-next-line global-require,  no-undef
        const css = require('./acolorpicker.css').toString();
        const style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.setAttribute('data-source', 'a-color-picker');
        style.innerHTML = css;
        // TODO: verificare che esista <head>
        document.querySelector('head').appendChild(style);
    }
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
    rgbToHsv,
    rgbToInt,
    intToRgb,
    getLuminance,
    COLOR_NAMES,
    PALETTE_MATERIAL_500,
    PALETTE_MATERIAL_CHROME,
    VERSION
};