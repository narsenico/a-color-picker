window["AColorPicker"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(5);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PALETTE_MATERIAL_CHROME = exports.PALETTE_MATERIAL_500 = exports.COLOR_NAMES = exports.intToRgb = exports.rgbToInt = exports.rgbToHsl = exports.hslToRgb = exports.rgbToHex = exports.parseColorToRgba = exports.parseColorToRgb = exports.createPicker = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

__webpack_require__(3);

var _utils = __webpack_require__(6);

var _constants = __webpack_require__(7);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IS_EDGE = window.navigator.userAgent.indexOf('Edge') > -1,
    IS_IE11 = window.navigator.userAgent.indexOf('rv:') > -1;

var DEFAULT = {
    attachTo: 'body',
    showHSL: true,
    showRGB: true,
    showHEX: true,
    showAlpha: false,
    color: '#ff0000',
    palette: null,
    paletteEditable: false
};

var SL_BAR_SIZE = [200, 150],
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

var HTML_BOX = '<div class="a-color-picker-row a-color-picker-stack">\n                            <canvas class="a-color-picker-sl a-color-picker-transparent"></canvas>\n                            <div class="a-color-picker-dot"></div>\n                        </div>\n                        <div class="a-color-picker-row">\n                            <div class="a-color-picker-stack a-color-picker-transparent a-color-picker-circle">\n                                <div class="a-color-picker-preview">\n                                    <input class="a-color-picker-clipbaord" type="text">\n                                </div>\n                            </div>\n                            <div class="a-color-picker-column">\n                                <div class="a-color-picker-cell a-color-picker-stack">\n                                    <canvas class="a-color-picker-h"></canvas>\n                                    <div class="a-color-picker-dot"></div>\n                                </div>\n                                <div class="a-color-picker-cell a-color-picker-stack" show-on-alpha>\n                                    <canvas class="a-color-picker-a a-color-picker-transparent"></canvas>\n                                    <div class="a-color-picker-dot"></div>\n                                </div>\n                            </div>\n                        </div>\n                        <div class="a-color-picker-row a-color-picker-hsl" show-on-hsl>\n                            <label>H</label>\n                            <input name="H" type="number" maxlength="3" min="0" max="360" value="0">\n                            <label>S</label>\n                            <input name="S" type="number" maxlength="3" min="0" max="100" value="0">\n                            <label>L</label>\n                            <input name="L" type="number" maxlength="3" min="0" max="100" value="0">\n                        </div>\n                        <div class="a-color-picker-row a-color-picker-rgb" show-on-rgb>\n                            <label>R</label>\n                            <input name="R" type="number" maxlength="3" min="0" max="255" value="0">\n                            <label>G</label>\n                            <input name="G" type="number" maxlength="3" min="0" max="255" value="0">\n                            <label>B</label>\n                            <input name="B" type="number" maxlength="3" min="0" max="255" value="0">\n                        </div>\n                        <div class="a-color-picker-row a-color-picker-single-input" show-on-single-input>\n                            <label>HEX</label>\n                            <input name="RGBHEX" type="text" select-on-focus>\n                        </div>\n                        <div class="a-color-picker-row a-color-picker-palette"></div>';

function parseElemnt(element, defaultElement, fallToDefault) {
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

function canvasHelper(canvas) {
    var ctx = canvas.getContext('2d'),
        width = +canvas.width,
        height = +canvas.height;
    // questo gradiente da bianco (alto) a nero (basso) viene applicato come sfondo al canvas
    var whiteBlackGradient = ctx.createLinearGradient(1, 1, 1, height - 1);
    whiteBlackGradient.addColorStop(0, 'white');
    whiteBlackGradient.addColorStop(1, 'black');
    return {
        setHue: function setHue(hue) {
            // gradiente con il colore relavito a lo HUE da sinistra a destra partendo da trasparente a opaco
            // la combinazione del gradiente bianco/nero e questo permette di avere un canvas dove 
            // sull'asse delle ordinate è espressa la saturazione, e sull'asse delle ascisse c'è la luminosità
            var colorGradient = ctx.createLinearGradient(0, 0, width - 1, 0);
            colorGradient.addColorStop(0, 'hsla(' + hue + ', 100%, 50%, 0)');
            colorGradient.addColorStop(1, 'hsla(' + hue + ', 100%, 50%, 1)');
            // applico i gradienti
            ctx.fillStyle = whiteBlackGradient;
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = colorGradient;
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'source-over';
        },
        grabColor: function grabColor(x, y) {
            // recupera il colore del pixel in formato RGBA
            return ctx.getImageData(x, y, 1, 1).data;
        },
        findColor: function findColor(r, g, b) {
            // TODO: se la luminosità è bassa posso controllare prima la parte inferiore
            var rowLen = width * 4,

            // visto che non sono sicuro di trovare il colore esatto considero un gap in + e - su tutti i 3 valori
            gap = 5,

            // array contenente tutti i pixel, ogni pixel sono 4 byte RGBA (quindi è grande w*h*4)
            data = ctx.getImageData(0, 0, width, height).data;
            var coord = [-1, -1];
            // console.log(data.length, r, g, b)
            // console.log(data)
            // console.time('findColor');
            // scorro l'array di pixel, ogni 4 byte c'è un pixel nuovo
            for (var ii = 0; ii < data.length; ii += 4) {
                if (Math.abs(data[ii] - r) <= gap && Math.abs(data[ii + 1] - g) <= gap && Math.abs(data[ii + 2] - b) <= gap) {
                    // console.log('found', ii, Math.floor(ii/rowLen), (ii%rowLen)/4);
                    coord = [ii % rowLen / 4, Math.floor(ii / rowLen)];
                    break;
                }
            }
            // console.timeEnd('findColor');
            return coord;
        }
    };
}

function cssColorToRgb(color) {
    if (color) {
        var colorByName = _utils.COLOR_NAMES[color.toString().toLowerCase()];
        // considero sia il formato esteso #RRGGGBB che quello corto #RGB
        // provo a estrarre i valori da colorByName solo se questo è valorizzato, altrimenti uso direttamente color

        var _ref = /^\s*#?((([0-9A-F])([0-9A-F])([0-9A-F]))|(([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})))\s*$/i.exec(colorByName || color) || [],
            _ref2 = _slicedToArray(_ref, 10),
            r = _ref2[3],
            g = _ref2[4],
            b = _ref2[5],
            rr = _ref2[7],
            gg = _ref2[8],
            bb = _ref2[9];

        if (r !== undefined) return [parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16)];else if (rr !== undefined) return [parseInt(rr, 16), parseInt(gg, 16), parseInt(bb, 16)];
    }
    return undefined;
}

function cssRgbToRgb(rgb) {
    if (rgb) {
        var _ref3 = /^rgb\((\d+),(\d+),(\d+)\)/i.exec(rgb) || [],
            _ref4 = _slicedToArray(_ref3, 4),
            m = _ref4[0],
            r = _ref4[1],
            g = _ref4[2],
            b = _ref4[3];

        return m ? [(0, _utils.limit)(r, 0, 255), (0, _utils.limit)(g, 0, 255), (0, _utils.limit)(b, 0, 255)] : undefined;
    }
    return undefined;
}

function cssRgbaToRgba(rgba) {
    if (rgba) {
        var _ref5 = /^rgba\((\d+),(\d+),(\d+),(\d*(.\d+)?)\)/i.exec(rgba) || [],
            _ref6 = _slicedToArray(_ref5, 5),
            m = _ref6[0],
            r = _ref6[1],
            g = _ref6[2],
            b = _ref6[3],
            a = _ref6[4];

        return m ? [(0, _utils.limit)(r, 0, 255), (0, _utils.limit)(g, 0, 255), (0, _utils.limit)(b, 0, 255), (0, _utils.limit)(a, 0, 1)] : undefined;
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
        color = [(0, _utils.limit)(color[0], 0, 255), (0, _utils.limit)(color[1], 0, 255), (0, _utils.limit)(color[2], 0, 255)];
        return color;
    } else {
        return cssColorToRgb(color) || cssRgbToRgb(color);
    }
}

function parseColorToRgba(color) {
    if (Array.isArray(color)) {
        color = [(0, _utils.limit)(color[0], 0, 255), (0, _utils.limit)(color[1], 0, 255), (0, _utils.limit)(color[2], 0, 255), (0, _utils.limit)((0, _utils.nvl)(color[3], 1), 0, 1)];
        return color;
    } else {
        var parsed = cssColorToRgb(color) || cssRgbToRgb(color) || cssRgbaToRgba(color);
        if (parsed && parsed.length === 3) {
            parsed.push(1);
        }
        return parsed;
    }
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

function copyOptionsFromElement(options, element) {
    var attrPrefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'acp-';

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
        var palette = element.getAttribute(attrPrefix + 'palette');
        switch (palette) {
            case 'PALETTE_MATERIAL_500':
                options.palette = _utils.PALETTE_MATERIAL_500;
                break;
            case 'PALETTE_MATERIAL_CHROME':
            case '':
                options.palette = _utils.PALETTE_MATERIAL_CHROME;
                break;
            default:
                options.palette = palette.split(/[,;\|]/);
                break;
        }
    }
    if (element.hasAttribute(attrPrefix + 'color')) {
        options.color = element.getAttribute(attrPrefix + 'color');
    }
}

var ColorPicker = function () {
    function ColorPicker(options) {
        _classCallCheck(this, ColorPicker);

        var container = parseElemnt(options);
        if (container) {
            // se viene passato al costrutto un elemento HTML uso le opzioni di default
            this.options = Object.assign({}, DEFAULT, { attachTo: options });
        } else {
            // altrimenti presumo che sia indicato nelle opzioni qual'è il contenitore
            this.options = Object.assign({}, DEFAULT, options);
            container = parseElemnt(this.options.attachTo);
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
            this.palette = {/*<color>: boolean*/};

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
            var hueBar = this.element.querySelector('.a-color-picker-h');
            this.setupHueCanvas(hueBar);
            this.hueBarHelper = canvasHelper(hueBar);
            this.huePointer = this.element.querySelector('.a-color-picker-h+.a-color-picker-dot');
            // preparo il canvas per SL (saturation e luminance)
            var slBar = this.element.querySelector('.a-color-picker-sl');
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
            throw 'Container not found: ' + this.options.attachTo;
        }
    }

    _createClass(ColorPicker, [{
        key: 'setupHueCanvas',
        value: function setupHueCanvas(canvas) {
            var _this = this;

            canvas.width = HUE_BAR_SIZE[0];
            canvas.height = HUE_BAR_SIZE[1];
            // disegno sul canvas applicando un gradiente lineare che copra tutti i possibili valori di HUE
            //  quindi ci vogliono 361 stop (da 0 a 360), mantendo fisse S e L
            var ctx = canvas.getContext('2d'),
                gradient = ctx.createLinearGradient(0, 0, HUE_BAR_SIZE[0], 0),
                step = 1 / 360;
            // aggiungo tutti i 361 step al gradiente
            for (var ii = 0; ii <= 1; ii += step) {
                gradient.addColorStop(ii, 'hsl(' + 360 * ii + ', 100%, 50%)');
            }
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, HUE_BAR_SIZE[0], HUE_BAR_SIZE[1]);
            // gestisco gli eventi per la selezione del valore e segnalo il cambiamento tramite callbak
            // una volta che il puntatore è premuto sul canvas (mousedown) 
            // intercetto le variazioni nella posizione del puntatore (mousemove)
            // relativamente al document, in modo che il puntatore in movimento possa uscire dal canvas
            // una volta sollevato (mouseup) elimino i listener
            var onMouseMove = function onMouseMove(e) {
                var x = (0, _utils.limit)(e.clientX - canvas.getBoundingClientRect().left, 0, HUE_BAR_SIZE[0]),
                    hue = Math.round(x * 360 / HUE_BAR_SIZE[0]);
                _this.huePointer.style.left = x - 7 + 'px';
                _this.onValueChanged(HUE, hue);
            };
            var onMouseUp = function onMouseUp() {
                // rimuovo i listener, verranno riattivati al prossimo mousedown
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            // mouse down sul canvas: intercetto il movimento, smetto appena il mouse viene sollevato
            canvas.addEventListener('mousedown', function (e) {
                onMouseMove(e);
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        }
    }, {
        key: 'setupSlCanvas',
        value: function setupSlCanvas(canvas) {
            var _this2 = this;

            canvas.width = SL_BAR_SIZE[0];
            canvas.height = SL_BAR_SIZE[1];
            // gestisco gli eventi per la selezione del valore e segnalo il cambiamento tramite callbak
            // una volta che il puntatore è premuto sul canvas (mousedown) 
            // intercetto le variazioni nella posizione del puntatore (mousemove)
            // relativamente al document, in modo che il puntatore in movimento possa uscire dal canvas
            // una volta sollevato (mouseup) elimino i listener
            var onMouseMove = function onMouseMove(e) {
                var x = (0, _utils.limit)(e.clientX - canvas.getBoundingClientRect().left, 0, SL_BAR_SIZE[0] - 1),
                    y = (0, _utils.limit)(e.clientY - canvas.getBoundingClientRect().top, 0, SL_BAR_SIZE[1] - 1),
                    c = _this2.slBarHelper.grabColor(x, y);
                // console.log('grab', x, y, c)
                _this2.slPointer.style.left = x - 7 + 'px';
                _this2.slPointer.style.top = y - 7 + 'px';
                _this2.onValueChanged(RGB, c);
            };
            var onMouseUp = function onMouseUp() {
                // rimuovo i listener, verranno riattivati al prossimo mousedown
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            // mouse down sul canvas: intercetto il movimento, smetto appena il mouse viene sollevato
            canvas.addEventListener('mousedown', function (e) {
                onMouseMove(e);
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        }
    }, {
        key: 'setupAlphaCanvas',
        value: function setupAlphaCanvas(canvas) {
            var _this3 = this;

            canvas.width = ALPHA_BAR_SIZE[0];
            canvas.height = ALPHA_BAR_SIZE[1];
            // disegno sul canvas con un gradiente che va dalla piena trasparenza al pieno opaco
            var ctx = canvas.getContext('2d'),
                gradient = ctx.createLinearGradient(0, 0, canvas.width - 1, 0);
            gradient.addColorStop(0, 'hsla(0, 0%, 50%, 0)');
            gradient.addColorStop(1, 'hsla(0, 0%, 50%, 1)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, ALPHA_BAR_SIZE[0], ALPHA_BAR_SIZE[1]);
            // gestisco gli eventi per la selezione del valore e segnalo il cambiamento tramite callbak
            // una volta che il puntatore è premuto sul canvas (mousedown) 
            // intercetto le variazioni nella posizione del puntatore (mousemove)
            // relativamente al document, in modo che il puntatore in movimento possa uscire dal canvas
            // una volta sollevato (mouseup) elimino i listener
            var onMouseMove = function onMouseMove(e) {
                var x = (0, _utils.limit)(e.clientX - canvas.getBoundingClientRect().left, 0, ALPHA_BAR_SIZE[0]),
                    alpha = +(x / ALPHA_BAR_SIZE[0]).toFixed(2);
                _this3.alphaPointer.style.left = x - 7 + 'px';
                _this3.onValueChanged(ALPHA, alpha);
            };
            var onMouseUp = function onMouseUp() {
                // rimuovo i listener, verranno riattivati al prossimo mousedown
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            // mouse down sul canvas: intercetto il movimento, smetto appena il mouse viene sollevato
            canvas.addEventListener('mousedown', function (e) {
                onMouseMove(e);
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        }
    }, {
        key: 'setupInput',
        value: function setupInput(input) {
            var _this4 = this;

            var min = +input.min,
                max = +input.max,
                prop = input.name;
            if (input.hasAttribute('select-on-focus')) {
                input.addEventListener('focus', function () {
                    //non funziona in IE/Edge
                    input.select();
                });
            }
            if (input.type === 'text') {
                input.addEventListener('change', function () {
                    _this4.onValueChanged(prop, input.value);
                });
            } else {
                if (IS_EDGE || IS_IE11) {
                    // edge modifica il valore con le frecce MA non scatena l'evento change
                    // quindi le intercetto impostando e.returnValue a false in modo
                    // che non il valore non venga modificato anche da edge subito dopo il keydown
                    input.addEventListener('keydown', function (e) {
                        if (e.key === 'Up') {
                            input.value = (0, _utils.limit)(+input.value + 1, min, max);
                            _this4.onValueChanged(prop, input.value);
                            e.returnValue = false;
                        } else if (e.key === 'Down') {
                            input.value = (0, _utils.limit)(+input.value - 1, min, max);
                            _this4.onValueChanged(prop, input.value);
                            e.returnValue = false;
                        }
                    });
                }
                input.addEventListener('change', function () {
                    var value = +input.value;
                    _this4.onValueChanged(prop, (0, _utils.limit)(value, min, max));
                });
            }
        }
    }, {
        key: 'setupClipboard',
        value: function setupClipboard(input) {
            var _this5 = this;

            // l'input ricopre completamente la preview ma è totalmente trasparente
            input.title = 'click to copy';
            input.addEventListener('click', function () {
                // non uso direttamente inputRGBHEX perchè potrebbe contenere un colore non valido
                input.value = (0, _utils.rgbToHex)(_this5.R, _this5.G, _this5.B);
                input.select();
                document.execCommand('copy');
            });
        }
    }, {
        key: 'setPalette',
        value: function setPalette(row) {
            var _this6 = this;

            // palette è una copia di this.options.palette
            var palette = (0, _utils.ensureArray)(this.options.palette);
            if (this.options.paletteEditable || palette.length > 0) {
                var addColorToPalette = function addColorToPalette(hex, refElement, fire) {
                    // se il colore è già presente, non creo un nuovo <div> ma sposto quello esistente in coda
                    var el = row.querySelector('.a-color-picker-palette-color[data-color="' + hex + '"]') || document.createElement('div');
                    el.className = 'a-color-picker-palette-color';
                    el.style.backgroundColor = hex;
                    el.setAttribute('data-color', hex);
                    el.title = hex;
                    row.insertBefore(el, refElement);
                    _this6.palette[hex] = true;
                    if (fire) {
                        _this6.onPaletteColorAdd(hex);
                    }
                };
                var removeColorToPalette = function removeColorToPalette(element, fire) {
                    // se element è nullo elimino tutti i colori
                    if (element) {
                        row.removeChild(element);
                        _this6.palette[element.getAttribute('data-color')] = false;
                        if (fire) {
                            _this6.onPaletteColorRemove(element.getAttribute('data-color'));
                        }
                    } else {
                        row.querySelectorAll('.a-color-picker-palette-color[data-color]').forEach(function (el) {
                            row.removeChild(el);
                        });
                        Object.keys(_this6.palette).forEach(function (k) {
                            _this6.palette[k] = false;
                        });
                        if (fire) {
                            _this6.onPaletteColorRemove();
                        }
                    }
                };
                // solo i colori validi vengono aggiunti alla palette
                palette.map(function (p) {
                    return p && parseColorToRgb(p);
                }).filter(function (c) {
                    return !!c;
                }).forEach(function (c) {
                    return addColorToPalette(_utils.rgbToHex.apply(undefined, _toConsumableArray(c)));
                });
                // in caso di palette editabile viene aggiunto un pulsante + che serve ad aggiungere il colore corrente
                if (this.options.paletteEditable) {
                    var el = document.createElement('div');
                    el.className = 'a-color-picker-palette-color a-color-picker-palette-add';
                    el.innerHTML = '+';
                    row.appendChild(el);
                }
                row.addEventListener('click', function (e) {
                    if (/a-color-picker-palette-add/.test(e.target.className)) {
                        if (e.shiftKey) {
                            // rimuove tutti i colori
                            removeColorToPalette(null, true);
                        } else {
                            // aggiungo il colore e triggero l'evento 'oncoloradd'
                            addColorToPalette((0, _utils.rgbToHex)(_this6.R, _this6.G, _this6.B), e.target, true);
                        }
                    } else if (/a-color-picker-palette-color/.test(e.target.className)) {
                        if (e.shiftKey) {
                            // rimuovo il colore e triggero l'evento 'oncolorremove'
                            removeColorToPalette(e.target, true);
                        } else {
                            // visto che il colore letto da backgroundColor risulta nel formato rgb()
                            // devo usare il valore hex originale
                            _this6.onValueChanged(COLOR, e.target.getAttribute('data-color'));
                        }
                    }
                });
            } else {
                // la palette con i colori predefiniti viene nasconsta se non ci sono colori
                row.style.display = 'none';
            }
        }
    }, {
        key: 'onValueChanged',
        value: function onValueChanged(prop, value) {
            // console.log(prop, value);
            switch (prop) {
                case HUE:
                    this.H = value;

                    var _hslToRgb = (0, _utils.hslToRgb)(this.H, this.S, this.L);

                    var _hslToRgb2 = _slicedToArray(_hslToRgb, 3);

                    this.R = _hslToRgb2[0];
                    this.G = _hslToRgb2[1];
                    this.B = _hslToRgb2[2];

                    this.slBarHelper.setHue(value);
                    this.updatePointerH(this.H);
                    this.updateInputHSL(this.H, this.S, this.L);
                    this.updateInputRGB(this.R, this.G, this.B);
                    this.updateInputRGBHEX(this.R, this.G, this.B);
                    break;
                case SATURATION:
                    this.S = value;

                    var _hslToRgb3 = (0, _utils.hslToRgb)(this.H, this.S, this.L);

                    var _hslToRgb4 = _slicedToArray(_hslToRgb3, 3);

                    this.R = _hslToRgb4[0];
                    this.G = _hslToRgb4[1];
                    this.B = _hslToRgb4[2];

                    this.updatePointerSL(this.H, this.S, this.L);
                    this.updateInputHSL(this.H, this.S, this.L);
                    this.updateInputRGB(this.R, this.G, this.B);
                    this.updateInputRGBHEX(this.R, this.G, this.B);
                    break;
                case LUMINANCE:
                    this.L = value;

                    var _hslToRgb5 = (0, _utils.hslToRgb)(this.H, this.S, this.L);

                    var _hslToRgb6 = _slicedToArray(_hslToRgb5, 3);

                    this.R = _hslToRgb6[0];
                    this.G = _hslToRgb6[1];
                    this.B = _hslToRgb6[2];

                    this.updatePointerSL(this.H, this.S, this.L);
                    this.updateInputHSL(this.H, this.S, this.L);
                    this.updateInputRGB(this.R, this.G, this.B);
                    this.updateInputRGBHEX(this.R, this.G, this.B);
                    break;
                case RED:
                    this.R = value;

                    var _rgbToHsl = (0, _utils.rgbToHsl)(this.R, this.G, this.B);

                    var _rgbToHsl2 = _slicedToArray(_rgbToHsl, 3);

                    this.H = _rgbToHsl2[0];
                    this.S = _rgbToHsl2[1];
                    this.L = _rgbToHsl2[2];

                    this.slBarHelper.setHue(this.H);
                    this.updatePointerH(this.H);
                    this.updatePointerSL(this.H, this.S, this.L);
                    this.updateInputHSL(this.H, this.S, this.L);
                    this.updateInputRGBHEX(this.R, this.G, this.B);
                    break;
                case GREEN:
                    this.G = value;

                    var _rgbToHsl3 = (0, _utils.rgbToHsl)(this.R, this.G, this.B);

                    var _rgbToHsl4 = _slicedToArray(_rgbToHsl3, 3);

                    this.H = _rgbToHsl4[0];
                    this.S = _rgbToHsl4[1];
                    this.L = _rgbToHsl4[2];

                    this.slBarHelper.setHue(this.H);
                    this.updatePointerH(this.H);
                    this.updatePointerSL(this.H, this.S, this.L);
                    this.updateInputHSL(this.H, this.S, this.L);
                    this.updateInputRGBHEX(this.R, this.G, this.B);
                    break;
                case BLUE:
                    this.B = value;

                    var _rgbToHsl5 = (0, _utils.rgbToHsl)(this.R, this.G, this.B);

                    var _rgbToHsl6 = _slicedToArray(_rgbToHsl5, 3);

                    this.H = _rgbToHsl6[0];
                    this.S = _rgbToHsl6[1];
                    this.L = _rgbToHsl6[2];

                    this.slBarHelper.setHue(this.H);
                    this.updatePointerH(this.H);
                    this.updatePointerSL(this.H, this.S, this.L);
                    this.updateInputHSL(this.H, this.S, this.L);
                    this.updateInputRGBHEX(this.R, this.G, this.B);
                    break;
                case RGB:
                    var _value = _slicedToArray(value, 3);

                    this.R = _value[0];
                    this.G = _value[1];
                    this.B = _value[2];

                    var _rgbToHsl7 = (0, _utils.rgbToHsl)(this.R, this.G, this.B);

                    var _rgbToHsl8 = _slicedToArray(_rgbToHsl7, 3);

                    this.H = _rgbToHsl8[0];
                    this.S = _rgbToHsl8[1];
                    this.L = _rgbToHsl8[2];

                    this.updateInputHSL(this.H, this.S, this.L);
                    this.updateInputRGB(this.R, this.G, this.B);
                    this.updateInputRGBHEX(this.R, this.G, this.B);
                    break;
                case RGBA_USER:
                    var _value2 = _slicedToArray(value, 4);

                    this.R = _value2[0];
                    this.G = _value2[1];
                    this.B = _value2[2];
                    this.A = _value2[3];

                    var _rgbToHsl9 = (0, _utils.rgbToHsl)(this.R, this.G, this.B);

                    var _rgbToHsl10 = _slicedToArray(_rgbToHsl9, 3);

                    this.H = _rgbToHsl10[0];
                    this.S = _rgbToHsl10[1];
                    this.L = _rgbToHsl10[2];

                    this.slBarHelper.setHue(this.H);
                    this.updatePointerH(this.H);
                    this.updatePointerSL(this.H, this.S, this.L);
                    this.updateInputHSL(this.H, this.S, this.L);
                    this.updateInputRGB(this.R, this.G, this.B);
                    this.updateInputRGBHEX(this.R, this.G, this.B);
                    this.updatePointerA(this.A);
                    break;
                case HSLA_USER:
                    var _value3 = _slicedToArray(value, 4);

                    this.H = _value3[0];
                    this.S = _value3[1];
                    this.L = _value3[2];
                    this.A = _value3[3];

                    var _hslToRgb7 = (0, _utils.hslToRgb)(this.H, this.S, this.L);

                    var _hslToRgb8 = _slicedToArray(_hslToRgb7, 3);

                    this.R = _hslToRgb8[0];
                    this.G = _hslToRgb8[1];
                    this.B = _hslToRgb8[2];

                    this.slBarHelper.setHue(this.H);
                    this.updatePointerH(this.H);
                    this.updatePointerSL(this.H, this.S, this.L);
                    this.updateInputHSL(this.H, this.S, this.L);
                    this.updateInputRGB(this.R, this.G, this.B);
                    this.updateInputRGBHEX(this.R, this.G, this.B);
                    this.updatePointerA(this.A);
                    break;
                case RGBHEX:
                    var _ref7 = cssColorToRgb(value) || [this.R, this.G, this.B];

                    var _ref8 = _slicedToArray(_ref7, 3);

                    this.R = _ref8[0];
                    this.G = _ref8[1];
                    this.B = _ref8[2];

                    var _rgbToHsl11 = (0, _utils.rgbToHsl)(this.R, this.G, this.B);

                    var _rgbToHsl12 = _slicedToArray(_rgbToHsl11, 3);

                    this.H = _rgbToHsl12[0];
                    this.S = _rgbToHsl12[1];
                    this.L = _rgbToHsl12[2];

                    this.slBarHelper.setHue(this.H);
                    this.updatePointerH(this.H);
                    this.updatePointerSL(this.H, this.S, this.L);
                    this.updateInputHSL(this.H, this.S, this.L);
                    this.updateInputRGB(this.R, this.G, this.B);
                    break;
                case COLOR:
                    var _ref9 = parseColorToRgba(value) || [0, 0, 0, 1];

                    var _ref10 = _slicedToArray(_ref9, 4);

                    this.R = _ref10[0];
                    this.G = _ref10[1];
                    this.B = _ref10[2];
                    this.A = _ref10[3];

                    var _rgbToHsl13 = (0, _utils.rgbToHsl)(this.R, this.G, this.B);

                    var _rgbToHsl14 = _slicedToArray(_rgbToHsl13, 3);

                    this.H = _rgbToHsl14[0];
                    this.S = _rgbToHsl14[1];
                    this.L = _rgbToHsl14[2];

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
    }, {
        key: 'onColorChanged',
        value: function onColorChanged(r, g, b, a) {
            if (a === 1) {
                this.preview.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
            } else {
                this.preview.style.backgroundColor = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
            }
            this.onchange && this.onchange();
        }
    }, {
        key: 'onPaletteColorAdd',
        value: function onPaletteColorAdd(color) {
            this.oncoloradd && this.oncoloradd(color);
        }
    }, {
        key: 'onPaletteColorRemove',
        value: function onPaletteColorRemove(color) {
            this.oncolorremove && this.oncolorremove(color);
        }
    }, {
        key: 'updateInputHSL',
        value: function updateInputHSL(h, s, l) {
            this.inputH.value = h;
            this.inputS.value = s;
            this.inputL.value = l;
        }
    }, {
        key: 'updateInputRGB',
        value: function updateInputRGB(r, g, b) {
            this.inputR.value = r;
            this.inputG.value = g;
            this.inputB.value = b;
        }
    }, {
        key: 'updateInputRGBHEX',
        value: function updateInputRGBHEX(r, g, b) {
            this.inputRGBHEX.value = (0, _utils.rgbToHex)(r, g, b);
        }
    }, {
        key: 'updatePointerH',
        value: function updatePointerH(h) {
            var x = HUE_BAR_SIZE[0] * h / 360;
            this.huePointer.style.left = x - 7 + 'px';
        }
    }, {
        key: 'updatePointerSL',
        value: function updatePointerSL(h, s, l) {
            var _hslToRgb9 = (0, _utils.hslToRgb)(h, s, l),
                _hslToRgb10 = _slicedToArray(_hslToRgb9, 3),
                r = _hslToRgb10[0],
                g = _hslToRgb10[1],
                b = _hslToRgb10[2];

            var _slBarHelper$findColo = this.slBarHelper.findColor(r, g, b),
                _slBarHelper$findColo2 = _slicedToArray(_slBarHelper$findColo, 2),
                x = _slBarHelper$findColo2[0],
                y = _slBarHelper$findColo2[1];

            if (x >= 0) {
                this.slPointer.style.left = x - 7 + 'px';
                this.slPointer.style.top = y - 7 + 'px';
            }
        }
    }, {
        key: 'updatePointerA',
        value: function updatePointerA(a) {
            var x = ALPHA_BAR_SIZE[0] * a;
            this.alphaPointer.style.left = x - 7 + 'px';
        }
    }]);

    return ColorPicker;
}();

function wrapEventCallback(ctrl, picker, eventName, cb) {
    if (cb && typeof cb === 'function') {
        picker['on' + eventName] = function () {
            cb.call.apply(cb, [null, ctrl].concat(Array.prototype.slice.call(arguments)));
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
 * @param      {Object}          container Un elemento HTML che andrà a contenere il picker
 * 
 * oppure
 * 
 * @param      {Object}          options  Le opzioni di creazione
 * @return     {Object}          ritorna un controller per impostare e recuperare il colore corrente del picker
 */
function createPicker(options) {
    var picker = new ColorPicker(options);
    var cbEvents = {};
    return {
        get element() {
            return picker.element;
        },

        get rgb() {
            return [picker.R, picker.G, picker.B];
        },

        set rgb(_ref11) {
            var _ref12 = _slicedToArray(_ref11, 3),
                r = _ref12[0],
                g = _ref12[1],
                b = _ref12[2];

            var _ref13 = [(0, _utils.limit)(r, 0, 255), (0, _utils.limit)(g, 0, 255), (0, _utils.limit)(b, 0, 255)];
            r = _ref13[0];
            g = _ref13[1];
            b = _ref13[2];

            picker.onValueChanged(RGBA_USER, [r, g, b, 1]);
        },

        get hsl() {
            return [picker.H, picker.S, picker.L];
        },

        set hsl(_ref14) {
            var _ref15 = _slicedToArray(_ref14, 3),
                h = _ref15[0],
                s = _ref15[1],
                l = _ref15[2];

            var _ref16 = [(0, _utils.limit)(h, 0, 360), (0, _utils.limit)(s, 0, 100), (0, _utils.limit)(l, 0, 100)];
            h = _ref16[0];
            s = _ref16[1];
            l = _ref16[2];

            picker.onValueChanged(HSLA_USER, [h, s, l, 1]);
        },

        get rgbhex() {
            return (0, _utils.rgbToHex)(picker.R, picker.G, picker.B);
        },

        get rgba() {
            return [picker.R, picker.G, picker.B, picker.A];
        },

        set rgba(_ref17) {
            var _ref18 = _slicedToArray(_ref17, 4),
                r = _ref18[0],
                g = _ref18[1],
                b = _ref18[2],
                a = _ref18[3];

            var _ref19 = [(0, _utils.limit)(r, 0, 255), (0, _utils.limit)(g, 0, 255), (0, _utils.limit)(b, 0, 255), (0, _utils.limit)(a, 0, 1)];
            r = _ref19[0];
            g = _ref19[1];
            b = _ref19[2];
            a = _ref19[3];

            picker.onValueChanged(RGBA_USER, [r, g, b, a]);
        },

        get hsla() {
            return [picker.H, picker.S, picker.L, picker.A];
        },

        set hsla(_ref20) {
            var _ref21 = _slicedToArray(_ref20, 4),
                h = _ref21[0],
                s = _ref21[1],
                l = _ref21[2],
                a = _ref21[3];

            var _ref22 = [(0, _utils.limit)(h, 0, 360), (0, _utils.limit)(s, 0, 100), (0, _utils.limit)(l, 0, 100), (0, _utils.limit)(a, 0, 1)];
            h = _ref22[0];
            s = _ref22[1];
            l = _ref22[2];
            a = _ref22[3];

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
                return 'rgba(' + picker.R + ',' + picker.G + ',' + picker.B + ',' + picker.A + ')';
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
            return Object.keys(picker.palette).filter(function (k) {
                return picker.palette[k];
            });
        },

        on: function on(eventName, cb) {
            if (eventName) {
                wrapEventCallback(this, picker, eventName, cb);
                cbEvents[eventName] = cb;
            }
            return this;
        },
        off: function off(eventName) {
            return this.on(eventName, null);
        }
    };
}

exports.createPicker = createPicker;
exports.parseColorToRgb = parseColorToRgb;
exports.parseColorToRgba = parseColorToRgba;
exports.rgbToHex = _utils.rgbToHex;
exports.hslToRgb = _utils.hslToRgb;
exports.rgbToHsl = _utils.rgbToHsl;
exports.rgbToInt = _utils.rgbToInt;
exports.intToRgb = _utils.intToRgb;
exports.COLOR_NAMES = _utils.COLOR_NAMES;
exports.PALETTE_MATERIAL_500 = _utils.PALETTE_MATERIAL_500;
exports.PALETTE_MATERIAL_CHROME = _utils.PALETTE_MATERIAL_CHROME;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./main.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./main.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".a-color-picker {\n    background-color: #fafafa;\n    padding: 2px;\n    box-sizing: border-box;\n    display: inline-flex;\n    flex-direction: column;\n    user-select: none;\n    width: 208px;\n    font: 400 10px Helvetica,Arial,sans-serif;\n}\n\n.a-color-picker input {\n    box-sizing: border-box;\n}\n\n.a-color-picker-row {\n    padding: 2px;\n    box-sizing: border-box;\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    justify-content: space-between;\n    user-select: none;\n}\n\n.a-color-picker-row:not(:first-child) {\n    border-top: solid 1px #eee;\n}\n\n.a-color-picker-column {\n    display: flex;\n    flex-direction: column;\n}\n\n.a-color-picker-cell {\n    flex: 1 1 auto;\n}\n\n.a-color-picker-stack {\n    position: relative;\n    overflow: hidden;\n}\n\n.a-color-picker-dot {\n    position: absolute;\n    width: 14px;\n    height: 14px;\n    top: 0px;\n    left: 0px;\n    background: rgba(255, 255, 255, 0.59);\n    pointer-events: none;\n    border-radius: 50px;\n    border: solid 1px #074462;\n}\n\n.a-color-picker-h,\n.a-color-picker-a {\n    border-radius: 2px;\n}\n\n.a-color-picker-preview {\n    box-sizing: border-box;\n    width: 40px;\n    height: 40px;\n    user-select: none;\n}\n\n.a-color-picker-circle {\n    border-radius: 50px;\n    border: solid 1px #eee;    \n}\n\n.a-color-picker-hsl,\n.a-color-picker-rgb,\n.a-color-picker-single-input {\n    justify-content: space-evenly;\n}\n\n.a-color-picker-hsl>label,\n.a-color-picker-rgb>label,\n.a-color-picker-single-input>label {\n    padding: 0 6px;\n    flex: 0 0 auto;\n}\n\n.a-color-picker-hsl>input,\n.a-color-picker-rgb>input,\n.a-color-picker-single-input>input {\n    text-align: center;\n    padding: 2px 0px;\n    width: 0;\n    flex: 1 1 auto;\n}\n\n.a-color-picker-transparent {\n    background-image: linear-gradient(to right, #f2eeee 1px, transparent 1px), linear-gradient(to bottom, #f2eeee 1px, transparent 1px);\n    background-size: 8px 8px;\n}\n\n.a-color-picker.hide-hsl [show-on-hsl],\n.a-color-picker.hide-rgb [show-on-rgb],\n.a-color-picker.hide-single-input [show-on-single-input],\n.a-color-picker.hide-alpha [show-on-alpha] {\n    display: none;\n}\n\n.a-color-picker-clipbaord {\n    width: 100%;\n    height: 100%;\n    opacity: 0;\n    cursor: pointer;\n}\n\n.a-color-picker-palette {\n    flex-flow: wrap;\n    flex-direction: row;\n    justify-content: flex-start;\n    padding: 2px 0px;\n}\n\n.a-color-picker-palette-color {\n    width: 15px;\n    height: 15px;\n    flex: 0 1 15px;\n    margin: 5px;\n    box-sizing: border-box;\n    cursor: pointer;\n    border-radius: 3px;\n    border: solid 1px rgba(203, 203, 203, 0.32);\n}\n\n.a-color-picker-palette-add {\n    text-align: center;\n    line-height: 13px;\n    color: #607D8B;\n}", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var COLOR_NAMES = { 'aliceblue': '#F0F8FF', 'antiquewhite': '#FAEBD7', 'aqua': '#00FFFF', 'aquamarine': '#7FFFD4', 'azure': '#F0FFFF', 'beige': '#F5F5DC', 'bisque': '#FFE4C4', 'black': '#000000', 'blanchedalmond': '#FFEBCD', 'blue': '#0000FF', 'blueviolet': '#8A2BE2', 'brown': '#A52A2A', 'burlywood': '#DEB887', 'cadetblue': '#5F9EA0', 'chartreuse': '#7FFF00', 'chocolate': '#D2691E', 'coral': '#FF7F50', 'cornflowerblue': '#6495ED', 'cornsilk': '#FFF8DC', 'crimson': '#DC143C', 'cyan': '#00FFFF', 'darkblue': '#00008B', 'darkcyan': '#008B8B', 'darkgoldenrod': '#B8860B', 'darkgray': '#A9A9A9', 'darkgrey': '#A9A9A9', 'darkgreen': '#006400', 'darkkhaki': '#BDB76B', 'darkmagenta': '#8B008B', 'darkolivegreen': '#556B2F', 'darkorange': '#FF8C00', 'darkorchid': '#9932CC', 'darkred': '#8B0000', 'darksalmon': '#E9967A', 'darkseagreen': '#8FBC8F', 'darkslateblue': '#483D8B', 'darkslategray': '#2F4F4F', 'darkslategrey': '#2F4F4F', 'darkturquoise': '#00CED1', 'darkviolet': '#9400D3', 'deeppink': '#FF1493', 'deepskyblue': '#00BFFF', 'dimgray': '#696969', 'dimgrey': '#696969', 'dodgerblue': '#1E90FF', 'firebrick': '#B22222', 'floralwhite': '#FFFAF0', 'forestgreen': '#228B22', 'fuchsia': '#FF00FF', 'gainsboro': '#DCDCDC', 'ghostwhite': '#F8F8FF', 'gold': '#FFD700', 'goldenrod': '#DAA520', 'gray': '#808080', 'grey': '#808080', 'green': '#008000', 'greenyellow': '#ADFF2F', 'honeydew': '#F0FFF0', 'hotpink': '#FF69B4', 'indianred ': '#CD5C5C', 'indigo ': '#4B0082', 'ivory': '#FFFFF0', 'khaki': '#F0E68C', 'lavender': '#E6E6FA', 'lavenderblush': '#FFF0F5', 'lawngreen': '#7CFC00', 'lemonchiffon': '#FFFACD', 'lightblue': '#ADD8E6', 'lightcoral': '#F08080', 'lightcyan': '#E0FFFF', 'lightgoldenrodyellow': '#FAFAD2', 'lightgray': '#D3D3D3', 'lightgrey': '#D3D3D3', 'lightgreen': '#90EE90', 'lightpink': '#FFB6C1', 'lightsalmon': '#FFA07A', 'lightseagreen': '#20B2AA', 'lightskyblue': '#87CEFA', 'lightslategray': '#778899', 'lightslategrey': '#778899', 'lightsteelblue': '#B0C4DE', 'lightyellow': '#FFFFE0', 'lime': '#00FF00', 'limegreen': '#32CD32', 'linen': '#FAF0E6', 'magenta': '#FF00FF', 'maroon': '#800000', 'mediumaquamarine': '#66CDAA', 'mediumblue': '#0000CD', 'mediumorchid': '#BA55D3', 'mediumpurple': '#9370DB', 'mediumseagreen': '#3CB371', 'mediumslateblue': '#7B68EE', 'mediumspringgreen': '#00FA9A', 'mediumturquoise': '#48D1CC', 'mediumvioletred': '#C71585', 'midnightblue': '#191970', 'mintcream': '#F5FFFA', 'mistyrose': '#FFE4E1', 'moccasin': '#FFE4B5', 'navajowhite': '#FFDEAD', 'navy': '#000080', 'oldlace': '#FDF5E6', 'olive': '#808000', 'olivedrab': '#6B8E23', 'orange': '#FFA500', 'orangered': '#FF4500', 'orchid': '#DA70D6', 'palegoldenrod': '#EEE8AA', 'palegreen': '#98FB98', 'paleturquoise': '#AFEEEE', 'palevioletred': '#DB7093', 'papayawhip': '#FFEFD5', 'peachpuff': '#FFDAB9', 'peru': '#CD853F', 'pink': '#FFC0CB', 'plum': '#DDA0DD', 'powderblue': '#B0E0E6', 'purple': '#800080', 'rebeccapurple': '#663399', 'red': '#FF0000', 'rosybrown': '#BC8F8F', 'royalblue': '#4169E1', 'saddlebrown': '#8B4513', 'salmon': '#FA8072', 'sandybrown': '#F4A460', 'seagreen': '#2E8B57', 'seashell': '#FFF5EE', 'sienna': '#A0522D', 'silver': '#C0C0C0', 'skyblue': '#87CEEB', 'slateblue': '#6A5ACD', 'slategray': '#708090', 'slategrey': '#708090', 'snow': '#FFFAFA', 'springgreen': '#00FF7F', 'steelblue': '#4682B4', 'tan': '#D2B48C', 'teal': '#008080', 'thistle': '#D8BFD8', 'tomato': '#FF6347', 'turquoise': '#40E0D0', 'violet': '#EE82EE', 'wheat': '#F5DEB3', 'white': '#FFFFFF', 'whitesmoke': '#F5F5F5', 'yellow': '#FFFF00', 'yellowgreen': '#9ACD32' };
var PALETTE_MATERIAL_500 = ['#F44336', '#E91E63', '#E91E63', '#9C27B0', '#9C27B0', '#673AB7', '#673AB7', '#3F51B5', '#3F51B5', '#2196F3', '#2196F3', '#03A9F4', '#03A9F4', '#00BCD4', '#00BCD4', '#009688', '#009688', '#4CAF50', '#4CAF50', '#8BC34A', '#8BC34A', '#CDDC39', '#CDDC39', '#FFEB3B', '#FFEB3B', '#FFC107', '#FFC107', '#FF9800', '#FF9800', '#FF5722', '#FF5722', '#795548', '#795548', '#9E9E9E', '#9E9E9E', '#607D8B', '#607D8B'];
var PALETTE_MATERIAL_CHROME = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#9e9e9e', '#607d8b'];

function limit(value, min, max) {
    value = +value;
    return isNaN(value) ? min : value < min ? min : value > max ? max : value;
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
    var _ref = [limit(r, 0, 255), limit(g, 0, 255), limit(b, 0, 255)];
    r = _ref[0];
    g = _ref[1];
    b = _ref[2];

    return "#" + ("000000" + (r << 16 | g << 8 | b).toString(16)).slice(-6);
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
    var r = void 0,
        g = void 0,
        b = void 0;
    var _ref2 = [limit(h, 0, 360) / 360, limit(s, 0, 100) / 100, limit(l, 0, 100) / 100];
    h = _ref2[0];
    s = _ref2[1];
    l = _ref2[2];


    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

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
    var _ref3 = [limit(r, 0, 255) / 255, limit(g, 0, 255) / 255, limit(b, 0, 255) / 255];
    r = _ref3[0];
    g = _ref3[1];
    b = _ref3[2];


    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h = void 0,
        s = void 0,
        l = (max + min) / 2;

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
    return [int >> 16 & 255, //r
    int >> 8 & 255, //g
    int & 255 //b
    ];
}

exports.COLOR_NAMES = COLOR_NAMES;
exports.PALETTE_MATERIAL_500 = PALETTE_MATERIAL_500;
exports.PALETTE_MATERIAL_CHROME = PALETTE_MATERIAL_CHROME;
exports.rgbToHex = rgbToHex;
exports.hslToRgb = hslToRgb;
exports.rgbToHsl = rgbToHsl;
exports.rgbToInt = rgbToInt;
exports.intToRgb = intToRgb;
exports.limit = limit;
exports.ensureArray = ensureArray;
exports.nvl = nvl;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = {"O_RDONLY":0,"O_WRONLY":1,"O_RDWR":2,"S_IFMT":61440,"S_IFREG":32768,"S_IFDIR":16384,"S_IFCHR":8192,"S_IFBLK":24576,"S_IFIFO":4096,"S_IFLNK":40960,"S_IFSOCK":49152,"O_CREAT":512,"O_EXCL":2048,"O_NOCTTY":131072,"O_TRUNC":1024,"O_APPEND":8,"O_DIRECTORY":1048576,"O_NOFOLLOW":256,"O_SYNC":128,"O_SYMLINK":2097152,"O_NONBLOCK":4,"S_IRWXU":448,"S_IRUSR":256,"S_IWUSR":128,"S_IXUSR":64,"S_IRWXG":56,"S_IRGRP":32,"S_IWGRP":16,"S_IXGRP":8,"S_IRWXO":7,"S_IROTH":4,"S_IWOTH":2,"S_IXOTH":1,"E2BIG":7,"EACCES":13,"EADDRINUSE":48,"EADDRNOTAVAIL":49,"EAFNOSUPPORT":47,"EAGAIN":35,"EALREADY":37,"EBADF":9,"EBADMSG":94,"EBUSY":16,"ECANCELED":89,"ECHILD":10,"ECONNABORTED":53,"ECONNREFUSED":61,"ECONNRESET":54,"EDEADLK":11,"EDESTADDRREQ":39,"EDOM":33,"EDQUOT":69,"EEXIST":17,"EFAULT":14,"EFBIG":27,"EHOSTUNREACH":65,"EIDRM":90,"EILSEQ":92,"EINPROGRESS":36,"EINTR":4,"EINVAL":22,"EIO":5,"EISCONN":56,"EISDIR":21,"ELOOP":62,"EMFILE":24,"EMLINK":31,"EMSGSIZE":40,"EMULTIHOP":95,"ENAMETOOLONG":63,"ENETDOWN":50,"ENETRESET":52,"ENETUNREACH":51,"ENFILE":23,"ENOBUFS":55,"ENODATA":96,"ENODEV":19,"ENOENT":2,"ENOEXEC":8,"ENOLCK":77,"ENOLINK":97,"ENOMEM":12,"ENOMSG":91,"ENOPROTOOPT":42,"ENOSPC":28,"ENOSR":98,"ENOSTR":99,"ENOSYS":78,"ENOTCONN":57,"ENOTDIR":20,"ENOTEMPTY":66,"ENOTSOCK":38,"ENOTSUP":45,"ENOTTY":25,"ENXIO":6,"EOPNOTSUPP":102,"EOVERFLOW":84,"EPERM":1,"EPIPE":32,"EPROTO":100,"EPROTONOSUPPORT":43,"EPROTOTYPE":41,"ERANGE":34,"EROFS":30,"ESPIPE":29,"ESRCH":3,"ESTALE":70,"ETIME":101,"ETIMEDOUT":60,"ETXTBSY":26,"EWOULDBLOCK":35,"EXDEV":18,"SIGHUP":1,"SIGINT":2,"SIGQUIT":3,"SIGILL":4,"SIGTRAP":5,"SIGABRT":6,"SIGIOT":6,"SIGBUS":10,"SIGFPE":8,"SIGKILL":9,"SIGUSR1":30,"SIGSEGV":11,"SIGUSR2":31,"SIGPIPE":13,"SIGALRM":14,"SIGTERM":15,"SIGCHLD":20,"SIGCONT":19,"SIGSTOP":17,"SIGTSTP":18,"SIGTTIN":21,"SIGTTOU":22,"SIGURG":16,"SIGXCPU":24,"SIGXFSZ":25,"SIGVTALRM":26,"SIGPROF":27,"SIGWINCH":28,"SIGIO":23,"SIGSYS":12,"SSL_OP_ALL":2147486719,"SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION":262144,"SSL_OP_CIPHER_SERVER_PREFERENCE":4194304,"SSL_OP_CISCO_ANYCONNECT":32768,"SSL_OP_COOKIE_EXCHANGE":8192,"SSL_OP_CRYPTOPRO_TLSEXT_BUG":2147483648,"SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS":2048,"SSL_OP_EPHEMERAL_RSA":0,"SSL_OP_LEGACY_SERVER_CONNECT":4,"SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER":32,"SSL_OP_MICROSOFT_SESS_ID_BUG":1,"SSL_OP_MSIE_SSLV2_RSA_PADDING":0,"SSL_OP_NETSCAPE_CA_DN_BUG":536870912,"SSL_OP_NETSCAPE_CHALLENGE_BUG":2,"SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG":1073741824,"SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG":8,"SSL_OP_NO_COMPRESSION":131072,"SSL_OP_NO_QUERY_MTU":4096,"SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION":65536,"SSL_OP_NO_SSLv2":16777216,"SSL_OP_NO_SSLv3":33554432,"SSL_OP_NO_TICKET":16384,"SSL_OP_NO_TLSv1":67108864,"SSL_OP_NO_TLSv1_1":268435456,"SSL_OP_NO_TLSv1_2":134217728,"SSL_OP_PKCS1_CHECK_1":0,"SSL_OP_PKCS1_CHECK_2":0,"SSL_OP_SINGLE_DH_USE":1048576,"SSL_OP_SINGLE_ECDH_USE":524288,"SSL_OP_SSLEAY_080_CLIENT_DH_BUG":128,"SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG":0,"SSL_OP_TLS_BLOCK_PADDING_BUG":512,"SSL_OP_TLS_D5_BUG":256,"SSL_OP_TLS_ROLLBACK_BUG":8388608,"ENGINE_METHOD_DSA":2,"ENGINE_METHOD_DH":4,"ENGINE_METHOD_RAND":8,"ENGINE_METHOD_ECDH":16,"ENGINE_METHOD_ECDSA":32,"ENGINE_METHOD_CIPHERS":64,"ENGINE_METHOD_DIGESTS":128,"ENGINE_METHOD_STORE":256,"ENGINE_METHOD_PKEY_METHS":512,"ENGINE_METHOD_PKEY_ASN1_METHS":1024,"ENGINE_METHOD_ALL":65535,"ENGINE_METHOD_NONE":0,"DH_CHECK_P_NOT_SAFE_PRIME":2,"DH_CHECK_P_NOT_PRIME":1,"DH_UNABLE_TO_CHECK_GENERATOR":4,"DH_NOT_SUITABLE_GENERATOR":8,"NPN_ENABLED":1,"RSA_PKCS1_PADDING":1,"RSA_SSLV23_PADDING":2,"RSA_NO_PADDING":3,"RSA_PKCS1_OAEP_PADDING":4,"RSA_X931_PADDING":5,"RSA_PKCS1_PSS_PADDING":6,"POINT_CONVERSION_COMPRESSED":2,"POINT_CONVERSION_UNCOMPRESSED":4,"POINT_CONVERSION_HYBRID":6,"F_OK":0,"R_OK":4,"W_OK":2,"X_OK":1,"UV_UDP_REUSEADDR":4}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(9);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var AColorPicker = __webpack_require__(2);
var body = document.querySelector('body');

[].concat(_toConsumableArray(document.querySelectorAll('.picker'))).forEach(function (el) {
    AColorPicker.createPicker(el).on('change', function (picker) {
        // body.style.backgroundColor = picker.color;
    });
});

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(10);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./docs.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./docs.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Roboto);", ""]);

// module
exports.push([module.i, "* {\n\tbox-sizing: border-box;\n}\n\nbody {\n\tfont-family: 'Roboto', sans-serif;\n\tfont-size: 14px;\n\tline-height: 1.5;\n\tmargin: 0;\n}\n\n.shadow {\n\tbox-shadow: 0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(3, 1, 1, 0.08);\n}\n\n.title {\n\tpadding: 8px;\n\tbackground-color: #F0C531;\n}\n\n.badges {\n\tbackground: #faeaaf;\n\tpadding: 4px;\n}\n\n.badges a {\n\ttext-decoration: none;\n}\n\n.samples {\n\tdisplay: flex;\n\tflex-wrap: wrap;\n}\n\n.samples>section {\n\tflex: 0 0 300px;\n\tmargin: 8px;\n\tpadding: 4px;\n\tborder-radius: 2px;\n\tbackground-color: #EFE9E7;\n}\n\n.samples>section {\n\tdisplay: grid;\n\tgrid-gap: 8px;\n\tgrid-auto-rows: .25fr 2fr 1fr;\n\tjustify-items: center;\n}\n\npre.prettyprint {\n\tborder: none;\n}", ""]);

// exports


/***/ })
/******/ ]);
//# sourceMappingURL=docs.js.map