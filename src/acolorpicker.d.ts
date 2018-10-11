declare module 'a-color-picker';

declare namespace AColorPicker {

    type OutFormat = (
        'rgb' | 'rgbcss' | 'rgbcss4' | 'rgba' | 'rgbacss' |
        'hsl' | 'hslcss' | 'hslcss4' | 'hsla' | 'hslacss' |
        'hex' | 'hexcss4' | 'int'
    );

    type EventName = ('change' | 'coloradd' | 'colorremove');

    type ACPCallback = (controller: ACPController, color?: string) => void;

    interface ACPHTMLElement extends HTMLElement {
        readonly ctrl: ACPController;
    }

    interface ACPColor extends Object {
        rgb: Array<number>;
        rgbcss: string;
        rgbcss4: string;
        rgba: Array<number>;
        rgbacss: string;
        hsl: Array<number>;
        hslcss: string;
        hslcss4: string;
        hsla: Array<number>;
        hslacss: string;
        hex: string;
        hexcss4: string;
        int: number;
        toString(): string;
    }

    interface ACPController extends Object {
        readonly element: ACPHTMLElement;
        readonly rgbhex: string;
        readonly all: ACPColor;
        readonly palette: Array<string>;
        rgb: Array<number>;
        rgba: Array<number>;
        hsl: Array<number>;
        hsla: Array<number>;
        color: string | Array<number>;
        /**
         * @deprecated  use on('change', cb) instead
         */
        onchange: ACPCallback;
        /**
         * @deprecated  use on('coloradd', cb) instead
         */
        oncoloradd: ACPCallback;
        /**
         * @deprecated  use on('colorremove', cb) instead
         */
        oncolorremove: ACPCallback;
        on(eventName: EventName, cb: ACPCallback): ACPController;
        off(eventName: EventName, cb?: ACPCallback): ACPController;
    }

    /**
     * @param   color   {string | Array<number>}   color to be parsed
     * @param   outFormat   {string}    format
     * @returns {string}    color formattted    
     */
    export function parseColor(color: string | Array<number>, outFormat?: OutFormat): string;
    /**
     * @param   color   {string | Array<number>}   color to be parsed
     * @param   objToFill   {Object}    plain object
     * @returns {Object}    objToFill object filled with properties
     */
    export function parseColor(color: string | Array<number>, objToFill: Object): Object & ACPColor;
    export function createPicker(options?: Object): ACPController;
    export function createPicker(element: any, options?: Object): ACPController;
    export function from(selector: any, options?: Object): Array<ACPController>;
}

export = AColorPicker;