// colyseus.js@0.16.16 (@colyseus/schema 3.0.24)
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define('colyseus.js', ['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Colyseus = {}));
})(this, (function (exports) { 'use strict';

    function _mergeNamespaces(n, m) {
        m.forEach(function (e) {
            e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
                if (k !== 'default' && !(k in n)) {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        });
        return Object.freeze(n);
    }

    //
    // Polyfills for legacy environments
    //
    /*
     * Support Android 4.4.x
     */
    if (!ArrayBuffer.isView) {
        ArrayBuffer.isView = (a) => {
            return a !== null && typeof (a) === 'object' && a.buffer instanceof ArrayBuffer;
        };
    }
    // Cocos Creator does not provide "FormData"
    // Define a dummy implementation so it doesn't crash
    if (typeof (FormData) === "undefined") {
        // @ts-ignore
        global['FormData'] = class {
        };
    }
    // Define globalThis if not available.
    // https://github.com/colyseus/colyseus.js/issues/86
    if (typeof (globalThis) === "undefined" &&
        typeof (window) !== "undefined") {
        // @ts-ignore
        window['globalThis'] = window;
    }

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */


    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }

    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    var CloseCode;
    (function (CloseCode) {
        CloseCode[CloseCode["CONSENTED"] = 4000] = "CONSENTED";
        CloseCode[CloseCode["DEVMODE_RESTART"] = 4010] = "DEVMODE_RESTART";
    })(CloseCode || (CloseCode = {}));
    class ServerError extends Error {
        constructor(code, message) {
            super(message);
            this.name = "ServerError";
            this.code = code;
        }
    }

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    var umd$1 = {exports: {}};

    var umd = umd$1.exports;

    var hasRequiredUmd;

    function requireUmd () {
    	if (hasRequiredUmd) return umd$1.exports;
    	hasRequiredUmd = 1;
    	(function (module, exports) {
    		(function (global, factory) {
    		    factory(exports) ;
    		})(umd, (function (exports) {
    		    const SWITCH_TO_STRUCTURE = 255; // (decoding collides with DELETE_AND_ADD + fieldIndex = 63)
    		    const TYPE_ID = 213;
    		    /**
    		     * Encoding Schema field operations.
    		     */
    		    exports.OPERATION = void 0;
    		    (function (OPERATION) {
    		        OPERATION[OPERATION["ADD"] = 128] = "ADD";
    		        OPERATION[OPERATION["REPLACE"] = 0] = "REPLACE";
    		        OPERATION[OPERATION["DELETE"] = 64] = "DELETE";
    		        OPERATION[OPERATION["DELETE_AND_MOVE"] = 96] = "DELETE_AND_MOVE";
    		        OPERATION[OPERATION["MOVE_AND_ADD"] = 160] = "MOVE_AND_ADD";
    		        OPERATION[OPERATION["DELETE_AND_ADD"] = 192] = "DELETE_AND_ADD";
    		        /**
    		         * Collection operations
    		         */
    		        OPERATION[OPERATION["CLEAR"] = 10] = "CLEAR";
    		        /**
    		         * ArraySchema operations
    		         */
    		        OPERATION[OPERATION["REVERSE"] = 15] = "REVERSE";
    		        OPERATION[OPERATION["MOVE"] = 32] = "MOVE";
    		        OPERATION[OPERATION["DELETE_BY_REFID"] = 33] = "DELETE_BY_REFID";
    		        OPERATION[OPERATION["ADD_BY_REFID"] = 129] = "ADD_BY_REFID";
    		    })(exports.OPERATION || (exports.OPERATION = {}));

    		    Symbol.metadata ??= Symbol.for("Symbol.metadata");

    		    const $track = Symbol("$track");
    		    const $encoder = Symbol("$encoder");
    		    const $decoder = Symbol("$decoder");
    		    const $filter = Symbol("$filter");
    		    const $getByIndex = Symbol("$getByIndex");
    		    const $deleteByIndex = Symbol("$deleteByIndex");
    		    /**
    		     * Used to hold ChangeTree instances whitin the structures
    		     */
    		    const $changes = Symbol('$changes');
    		    /**
    		     * Used to keep track of the type of the child elements of a collection
    		     * (MapSchema, ArraySchema, etc.)
    		     */
    		    const $childType = Symbol('$childType');
    		    /**
    		     * Optional "discard" method for custom types (ArraySchema)
    		     * (Discards changes for next serialization)
    		     */
    		    const $onEncodeEnd = Symbol('$onEncodeEnd');
    		    /**
    		     * When decoding, this method is called after the instance is fully decoded
    		     */
    		    const $onDecodeEnd = Symbol("$onDecodeEnd");
    		    /**
    		     * Metadata
    		     */
    		    const $descriptors = Symbol("$descriptors");
    		    const $numFields = "$__numFields";
    		    const $refTypeFieldIndexes = "$__refTypeFieldIndexes";
    		    const $viewFieldIndexes = "$__viewFieldIndexes";
    		    const $fieldIndexesByViewTag = "$__fieldIndexesByViewTag";

    		    /**
    		     * Copyright (c) 2018 Endel Dreyer
    		     * Copyright (c) 2014 Ion Drive Software Ltd.
    		     *
    		     * Permission is hereby granted, free of charge, to any person obtaining a copy
    		     * of this software and associated documentation files (the "Software"), to deal
    		     * in the Software without restriction, including without limitation the rights
    		     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    		     * copies of the Software, and to permit persons to whom the Software is
    		     * furnished to do so, subject to the following conditions:
    		     *
    		     * The above copyright notice and this permission notice shall be included in all
    		     * copies or substantial portions of the Software.
    		     *
    		     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    		     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    		     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    		     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    		     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    		     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    		     * SOFTWARE
    		     */
    		    /**
    		     * msgpack implementation highly based on notepack.io
    		     * https://github.com/darrachequesne/notepack
    		     */
    		    let textEncoder;
    		    // @ts-ignore
    		    try {
    		        textEncoder = new TextEncoder();
    		    }
    		    catch (e) { }
    		    const _convoBuffer$1 = new ArrayBuffer(8);
    		    const _int32$1 = new Int32Array(_convoBuffer$1);
    		    const _float32$1 = new Float32Array(_convoBuffer$1);
    		    const _float64$1 = new Float64Array(_convoBuffer$1);
    		    const _int64$1 = new BigInt64Array(_convoBuffer$1);
    		    const hasBufferByteLength = (typeof Buffer !== 'undefined' && Buffer.byteLength);
    		    const utf8Length = (hasBufferByteLength)
    		        ? Buffer.byteLength // node
    		        : function (str, _) {
    		            var c = 0, length = 0;
    		            for (var i = 0, l = str.length; i < l; i++) {
    		                c = str.charCodeAt(i);
    		                if (c < 0x80) {
    		                    length += 1;
    		                }
    		                else if (c < 0x800) {
    		                    length += 2;
    		                }
    		                else if (c < 0xd800 || c >= 0xe000) {
    		                    length += 3;
    		                }
    		                else {
    		                    i++;
    		                    length += 4;
    		                }
    		            }
    		            return length;
    		        };
    		    function utf8Write(view, str, it) {
    		        var c = 0;
    		        for (var i = 0, l = str.length; i < l; i++) {
    		            c = str.charCodeAt(i);
    		            if (c < 0x80) {
    		                view[it.offset++] = c;
    		            }
    		            else if (c < 0x800) {
    		                view[it.offset] = 0xc0 | (c >> 6);
    		                view[it.offset + 1] = 0x80 | (c & 0x3f);
    		                it.offset += 2;
    		            }
    		            else if (c < 0xd800 || c >= 0xe000) {
    		                view[it.offset] = 0xe0 | (c >> 12);
    		                view[it.offset + 1] = 0x80 | (c >> 6 & 0x3f);
    		                view[it.offset + 2] = 0x80 | (c & 0x3f);
    		                it.offset += 3;
    		            }
    		            else {
    		                i++;
    		                c = 0x10000 + (((c & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
    		                view[it.offset] = 0xf0 | (c >> 18);
    		                view[it.offset + 1] = 0x80 | (c >> 12 & 0x3f);
    		                view[it.offset + 2] = 0x80 | (c >> 6 & 0x3f);
    		                view[it.offset + 3] = 0x80 | (c & 0x3f);
    		                it.offset += 4;
    		            }
    		        }
    		    }
    		    function int8$1(bytes, value, it) {
    		        bytes[it.offset++] = value & 255;
    		    }
    		    function uint8$1(bytes, value, it) {
    		        bytes[it.offset++] = value & 255;
    		    }
    		    function int16$1(bytes, value, it) {
    		        bytes[it.offset++] = value & 255;
    		        bytes[it.offset++] = (value >> 8) & 255;
    		    }
    		    function uint16$1(bytes, value, it) {
    		        bytes[it.offset++] = value & 255;
    		        bytes[it.offset++] = (value >> 8) & 255;
    		    }
    		    function int32$1(bytes, value, it) {
    		        bytes[it.offset++] = value & 255;
    		        bytes[it.offset++] = (value >> 8) & 255;
    		        bytes[it.offset++] = (value >> 16) & 255;
    		        bytes[it.offset++] = (value >> 24) & 255;
    		    }
    		    function uint32$1(bytes, value, it) {
    		        const b4 = value >> 24;
    		        const b3 = value >> 16;
    		        const b2 = value >> 8;
    		        const b1 = value;
    		        bytes[it.offset++] = b1 & 255;
    		        bytes[it.offset++] = b2 & 255;
    		        bytes[it.offset++] = b3 & 255;
    		        bytes[it.offset++] = b4 & 255;
    		    }
    		    function int64$1(bytes, value, it) {
    		        const high = Math.floor(value / Math.pow(2, 32));
    		        const low = value >>> 0;
    		        uint32$1(bytes, low, it);
    		        uint32$1(bytes, high, it);
    		    }
    		    function uint64$1(bytes, value, it) {
    		        const high = (value / Math.pow(2, 32)) >> 0;
    		        const low = value >>> 0;
    		        uint32$1(bytes, low, it);
    		        uint32$1(bytes, high, it);
    		    }
    		    function bigint64$1(bytes, value, it) {
    		        _int64$1[0] = BigInt.asIntN(64, value);
    		        int32$1(bytes, _int32$1[0], it);
    		        int32$1(bytes, _int32$1[1], it);
    		    }
    		    function biguint64$1(bytes, value, it) {
    		        _int64$1[0] = BigInt.asIntN(64, value);
    		        int32$1(bytes, _int32$1[0], it);
    		        int32$1(bytes, _int32$1[1], it);
    		    }
    		    function float32$1(bytes, value, it) {
    		        _float32$1[0] = value;
    		        int32$1(bytes, _int32$1[0], it);
    		    }
    		    function float64$1(bytes, value, it) {
    		        _float64$1[0] = value;
    		        int32$1(bytes, _int32$1[0 ], it);
    		        int32$1(bytes, _int32$1[1 ], it);
    		    }
    		    function boolean$1(bytes, value, it) {
    		        bytes[it.offset++] = value ? 1 : 0; // uint8
    		    }
    		    function string$1(bytes, value, it) {
    		        // encode `null` strings as empty.
    		        if (!value) {
    		            value = "";
    		        }
    		        let length = utf8Length(value, "utf8");
    		        let size = 0;
    		        // fixstr
    		        if (length < 0x20) {
    		            bytes[it.offset++] = length | 0xa0;
    		            size = 1;
    		        }
    		        // str 8
    		        else if (length < 0x100) {
    		            bytes[it.offset++] = 0xd9;
    		            bytes[it.offset++] = length % 255;
    		            size = 2;
    		        }
    		        // str 16
    		        else if (length < 0x10000) {
    		            bytes[it.offset++] = 0xda;
    		            uint16$1(bytes, length, it);
    		            size = 3;
    		        }
    		        // str 32
    		        else if (length < 0x100000000) {
    		            bytes[it.offset++] = 0xdb;
    		            uint32$1(bytes, length, it);
    		            size = 5;
    		        }
    		        else {
    		            throw new Error('String too long');
    		        }
    		        utf8Write(bytes, value, it);
    		        return size + length;
    		    }
    		    function number$1(bytes, value, it) {
    		        if (isNaN(value)) {
    		            return number$1(bytes, 0, it);
    		        }
    		        else if (!isFinite(value)) {
    		            return number$1(bytes, (value > 0) ? Number.MAX_SAFE_INTEGER : -Number.MAX_SAFE_INTEGER, it);
    		        }
    		        else if (value !== (value | 0)) {
    		            if (Math.abs(value) <= 3.4028235e+38) { // range check
    		                _float32$1[0] = value;
    		                if (Math.abs(Math.abs(_float32$1[0]) - Math.abs(value)) < 1e-4) { // precision check; adjust 1e-n (n = precision) to in-/decrease acceptable precision loss
    		                    // now we know value is in range for f32 and has acceptable precision for f32
    		                    bytes[it.offset++] = 0xca;
    		                    float32$1(bytes, value, it);
    		                    return 5;
    		                }
    		            }
    		            bytes[it.offset++] = 0xcb;
    		            float64$1(bytes, value, it);
    		            return 9;
    		        }
    		        if (value >= 0) {
    		            // positive fixnum
    		            if (value < 0x80) {
    		                bytes[it.offset++] = value & 255; // uint8
    		                return 1;
    		            }
    		            // uint 8
    		            if (value < 0x100) {
    		                bytes[it.offset++] = 0xcc;
    		                bytes[it.offset++] = value & 255; // uint8
    		                return 2;
    		            }
    		            // uint 16
    		            if (value < 0x10000) {
    		                bytes[it.offset++] = 0xcd;
    		                uint16$1(bytes, value, it);
    		                return 3;
    		            }
    		            // uint 32
    		            if (value < 0x100000000) {
    		                bytes[it.offset++] = 0xce;
    		                uint32$1(bytes, value, it);
    		                return 5;
    		            }
    		            // uint 64
    		            bytes[it.offset++] = 0xcf;
    		            uint64$1(bytes, value, it);
    		            return 9;
    		        }
    		        else {
    		            // negative fixnum
    		            if (value >= -32) {
    		                bytes[it.offset++] = 0xe0 | (value + 0x20);
    		                return 1;
    		            }
    		            // int 8
    		            if (value >= -128) {
    		                bytes[it.offset++] = 0xd0;
    		                int8$1(bytes, value, it);
    		                return 2;
    		            }
    		            // int 16
    		            if (value >= -32768) {
    		                bytes[it.offset++] = 0xd1;
    		                int16$1(bytes, value, it);
    		                return 3;
    		            }
    		            // int 32
    		            if (value >= -2147483648) {
    		                bytes[it.offset++] = 0xd2;
    		                int32$1(bytes, value, it);
    		                return 5;
    		            }
    		            // int 64
    		            bytes[it.offset++] = 0xd3;
    		            int64$1(bytes, value, it);
    		            return 9;
    		        }
    		    }
    		    const encode = {
    		        int8: int8$1,
    		        uint8: uint8$1,
    		        int16: int16$1,
    		        uint16: uint16$1,
    		        int32: int32$1,
    		        uint32: uint32$1,
    		        int64: int64$1,
    		        uint64: uint64$1,
    		        bigint64: bigint64$1,
    		        biguint64: biguint64$1,
    		        float32: float32$1,
    		        float64: float64$1,
    		        boolean: boolean$1,
    		        string: string$1,
    		        number: number$1,
    		        utf8Write,
    		        utf8Length,
    		    };

    		    /**
    		     * Copyright (c) 2018 Endel Dreyer
    		     * Copyright (c) 2014 Ion Drive Software Ltd.
    		     *
    		     * Permission is hereby granted, free of charge, to any person obtaining a copy
    		     * of this software and associated documentation files (the "Software"), to deal
    		     * in the Software without restriction, including without limitation the rights
    		     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    		     * copies of the Software, and to permit persons to whom the Software is
    		     * furnished to do so, subject to the following conditions:
    		     *
    		     * The above copyright notice and this permission notice shall be included in all
    		     * copies or substantial portions of the Software.
    		     *
    		     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    		     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    		     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    		     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    		     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    		     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    		     * SOFTWARE
    		     */
    		    // force little endian to facilitate decoding on multiple implementations
    		    const _convoBuffer = new ArrayBuffer(8);
    		    const _int32 = new Int32Array(_convoBuffer);
    		    const _float32 = new Float32Array(_convoBuffer);
    		    const _float64 = new Float64Array(_convoBuffer);
    		    const _uint64 = new BigUint64Array(_convoBuffer);
    		    const _int64 = new BigInt64Array(_convoBuffer);
    		    function utf8Read(bytes, it, length) {
    		        var string = '', chr = 0;
    		        for (var i = it.offset, end = it.offset + length; i < end; i++) {
    		            var byte = bytes[i];
    		            if ((byte & 0x80) === 0x00) {
    		                string += String.fromCharCode(byte);
    		                continue;
    		            }
    		            if ((byte & 0xe0) === 0xc0) {
    		                string += String.fromCharCode(((byte & 0x1f) << 6) |
    		                    (bytes[++i] & 0x3f));
    		                continue;
    		            }
    		            if ((byte & 0xf0) === 0xe0) {
    		                string += String.fromCharCode(((byte & 0x0f) << 12) |
    		                    ((bytes[++i] & 0x3f) << 6) |
    		                    ((bytes[++i] & 0x3f) << 0));
    		                continue;
    		            }
    		            if ((byte & 0xf8) === 0xf0) {
    		                chr = ((byte & 0x07) << 18) |
    		                    ((bytes[++i] & 0x3f) << 12) |
    		                    ((bytes[++i] & 0x3f) << 6) |
    		                    ((bytes[++i] & 0x3f) << 0);
    		                if (chr >= 0x010000) { // surrogate pair
    		                    chr -= 0x010000;
    		                    string += String.fromCharCode((chr >>> 10) + 0xD800, (chr & 0x3FF) + 0xDC00);
    		                }
    		                else {
    		                    string += String.fromCharCode(chr);
    		                }
    		                continue;
    		            }
    		            console.error('Invalid byte ' + byte.toString(16));
    		            // (do not throw error to avoid server/client from crashing due to hack attemps)
    		            // throw new Error('Invalid byte ' + byte.toString(16));
    		        }
    		        it.offset += length;
    		        return string;
    		    }
    		    function int8(bytes, it) {
    		        return uint8(bytes, it) << 24 >> 24;
    		    }
    		    function uint8(bytes, it) {
    		        return bytes[it.offset++];
    		    }
    		    function int16(bytes, it) {
    		        return uint16(bytes, it) << 16 >> 16;
    		    }
    		    function uint16(bytes, it) {
    		        return bytes[it.offset++] | bytes[it.offset++] << 8;
    		    }
    		    function int32(bytes, it) {
    		        return bytes[it.offset++] | bytes[it.offset++] << 8 | bytes[it.offset++] << 16 | bytes[it.offset++] << 24;
    		    }
    		    function uint32(bytes, it) {
    		        return int32(bytes, it) >>> 0;
    		    }
    		    function float32(bytes, it) {
    		        _int32[0] = int32(bytes, it);
    		        return _float32[0];
    		    }
    		    function float64(bytes, it) {
    		        _int32[0 ] = int32(bytes, it);
    		        _int32[1 ] = int32(bytes, it);
    		        return _float64[0];
    		    }
    		    function int64(bytes, it) {
    		        const low = uint32(bytes, it);
    		        const high = int32(bytes, it) * Math.pow(2, 32);
    		        return high + low;
    		    }
    		    function uint64(bytes, it) {
    		        const low = uint32(bytes, it);
    		        const high = uint32(bytes, it) * Math.pow(2, 32);
    		        return high + low;
    		    }
    		    function bigint64(bytes, it) {
    		        _int32[0] = int32(bytes, it);
    		        _int32[1] = int32(bytes, it);
    		        return _int64[0];
    		    }
    		    function biguint64(bytes, it) {
    		        _int32[0] = int32(bytes, it);
    		        _int32[1] = int32(bytes, it);
    		        return _uint64[0];
    		    }
    		    function boolean(bytes, it) {
    		        return uint8(bytes, it) > 0;
    		    }
    		    function string(bytes, it) {
    		        const prefix = bytes[it.offset++];
    		        let length;
    		        if (prefix < 0xc0) {
    		            // fixstr
    		            length = prefix & 0x1f;
    		        }
    		        else if (prefix === 0xd9) {
    		            length = uint8(bytes, it);
    		        }
    		        else if (prefix === 0xda) {
    		            length = uint16(bytes, it);
    		        }
    		        else if (prefix === 0xdb) {
    		            length = uint32(bytes, it);
    		        }
    		        return utf8Read(bytes, it, length);
    		    }
    		    function number(bytes, it) {
    		        const prefix = bytes[it.offset++];
    		        if (prefix < 0x80) {
    		            // positive fixint
    		            return prefix;
    		        }
    		        else if (prefix === 0xca) {
    		            // float 32
    		            return float32(bytes, it);
    		        }
    		        else if (prefix === 0xcb) {
    		            // float 64
    		            return float64(bytes, it);
    		        }
    		        else if (prefix === 0xcc) {
    		            // uint 8
    		            return uint8(bytes, it);
    		        }
    		        else if (prefix === 0xcd) {
    		            // uint 16
    		            return uint16(bytes, it);
    		        }
    		        else if (prefix === 0xce) {
    		            // uint 32
    		            return uint32(bytes, it);
    		        }
    		        else if (prefix === 0xcf) {
    		            // uint 64
    		            return uint64(bytes, it);
    		        }
    		        else if (prefix === 0xd0) {
    		            // int 8
    		            return int8(bytes, it);
    		        }
    		        else if (prefix === 0xd1) {
    		            // int 16
    		            return int16(bytes, it);
    		        }
    		        else if (prefix === 0xd2) {
    		            // int 32
    		            return int32(bytes, it);
    		        }
    		        else if (prefix === 0xd3) {
    		            // int 64
    		            return int64(bytes, it);
    		        }
    		        else if (prefix > 0xdf) {
    		            // negative fixint
    		            return (0xff - prefix + 1) * -1;
    		        }
    		    }
    		    function stringCheck(bytes, it) {
    		        const prefix = bytes[it.offset];
    		        return (
    		        // fixstr
    		        (prefix < 0xc0 && prefix > 0xa0) ||
    		            // str 8
    		            prefix === 0xd9 ||
    		            // str 16
    		            prefix === 0xda ||
    		            // str 32
    		            prefix === 0xdb);
    		    }
    		    const decode = {
    		        utf8Read,
    		        int8,
    		        uint8,
    		        int16,
    		        uint16,
    		        int32,
    		        uint32,
    		        float32,
    		        float64,
    		        int64,
    		        uint64,
    		        bigint64,
    		        biguint64,
    		        boolean,
    		        string,
    		        number,
    		        stringCheck,
    		    };

    		    const registeredTypes = {};
    		    const identifiers = new Map();
    		    function registerType(identifier, definition) {
    		        if (definition.constructor) {
    		            identifiers.set(definition.constructor, identifier);
    		            registeredTypes[identifier] = definition;
    		        }
    		        if (definition.encode) {
    		            encode[identifier] = definition.encode;
    		        }
    		        if (definition.decode) {
    		            decode[identifier] = definition.decode;
    		        }
    		    }
    		    function getType(identifier) {
    		        return registeredTypes[identifier];
    		    }
    		    function defineCustomTypes(types) {
    		        for (const identifier in types) {
    		            registerType(identifier, types[identifier]);
    		        }
    		        return (t) => type(t);
    		    }

    		    class TypeContext {
    		        /**
    		         * For inheritance support
    		         * Keeps track of which classes extends which. (parent -> children)
    		         */
    		        static { this.inheritedTypes = new Map(); }
    		        static { this.cachedContexts = new Map(); }
    		        static register(target) {
    		            const parent = Object.getPrototypeOf(target);
    		            if (parent !== Schema) {
    		                let inherits = TypeContext.inheritedTypes.get(parent);
    		                if (!inherits) {
    		                    inherits = new Set();
    		                    TypeContext.inheritedTypes.set(parent, inherits);
    		                }
    		                inherits.add(target);
    		            }
    		        }
    		        static cache(rootClass) {
    		            let context = TypeContext.cachedContexts.get(rootClass);
    		            if (!context) {
    		                context = new TypeContext(rootClass);
    		                TypeContext.cachedContexts.set(rootClass, context);
    		            }
    		            return context;
    		        }
    		        constructor(rootClass) {
    		            this.types = {};
    		            this.schemas = new Map();
    		            this.hasFilters = false;
    		            this.parentFiltered = {};
    		            if (rootClass) {
    		                this.discoverTypes(rootClass);
    		            }
    		        }
    		        has(schema) {
    		            return this.schemas.has(schema);
    		        }
    		        get(typeid) {
    		            return this.types[typeid];
    		        }
    		        add(schema, typeid = this.schemas.size) {
    		            // skip if already registered
    		            if (this.schemas.has(schema)) {
    		                return false;
    		            }
    		            this.types[typeid] = schema;
    		            //
    		            // Workaround to allow using an empty Schema (with no `@type()` fields)
    		            //
    		            if (schema[Symbol.metadata] === undefined) {
    		                Metadata.initialize(schema);
    		            }
    		            this.schemas.set(schema, typeid);
    		            return true;
    		        }
    		        getTypeId(klass) {
    		            return this.schemas.get(klass);
    		        }
    		        discoverTypes(klass, parentType, parentIndex, parentHasViewTag) {
    		            if (parentHasViewTag) {
    		                this.registerFilteredByParent(klass, parentType, parentIndex);
    		            }
    		            // skip if already registered
    		            if (!this.add(klass)) {
    		                return;
    		            }
    		            // add classes inherited from this base class
    		            TypeContext.inheritedTypes.get(klass)?.forEach((child) => {
    		                this.discoverTypes(child, parentType, parentIndex, parentHasViewTag);
    		            });
    		            // add parent classes
    		            let parent = klass;
    		            while ((parent = Object.getPrototypeOf(parent)) &&
    		                parent !== Schema && // stop at root (Schema)
    		                parent !== Function.prototype // stop at root (non-Schema)
    		            ) {
    		                this.discoverTypes(parent);
    		            }
    		            const metadata = (klass[Symbol.metadata] ??= {});
    		            // if any schema/field has filters, mark "context" as having filters.
    		            if (metadata[$viewFieldIndexes]) {
    		                this.hasFilters = true;
    		            }
    		            for (const fieldIndex in metadata) {
    		                const index = fieldIndex;
    		                const fieldType = metadata[index].type;
    		                const fieldHasViewTag = (metadata[index].tag !== undefined);
    		                if (typeof (fieldType) === "string") {
    		                    continue;
    		                }
    		                if (Array.isArray(fieldType)) {
    		                    const type = fieldType[0];
    		                    // skip primitive types
    		                    if (type === "string") {
    		                        continue;
    		                    }
    		                    this.discoverTypes(type, klass, index, parentHasViewTag || fieldHasViewTag);
    		                }
    		                else if (typeof (fieldType) === "function") {
    		                    this.discoverTypes(fieldType, klass, index, parentHasViewTag || fieldHasViewTag);
    		                }
    		                else {
    		                    const type = Object.values(fieldType)[0];
    		                    // skip primitive types
    		                    if (typeof (type) === "string") {
    		                        continue;
    		                    }
    		                    this.discoverTypes(type, klass, index, parentHasViewTag || fieldHasViewTag);
    		                }
    		            }
    		        }
    		        /**
    		         * Keep track of which classes have filters applied.
    		         * Format: `${typeid}-${parentTypeid}-${parentIndex}`
    		         */
    		        registerFilteredByParent(schema, parentType, parentIndex) {
    		            const typeid = this.schemas.get(schema) ?? this.schemas.size;
    		            let key = `${typeid}`;
    		            if (parentType) {
    		                key += `-${this.schemas.get(parentType)}`;
    		            }
    		            key += `-${parentIndex}`;
    		            this.parentFiltered[key] = true;
    		        }
    		        debug() {
    		            let parentFiltered = "";
    		            for (const key in this.parentFiltered) {
    		                const keys = key.split("-").map(Number);
    		                const fieldIndex = keys.pop();
    		                parentFiltered += `\n\t\t`;
    		                parentFiltered += `${key}: ${keys.reverse().map((id, i) => {
		                const klass = this.types[id];
		                const metadata = klass[Symbol.metadata];
		                let txt = klass.name;
		                if (i === 0) {
		                    txt += `[${metadata[fieldIndex].name}]`;
		                }
		                return `${txt}`;
		            }).join(" -> ")}`;
    		            }
    		            return `TypeContext ->\n` +
    		                `\tSchema types: ${this.schemas.size}\n` +
    		                `\thasFilters: ${this.hasFilters}\n` +
    		                `\tparentFiltered:${parentFiltered}`;
    		        }
    		    }

    		    function getNormalizedType(type) {
    		        return (Array.isArray(type))
    		            ? { array: type[0] }
    		            : (typeof (type['type']) !== "undefined")
    		                ? type['type']
    		                : type;
    		    }
    		    const Metadata = {
    		        addField(metadata, index, name, type, descriptor) {
    		            if (index > 64) {
    		                throw new Error(`Can't define field '${name}'.\nSchema instances may only have up to 64 fields.`);
    		            }
    		            metadata[index] = Object.assign(metadata[index] || {}, // avoid overwriting previous field metadata (@owned / @deprecated)
    		            {
    		                type: getNormalizedType(type),
    		                index,
    		                name,
    		            });
    		            // create "descriptors" map
    		            Object.defineProperty(metadata, $descriptors, {
    		                value: metadata[$descriptors] || {},
    		                enumerable: false,
    		                configurable: true,
    		            });
    		            if (descriptor) {
    		                // for encoder
    		                metadata[$descriptors][name] = descriptor;
    		                metadata[$descriptors][`_${name}`] = {
    		                    value: undefined,
    		                    writable: true,
    		                    enumerable: false,
    		                    configurable: true,
    		                };
    		            }
    		            else {
    		                // for decoder
    		                metadata[$descriptors][name] = {
    		                    value: undefined,
    		                    writable: true,
    		                    enumerable: true,
    		                    configurable: true,
    		                };
    		            }
    		            // map -1 as last field index
    		            Object.defineProperty(metadata, $numFields, {
    		                value: index,
    		                enumerable: false,
    		                configurable: true
    		            });
    		            // map field name => index (non enumerable)
    		            Object.defineProperty(metadata, name, {
    		                value: index,
    		                enumerable: false,
    		                configurable: true,
    		            });
    		            // if child Ref/complex type, add to -4
    		            if (typeof (metadata[index].type) !== "string") {
    		                if (metadata[$refTypeFieldIndexes] === undefined) {
    		                    Object.defineProperty(metadata, $refTypeFieldIndexes, {
    		                        value: [],
    		                        enumerable: false,
    		                        configurable: true,
    		                    });
    		                }
    		                metadata[$refTypeFieldIndexes].push(index);
    		            }
    		        },
    		        setTag(metadata, fieldName, tag) {
    		            const index = metadata[fieldName];
    		            const field = metadata[index];
    		            // add 'tag' to the field
    		            field.tag = tag;
    		            if (!metadata[$viewFieldIndexes]) {
    		                // -2: all field indexes with "view" tag
    		                Object.defineProperty(metadata, $viewFieldIndexes, {
    		                    value: [],
    		                    enumerable: false,
    		                    configurable: true
    		                });
    		                // -3: field indexes by "view" tag
    		                Object.defineProperty(metadata, $fieldIndexesByViewTag, {
    		                    value: {},
    		                    enumerable: false,
    		                    configurable: true
    		                });
    		            }
    		            metadata[$viewFieldIndexes].push(index);
    		            if (!metadata[$fieldIndexesByViewTag][tag]) {
    		                metadata[$fieldIndexesByViewTag][tag] = [];
    		            }
    		            metadata[$fieldIndexesByViewTag][tag].push(index);
    		        },
    		        setFields(target, fields) {
    		            // for inheritance support
    		            const constructor = target.prototype.constructor;
    		            TypeContext.register(constructor);
    		            const parentClass = Object.getPrototypeOf(constructor);
    		            const parentMetadata = parentClass && parentClass[Symbol.metadata];
    		            const metadata = Metadata.initialize(constructor);
    		            // Use Schema's methods if not defined in the class
    		            if (!constructor[$track]) {
    		                constructor[$track] = Schema[$track];
    		            }
    		            if (!constructor[$encoder]) {
    		                constructor[$encoder] = Schema[$encoder];
    		            }
    		            if (!constructor[$decoder]) {
    		                constructor[$decoder] = Schema[$decoder];
    		            }
    		            if (!constructor.prototype.toJSON) {
    		                constructor.prototype.toJSON = Schema.prototype.toJSON;
    		            }
    		            //
    		            // detect index for this field, considering inheritance
    		            //
    		            let fieldIndex = metadata[$numFields] // current structure already has fields defined
    		                ?? (parentMetadata && parentMetadata[$numFields]) // parent structure has fields defined
    		                ?? -1; // no fields defined
    		            fieldIndex++;
    		            for (const field in fields) {
    		                const type = fields[field];
    		                // FIXME: this code is duplicated from @type() annotation
    		                const complexTypeKlass = (Array.isArray(type))
    		                    ? getType("array")
    		                    : (typeof (Object.keys(type)[0]) === "string") && getType(Object.keys(type)[0]);
    		                const childType = (complexTypeKlass)
    		                    ? Object.values(type)[0]
    		                    : getNormalizedType(type);
    		                Metadata.addField(metadata, fieldIndex, field, type, getPropertyDescriptor(`_${field}`, fieldIndex, childType, complexTypeKlass));
    		                fieldIndex++;
    		            }
    		            return target;
    		        },
    		        isDeprecated(metadata, field) {
    		            return metadata[field].deprecated === true;
    		        },
    		        init(klass) {
    		            //
    		            // Used only to initialize an empty Schema (Encoder#constructor)
    		            // TODO: remove/refactor this...
    		            //
    		            const metadata = {};
    		            klass[Symbol.metadata] = metadata;
    		            Object.defineProperty(metadata, $numFields, {
    		                value: 0,
    		                enumerable: false,
    		                configurable: true,
    		            });
    		        },
    		        initialize(constructor) {
    		            const parentClass = Object.getPrototypeOf(constructor);
    		            const parentMetadata = parentClass[Symbol.metadata];
    		            let metadata = constructor[Symbol.metadata] ?? Object.create(null);
    		            // make sure inherited classes have their own metadata object.
    		            if (parentClass !== Schema && metadata === parentMetadata) {
    		                metadata = Object.create(null);
    		                if (parentMetadata) {
    		                    //
    		                    // assign parent metadata to current
    		                    //
    		                    Object.setPrototypeOf(metadata, parentMetadata);
    		                    // $numFields
    		                    Object.defineProperty(metadata, $numFields, {
    		                        value: parentMetadata[$numFields],
    		                        enumerable: false,
    		                        configurable: true,
    		                        writable: true,
    		                    });
    		                    // $viewFieldIndexes / $fieldIndexesByViewTag
    		                    if (parentMetadata[$viewFieldIndexes] !== undefined) {
    		                        Object.defineProperty(metadata, $viewFieldIndexes, {
    		                            value: [...parentMetadata[$viewFieldIndexes]],
    		                            enumerable: false,
    		                            configurable: true,
    		                            writable: true,
    		                        });
    		                        Object.defineProperty(metadata, $fieldIndexesByViewTag, {
    		                            value: { ...parentMetadata[$fieldIndexesByViewTag] },
    		                            enumerable: false,
    		                            configurable: true,
    		                            writable: true,
    		                        });
    		                    }
    		                    // $refTypeFieldIndexes
    		                    if (parentMetadata[$refTypeFieldIndexes] !== undefined) {
    		                        Object.defineProperty(metadata, $refTypeFieldIndexes, {
    		                            value: [...parentMetadata[$refTypeFieldIndexes]],
    		                            enumerable: false,
    		                            configurable: true,
    		                            writable: true,
    		                        });
    		                    }
    		                    // $descriptors
    		                    Object.defineProperty(metadata, $descriptors, {
    		                        value: { ...parentMetadata[$descriptors] },
    		                        enumerable: false,
    		                        configurable: true,
    		                        writable: true,
    		                    });
    		                }
    		            }
    		            constructor[Symbol.metadata] = metadata;
    		            return metadata;
    		        },
    		        isValidInstance(klass) {
    		            return (klass.constructor[Symbol.metadata] &&
    		                Object.prototype.hasOwnProperty.call(klass.constructor[Symbol.metadata], $numFields));
    		        },
    		        getFields(klass) {
    		            const metadata = klass[Symbol.metadata];
    		            const fields = {};
    		            for (let i = 0; i <= metadata[$numFields]; i++) {
    		                fields[metadata[i].name] = metadata[i].type;
    		            }
    		            return fields;
    		        }
    		    };

    		    function setOperationAtIndex(changeSet, index) {
    		        const operationsIndex = changeSet.indexes[index];
    		        if (operationsIndex === undefined) {
    		            changeSet.indexes[index] = changeSet.operations.push(index) - 1;
    		        }
    		        else {
    		            changeSet.operations[operationsIndex] = index;
    		        }
    		    }
    		    function deleteOperationAtIndex(changeSet, index) {
    		        const operationsIndex = changeSet.indexes[index];
    		        if (operationsIndex !== undefined) {
    		            changeSet.operations[operationsIndex] = undefined;
    		        }
    		        delete changeSet.indexes[index];
    		    }
    		    function enqueueChangeTree(root, changeTree, changeSet, queueRootIndex = changeTree[changeSet].queueRootIndex) {
    		        if (root && root[changeSet][queueRootIndex] !== changeTree) {
    		            changeTree[changeSet].queueRootIndex = root[changeSet].push(changeTree) - 1;
    		        }
    		    }
    		    class ChangeTree {
    		        constructor(ref) {
    		            /**
    		             * Whether this structure is parent of a filtered structure.
    		             */
    		            this.isFiltered = false;
    		            this.indexedOperations = {};
    		            //
    		            // TODO:
    		            //   try storing the index + operation per item.
    		            //   example: 1024 & 1025 => ADD, 1026 => DELETE
    		            //
    		            // => https://chatgpt.com/share/67107d0c-bc20-8004-8583-83b17dd7c196
    		            //
    		            this.changes = { indexes: {}, operations: [] };
    		            this.allChanges = { indexes: {}, operations: [] };
    		            /**
    		             * Is this a new instance? Used on ArraySchema to determine OPERATION.MOVE_AND_ADD operation.
    		             */
    		            this.isNew = true;
    		            this.ref = ref;
    		            //
    		            // Does this structure have "filters" declared?
    		            //
    		            const metadata = ref.constructor[Symbol.metadata];
    		            if (metadata?.[$viewFieldIndexes]) {
    		                this.allFilteredChanges = { indexes: {}, operations: [] };
    		                this.filteredChanges = { indexes: {}, operations: [] };
    		            }
    		        }
    		        setRoot(root) {
    		            this.root = root;
    		            this.checkIsFiltered(this.parent, this.parentIndex);
    		            // Recursively set root on child structures
    		            const metadata = this.ref.constructor[Symbol.metadata];
    		            if (metadata) {
    		                metadata[$refTypeFieldIndexes]?.forEach((index) => {
    		                    const field = metadata[index];
    		                    const value = this.ref[field.name];
    		                    value?.[$changes].setRoot(root);
    		                });
    		            }
    		            else if (this.ref[$childType] && typeof (this.ref[$childType]) !== "string") {
    		                // MapSchema / ArraySchema, etc.
    		                this.ref.forEach((value, key) => {
    		                    value[$changes].setRoot(root);
    		                });
    		            }
    		        }
    		        setParent(parent, root, parentIndex) {
    		            this.parent = parent;
    		            this.parentIndex = parentIndex;
    		            // avoid setting parents with empty `root`
    		            if (!root) {
    		                return;
    		            }
    		            // skip if parent is already set
    		            if (root !== this.root) {
    		                this.root = root;
    		                this.checkIsFiltered(parent, parentIndex);
    		            }
    		            else {
    		                root.add(this);
    		            }
    		            // assign same parent on child structures
    		            const metadata = this.ref.constructor[Symbol.metadata];
    		            if (metadata) {
    		                metadata[$refTypeFieldIndexes]?.forEach((index) => {
    		                    const field = metadata[index];
    		                    const value = this.ref[field.name];
    		                    value?.[$changes].setParent(this.ref, root, index);
    		                });
    		            }
    		            else if (this.ref[$childType] && typeof (this.ref[$childType]) !== "string") {
    		                // MapSchema / ArraySchema, etc.
    		                this.ref.forEach((value, key) => {
    		                    value[$changes].setParent(this.ref, root, this.indexes[key] ?? key);
    		                });
    		            }
    		        }
    		        forEachChild(callback) {
    		            //
    		            // assign same parent on child structures
    		            //
    		            const metadata = this.ref.constructor[Symbol.metadata];
    		            if (metadata) {
    		                metadata[$refTypeFieldIndexes]?.forEach((index) => {
    		                    const field = metadata[index];
    		                    const value = this.ref[field.name];
    		                    if (value) {
    		                        callback(value[$changes], index);
    		                    }
    		                });
    		            }
    		            else if (this.ref[$childType] && typeof (this.ref[$childType]) !== "string") {
    		                // MapSchema / ArraySchema, etc.
    		                this.ref.forEach((value, key) => {
    		                    callback(value[$changes], this.indexes[key] ?? key);
    		                });
    		            }
    		        }
    		        operation(op) {
    		            // operations without index use negative values to represent them
    		            // this is checked during .encode() time.
    		            this.changes.operations.push(-op);
    		            enqueueChangeTree(this.root, this, 'changes');
    		        }
    		        change(index, operation = exports.OPERATION.ADD) {
    		            const metadata = this.ref.constructor[Symbol.metadata];
    		            const isFiltered = this.isFiltered || (metadata?.[index]?.tag !== undefined);
    		            const changeSet = (isFiltered)
    		                ? this.filteredChanges
    		                : this.changes;
    		            const previousOperation = this.indexedOperations[index];
    		            if (!previousOperation || previousOperation === exports.OPERATION.DELETE) {
    		                const op = (!previousOperation)
    		                    ? operation
    		                    : (previousOperation === exports.OPERATION.DELETE)
    		                        ? exports.OPERATION.DELETE_AND_ADD
    		                        : operation;
    		                //
    		                // TODO: are DELETE operations being encoded as ADD here ??
    		                //
    		                this.indexedOperations[index] = op;
    		            }
    		            setOperationAtIndex(changeSet, index);
    		            if (isFiltered) {
    		                setOperationAtIndex(this.allFilteredChanges, index);
    		                if (this.root) {
    		                    enqueueChangeTree(this.root, this, 'filteredChanges');
    		                    enqueueChangeTree(this.root, this, 'allFilteredChanges');
    		                }
    		            }
    		            else {
    		                setOperationAtIndex(this.allChanges, index);
    		                enqueueChangeTree(this.root, this, 'changes');
    		            }
    		        }
    		        shiftChangeIndexes(shiftIndex) {
    		            //
    		            // Used only during:
    		            //
    		            // - ArraySchema#unshift()
    		            //
    		            const changeSet = (this.isFiltered)
    		                ? this.filteredChanges
    		                : this.changes;
    		            const newIndexedOperations = {};
    		            const newIndexes = {};
    		            for (const index in this.indexedOperations) {
    		                newIndexedOperations[Number(index) + shiftIndex] = this.indexedOperations[index];
    		                newIndexes[Number(index) + shiftIndex] = changeSet[index];
    		            }
    		            this.indexedOperations = newIndexedOperations;
    		            changeSet.indexes = newIndexes;
    		            changeSet.operations = changeSet.operations.map((index) => index + shiftIndex);
    		        }
    		        shiftAllChangeIndexes(shiftIndex, startIndex = 0) {
    		            //
    		            // Used only during:
    		            //
    		            // - ArraySchema#splice()
    		            //
    		            if (this.filteredChanges !== undefined) {
    		                this._shiftAllChangeIndexes(shiftIndex, startIndex, this.allFilteredChanges);
    		                this._shiftAllChangeIndexes(shiftIndex, startIndex, this.allChanges);
    		            }
    		            else {
    		                this._shiftAllChangeIndexes(shiftIndex, startIndex, this.allChanges);
    		            }
    		        }
    		        _shiftAllChangeIndexes(shiftIndex, startIndex = 0, changeSet) {
    		            const newIndexes = {};
    		            for (const key in changeSet.indexes) {
    		                const index = changeSet.indexes[key];
    		                if (index > startIndex) {
    		                    newIndexes[Number(key) + shiftIndex] = index;
    		                }
    		                else {
    		                    newIndexes[key] = index;
    		                }
    		            }
    		            changeSet.indexes = newIndexes;
    		            for (let i = 0; i < changeSet.operations.length; i++) {
    		                const index = changeSet.operations[i];
    		                if (index > startIndex) {
    		                    changeSet.operations[i] = index + shiftIndex;
    		                }
    		            }
    		        }
    		        indexedOperation(index, operation, allChangesIndex = index) {
    		            this.indexedOperations[index] = operation;
    		            if (this.filteredChanges !== undefined) {
    		                setOperationAtIndex(this.allFilteredChanges, allChangesIndex);
    		                setOperationAtIndex(this.filteredChanges, index);
    		                enqueueChangeTree(this.root, this, 'filteredChanges');
    		            }
    		            else {
    		                setOperationAtIndex(this.allChanges, allChangesIndex);
    		                setOperationAtIndex(this.changes, index);
    		                enqueueChangeTree(this.root, this, 'changes');
    		            }
    		        }
    		        getType(index) {
    		            if (Metadata.isValidInstance(this.ref)) {
    		                const metadata = this.ref.constructor[Symbol.metadata];
    		                return metadata[index].type;
    		            }
    		            else {
    		                //
    		                // Get the child type from parent structure.
    		                // - ["string"] => "string"
    		                // - { map: "string" } => "string"
    		                // - { set: "string" } => "string"
    		                //
    		                return this.ref[$childType];
    		            }
    		        }
    		        getChange(index) {
    		            return this.indexedOperations[index];
    		        }
    		        //
    		        // used during `.encode()`
    		        //
    		        getValue(index, isEncodeAll = false) {
    		            //
    		            // `isEncodeAll` param is only used by ArraySchema
    		            //
    		            return this.ref[$getByIndex](index, isEncodeAll);
    		        }
    		        delete(index, operation, allChangesIndex = index) {
    		            if (index === undefined) {
    		                try {
    		                    throw new Error(`@colyseus/schema ${this.ref.constructor.name}: trying to delete non-existing index '${index}'`);
    		                }
    		                catch (e) {
    		                    console.warn(e);
    		                }
    		                return;
    		            }
    		            const changeSet = (this.filteredChanges !== undefined)
    		                ? this.filteredChanges
    		                : this.changes;
    		            this.indexedOperations[index] = operation ?? exports.OPERATION.DELETE;
    		            setOperationAtIndex(changeSet, index);
    		            const previousValue = this.getValue(index);
    		            // remove `root` reference
    		            if (previousValue && previousValue[$changes]) {
    		                //
    		                // FIXME: this.root is "undefined"
    		                //
    		                // This method is being called at decoding time when a DELETE operation is found.
    		                //
    		                // - This is due to using the concrete Schema class at decoding time.
    		                // - "Reflected" structures do not have this problem.
    		                //
    		                // (The property descriptors should NOT be used at decoding time. only at encoding time.)
    		                //
    		                this.root?.remove(previousValue[$changes]);
    		            }
    		            deleteOperationAtIndex(this.allChanges, allChangesIndex);
    		            //
    		            // FIXME: this is looking a ugly and repeated
    		            //
    		            if (this.filteredChanges !== undefined) {
    		                deleteOperationAtIndex(this.allFilteredChanges, allChangesIndex);
    		                enqueueChangeTree(this.root, this, 'filteredChanges');
    		            }
    		            else {
    		                enqueueChangeTree(this.root, this, 'changes');
    		            }
    		            return previousValue;
    		        }
    		        endEncode() {
    		            this.indexedOperations = {};
    		            // // clear changes
    		            // this.changes.indexes = {};
    		            // this.changes.operations.length = 0;
    		            // ArraySchema and MapSchema have a custom "encode end" method
    		            this.ref[$onEncodeEnd]?.();
    		            // Not a new instance anymore
    		            this.isNew = false;
    		        }
    		        discard(discardAll = false) {
    		            //
    		            // > MapSchema:
    		            //      Remove cached key to ensure ADD operations is unsed instead of
    		            //      REPLACE in case same key is used on next patches.
    		            //
    		            this.ref[$onEncodeEnd]?.();
    		            this.indexedOperations = {};
    		            this.changes.indexes = {};
    		            this.changes.operations.length = 0;
    		            this.changes.queueRootIndex = undefined;
    		            if (this.filteredChanges !== undefined) {
    		                this.filteredChanges.indexes = {};
    		                this.filteredChanges.operations.length = 0;
    		                this.filteredChanges.queueRootIndex = undefined;
    		            }
    		            if (discardAll) {
    		                this.allChanges.indexes = {};
    		                this.allChanges.operations.length = 0;
    		                if (this.allFilteredChanges !== undefined) {
    		                    this.allFilteredChanges.indexes = {};
    		                    this.allFilteredChanges.operations.length = 0;
    		                }
    		                // remove children references
    		                this.forEachChild((changeTree, _) => this.root?.remove(changeTree));
    		            }
    		        }
    		        /**
    		         * Recursively discard all changes from this, and child structures.
    		         */
    		        discardAll() {
    		            const keys = Object.keys(this.indexedOperations);
    		            for (let i = 0, len = keys.length; i < len; i++) {
    		                const value = this.getValue(Number(keys[i]));
    		                if (value && value[$changes]) {
    		                    value[$changes].discardAll();
    		                }
    		            }
    		            this.discard();
    		        }
    		        ensureRefId() {
    		            // skip if refId is already set.
    		            if (this.refId !== undefined) {
    		                return;
    		            }
    		            this.refId = this.root.getNextUniqueId();
    		        }
    		        get changed() {
    		            return (Object.entries(this.indexedOperations).length > 0);
    		        }
    		        checkIsFiltered(parent, parentIndex) {
    		            const isNewChangeTree = this.root.add(this);
    		            if (this.root.types.hasFilters) {
    		                //
    		                // At Schema initialization, the "root" structure might not be available
    		                // yet, as it only does once the "Encoder" has been set up.
    		                //
    		                // So the "parent" may be already set without a "root".
    		                //
    		                this._checkFilteredByParent(parent, parentIndex);
    		                if (this.filteredChanges !== undefined) {
    		                    enqueueChangeTree(this.root, this, 'filteredChanges');
    		                    if (isNewChangeTree) {
    		                        this.root.allFilteredChanges.push(this);
    		                    }
    		                }
    		            }
    		            if (!this.isFiltered) {
    		                enqueueChangeTree(this.root, this, 'changes');
    		                if (isNewChangeTree) {
    		                    this.root.allChanges.push(this);
    		                }
    		            }
    		        }
    		        _checkFilteredByParent(parent, parentIndex) {
    		            // skip if parent is not set
    		            if (!parent) {
    		                return;
    		            }
    		            //
    		            // ArraySchema | MapSchema - get the child type
    		            // (if refType is typeof string, the parentFiltered[key] below will always be invalid)
    		            //
    		            const refType = Metadata.isValidInstance(this.ref)
    		                ? this.ref.constructor
    		                : this.ref[$childType];
    		            if (!Metadata.isValidInstance(parent)) {
    		                const parentChangeTree = parent[$changes];
    		                parent = parentChangeTree.parent;
    		                parentIndex = parentChangeTree.parentIndex;
    		            }
    		            const parentConstructor = parent.constructor;
    		            let key = `${this.root.types.getTypeId(refType)}`;
    		            if (parentConstructor) {
    		                key += `-${this.root.types.schemas.get(parentConstructor)}`;
    		            }
    		            key += `-${parentIndex}`;
    		            this.isFiltered = parent[$changes].isFiltered // in case parent is already filtered
    		                || this.root.types.parentFiltered[key]
    		                || parentConstructor?.[Symbol.metadata]?.[$viewFieldIndexes]?.includes(parentIndex);
    		            //
    		            // TODO: refactor this!
    		            //
    		            //      swapping `changes` and `filteredChanges` is required here
    		            //      because "isFiltered" may not be imedialely available on `change()`
    		            //      (this happens when instance is detached from root or parent)
    		            //
    		            if (this.isFiltered) {
    		                this.filteredChanges = { indexes: {}, operations: [] };
    		                this.allFilteredChanges = { indexes: {}, operations: [] };
    		                if (this.changes.operations.length > 0) {
    		                    // swap changes reference
    		                    const changes = this.changes;
    		                    this.changes = this.filteredChanges;
    		                    this.filteredChanges = changes;
    		                    // swap "all changes" reference
    		                    const allFilteredChanges = this.allFilteredChanges;
    		                    this.allFilteredChanges = this.allChanges;
    		                    this.allChanges = allFilteredChanges;
    		                }
    		            }
    		        }
    		    }

    		    function encodeValue(encoder, bytes, type, value, operation, it) {
    		        if (typeof (type) === "string") {
    		            encode[type]?.(bytes, value, it);
    		        }
    		        else if (type[Symbol.metadata] !== undefined) {
    		            //
    		            // Encode refId for this instance.
    		            // The actual instance is going to be encoded on next `changeTree` iteration.
    		            //
    		            encode.number(bytes, value[$changes].refId, it);
    		            // Try to encode inherited TYPE_ID if it's an ADD operation.
    		            if ((operation & exports.OPERATION.ADD) === exports.OPERATION.ADD) {
    		                encoder.tryEncodeTypeId(bytes, type, value.constructor, it);
    		            }
    		        }
    		        else {
    		            //
    		            // Encode refId for this instance.
    		            // The actual instance is going to be encoded on next `changeTree` iteration.
    		            //
    		            encode.number(bytes, value[$changes].refId, it);
    		        }
    		    }
    		    /**
    		     * Used for Schema instances.
    		     * @private
    		     */
    		    const encodeSchemaOperation = function (encoder, bytes, changeTree, index, operation, it, _, __, metadata) {
    		        // "compress" field index + operation
    		        bytes[it.offset++] = (index | operation) & 255;
    		        // Do not encode value for DELETE operations
    		        if (operation === exports.OPERATION.DELETE) {
    		            return;
    		        }
    		        const ref = changeTree.ref;
    		        const field = metadata[index];
    		        // TODO: inline this function call small performance gain
    		        encodeValue(encoder, bytes, metadata[index].type, ref[field.name], operation, it);
    		    };
    		    /**
    		     * Used for collections (MapSchema, CollectionSchema, SetSchema)
    		     * @private
    		     */
    		    const encodeKeyValueOperation = function (encoder, bytes, changeTree, index, operation, it) {
    		        // encode operation
    		        bytes[it.offset++] = operation & 255;
    		        // custom operations
    		        if (operation === exports.OPERATION.CLEAR) {
    		            return;
    		        }
    		        // encode index
    		        encode.number(bytes, index, it);
    		        // Do not encode value for DELETE operations
    		        if (operation === exports.OPERATION.DELETE) {
    		            return;
    		        }
    		        const ref = changeTree.ref;
    		        //
    		        // encode "alias" for dynamic fields (maps)
    		        //
    		        if ((operation & exports.OPERATION.ADD) === exports.OPERATION.ADD) { // ADD or DELETE_AND_ADD
    		            if (typeof (ref['set']) === "function") {
    		                //
    		                // MapSchema dynamic key
    		                //
    		                const dynamicIndex = changeTree.ref['$indexes'].get(index);
    		                encode.string(bytes, dynamicIndex, it);
    		            }
    		        }
    		        const type = ref[$childType];
    		        const value = ref[$getByIndex](index);
    		        // try { throw new Error(); } catch (e) {
    		        //     // only print if not coming from Reflection.ts
    		        //     if (!e.stack.includes("src/Reflection.ts")) {
    		        //         console.log("encodeKeyValueOperation -> ", {
    		        //             ref: changeTree.ref.constructor.name,
    		        //             field,
    		        //             operation: OPERATION[operation],
    		        //             value: value?.toJSON(),
    		        //             items: ref.toJSON(),
    		        //         });
    		        //     }
    		        // }
    		        // TODO: inline this function call small performance gain
    		        encodeValue(encoder, bytes, type, value, operation, it);
    		    };
    		    /**
    		     * Used for collections (MapSchema, ArraySchema, etc.)
    		     * @private
    		     */
    		    const encodeArray = function (encoder, bytes, changeTree, field, operation, it, isEncodeAll, hasView) {
    		        const ref = changeTree.ref;
    		        const useOperationByRefId = hasView && changeTree.isFiltered && (typeof (changeTree.getType(field)) !== "string");
    		        let refOrIndex;
    		        if (useOperationByRefId) {
    		            refOrIndex = ref['tmpItems'][field][$changes].refId;
    		            if (operation === exports.OPERATION.DELETE) {
    		                operation = exports.OPERATION.DELETE_BY_REFID;
    		            }
    		            else if (operation === exports.OPERATION.ADD) {
    		                operation = exports.OPERATION.ADD_BY_REFID;
    		            }
    		        }
    		        else {
    		            refOrIndex = field;
    		        }
    		        // encode operation
    		        bytes[it.offset++] = operation & 255;
    		        // custom operations
    		        if (operation === exports.OPERATION.CLEAR ||
    		            operation === exports.OPERATION.REVERSE) {
    		            return;
    		        }
    		        // encode index
    		        encode.number(bytes, refOrIndex, it);
    		        // Do not encode value for DELETE operations
    		        if (operation === exports.OPERATION.DELETE) {
    		            return;
    		        }
    		        const type = changeTree.getType(field);
    		        const value = changeTree.getValue(field, isEncodeAll);
    		        // console.log("encodeArray -> ", {
    		        //     ref: changeTree.ref.constructor.name,
    		        //     field,
    		        //     operation: OPERATION[operation],
    		        //     value: value?.toJSON(),
    		        //     items: ref.toJSON(),
    		        // });
    		        // TODO: inline this function call small performance gain
    		        encodeValue(encoder, bytes, type, value, operation, it);
    		    };

    		    const DEFINITION_MISMATCH = -1;
    		    function decodeValue(decoder, operation, ref, index, type, bytes, it, allChanges) {
    		        const $root = decoder.root;
    		        const previousValue = ref[$getByIndex](index);
    		        let value;
    		        if ((operation & exports.OPERATION.DELETE) === exports.OPERATION.DELETE) {
    		            // Flag `refId` for garbage collection.
    		            const previousRefId = $root.refIds.get(previousValue);
    		            if (previousRefId !== undefined) {
    		                $root.removeRef(previousRefId);
    		            }
    		            //
    		            // Delete operations
    		            //
    		            if (operation !== exports.OPERATION.DELETE_AND_ADD) {
    		                ref[$deleteByIndex](index);
    		            }
    		            value = undefined;
    		        }
    		        if (operation === exports.OPERATION.DELETE) ;
    		        else if (Schema.is(type)) {
    		            const refId = decode.number(bytes, it);
    		            value = $root.refs.get(refId);
    		            if ((operation & exports.OPERATION.ADD) === exports.OPERATION.ADD) {
    		                const childType = decoder.getInstanceType(bytes, it, type);
    		                if (!value) {
    		                    value = decoder.createInstanceOfType(childType);
    		                }
    		                $root.addRef(refId, value, (value !== previousValue || // increment ref count if value has changed
    		                    (operation === exports.OPERATION.DELETE_AND_ADD && value === previousValue) // increment ref count if the same instance is being added again
    		                ));
    		            }
    		        }
    		        else if (typeof (type) === "string") {
    		            //
    		            // primitive value (number, string, boolean, etc)
    		            //
    		            value = decode[type](bytes, it);
    		        }
    		        else {
    		            const typeDef = getType(Object.keys(type)[0]);
    		            const refId = decode.number(bytes, it);
    		            const valueRef = ($root.refs.has(refId))
    		                ? previousValue || $root.refs.get(refId)
    		                : new typeDef.constructor();
    		            value = valueRef.clone(true);
    		            value[$childType] = Object.values(type)[0]; // cache childType for ArraySchema and MapSchema
    		            if (previousValue) {
    		                let previousRefId = $root.refIds.get(previousValue);
    		                if (previousRefId !== undefined && refId !== previousRefId) {
    		                    //
    		                    // enqueue onRemove if structure has been replaced.
    		                    //
    		                    const entries = previousValue.entries();
    		                    let iter;
    		                    while ((iter = entries.next()) && !iter.done) {
    		                        const [key, value] = iter.value;
    		                        // if value is a schema, remove its reference
    		                        if (typeof (value) === "object") {
    		                            previousRefId = $root.refIds.get(value);
    		                            $root.removeRef(previousRefId);
    		                        }
    		                        allChanges.push({
    		                            ref: previousValue,
    		                            refId: previousRefId,
    		                            op: exports.OPERATION.DELETE,
    		                            field: key,
    		                            value: undefined,
    		                            previousValue: value,
    		                        });
    		                    }
    		                }
    		            }
    		            $root.addRef(refId, value, (valueRef !== previousValue ||
    		                (operation === exports.OPERATION.DELETE_AND_ADD && valueRef === previousValue)));
    		        }
    		        return { value, previousValue };
    		    }
    		    const decodeSchemaOperation = function (decoder, bytes, it, ref, allChanges) {
    		        const first_byte = bytes[it.offset++];
    		        const metadata = ref.constructor[Symbol.metadata];
    		        // "compressed" index + operation
    		        const operation = (first_byte >> 6) << 6;
    		        const index = first_byte % (operation || 255);
    		        // skip early if field is not defined
    		        const field = metadata[index];
    		        if (field === undefined) {
    		            console.warn("@colyseus/schema: field not defined at", { index, ref: ref.constructor.name, metadata });
    		            return DEFINITION_MISMATCH;
    		        }
    		        const { value, previousValue } = decodeValue(decoder, operation, ref, index, field.type, bytes, it, allChanges);
    		        if (value !== null && value !== undefined) {
    		            ref[field.name] = value;
    		        }
    		        // add change
    		        if (previousValue !== value) {
    		            allChanges.push({
    		                ref,
    		                refId: decoder.currentRefId,
    		                op: operation,
    		                field: field.name,
    		                value,
    		                previousValue,
    		            });
    		        }
    		    };
    		    const decodeKeyValueOperation = function (decoder, bytes, it, ref, allChanges) {
    		        // "uncompressed" index + operation (array/map items)
    		        const operation = bytes[it.offset++];
    		        if (operation === exports.OPERATION.CLEAR) {
    		            //
    		            // When decoding:
    		            // - enqueue items for DELETE callback.
    		            // - flag child items for garbage collection.
    		            //
    		            decoder.removeChildRefs(ref, allChanges);
    		            ref.clear();
    		            return;
    		        }
    		        const index = decode.number(bytes, it);
    		        const type = ref[$childType];
    		        let dynamicIndex;
    		        if ((operation & exports.OPERATION.ADD) === exports.OPERATION.ADD) { // ADD or DELETE_AND_ADD
    		            if (typeof (ref['set']) === "function") {
    		                dynamicIndex = decode.string(bytes, it); // MapSchema
    		                ref['setIndex'](index, dynamicIndex);
    		            }
    		            else {
    		                dynamicIndex = index; // ArraySchema
    		            }
    		        }
    		        else {
    		            // get dynamic index from "ref"
    		            dynamicIndex = ref['getIndex'](index);
    		        }
    		        const { value, previousValue } = decodeValue(decoder, operation, ref, index, type, bytes, it, allChanges);
    		        if (value !== null && value !== undefined) {
    		            if (typeof (ref['set']) === "function") {
    		                // MapSchema
    		                ref['$items'].set(dynamicIndex, value);
    		            }
    		            else if (typeof (ref['$setAt']) === "function") {
    		                // ArraySchema
    		                ref['$setAt'](index, value, operation);
    		            }
    		            else if (typeof (ref['add']) === "function") {
    		                // CollectionSchema && SetSchema
    		                const index = ref.add(value);
    		                if (typeof (index) === "number") {
    		                    ref['setIndex'](index, index);
    		                }
    		            }
    		        }
    		        // add change
    		        if (previousValue !== value) {
    		            allChanges.push({
    		                ref,
    		                refId: decoder.currentRefId,
    		                op: operation,
    		                field: "", // FIXME: remove this
    		                dynamicIndex,
    		                value,
    		                previousValue,
    		            });
    		        }
    		    };
    		    const decodeArray = function (decoder, bytes, it, ref, allChanges) {
    		        // "uncompressed" index + operation (array/map items)
    		        let operation = bytes[it.offset++];
    		        let index;
    		        if (operation === exports.OPERATION.CLEAR) {
    		            //
    		            // When decoding:
    		            // - enqueue items for DELETE callback.
    		            // - flag child items for garbage collection.
    		            //
    		            decoder.removeChildRefs(ref, allChanges);
    		            ref.clear();
    		            return;
    		        }
    		        else if (operation === exports.OPERATION.REVERSE) {
    		            ref.reverse();
    		            return;
    		        }
    		        else if (operation === exports.OPERATION.DELETE_BY_REFID) {
    		            // TODO: refactor here, try to follow same flow as below
    		            const refId = decode.number(bytes, it);
    		            const previousValue = decoder.root.refs.get(refId);
    		            index = ref.findIndex((value) => value === previousValue);
    		            ref[$deleteByIndex](index);
    		            allChanges.push({
    		                ref,
    		                refId: decoder.currentRefId,
    		                op: exports.OPERATION.DELETE,
    		                field: "", // FIXME: remove this
    		                dynamicIndex: index,
    		                value: undefined,
    		                previousValue,
    		            });
    		            return;
    		        }
    		        else if (operation === exports.OPERATION.ADD_BY_REFID) {
    		            const refId = decode.number(bytes, it);
    		            const itemByRefId = decoder.root.refs.get(refId);
    		            // use existing index, or push new value
    		            index = (itemByRefId)
    		                ? ref.findIndex((value) => value === itemByRefId)
    		                : ref.length;
    		        }
    		        else {
    		            index = decode.number(bytes, it);
    		        }
    		        const type = ref[$childType];
    		        let dynamicIndex = index;
    		        const { value, previousValue } = decodeValue(decoder, operation, ref, index, type, bytes, it, allChanges);
    		        if (value !== null && value !== undefined &&
    		            value !== previousValue // avoid setting same value twice (if index === 0 it will result in a "unshift" for ArraySchema)
    		        ) {
    		            // ArraySchema
    		            ref['$setAt'](index, value, operation);
    		        }
    		        // add change
    		        if (previousValue !== value) {
    		            allChanges.push({
    		                ref,
    		                refId: decoder.currentRefId,
    		                op: operation,
    		                field: "", // FIXME: remove this
    		                dynamicIndex,
    		                value,
    		                previousValue,
    		            });
    		        }
    		    };

    		    class EncodeSchemaError extends Error {
    		    }
    		    function assertType(value, type, klass, field) {
    		        let typeofTarget;
    		        let allowNull = false;
    		        switch (type) {
    		            case "number":
    		            case "int8":
    		            case "uint8":
    		            case "int16":
    		            case "uint16":
    		            case "int32":
    		            case "uint32":
    		            case "int64":
    		            case "uint64":
    		            case "float32":
    		            case "float64":
    		                typeofTarget = "number";
    		                if (isNaN(value)) {
    		                    console.log(`trying to encode "NaN" in ${klass.constructor.name}#${field}`);
    		                }
    		                break;
    		            case "bigint64":
    		            case "biguint64":
    		                typeofTarget = "bigint";
    		                break;
    		            case "string":
    		                typeofTarget = "string";
    		                allowNull = true;
    		                break;
    		            case "boolean":
    		                // boolean is always encoded as true/false based on truthiness
    		                return;
    		            default:
    		                // skip assertion for custom types
    		                // TODO: allow custom types to define their own assertions
    		                return;
    		        }
    		        if (typeof (value) !== typeofTarget && (!allowNull || (allowNull && value !== null))) {
    		            let foundValue = `'${JSON.stringify(value)}'${(value && value.constructor && ` (${value.constructor.name})`) || ''}`;
    		            throw new EncodeSchemaError(`a '${typeofTarget}' was expected, but ${foundValue} was provided in ${klass.constructor.name}#${field}`);
    		        }
    		    }
    		    function assertInstanceType(value, type, instance, field) {
    		        if (!(value instanceof type)) {
    		            throw new EncodeSchemaError(`a '${type.name}' was expected, but '${value && value.constructor.name}' was provided in ${instance.constructor.name}#${field}`);
    		        }
    		    }

    		    var _a$4, _b$4;
    		    const DEFAULT_SORT = (a, b) => {
    		        const A = a.toString();
    		        const B = b.toString();
    		        if (A < B)
    		            return -1;
    		        else if (A > B)
    		            return 1;
    		        else
    		            return 0;
    		    };
    		    class ArraySchema {
    		        static { this[_a$4] = encodeArray; }
    		        static { this[_b$4] = decodeArray; }
    		        /**
    		         * Determine if a property must be filtered.
    		         * - If returns false, the property is NOT going to be encoded.
    		         * - If returns true, the property is going to be encoded.
    		         *
    		         * Encoding with "filters" happens in two steps:
    		         * - First, the encoder iterates over all "not owned" properties and encodes them.
    		         * - Then, the encoder iterates over all "owned" properties per instance and encodes them.
    		         */
    		        static [(_a$4 = $encoder, _b$4 = $decoder, $filter)](ref, index, view) {
    		            return (!view ||
    		                typeof (ref[$childType]) === "string" ||
    		                // view.items.has(ref[$getByIndex](index)[$changes])
    		                view.visible.has(ref['tmpItems'][index]?.[$changes]));
    		        }
    		        static is(type) {
    		            return (
    		            // type format: ["string"]
    		            Array.isArray(type) ||
    		                // type format: { array: "string" }
    		                (type['array'] !== undefined));
    		        }
    		        static from(iterable) {
    		            return new ArraySchema(...Array.from(iterable));
    		        }
    		        constructor(...items) {
    		            this.items = [];
    		            this.tmpItems = [];
    		            this.deletedIndexes = {};
    		            Object.defineProperty(this, $childType, {
    		                value: undefined,
    		                enumerable: false,
    		                writable: true,
    		                configurable: true,
    		            });
    		            const proxy = new Proxy(this, {
    		                get: (obj, prop) => {
    		                    if (typeof (prop) !== "symbol" &&
    		                        // FIXME: d8 accuses this as low performance
    		                        !isNaN(prop) // https://stackoverflow.com/a/175787/892698
    		                    ) {
    		                        return this.items[prop];
    		                    }
    		                    else {
    		                        return Reflect.get(obj, prop);
    		                    }
    		                },
    		                set: (obj, key, setValue) => {
    		                    if (typeof (key) !== "symbol" && !isNaN(key)) {
    		                        if (setValue === undefined || setValue === null) {
    		                            obj.$deleteAt(key);
    		                        }
    		                        else {
    		                            if (setValue[$changes]) {
    		                                assertInstanceType(setValue, obj[$childType], obj, key);
    		                                const previousValue = obj.items[key];
    		                                if (previousValue !== undefined) {
    		                                    if (setValue[$changes].isNew) {
    		                                        this[$changes].indexedOperation(Number(key), exports.OPERATION.MOVE_AND_ADD);
    		                                    }
    		                                    else {
    		                                        if ((obj[$changes].getChange(Number(key)) & exports.OPERATION.DELETE) === exports.OPERATION.DELETE) {
    		                                            this[$changes].indexedOperation(Number(key), exports.OPERATION.DELETE_AND_MOVE);
    		                                        }
    		                                        else {
    		                                            this[$changes].indexedOperation(Number(key), exports.OPERATION.MOVE);
    		                                        }
    		                                    }
    		                                    // remove root reference from previous value
    		                                    previousValue[$changes].root?.remove(previousValue[$changes]);
    		                                }
    		                                else if (setValue[$changes].isNew) {
    		                                    this[$changes].indexedOperation(Number(key), exports.OPERATION.ADD);
    		                                }
    		                                setValue[$changes].setParent(this, obj[$changes].root, key);
    		                            }
    		                            else {
    		                                obj.$changeAt(Number(key), setValue);
    		                            }
    		                            this.items[key] = setValue;
    		                            this.tmpItems[key] = setValue;
    		                        }
    		                        return true;
    		                    }
    		                    else {
    		                        return Reflect.set(obj, key, setValue);
    		                    }
    		                },
    		                deleteProperty: (obj, prop) => {
    		                    if (typeof (prop) === "number") {
    		                        obj.$deleteAt(prop);
    		                    }
    		                    else {
    		                        delete obj[prop];
    		                    }
    		                    return true;
    		                },
    		                has: (obj, key) => {
    		                    if (typeof (key) !== "symbol" && !isNaN(Number(key))) {
    		                        return Reflect.has(this.items, key);
    		                    }
    		                    return Reflect.has(obj, key);
    		                }
    		            });
    		            this[$changes] = new ChangeTree(proxy);
    		            this[$changes].indexes = {};
    		            if (items.length > 0) {
    		                this.push(...items);
    		            }
    		            return proxy;
    		        }
    		        set length(newLength) {
    		            if (newLength === 0) {
    		                this.clear();
    		            }
    		            else if (newLength < this.items.length) {
    		                this.splice(newLength, this.length - newLength);
    		            }
    		            else {
    		                console.warn("ArraySchema: can't set .length to a higher value than its length.");
    		            }
    		        }
    		        get length() {
    		            return this.items.length;
    		        }
    		        push(...values) {
    		            let length = this.tmpItems.length;
    		            const changeTree = this[$changes];
    		            // values.forEach((value, i) => {
    		            for (let i = 0, l = values.length; i < values.length; i++, length++) {
    		                const value = values[i];
    		                if (value === undefined || value === null) {
    		                    // skip null values
    		                    return;
    		                }
    		                else if (typeof (value) === "object" && this[$childType]) {
    		                    assertInstanceType(value, this[$childType], this, i);
    		                    // TODO: move value[$changes]?.setParent() to this block.
    		                }
    		                changeTree.indexedOperation(length, exports.OPERATION.ADD, this.items.length);
    		                this.items.push(value);
    		                this.tmpItems.push(value);
    		                //
    		                // set value's parent after the value is set
    		                // (to avoid encoding "refId" operations before parent's "ADD" operation)
    		                //
    		                value[$changes]?.setParent(this, changeTree.root, length);
    		            }
    		            //     length++;
    		            // });
    		            return length;
    		        }
    		        /**
    		         * Removes the last element from an array and returns it.
    		         */
    		        pop() {
    		            let index = -1;
    		            // find last non-undefined index
    		            for (let i = this.tmpItems.length - 1; i >= 0; i--) {
    		                // if (this.tmpItems[i] !== undefined) {
    		                if (this.deletedIndexes[i] !== true) {
    		                    index = i;
    		                    break;
    		                }
    		            }
    		            if (index < 0) {
    		                return undefined;
    		            }
    		            this[$changes].delete(index, undefined, this.items.length - 1);
    		            // this.tmpItems[index] = undefined;
    		            // this.tmpItems.pop();
    		            this.deletedIndexes[index] = true;
    		            return this.items.pop();
    		        }
    		        at(index) {
    		            // Allow negative indexing from the end
    		            if (index < 0)
    		                index += this.length;
    		            return this.items[index];
    		        }
    		        // encoding only
    		        $changeAt(index, value) {
    		            if (value === undefined || value === null) {
    		                console.error("ArraySchema items cannot be null nor undefined; Use `deleteAt(index)` instead.");
    		                return;
    		            }
    		            // skip if the value is the same as cached.
    		            if (this.items[index] === value) {
    		                return;
    		            }
    		            const changeTree = this[$changes];
    		            const operation = changeTree.indexes?.[index]?.op ?? exports.OPERATION.ADD;
    		            changeTree.change(index, operation);
    		            //
    		            // set value's parent after the value is set
    		            // (to avoid encoding "refId" operations before parent's "ADD" operation)
    		            //
    		            value[$changes]?.setParent(this, changeTree.root, index);
    		        }
    		        // encoding only
    		        $deleteAt(index, operation) {
    		            this[$changes].delete(index, operation);
    		        }
    		        // decoding only
    		        $setAt(index, value, operation) {
    		            if (index === 0 &&
    		                operation === exports.OPERATION.ADD &&
    		                this.items[index] !== undefined) {
    		                // handle decoding unshift
    		                this.items.unshift(value);
    		            }
    		            else if (operation === exports.OPERATION.DELETE_AND_MOVE) {
    		                this.items.splice(index, 1);
    		                this.items[index] = value;
    		            }
    		            else {
    		                this.items[index] = value;
    		            }
    		        }
    		        clear() {
    		            // skip if already clear
    		            if (this.items.length === 0) {
    		                return;
    		            }
    		            // discard previous operations.
    		            const changeTree = this[$changes];
    		            // discard children
    		            changeTree.forEachChild((changeTree, _) => {
    		                changeTree.discard(true);
    		                //
    		                // TODO: add tests with instance sharing + .clear()
    		                // FIXME: this.root? is required because it is being called at decoding time.
    		                //
    		                // TODO: do not use [$changes] at decoding time.
    		                //
    		                const root = changeTree.root;
    		                if (root !== undefined) {
    		                    root.removeChangeFromChangeSet("changes", changeTree);
    		                    root.removeChangeFromChangeSet("allChanges", changeTree);
    		                    root.removeChangeFromChangeSet("allFilteredChanges", changeTree);
    		                }
    		            });
    		            changeTree.discard(true);
    		            changeTree.operation(exports.OPERATION.CLEAR);
    		            this.items.length = 0;
    		            this.tmpItems.length = 0;
    		        }
    		        /**
    		         * Combines two or more arrays.
    		         * @param items Additional items to add to the end of array1.
    		         */
    		        // @ts-ignore
    		        concat(...items) {
    		            return new ArraySchema(...this.items.concat(...items));
    		        }
    		        /**
    		         * Adds all the elements of an array separated by the specified separator string.
    		         * @param separator A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma.
    		         */
    		        join(separator) {
    		            return this.items.join(separator);
    		        }
    		        /**
    		         * Reverses the elements in an Array.
    		         */
    		        // @ts-ignore
    		        reverse() {
    		            this[$changes].operation(exports.OPERATION.REVERSE);
    		            this.items.reverse();
    		            this.tmpItems.reverse();
    		            return this;
    		        }
    		        /**
    		         * Removes the first element from an array and returns it.
    		         */
    		        shift() {
    		            if (this.items.length === 0) {
    		                return undefined;
    		            }
    		            // const index = Number(Object.keys(changeTree.indexes)[0]);
    		            const index = this.tmpItems.findIndex((item, i) => item === this.items[0]);
    		            const changeTree = this[$changes];
    		            changeTree.delete(index);
    		            changeTree.shiftAllChangeIndexes(-1, index);
    		            // this.deletedIndexes[index] = true;
    		            return this.items.shift();
    		        }
    		        /**
    		         * Returns a section of an array.
    		         * @param start The beginning of the specified portion of the array.
    		         * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
    		         */
    		        slice(start, end) {
    		            const sliced = new ArraySchema();
    		            sliced.push(...this.items.slice(start, end));
    		            return sliced;
    		        }
    		        /**
    		         * Sorts an array.
    		         * @param compareFn Function used to determine the order of the elements. It is expected to return
    		         * a negative value if first argument is less than second argument, zero if they're equal and a positive
    		         * value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
    		         * ```ts
    		         * [11,2,22,1].sort((a, b) => a - b)
    		         * ```
    		         */
    		        sort(compareFn = DEFAULT_SORT) {
    		            const changeTree = this[$changes];
    		            const sortedItems = this.items.sort(compareFn);
    		            // wouldn't OPERATION.MOVE make more sense here?
    		            sortedItems.forEach((_, i) => changeTree.change(i, exports.OPERATION.REPLACE));
    		            this.tmpItems.sort(compareFn);
    		            return this;
    		        }
    		        /**
    		         * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
    		         * @param start The zero-based location in the array from which to start removing elements.
    		         * @param deleteCount The number of elements to remove.
    		         * @param insertItems Elements to insert into the array in place of the deleted elements.
    		         */
    		        splice(start, deleteCount = this.items.length - start, ...insertItems) {
    		            const changeTree = this[$changes];
    		            const tmpItemsLength = this.tmpItems.length;
    		            const insertCount = insertItems.length;
    		            // build up-to-date list of indexes, excluding removed values.
    		            const indexes = [];
    		            for (let i = 0; i < tmpItemsLength; i++) {
    		                // if (this.tmpItems[i] !== undefined) {
    		                if (this.deletedIndexes[i] !== true) {
    		                    indexes.push(i);
    		                }
    		            }
    		            // delete operations at correct index
    		            for (let i = start; i < start + deleteCount; i++) {
    		                const index = indexes[i];
    		                changeTree.delete(index);
    		                // this.tmpItems[index] = undefined;
    		                this.deletedIndexes[index] = true;
    		            }
    		            // force insert operations
    		            for (let i = 0; i < insertCount; i++) {
    		                const addIndex = indexes[start] + i;
    		                changeTree.indexedOperation(addIndex, exports.OPERATION.ADD);
    		                // set value's parent/root
    		                insertItems[i][$changes]?.setParent(this, changeTree.root, addIndex);
    		            }
    		            //
    		            // delete exceeding indexes from "allChanges"
    		            // (prevent .encodeAll() from encoding non-existing items)
    		            //
    		            if (deleteCount > insertCount) {
    		                changeTree.shiftAllChangeIndexes(-(deleteCount - insertCount), indexes[start + insertCount]);
    		            }
    		            return this.items.splice(start, deleteCount, ...insertItems);
    		        }
    		        /**
    		         * Inserts new elements at the start of an array.
    		         * @param items  Elements to insert at the start of the Array.
    		         */
    		        unshift(...items) {
    		            const changeTree = this[$changes];
    		            // shift indexes
    		            changeTree.shiftChangeIndexes(items.length);
    		            // new index
    		            if (changeTree.isFiltered) {
    		                setOperationAtIndex(changeTree.filteredChanges, this.items.length);
    		                // changeTree.filteredChanges[this.items.length] = OPERATION.ADD;
    		            }
    		            else {
    		                setOperationAtIndex(changeTree.allChanges, this.items.length);
    		                // changeTree.allChanges[this.items.length] = OPERATION.ADD;
    		            }
    		            // FIXME: should we use OPERATION.MOVE here instead?
    		            items.forEach((_, index) => {
    		                changeTree.change(index, exports.OPERATION.ADD);
    		            });
    		            this.tmpItems.unshift(...items);
    		            return this.items.unshift(...items);
    		        }
    		        /**
    		         * Returns the index of the first occurrence of a value in an array.
    		         * @param searchElement The value to locate in the array.
    		         * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
    		         */
    		        indexOf(searchElement, fromIndex) {
    		            return this.items.indexOf(searchElement, fromIndex);
    		        }
    		        /**
    		         * Returns the index of the last occurrence of a specified value in an array.
    		         * @param searchElement The value to locate in the array.
    		         * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array.
    		         */
    		        lastIndexOf(searchElement, fromIndex = this.length - 1) {
    		            return this.items.lastIndexOf(searchElement, fromIndex);
    		        }
    		        every(callbackfn, thisArg) {
    		            return this.items.every(callbackfn, thisArg);
    		        }
    		        /**
    		         * Determines whether the specified callback function returns true for any element of an array.
    		         * @param callbackfn A function that accepts up to three arguments. The some method calls
    		         * the callbackfn function for each element in the array until the callbackfn returns a value
    		         * which is coercible to the Boolean value true, or until the end of the array.
    		         * @param thisArg An object to which the this keyword can refer in the callbackfn function.
    		         * If thisArg is omitted, undefined is used as the this value.
    		         */
    		        some(callbackfn, thisArg) {
    		            return this.items.some(callbackfn, thisArg);
    		        }
    		        /**
    		         * Performs the specified action for each element in an array.
    		         * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
    		         * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
    		         */
    		        forEach(callbackfn, thisArg) {
    		            return this.items.forEach(callbackfn, thisArg);
    		        }
    		        /**
    		         * Calls a defined callback function on each element of an array, and returns an array that contains the results.
    		         * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
    		         * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
    		         */
    		        map(callbackfn, thisArg) {
    		            return this.items.map(callbackfn, thisArg);
    		        }
    		        filter(callbackfn, thisArg) {
    		            return this.items.filter(callbackfn, thisArg);
    		        }
    		        /**
    		         * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
    		         * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
    		         * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
    		         */
    		        reduce(callbackfn, initialValue) {
    		            return this.items.reduce(callbackfn, initialValue);
    		        }
    		        /**
    		         * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
    		         * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
    		         * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
    		         */
    		        reduceRight(callbackfn, initialValue) {
    		            return this.items.reduceRight(callbackfn, initialValue);
    		        }
    		        /**
    		         * Returns the value of the first element in the array where predicate is true, and undefined
    		         * otherwise.
    		         * @param predicate find calls predicate once for each element of the array, in ascending
    		         * order, until it finds one where predicate returns true. If such an element is found, find
    		         * immediately returns that element value. Otherwise, find returns undefined.
    		         * @param thisArg If provided, it will be used as the this value for each invocation of
    		         * predicate. If it is not provided, undefined is used instead.
    		         */
    		        find(predicate, thisArg) {
    		            return this.items.find(predicate, thisArg);
    		        }
    		        /**
    		         * Returns the index of the first element in the array where predicate is true, and -1
    		         * otherwise.
    		         * @param predicate find calls predicate once for each element of the array, in ascending
    		         * order, until it finds one where predicate returns true. If such an element is found,
    		         * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    		         * @param thisArg If provided, it will be used as the this value for each invocation of
    		         * predicate. If it is not provided, undefined is used instead.
    		         */
    		        findIndex(predicate, thisArg) {
    		            return this.items.findIndex(predicate, thisArg);
    		        }
    		        /**
    		         * Returns the this object after filling the section identified by start and end with value
    		         * @param value value to fill array section with
    		         * @param start index to start filling the array at. If start is negative, it is treated as
    		         * length+start where length is the length of the array.
    		         * @param end index to stop filling the array at. If end is negative, it is treated as
    		         * length+end.
    		         */
    		        fill(value, start, end) {
    		            //
    		            // TODO
    		            //
    		            throw new Error("ArraySchema#fill() not implemented");
    		        }
    		        /**
    		         * Returns the this object after copying a section of the array identified by start and end
    		         * to the same array starting at position target
    		         * @param target If target is negative, it is treated as length+target where length is the
    		         * length of the array.
    		         * @param start If start is negative, it is treated as length+start. If end is negative, it
    		         * is treated as length+end.
    		         * @param end If not specified, length of the this object is used as its default value.
    		         */
    		        copyWithin(target, start, end) {
    		            //
    		            // TODO
    		            //
    		            throw new Error("ArraySchema#copyWithin() not implemented");
    		        }
    		        /**
    		         * Returns a string representation of an array.
    		         */
    		        toString() {
    		            return this.items.toString();
    		        }
    		        /**
    		         * Returns a string representation of an array. The elements are converted to string using their toLocalString methods.
    		         */
    		        toLocaleString() {
    		            return this.items.toLocaleString();
    		        }
    		        ;
    		        /** Iterator */
    		        [Symbol.iterator]() {
    		            return this.items[Symbol.iterator]();
    		        }
    		        static get [Symbol.species]() {
    		            return ArraySchema;
    		        }
    		        /**
    		         * Returns an iterable of key, value pairs for every entry in the array
    		         */
    		        entries() { return this.items.entries(); }
    		        /**
    		         * Returns an iterable of keys in the array
    		         */
    		        keys() { return this.items.keys(); }
    		        /**
    		         * Returns an iterable of values in the array
    		         */
    		        values() { return this.items.values(); }
    		        /**
    		         * Determines whether an array includes a certain element, returning true or false as appropriate.
    		         * @param searchElement The element to search for.
    		         * @param fromIndex The position in this array at which to begin searching for searchElement.
    		         */
    		        includes(searchElement, fromIndex) {
    		            return this.items.includes(searchElement, fromIndex);
    		        }
    		        //
    		        // ES2022
    		        //
    		        /**
    		         * Calls a defined callback function on each element of an array. Then, flattens the result into
    		         * a new array.
    		         * This is identical to a map followed by flat with depth 1.
    		         *
    		         * @param callback A function that accepts up to three arguments. The flatMap method calls the
    		         * callback function one time for each element in the array.
    		         * @param thisArg An object to which the this keyword can refer in the callback function. If
    		         * thisArg is omitted, undefined is used as the this value.
    		         */
    		        // @ts-ignore
    		        flatMap(callback, thisArg) {
    		            // @ts-ignore
    		            throw new Error("ArraySchema#flatMap() is not supported.");
    		        }
    		        /**
    		         * Returns a new array with all sub-array elements concatenated into it recursively up to the
    		         * specified depth.
    		         *
    		         * @param depth The maximum recursion depth
    		         */
    		        // @ts-ignore
    		        flat(depth) {
    		            throw new Error("ArraySchema#flat() is not supported.");
    		        }
    		        findLast() {
    		            // @ts-ignore
    		            return this.items.findLast.apply(this.items, arguments);
    		        }
    		        findLastIndex(...args) {
    		            // @ts-ignore
    		            return this.items.findLastIndex.apply(this.items, arguments);
    		        }
    		        //
    		        // ES2023
    		        //
    		        with(index, value) {
    		            const copy = this.items.slice();
    		            // Allow negative indexing from the end
    		            if (index < 0)
    		                index += this.length;
    		            copy[index] = value;
    		            return new ArraySchema(...copy);
    		        }
    		        toReversed() {
    		            return this.items.slice().reverse();
    		        }
    		        toSorted(compareFn) {
    		            return this.items.slice().sort(compareFn);
    		        }
    		        // @ts-ignore
    		        toSpliced(start, deleteCount, ...items) {
    		            // @ts-ignore
    		            return this.items.toSpliced.apply(copy, arguments);
    		        }
    		        [($getByIndex)](index, isEncodeAll = false) {
    		            //
    		            // TODO: avoid unecessary `this.tmpItems` check during decoding.
    		            //
    		            //    ENCODING uses `this.tmpItems` (or `this.items` if `isEncodeAll` is true)
    		            //    DECODING uses `this.items`
    		            //
    		            return (isEncodeAll)
    		                ? this.items[index]
    		                : this.deletedIndexes[index]
    		                    ? this.items[index]
    		                    : this.tmpItems[index] || this.items[index];
    		            // return (isEncodeAll)
    		            //     ? this.items[index]
    		            //     : this.tmpItems[index] ?? this.items[index];
    		        }
    		        [$deleteByIndex](index) {
    		            this.items[index] = undefined;
    		            this.tmpItems[index] = undefined; // TODO: do not try to get "tmpItems" at decoding time.
    		        }
    		        [$onEncodeEnd]() {
    		            this.tmpItems = this.items.slice();
    		            this.deletedIndexes = {};
    		        }
    		        [$onDecodeEnd]() {
    		            this.items = this.items.filter((item) => item !== undefined);
    		            this.tmpItems = this.items.slice(); // TODO: do no use "tmpItems" at decoding time.
    		        }
    		        toArray() {
    		            return this.items.slice(0);
    		        }
    		        toJSON() {
    		            return this.toArray().map((value) => {
    		                return (typeof (value['toJSON']) === "function")
    		                    ? value['toJSON']()
    		                    : value;
    		            });
    		        }
    		        //
    		        // Decoding utilities
    		        //
    		        clone(isDecoding) {
    		            let cloned;
    		            if (isDecoding) {
    		                cloned = new ArraySchema();
    		                cloned.push(...this.items);
    		            }
    		            else {
    		                cloned = new ArraySchema(...this.map(item => ((item[$changes])
    		                    ? item.clone()
    		                    : item)));
    		            }
    		            return cloned;
    		        }
    		        ;
    		    }
    		    registerType("array", { constructor: ArraySchema });

    		    var _a$3, _b$3;
    		    class MapSchema {
    		        static { this[_a$3] = encodeKeyValueOperation; }
    		        static { this[_b$3] = decodeKeyValueOperation; }
    		        /**
    		         * Determine if a property must be filtered.
    		         * - If returns false, the property is NOT going to be encoded.
    		         * - If returns true, the property is going to be encoded.
    		         *
    		         * Encoding with "filters" happens in two steps:
    		         * - First, the encoder iterates over all "not owned" properties and encodes them.
    		         * - Then, the encoder iterates over all "owned" properties per instance and encodes them.
    		         */
    		        static [(_a$3 = $encoder, _b$3 = $decoder, $filter)](ref, index, view) {
    		            return (!view ||
    		                typeof (ref[$childType]) === "string" ||
    		                view.visible.has((ref[$getByIndex](index) ?? ref.deletedItems[index])[$changes]));
    		        }
    		        static is(type) {
    		            return type['map'] !== undefined;
    		        }
    		        constructor(initialValues) {
    		            this.$items = new Map();
    		            this.$indexes = new Map();
    		            this.deletedItems = {};
    		            this[$changes] = new ChangeTree(this);
    		            this[$changes].indexes = {};
    		            if (initialValues) {
    		                if (initialValues instanceof Map ||
    		                    initialValues instanceof MapSchema) {
    		                    initialValues.forEach((v, k) => this.set(k, v));
    		                }
    		                else {
    		                    for (const k in initialValues) {
    		                        this.set(k, initialValues[k]);
    		                    }
    		                }
    		            }
    		            Object.defineProperty(this, $childType, {
    		                value: undefined,
    		                enumerable: false,
    		                writable: true,
    		                configurable: true,
    		            });
    		        }
    		        /** Iterator */
    		        [Symbol.iterator]() { return this.$items[Symbol.iterator](); }
    		        get [Symbol.toStringTag]() { return this.$items[Symbol.toStringTag]; }
    		        static get [Symbol.species]() { return MapSchema; }
    		        set(key, value) {
    		            if (value === undefined || value === null) {
    		                throw new Error(`MapSchema#set('${key}', ${value}): trying to set ${value} value on '${key}'.`);
    		            }
    		            else if (typeof (value) === "object" && this[$childType]) {
    		                assertInstanceType(value, this[$childType], this, key);
    		            }
    		            // Force "key" as string
    		            // See: https://github.com/colyseus/colyseus/issues/561#issuecomment-1646733468
    		            key = key.toString();
    		            const changeTree = this[$changes];
    		            const isRef = (value[$changes]) !== undefined;
    		            let index;
    		            let operation;
    		            // IS REPLACE?
    		            if (typeof (changeTree.indexes[key]) !== "undefined") {
    		                index = changeTree.indexes[key];
    		                operation = exports.OPERATION.REPLACE;
    		                const previousValue = this.$items.get(key);
    		                if (previousValue === value) {
    		                    // if value is the same, avoid re-encoding it.
    		                    return;
    		                }
    		                else if (isRef) {
    		                    // if is schema, force ADD operation if value differ from previous one.
    		                    operation = exports.OPERATION.DELETE_AND_ADD;
    		                    // remove reference from previous value
    		                    if (previousValue !== undefined) {
    		                        previousValue[$changes].root?.remove(previousValue[$changes]);
    		                    }
    		                }
    		            }
    		            else {
    		                index = changeTree.indexes[$numFields] ?? 0;
    		                operation = exports.OPERATION.ADD;
    		                this.$indexes.set(index, key);
    		                changeTree.indexes[key] = index;
    		                changeTree.indexes[$numFields] = index + 1;
    		            }
    		            this.$items.set(key, value);
    		            changeTree.change(index, operation);
    		            //
    		            // set value's parent after the value is set
    		            // (to avoid encoding "refId" operations before parent's "ADD" operation)
    		            //
    		            if (isRef) {
    		                value[$changes].setParent(this, changeTree.root, index);
    		            }
    		            return this;
    		        }
    		        get(key) {
    		            return this.$items.get(key);
    		        }
    		        delete(key) {
    		            const index = this[$changes].indexes[key];
    		            this.deletedItems[index] = this[$changes].delete(index);
    		            return this.$items.delete(key);
    		        }
    		        clear() {
    		            const changeTree = this[$changes];
    		            // discard previous operations.
    		            changeTree.discard(true);
    		            changeTree.indexes = {};
    		            // clear previous indexes
    		            this.$indexes.clear();
    		            // clear items
    		            this.$items.clear();
    		            changeTree.operation(exports.OPERATION.CLEAR);
    		        }
    		        has(key) {
    		            return this.$items.has(key);
    		        }
    		        forEach(callbackfn) {
    		            this.$items.forEach(callbackfn);
    		        }
    		        entries() {
    		            return this.$items.entries();
    		        }
    		        keys() {
    		            return this.$items.keys();
    		        }
    		        values() {
    		            return this.$items.values();
    		        }
    		        get size() {
    		            return this.$items.size;
    		        }
    		        setIndex(index, key) {
    		            this.$indexes.set(index, key);
    		        }
    		        getIndex(index) {
    		            return this.$indexes.get(index);
    		        }
    		        [$getByIndex](index) {
    		            return this.$items.get(this.$indexes.get(index));
    		        }
    		        [$deleteByIndex](index) {
    		            const key = this.$indexes.get(index);
    		            this.$items.delete(key);
    		            this.$indexes.delete(index);
    		        }
    		        [$onEncodeEnd]() {
    		            this.deletedItems = {};
    		        }
    		        toJSON() {
    		            const map = {};
    		            this.forEach((value, key) => {
    		                map[key] = (typeof (value['toJSON']) === "function")
    		                    ? value['toJSON']()
    		                    : value;
    		            });
    		            return map;
    		        }
    		        //
    		        // Decoding utilities
    		        //
    		        // @ts-ignore
    		        clone(isDecoding) {
    		            let cloned;
    		            if (isDecoding) {
    		                // client-side
    		                cloned = Object.assign(new MapSchema(), this);
    		            }
    		            else {
    		                // server-side
    		                cloned = new MapSchema();
    		                this.forEach((value, key) => {
    		                    if (value[$changes]) {
    		                        cloned.set(key, value['clone']());
    		                    }
    		                    else {
    		                        cloned.set(key, value);
    		                    }
    		                });
    		            }
    		            return cloned;
    		        }
    		    }
    		    registerType("map", { constructor: MapSchema });

    		    const DEFAULT_VIEW_TAG = -1;
    		    function entity(constructor) {
    		        TypeContext.register(constructor);
    		        return constructor;
    		    }
    		    /**
    		     * [See documentation](https://docs.colyseus.io/state/schema/)
    		     *
    		     * Annotate a Schema property to be serializeable.
    		     * \@type()'d fields are automatically flagged as "dirty" for the next patch.
    		     *
    		     * @example Standard usage, with automatic change tracking.
    		     * ```
    		     * \@type("string") propertyName: string;
    		     * ```
    		     *
    		     * @example You can provide the "manual" option if you'd like to manually control your patches via .setDirty().
    		     * ```
    		     * \@type("string", { manual: true })
    		     * ```
    		     */
    		    // export function type(type: DefinitionType, options?: TypeOptions) {
    		    //     return function ({ get, set }, context: ClassAccessorDecoratorContext): ClassAccessorDecoratorResult<Schema, any> {
    		    //         if (context.kind !== "accessor") {
    		    //             throw new Error("@type() is only supported for class accessor properties");
    		    //         }
    		    //         const field = context.name.toString();
    		    //         //
    		    //         // detect index for this field, considering inheritance
    		    //         //
    		    //         const parent = Object.getPrototypeOf(context.metadata);
    		    //         let fieldIndex: number = context.metadata[$numFields] // current structure already has fields defined
    		    //             ?? (parent && parent[$numFields]) // parent structure has fields defined
    		    //             ?? -1; // no fields defined
    		    //         fieldIndex++;
    		    //         if (
    		    //             !parent && // the parent already initializes the `$changes` property
    		    //             !Metadata.hasFields(context.metadata)
    		    //         ) {
    		    //             context.addInitializer(function (this: Ref) {
    		    //                 Object.defineProperty(this, $changes, {
    		    //                     value: new ChangeTree(this),
    		    //                     enumerable: false,
    		    //                     writable: true
    		    //                 });
    		    //             });
    		    //         }
    		    //         Metadata.addField(context.metadata, fieldIndex, field, type);
    		    //         const isArray = ArraySchema.is(type);
    		    //         const isMap = !isArray && MapSchema.is(type);
    		    //         // if (options && options.manual) {
    		    //         //     // do not declare getter/setter descriptor
    		    //         //     definition.descriptors[field] = {
    		    //         //         enumerable: true,
    		    //         //         configurable: true,
    		    //         //         writable: true,
    		    //         //     };
    		    //         //     return;
    		    //         // }
    		    //         return {
    		    //             init(value) {
    		    //                 // TODO: may need to convert ArraySchema/MapSchema here
    		    //                 // do not flag change if value is undefined.
    		    //                 if (value !== undefined) {
    		    //                     this[$changes].change(fieldIndex);
    		    //                     // automaticallty transform Array into ArraySchema
    		    //                     if (isArray) {
    		    //                         if (!(value instanceof ArraySchema)) {
    		    //                             value = new ArraySchema(...value);
    		    //                         }
    		    //                         value[$childType] = Object.values(type)[0];
    		    //                     }
    		    //                     // automaticallty transform Map into MapSchema
    		    //                     if (isMap) {
    		    //                         if (!(value instanceof MapSchema)) {
    		    //                             value = new MapSchema(value);
    		    //                         }
    		    //                         value[$childType] = Object.values(type)[0];
    		    //                     }
    		    //                     // try to turn provided structure into a Proxy
    		    //                     if (value['$proxy'] === undefined) {
    		    //                         if (isMap) {
    		    //                             value = getMapProxy(value);
    		    //                         }
    		    //                     }
    		    //                 }
    		    //                 return value;
    		    //             },
    		    //             get() {
    		    //                 return get.call(this);
    		    //             },
    		    //             set(value: any) {
    		    //                 /**
    		    //                  * Create Proxy for array or map items
    		    //                  */
    		    //                 // skip if value is the same as cached.
    		    //                 if (value === get.call(this)) {
    		    //                     return;
    		    //                 }
    		    //                 if (
    		    //                     value !== undefined &&
    		    //                     value !== null
    		    //                 ) {
    		    //                     // automaticallty transform Array into ArraySchema
    		    //                     if (isArray) {
    		    //                         if (!(value instanceof ArraySchema)) {
    		    //                             value = new ArraySchema(...value);
    		    //                         }
    		    //                         value[$childType] = Object.values(type)[0];
    		    //                     }
    		    //                     // automaticallty transform Map into MapSchema
    		    //                     if (isMap) {
    		    //                         if (!(value instanceof MapSchema)) {
    		    //                             value = new MapSchema(value);
    		    //                         }
    		    //                         value[$childType] = Object.values(type)[0];
    		    //                     }
    		    //                     // try to turn provided structure into a Proxy
    		    //                     if (value['$proxy'] === undefined) {
    		    //                         if (isMap) {
    		    //                             value = getMapProxy(value);
    		    //                         }
    		    //                     }
    		    //                     // flag the change for encoding.
    		    //                     this[$changes].change(fieldIndex);
    		    //                     //
    		    //                     // call setParent() recursively for this and its child
    		    //                     // structures.
    		    //                     //
    		    //                     if (value[$changes]) {
    		    //                         value[$changes].setParent(
    		    //                             this,
    		    //                             this[$changes].root,
    		    //                             Metadata.getIndex(context.metadata, field),
    		    //                         );
    		    //                     }
    		    //                 } else if (get.call(this)) {
    		    //                     //
    		    //                     // Setting a field to `null` or `undefined` will delete it.
    		    //                     //
    		    //                     this[$changes].delete(field);
    		    //                 }
    		    //                 set.call(this, value);
    		    //             },
    		    //         };
    		    //     }
    		    // }
    		    function view(tag = DEFAULT_VIEW_TAG) {
    		        return function (target, fieldName) {
    		            const constructor = target.constructor;
    		            const parentClass = Object.getPrototypeOf(constructor);
    		            const parentMetadata = parentClass[Symbol.metadata];
    		            // TODO: use Metadata.initialize()
    		            const metadata = (constructor[Symbol.metadata] ??= Object.assign({}, constructor[Symbol.metadata], parentMetadata ?? Object.create(null)));
    		            // const fieldIndex = metadata[fieldName];
    		            // if (!metadata[fieldIndex]) {
    		            //     //
    		            //     // detect index for this field, considering inheritance
    		            //     //
    		            //     metadata[fieldIndex] = {
    		            //         type: undefined,
    		            //         index: (metadata[$numFields] // current structure already has fields defined
    		            //             ?? (parentMetadata && parentMetadata[$numFields]) // parent structure has fields defined
    		            //             ?? -1) + 1 // no fields defined
    		            //     }
    		            // }
    		            Metadata.setTag(metadata, fieldName, tag);
    		        };
    		    }
    		    function type(type, options) {
    		        return function (target, field) {
    		            const constructor = target.constructor;
    		            if (!type) {
    		                throw new Error(`${constructor.name}: @type() reference provided for "${field}" is undefined. Make sure you don't have any circular dependencies.`);
    		            }
    		            // for inheritance support
    		            TypeContext.register(constructor);
    		            const parentClass = Object.getPrototypeOf(constructor);
    		            const parentMetadata = parentClass[Symbol.metadata];
    		            const metadata = Metadata.initialize(constructor);
    		            let fieldIndex = metadata[field];
    		            /**
    		             * skip if descriptor already exists for this field (`@deprecated()`)
    		             */
    		            if (metadata[fieldIndex] !== undefined) {
    		                if (metadata[fieldIndex].deprecated) {
    		                    // do not create accessors for deprecated properties.
    		                    return;
    		                }
    		                else if (metadata[fieldIndex].type !== undefined) {
    		                    // trying to define same property multiple times across inheritance.
    		                    // https://github.com/colyseus/colyseus-unity3d/issues/131#issuecomment-814308572
    		                    try {
    		                        throw new Error(`@colyseus/schema: Duplicate '${field}' definition on '${constructor.name}'.\nCheck @type() annotation`);
    		                    }
    		                    catch (e) {
    		                        const definitionAtLine = e.stack.split("\n")[4].trim();
    		                        throw new Error(`${e.message} ${definitionAtLine}`);
    		                    }
    		                }
    		            }
    		            else {
    		                //
    		                // detect index for this field, considering inheritance
    		                //
    		                fieldIndex = metadata[$numFields] // current structure already has fields defined
    		                    ?? (parentMetadata && parentMetadata[$numFields]) // parent structure has fields defined
    		                    ?? -1; // no fields defined
    		                fieldIndex++;
    		            }
    		            if (options && options.manual) {
    		                Metadata.addField(metadata, fieldIndex, field, type, {
    		                    // do not declare getter/setter descriptor
    		                    enumerable: true,
    		                    configurable: true,
    		                    writable: true,
    		                });
    		            }
    		            else {
    		                const complexTypeKlass = (Array.isArray(type))
    		                    ? getType("array")
    		                    : (typeof (Object.keys(type)[0]) === "string") && getType(Object.keys(type)[0]);
    		                const childType = (complexTypeKlass)
    		                    ? Object.values(type)[0]
    		                    : type;
    		                Metadata.addField(metadata, fieldIndex, field, type, getPropertyDescriptor(`_${field}`, fieldIndex, childType, complexTypeKlass));
    		            }
    		        };
    		    }
    		    function getPropertyDescriptor(fieldCached, fieldIndex, type, complexTypeKlass) {
    		        return {
    		            get: function () { return this[fieldCached]; },
    		            set: function (value) {
    		                const previousValue = this[fieldCached] ?? undefined;
    		                // skip if value is the same as cached.
    		                if (value === previousValue) {
    		                    return;
    		                }
    		                if (value !== undefined &&
    		                    value !== null) {
    		                    if (complexTypeKlass) {
    		                        // automaticallty transform Array into ArraySchema
    		                        if (complexTypeKlass.constructor === ArraySchema && !(value instanceof ArraySchema)) {
    		                            value = new ArraySchema(...value);
    		                        }
    		                        // automaticallty transform Map into MapSchema
    		                        if (complexTypeKlass.constructor === MapSchema && !(value instanceof MapSchema)) {
    		                            value = new MapSchema(value);
    		                        }
    		                        value[$childType] = type;
    		                    }
    		                    else if (typeof (type) !== "string") {
    		                        assertInstanceType(value, type, this, fieldCached.substring(1));
    		                    }
    		                    else {
    		                        assertType(value, type, this, fieldCached.substring(1));
    		                    }
    		                    const changeTree = this[$changes];
    		                    //
    		                    // Replacing existing "ref", remove it from root.
    		                    //
    		                    if (previousValue !== undefined && previousValue[$changes]) {
    		                        changeTree.root?.remove(previousValue[$changes]);
    		                        this.constructor[$track](changeTree, fieldIndex, exports.OPERATION.DELETE_AND_ADD);
    		                    }
    		                    else {
    		                        this.constructor[$track](changeTree, fieldIndex, exports.OPERATION.ADD);
    		                    }
    		                    //
    		                    // call setParent() recursively for this and its child
    		                    // structures.
    		                    //
    		                    value[$changes]?.setParent(this, changeTree.root, fieldIndex);
    		                }
    		                else if (previousValue !== undefined) {
    		                    //
    		                    // Setting a field to `null` or `undefined` will delete it.
    		                    //
    		                    this[$changes].delete(fieldIndex);
    		                }
    		                this[fieldCached] = value;
    		            },
    		            enumerable: true,
    		            configurable: true
    		        };
    		    }
    		    /**
    		     * `@deprecated()` flag a field as deprecated.
    		     * The previous `@type()` annotation should remain along with this one.
    		     */
    		    function deprecated(throws = true) {
    		        return function (klass, field) {
    		            //
    		            // FIXME: the following block of code is repeated across `@type()`, `@deprecated()` and `@unreliable()` decorators.
    		            //
    		            const constructor = klass.constructor;
    		            const parentClass = Object.getPrototypeOf(constructor);
    		            const parentMetadata = parentClass[Symbol.metadata];
    		            const metadata = (constructor[Symbol.metadata] ??= Object.assign({}, constructor[Symbol.metadata], parentMetadata ?? Object.create(null)));
    		            const fieldIndex = metadata[field];
    		            // if (!metadata[field]) {
    		            //     //
    		            //     // detect index for this field, considering inheritance
    		            //     //
    		            //     metadata[field] = {
    		            //         type: undefined,
    		            //         index: (metadata[$numFields] // current structure already has fields defined
    		            //             ?? (parentMetadata && parentMetadata[$numFields]) // parent structure has fields defined
    		            //             ?? -1) + 1 // no fields defined
    		            //     }
    		            // }
    		            metadata[fieldIndex].deprecated = true;
    		            if (throws) {
    		                metadata[$descriptors] ??= {};
    		                metadata[$descriptors][field] = {
    		                    get: function () { throw new Error(`${field} is deprecated.`); },
    		                    set: function (value) { },
    		                    enumerable: false,
    		                    configurable: true
    		                };
    		            }
    		            // flag metadata[field] as non-enumerable
    		            Object.defineProperty(metadata, fieldIndex, {
    		                value: metadata[fieldIndex],
    		                enumerable: false,
    		                configurable: true
    		            });
    		        };
    		    }
    		    function defineTypes(target, fields, options) {
    		        for (let field in fields) {
    		            type(fields[field], options)(target.prototype, field);
    		        }
    		        return target;
    		    }
    		    function schema(fields, name, inherits = Schema) {
    		        const defaultValues = {};
    		        const viewTagFields = {};
    		        for (let fieldName in fields) {
    		            const field = fields[fieldName];
    		            if (typeof (field) === "object") {
    		                if (field['default'] !== undefined) {
    		                    defaultValues[fieldName] = field['default'];
    		                }
    		                if (field['view'] !== undefined) {
    		                    viewTagFields[fieldName] = (typeof (field['view']) === "boolean")
    		                        ? DEFAULT_VIEW_TAG
    		                        : field['view'];
    		                }
    		            }
    		        }
    		        const klass = Metadata.setFields(class extends inherits {
    		            constructor(...args) {
    		                args[0] = Object.assign({}, defaultValues, args[0]);
    		                super(...args);
    		            }
    		        }, fields);
    		        for (let fieldName in viewTagFields) {
    		            view(viewTagFields[fieldName])(klass.prototype, fieldName);
    		        }
    		        if (name) {
    		            Object.defineProperty(klass, "name", { value: name });
    		        }
    		        klass.extends = (fields, name) => schema(fields, name, klass);
    		        return klass;
    		    }

    		    function getIndent(level) {
    		        return (new Array(level).fill(0)).map((_, i) => (i === level - 1) ? `└─ ` : `   `).join("");
    		    }
    		    function dumpChanges(schema) {
    		        const $root = schema[$changes].root;
    		        const dump = {
    		            ops: {},
    		            refs: []
    		        };
    		        // for (const refId in $root.changes) {
    		        $root.changes.forEach(changeTree => {
    		            const changes = changeTree.indexedOperations;
    		            dump.refs.push(`refId#${changeTree.refId}`);
    		            for (const index in changes) {
    		                const op = changes[index];
    		                const opName = exports.OPERATION[op];
    		                if (!dump.ops[opName]) {
    		                    dump.ops[opName] = 0;
    		                }
    		                dump.ops[exports.OPERATION[op]]++;
    		            }
    		        });
    		        return dump;
    		    }

    		    var _a$2, _b$2;
    		    /**
    		     * Schema encoder / decoder
    		     */
    		    class Schema {
    		        static { this[_a$2] = encodeSchemaOperation; }
    		        static { this[_b$2] = decodeSchemaOperation; }
    		        /**
    		         * Assign the property descriptors required to track changes on this instance.
    		         * @param instance
    		         */
    		        static initialize(instance) {
    		            Object.defineProperty(instance, $changes, {
    		                value: new ChangeTree(instance),
    		                enumerable: false,
    		                writable: true
    		            });
    		            Object.defineProperties(instance, instance.constructor[Symbol.metadata]?.[$descriptors] || {});
    		        }
    		        static is(type) {
    		            return typeof (type[Symbol.metadata]) === "object";
    		            // const metadata = type[Symbol.metadata];
    		            // return metadata && Object.prototype.hasOwnProperty.call(metadata, -1);
    		        }
    		        /**
    		         * Track property changes
    		         */
    		        static [(_a$2 = $encoder, _b$2 = $decoder, $track)](changeTree, index, operation = exports.OPERATION.ADD) {
    		            changeTree.change(index, operation);
    		        }
    		        /**
    		         * Determine if a property must be filtered.
    		         * - If returns false, the property is NOT going to be encoded.
    		         * - If returns true, the property is going to be encoded.
    		         *
    		         * Encoding with "filters" happens in two steps:
    		         * - First, the encoder iterates over all "not owned" properties and encodes them.
    		         * - Then, the encoder iterates over all "owned" properties per instance and encodes them.
    		         */
    		        static [$filter](ref, index, view) {
    		            const metadata = ref.constructor[Symbol.metadata];
    		            const tag = metadata[index]?.tag;
    		            if (view === undefined) {
    		                // shared pass/encode: encode if doesn't have a tag
    		                return tag === undefined;
    		            }
    		            else if (tag === undefined) {
    		                // view pass: no tag
    		                return true;
    		            }
    		            else if (tag === DEFAULT_VIEW_TAG) {
    		                // view pass: default tag
    		                return view.visible.has(ref[$changes]);
    		            }
    		            else {
    		                // view pass: custom tag
    		                const tags = view.tags?.get(ref[$changes]);
    		                return tags && tags.has(tag);
    		            }
    		        }
    		        // allow inherited classes to have a constructor
    		        constructor(...args) {
    		            //
    		            // inline
    		            // Schema.initialize(this);
    		            //
    		            Schema.initialize(this);
    		            //
    		            // Assign initial values
    		            //
    		            if (args[0]) {
    		                Object.assign(this, args[0]);
    		            }
    		        }
    		        assign(props) {
    		            Object.assign(this, props);
    		            return this;
    		        }
    		        /**
    		         * (Server-side): Flag a property to be encoded for the next patch.
    		         * @param instance Schema instance
    		         * @param property string representing the property name, or number representing the index of the property.
    		         * @param operation OPERATION to perform (detected automatically)
    		         */
    		        setDirty(property, operation) {
    		            const metadata = this.constructor[Symbol.metadata];
    		            this[$changes].change(metadata[metadata[property]].index, operation);
    		        }
    		        clone() {
    		            const cloned = new (this.constructor);
    		            const metadata = this.constructor[Symbol.metadata];
    		            //
    		            // TODO: clone all properties, not only annotated ones
    		            //
    		            // for (const field in this) {
    		            for (const fieldIndex in metadata) {
    		                // const field = metadata[metadata[fieldIndex]].name;
    		                const field = metadata[fieldIndex].name;
    		                if (typeof (this[field]) === "object" &&
    		                    typeof (this[field]?.clone) === "function") {
    		                    // deep clone
    		                    cloned[field] = this[field].clone();
    		                }
    		                else {
    		                    // primitive values
    		                    cloned[field] = this[field];
    		                }
    		            }
    		            return cloned;
    		        }
    		        toJSON() {
    		            const obj = {};
    		            const metadata = this.constructor[Symbol.metadata];
    		            for (const index in metadata) {
    		                const field = metadata[index];
    		                const fieldName = field.name;
    		                if (!field.deprecated && this[fieldName] !== null && typeof (this[fieldName]) !== "undefined") {
    		                    obj[fieldName] = (typeof (this[fieldName]['toJSON']) === "function")
    		                        ? this[fieldName]['toJSON']()
    		                        : this[fieldName];
    		                }
    		            }
    		            return obj;
    		        }
    		        discardAllChanges() {
    		            this[$changes].discardAll();
    		        }
    		        [$getByIndex](index) {
    		            const metadata = this.constructor[Symbol.metadata];
    		            return this[metadata[index].name];
    		        }
    		        [$deleteByIndex](index) {
    		            const metadata = this.constructor[Symbol.metadata];
    		            this[metadata[index].name] = undefined;
    		        }
    		        /**
    		         * Inspect the `refId` of all Schema instances in the tree. Optionally display the contents of the instance.
    		         *
    		         * @param ref Schema instance
    		         * @param showContents display JSON contents of the instance
    		         * @returns
    		         */
    		        static debugRefIds(ref, showContents = false, level = 0) {
    		            const contents = (showContents) ? ` - ${JSON.stringify(ref.toJSON())}` : "";
    		            const changeTree = ref[$changes];
    		            const refId = changeTree.refId;
    		            let output = "";
    		            output += `${getIndent(level)}${ref.constructor.name} (refId: ${refId})${contents}\n`;
    		            changeTree.forEachChild((childChangeTree) => output += this.debugRefIds(childChangeTree.ref, showContents, level + 1));
    		            return output;
    		        }
    		        /**
    		         * Return a string representation of the changes on a Schema instance.
    		         * The list of changes is cleared after each encode.
    		         *
    		         * @param instance Schema instance
    		         * @param isEncodeAll Return "full encode" instead of current change set.
    		         * @returns
    		         */
    		        static debugChanges(instance, isEncodeAll = false) {
    		            const changeTree = instance[$changes];
    		            const changeSet = (isEncodeAll) ? changeTree.allChanges : changeTree.changes;
    		            const changeSetName = (isEncodeAll) ? "allChanges" : "changes";
    		            let output = `${instance.constructor.name} (${changeTree.refId}) -> .${changeSetName}:\n`;
    		            function dumpChangeSet(changeSet) {
    		                changeSet.operations
    		                    .filter(op => op)
    		                    .forEach((index) => {
    		                    const operation = changeTree.indexedOperations[index];
    		                    console.log({ index, operation });
    		                    output += `- [${index}]: ${exports.OPERATION[operation]} (${JSON.stringify(changeTree.getValue(Number(index), isEncodeAll))})\n`;
    		                });
    		            }
    		            dumpChangeSet(changeSet);
    		            // display filtered changes
    		            if (!isEncodeAll &&
    		                changeTree.filteredChanges &&
    		                (changeTree.filteredChanges.operations).filter(op => op).length > 0) {
    		                output += `${instance.constructor.name} (${changeTree.refId}) -> .filteredChanges:\n`;
    		                dumpChangeSet(changeTree.filteredChanges);
    		            }
    		            // display filtered changes
    		            if (isEncodeAll &&
    		                changeTree.allFilteredChanges &&
    		                (changeTree.allFilteredChanges.operations).filter(op => op).length > 0) {
    		                output += `${instance.constructor.name} (${changeTree.refId}) -> .allFilteredChanges:\n`;
    		                dumpChangeSet(changeTree.allFilteredChanges);
    		            }
    		            return output;
    		        }
    		        static debugChangesDeep(ref, changeSetName = "changes") {
    		            let output = "";
    		            const rootChangeTree = ref[$changes];
    		            const root = rootChangeTree.root;
    		            const changeTrees = new Map();
    		            const instanceRefIds = [];
    		            let totalOperations = 0;
    		            for (const [refId, changes] of Object.entries(root[changeSetName])) {
    		                const changeTree = root.changeTrees[refId];
    		                let includeChangeTree = false;
    		                let parentChangeTrees = [];
    		                let parentChangeTree = changeTree.parent?.[$changes];
    		                if (changeTree === rootChangeTree) {
    		                    includeChangeTree = true;
    		                }
    		                else {
    		                    while (parentChangeTree !== undefined) {
    		                        parentChangeTrees.push(parentChangeTree);
    		                        if (parentChangeTree.ref === ref) {
    		                            includeChangeTree = true;
    		                            break;
    		                        }
    		                        parentChangeTree = parentChangeTree.parent?.[$changes];
    		                    }
    		                }
    		                if (includeChangeTree) {
    		                    instanceRefIds.push(changeTree.refId);
    		                    totalOperations += Object.keys(changes).length;
    		                    changeTrees.set(changeTree, parentChangeTrees.reverse());
    		                }
    		            }
    		            output += "---\n";
    		            output += `root refId: ${rootChangeTree.refId}\n`;
    		            output += `Total instances: ${instanceRefIds.length} (refIds: ${instanceRefIds.join(", ")})\n`;
    		            output += `Total changes: ${totalOperations}\n`;
    		            output += "---\n";
    		            // based on root.changes, display a tree of changes that has the "ref" instance as parent
    		            const visitedParents = new WeakSet();
    		            for (const [changeTree, parentChangeTrees] of changeTrees.entries()) {
    		                parentChangeTrees.forEach((parentChangeTree, level) => {
    		                    if (!visitedParents.has(parentChangeTree)) {
    		                        output += `${getIndent(level)}${parentChangeTree.ref.constructor.name} (refId: ${parentChangeTree.refId})\n`;
    		                        visitedParents.add(parentChangeTree);
    		                    }
    		                });
    		                const changes = changeTree.indexedOperations;
    		                const level = parentChangeTrees.length;
    		                const indent = getIndent(level);
    		                const parentIndex = (level > 0) ? `(${changeTree.parentIndex}) ` : "";
    		                output += `${indent}${parentIndex}${changeTree.ref.constructor.name} (refId: ${changeTree.refId}) - changes: ${Object.keys(changes).length}\n`;
    		                for (const index in changes) {
    		                    const operation = changes[index];
    		                    output += `${getIndent(level + 1)}${exports.OPERATION[operation]}: ${index}\n`;
    		                }
    		            }
    		            return `${output}`;
    		        }
    		    }

    		    var _a$1, _b$1;
    		    class CollectionSchema {
    		        static { this[_a$1] = encodeKeyValueOperation; }
    		        static { this[_b$1] = decodeKeyValueOperation; }
    		        /**
    		         * Determine if a property must be filtered.
    		         * - If returns false, the property is NOT going to be encoded.
    		         * - If returns true, the property is going to be encoded.
    		         *
    		         * Encoding with "filters" happens in two steps:
    		         * - First, the encoder iterates over all "not owned" properties and encodes them.
    		         * - Then, the encoder iterates over all "owned" properties per instance and encodes them.
    		         */
    		        static [(_a$1 = $encoder, _b$1 = $decoder, $filter)](ref, index, view) {
    		            return (!view ||
    		                typeof (ref[$childType]) === "string" ||
    		                view.visible.has((ref[$getByIndex](index) ?? ref.deletedItems[index])[$changes]));
    		        }
    		        static is(type) {
    		            return type['collection'] !== undefined;
    		        }
    		        constructor(initialValues) {
    		            this.$items = new Map();
    		            this.$indexes = new Map();
    		            this.deletedItems = {};
    		            this.$refId = 0;
    		            this[$changes] = new ChangeTree(this);
    		            this[$changes].indexes = {};
    		            if (initialValues) {
    		                initialValues.forEach((v) => this.add(v));
    		            }
    		            Object.defineProperty(this, $childType, {
    		                value: undefined,
    		                enumerable: false,
    		                writable: true,
    		                configurable: true,
    		            });
    		        }
    		        add(value) {
    		            // set "index" for reference.
    		            const index = this.$refId++;
    		            const isRef = (value[$changes]) !== undefined;
    		            if (isRef) {
    		                value[$changes].setParent(this, this[$changes].root, index);
    		            }
    		            this[$changes].indexes[index] = index;
    		            this.$indexes.set(index, index);
    		            this.$items.set(index, value);
    		            this[$changes].change(index);
    		            return index;
    		        }
    		        at(index) {
    		            const key = Array.from(this.$items.keys())[index];
    		            return this.$items.get(key);
    		        }
    		        entries() {
    		            return this.$items.entries();
    		        }
    		        delete(item) {
    		            const entries = this.$items.entries();
    		            let index;
    		            let entry;
    		            while (entry = entries.next()) {
    		                if (entry.done) {
    		                    break;
    		                }
    		                if (item === entry.value[1]) {
    		                    index = entry.value[0];
    		                    break;
    		                }
    		            }
    		            if (index === undefined) {
    		                return false;
    		            }
    		            this.deletedItems[index] = this[$changes].delete(index);
    		            this.$indexes.delete(index);
    		            return this.$items.delete(index);
    		        }
    		        clear() {
    		            const changeTree = this[$changes];
    		            // discard previous operations.
    		            changeTree.discard(true);
    		            changeTree.indexes = {};
    		            // clear previous indexes
    		            this.$indexes.clear();
    		            // clear items
    		            this.$items.clear();
    		            changeTree.operation(exports.OPERATION.CLEAR);
    		        }
    		        has(value) {
    		            return Array.from(this.$items.values()).some((v) => v === value);
    		        }
    		        forEach(callbackfn) {
    		            this.$items.forEach((value, key, _) => callbackfn(value, key, this));
    		        }
    		        values() {
    		            return this.$items.values();
    		        }
    		        get size() {
    		            return this.$items.size;
    		        }
    		        /** Iterator */
    		        [Symbol.iterator]() {
    		            return this.$items.values();
    		        }
    		        setIndex(index, key) {
    		            this.$indexes.set(index, key);
    		        }
    		        getIndex(index) {
    		            return this.$indexes.get(index);
    		        }
    		        [$getByIndex](index) {
    		            return this.$items.get(this.$indexes.get(index));
    		        }
    		        [$deleteByIndex](index) {
    		            const key = this.$indexes.get(index);
    		            this.$items.delete(key);
    		            this.$indexes.delete(index);
    		        }
    		        [$onEncodeEnd]() {
    		            this.deletedItems = {};
    		        }
    		        toArray() {
    		            return Array.from(this.$items.values());
    		        }
    		        toJSON() {
    		            const values = [];
    		            this.forEach((value, key) => {
    		                values.push((typeof (value['toJSON']) === "function")
    		                    ? value['toJSON']()
    		                    : value);
    		            });
    		            return values;
    		        }
    		        //
    		        // Decoding utilities
    		        //
    		        clone(isDecoding) {
    		            let cloned;
    		            if (isDecoding) {
    		                // client-side
    		                cloned = Object.assign(new CollectionSchema(), this);
    		            }
    		            else {
    		                // server-side
    		                cloned = new CollectionSchema();
    		                this.forEach((value) => {
    		                    if (value[$changes]) {
    		                        cloned.add(value['clone']());
    		                    }
    		                    else {
    		                        cloned.add(value);
    		                    }
    		                });
    		            }
    		            return cloned;
    		        }
    		    }
    		    registerType("collection", { constructor: CollectionSchema, });

    		    var _a, _b;
    		    class SetSchema {
    		        static { this[_a] = encodeKeyValueOperation; }
    		        static { this[_b] = decodeKeyValueOperation; }
    		        /**
    		         * Determine if a property must be filtered.
    		         * - If returns false, the property is NOT going to be encoded.
    		         * - If returns true, the property is going to be encoded.
    		         *
    		         * Encoding with "filters" happens in two steps:
    		         * - First, the encoder iterates over all "not owned" properties and encodes them.
    		         * - Then, the encoder iterates over all "owned" properties per instance and encodes them.
    		         */
    		        static [(_a = $encoder, _b = $decoder, $filter)](ref, index, view) {
    		            return (!view ||
    		                typeof (ref[$childType]) === "string" ||
    		                view.visible.has((ref[$getByIndex](index) ?? ref.deletedItems[index])[$changes]));
    		        }
    		        static is(type) {
    		            return type['set'] !== undefined;
    		        }
    		        constructor(initialValues) {
    		            this.$items = new Map();
    		            this.$indexes = new Map();
    		            this.deletedItems = {};
    		            this.$refId = 0;
    		            this[$changes] = new ChangeTree(this);
    		            this[$changes].indexes = {};
    		            if (initialValues) {
    		                initialValues.forEach((v) => this.add(v));
    		            }
    		            Object.defineProperty(this, $childType, {
    		                value: undefined,
    		                enumerable: false,
    		                writable: true,
    		                configurable: true,
    		            });
    		        }
    		        add(value) {
    		            // immediatelly return false if value already added.
    		            if (this.has(value)) {
    		                return false;
    		            }
    		            // set "index" for reference.
    		            const index = this.$refId++;
    		            if ((value[$changes]) !== undefined) {
    		                value[$changes].setParent(this, this[$changes].root, index);
    		            }
    		            const operation = this[$changes].indexes[index]?.op ?? exports.OPERATION.ADD;
    		            this[$changes].indexes[index] = index;
    		            this.$indexes.set(index, index);
    		            this.$items.set(index, value);
    		            this[$changes].change(index, operation);
    		            return index;
    		        }
    		        entries() {
    		            return this.$items.entries();
    		        }
    		        delete(item) {
    		            const entries = this.$items.entries();
    		            let index;
    		            let entry;
    		            while (entry = entries.next()) {
    		                if (entry.done) {
    		                    break;
    		                }
    		                if (item === entry.value[1]) {
    		                    index = entry.value[0];
    		                    break;
    		                }
    		            }
    		            if (index === undefined) {
    		                return false;
    		            }
    		            this.deletedItems[index] = this[$changes].delete(index);
    		            this.$indexes.delete(index);
    		            return this.$items.delete(index);
    		        }
    		        clear() {
    		            const changeTree = this[$changes];
    		            // discard previous operations.
    		            changeTree.discard(true);
    		            changeTree.indexes = {};
    		            // clear previous indexes
    		            this.$indexes.clear();
    		            // clear items
    		            this.$items.clear();
    		            changeTree.operation(exports.OPERATION.CLEAR);
    		        }
    		        has(value) {
    		            const values = this.$items.values();
    		            let has = false;
    		            let entry;
    		            while (entry = values.next()) {
    		                if (entry.done) {
    		                    break;
    		                }
    		                if (value === entry.value) {
    		                    has = true;
    		                    break;
    		                }
    		            }
    		            return has;
    		        }
    		        forEach(callbackfn) {
    		            this.$items.forEach((value, key, _) => callbackfn(value, key, this));
    		        }
    		        values() {
    		            return this.$items.values();
    		        }
    		        get size() {
    		            return this.$items.size;
    		        }
    		        /** Iterator */
    		        [Symbol.iterator]() {
    		            return this.$items.values();
    		        }
    		        setIndex(index, key) {
    		            this.$indexes.set(index, key);
    		        }
    		        getIndex(index) {
    		            return this.$indexes.get(index);
    		        }
    		        [$getByIndex](index) {
    		            return this.$items.get(this.$indexes.get(index));
    		        }
    		        [$deleteByIndex](index) {
    		            const key = this.$indexes.get(index);
    		            this.$items.delete(key);
    		            this.$indexes.delete(index);
    		        }
    		        [$onEncodeEnd]() {
    		            this.deletedItems = {};
    		        }
    		        toArray() {
    		            return Array.from(this.$items.values());
    		        }
    		        toJSON() {
    		            const values = [];
    		            this.forEach((value, key) => {
    		                values.push((typeof (value['toJSON']) === "function")
    		                    ? value['toJSON']()
    		                    : value);
    		            });
    		            return values;
    		        }
    		        //
    		        // Decoding utilities
    		        //
    		        clone(isDecoding) {
    		            let cloned;
    		            if (isDecoding) {
    		                // client-side
    		                cloned = Object.assign(new SetSchema(), this);
    		            }
    		            else {
    		                // server-side
    		                cloned = new SetSchema();
    		                this.forEach((value) => {
    		                    if (value[$changes]) {
    		                        cloned.add(value['clone']());
    		                    }
    		                    else {
    		                        cloned.add(value);
    		                    }
    		                });
    		            }
    		            return cloned;
    		        }
    		    }
    		    registerType("set", { constructor: SetSchema });

    		    /******************************************************************************
    		    Copyright (c) Microsoft Corporation.

    		    Permission to use, copy, modify, and/or distribute this software for any
    		    purpose with or without fee is hereby granted.

    		    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    		    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    		    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    		    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    		    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    		    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    		    PERFORMANCE OF THIS SOFTWARE.
    		    ***************************************************************************** */
    		    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */


    		    function __decorate(decorators, target, key, desc) {
    		        var c = arguments.length, r = c < 3 ? target : desc, d;
    		        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    		        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    		        return c > 3 && r && Object.defineProperty(target, key, r), r;
    		    }

    		    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    		        var e = new Error(message);
    		        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    		    };

    		    function spliceOne(arr, index) {
    		        // manually splice an array
    		        if (index === -1 || index >= arr.length) {
    		            return false;
    		        }
    		        const len = arr.length - 1;
    		        for (let i = index; i < len; i++) {
    		            arr[i] = arr[i + 1];
    		        }
    		        arr.length = len;
    		        return true;
    		    }

    		    class Root {
    		        constructor(types) {
    		            this.types = types;
    		            this.nextUniqueId = 0;
    		            this.refCount = {};
    		            this.changeTrees = {};
    		            // all changes
    		            this.allChanges = [];
    		            this.allFilteredChanges = []; // TODO: do not initialize it if filters are not used
    		            // pending changes to be encoded
    		            this.changes = [];
    		            this.filteredChanges = []; // TODO: do not initialize it if filters are not used
    		        }
    		        getNextUniqueId() {
    		            return this.nextUniqueId++;
    		        }
    		        add(changeTree) {
    		            // FIXME: move implementation of `ensureRefId` to `Root` class
    		            changeTree.ensureRefId();
    		            const isNewChangeTree = (this.changeTrees[changeTree.refId] === undefined);
    		            if (isNewChangeTree) {
    		                this.changeTrees[changeTree.refId] = changeTree;
    		            }
    		            const previousRefCount = this.refCount[changeTree.refId];
    		            if (previousRefCount === 0) {
    		                //
    		                // When a ChangeTree is re-added, it means that it was previously removed.
    		                // We need to re-add all changes to the `changes` map.
    		                //
    		                const ops = changeTree.allChanges.operations;
    		                let len = ops.length;
    		                while (len--) {
    		                    changeTree.indexedOperations[ops[len]] = exports.OPERATION.ADD;
    		                    setOperationAtIndex(changeTree.changes, len);
    		                }
    		            }
    		            this.refCount[changeTree.refId] = (previousRefCount || 0) + 1;
    		            return isNewChangeTree;
    		        }
    		        remove(changeTree) {
    		            const refCount = (this.refCount[changeTree.refId]) - 1;
    		            if (refCount <= 0) {
    		                //
    		                // Only remove "root" reference if it's the last reference
    		                //
    		                changeTree.root = undefined;
    		                delete this.changeTrees[changeTree.refId];
    		                this.removeChangeFromChangeSet("allChanges", changeTree);
    		                this.removeChangeFromChangeSet("changes", changeTree);
    		                if (changeTree.filteredChanges) {
    		                    this.removeChangeFromChangeSet("allFilteredChanges", changeTree);
    		                    this.removeChangeFromChangeSet("filteredChanges", changeTree);
    		                }
    		                this.refCount[changeTree.refId] = 0;
    		            }
    		            else {
    		                this.refCount[changeTree.refId] = refCount;
    		                //
    		                // When losing a reference to an instance, it is best to move the
    		                // ChangeTree to the end of the encoding queue.
    		                //
    		                // This way, at decoding time, the instance that contains the
    		                // ChangeTree will be available before the ChangeTree itself. If the
    		                // containing instance is not available, the Decoder will throw
    		                // "refId not found" error.
    		                //
    		                if (changeTree.filteredChanges !== undefined) {
    		                    this.removeChangeFromChangeSet("filteredChanges", changeTree);
    		                    enqueueChangeTree(this, changeTree, "filteredChanges");
    		                }
    		                else {
    		                    this.removeChangeFromChangeSet("changes", changeTree);
    		                    enqueueChangeTree(this, changeTree, "changes");
    		                }
    		            }
    		            changeTree.forEachChild((child, _) => this.remove(child));
    		            return refCount;
    		        }
    		        removeChangeFromChangeSet(changeSetName, changeTree) {
    		            const changeSet = this[changeSetName];
    		            if (spliceOne(changeSet, changeSet.indexOf(changeTree))) {
    		                changeTree[changeSetName].queueRootIndex = -1;
    		                // changeSet[index] = undefined;
    		                return true;
    		            }
    		        }
    		        clear() {
    		            this.changes.length = 0;
    		        }
    		    }

    		    class Encoder {
    		        static { this.BUFFER_SIZE = (typeof (Buffer) !== "undefined") && Buffer.poolSize || 8 * 1024; } // 8KB
    		        constructor(state) {
    		            this.sharedBuffer = Buffer.allocUnsafe(Encoder.BUFFER_SIZE);
    		            //
    		            // Use .cache() here to avoid re-creating a new context for every new room instance.
    		            //
    		            // We may need to make this optional in case of dynamically created
    		            // schemas - which would lead to memory leaks
    		            //
    		            this.context = TypeContext.cache(state.constructor);
    		            this.root = new Root(this.context);
    		            this.setState(state);
    		            // console.log(">>>>>>>>>>>>>>>> Encoder types");
    		            // this.context.schemas.forEach((id, schema) => {
    		            //     console.log("type:", id, schema.name, Object.keys(schema[Symbol.metadata]));
    		            // });
    		        }
    		        setState(state) {
    		            this.state = state;
    		            this.state[$changes].setRoot(this.root);
    		        }
    		        encode(it = { offset: 0 }, view, buffer = this.sharedBuffer, changeSetName = "changes", isEncodeAll = changeSetName === "allChanges", initialOffset = it.offset // cache current offset in case we need to resize the buffer
    		        ) {
    		            const hasView = (view !== undefined);
    		            const rootChangeTree = this.state[$changes];
    		            const shouldDiscardChanges = !isEncodeAll && !hasView;
    		            const changeTrees = this.root[changeSetName];
    		            for (let i = 0, numChangeTrees = changeTrees.length; i < numChangeTrees; i++) {
    		                const changeTree = changeTrees[i];
    		                if (hasView) {
    		                    if (!view.visible.has(changeTree)) {
    		                        view.invisible.add(changeTree);
    		                        continue; // skip this change tree
    		                    }
    		                    else {
    		                        view.invisible.delete(changeTree); // remove from invisible list
    		                    }
    		                }
    		                const operations = changeTree[changeSetName];
    		                const ref = changeTree.ref;
    		                // TODO: avoid iterating over change tree if no changes were made
    		                const numChanges = operations.operations.length;
    		                if (numChanges === 0) {
    		                    continue;
    		                }
    		                const ctor = ref.constructor;
    		                const encoder = ctor[$encoder];
    		                const filter = ctor[$filter];
    		                const metadata = ctor[Symbol.metadata];
    		                // skip root `refId` if it's the first change tree
    		                // (unless it "hasView", which will need to revisit the root)
    		                if (hasView || it.offset > initialOffset || changeTree !== rootChangeTree) {
    		                    buffer[it.offset++] = SWITCH_TO_STRUCTURE & 255;
    		                    encode.number(buffer, changeTree.refId, it);
    		                }
    		                for (let j = 0; j < numChanges; j++) {
    		                    const fieldIndex = operations.operations[j];
    		                    const operation = (fieldIndex < 0)
    		                        ? Math.abs(fieldIndex) // "pure" operation without fieldIndex (e.g. CLEAR, REVERSE, etc.)
    		                        : (isEncodeAll)
    		                            ? exports.OPERATION.ADD
    		                            : changeTree.indexedOperations[fieldIndex];
    		                    //
    		                    // first pass (encodeAll), identify "filtered" operations without encoding them
    		                    // they will be encoded per client, based on their view.
    		                    //
    		                    // TODO: how can we optimize filtering out "encode all" operations?
    		                    // TODO: avoid checking if no view tags were defined
    		                    //
    		                    if (fieldIndex === undefined || operation === undefined || (filter && !filter(ref, fieldIndex, view))) {
    		                        // console.log("ADD AS INVISIBLE:", fieldIndex, changeTree.ref.constructor.name)
    		                        // view?.invisible.add(changeTree);
    		                        continue;
    		                    }
    		                    encoder(this, buffer, changeTree, fieldIndex, operation, it, isEncodeAll, hasView, metadata);
    		                }
    		                // if (shouldDiscardChanges) {
    		                //     changeTree.discard();
    		                //     changeTree.isNew = false; // Not a new instance anymore
    		                // }
    		            }
    		            if (it.offset > buffer.byteLength) {
    		                // we can assume that n + 1 poolSize will suffice given that we are likely done with encoding at this point
    		                // multiples of poolSize are faster to allocate than arbitrary sizes
    		                // if we are on an older platform that doesn't implement pooling use 8kb as poolSize (that's the default for node)
    		                const newSize = Math.ceil(it.offset / (Buffer.poolSize ?? 8 * 1024)) * (Buffer.poolSize ?? 8 * 1024);
    		                console.warn(`@colyseus/schema buffer overflow. Encoded state is higher than default BUFFER_SIZE. Use the following to increase default BUFFER_SIZE:

    import { Encoder } from "@colyseus/schema";
    Encoder.BUFFER_SIZE = ${Math.round(newSize / 1024)} * 1024; // ${Math.round(newSize / 1024)} KB
`);
    		                //
    		                // resize buffer and re-encode (TODO: can we avoid re-encoding here?)
    		                // -> No we probably can't unless we catch the need for resize before encoding which is likely more computationally expensive than resizing on demand
    		                //
    		                buffer = Buffer.alloc(newSize, buffer); // fill with buffer here to memcpy previous encoding steps beyond the initialOffset
    		                // assign resized buffer to local sharedBuffer
    		                if (buffer === this.sharedBuffer) {
    		                    this.sharedBuffer = buffer;
    		                }
    		                return this.encode({ offset: initialOffset }, view, buffer, changeSetName, isEncodeAll);
    		            }
    		            else {
    		                //
    		                // only clear changes after making sure buffer resize is not required.
    		                //
    		                if (shouldDiscardChanges) {
    		                    //
    		                    // TODO: avoid iterating over change trees twice.
    		                    //
    		                    for (let i = 0, numChangeTrees = changeTrees.length; i < numChangeTrees; i++) {
    		                        const changeTree = changeTrees[i];
    		                        changeTree.discard();
    		                        changeTree.isNew = false; // Not a new instance anymore
    		                    }
    		                }
    		                return buffer.subarray(0, it.offset);
    		            }
    		        }
    		        encodeAll(it = { offset: 0 }, buffer = this.sharedBuffer) {
    		            return this.encode(it, undefined, buffer, "allChanges", true);
    		        }
    		        encodeAllView(view, sharedOffset, it, bytes = this.sharedBuffer) {
    		            const viewOffset = it.offset;
    		            // try to encode "filtered" changes
    		            this.encode(it, view, bytes, "allFilteredChanges", true, viewOffset);
    		            return Buffer.concat([
    		                bytes.subarray(0, sharedOffset),
    		                bytes.subarray(viewOffset, it.offset)
    		            ]);
    		        }
    		        debugChanges(field) {
    		            const rootChangeSet = (typeof (field) === "string")
    		                ? this.root[field]
    		                : field;
    		            rootChangeSet.forEach((changeTree) => {
    		                const changeSet = changeTree[field];
    		                const metadata = changeTree.ref.constructor[Symbol.metadata];
    		                console.log("->", { ref: changeTree.ref.constructor.name, refId: changeTree.refId, changes: Object.keys(changeSet).length });
    		                for (const index in changeSet) {
    		                    const op = changeSet[index];
    		                    console.log("  ->", {
    		                        index,
    		                        field: metadata?.[index],
    		                        op: exports.OPERATION[op],
    		                    });
    		                }
    		            });
    		        }
    		        encodeView(view, sharedOffset, it, bytes = this.sharedBuffer) {
    		            const viewOffset = it.offset;
    		            // encode visibility changes (add/remove for this view)
    		            for (const [refId, changes] of view.changes) {
    		                const changeTree = this.root.changeTrees[refId];
    		                if (changeTree === undefined) {
    		                    // detached instance, remove from view and skip.
    		                    // console.log("detached instance, remove from view and skip.", refId);
    		                    view.changes.delete(refId);
    		                    continue;
    		                }
    		                const keys = Object.keys(changes);
    		                if (keys.length === 0) {
    		                    // FIXME: avoid having empty changes if no changes were made
    		                    // console.log("changes.size === 0, skip", refId, changeTree.ref.constructor.name);
    		                    continue;
    		                }
    		                const ref = changeTree.ref;
    		                const ctor = ref.constructor;
    		                const encoder = ctor[$encoder];
    		                const metadata = ctor[Symbol.metadata];
    		                bytes[it.offset++] = SWITCH_TO_STRUCTURE & 255;
    		                encode.number(bytes, changeTree.refId, it);
    		                for (let i = 0, numChanges = keys.length; i < numChanges; i++) {
    		                    const index = Number(keys[i]);
    		                    // workaround when using view.add() on item that has been deleted from state (see test "adding to view item that has been removed from state")
    		                    const value = changeTree.ref[$getByIndex](index);
    		                    const operation = (value !== undefined && changes[index]) || exports.OPERATION.DELETE;
    		                    // isEncodeAll = false
    		                    // hasView = true
    		                    encoder(this, bytes, changeTree, index, operation, it, false, true, metadata);
    		                }
    		            }
    		            //
    		            // TODO: only clear view changes after all views are encoded
    		            // (to allow re-using StateView's for multiple clients)
    		            //
    		            // clear "view" changes after encoding
    		            view.changes.clear();
    		            // try to encode "filtered" changes
    		            this.encode(it, view, bytes, "filteredChanges", false, viewOffset);
    		            return Buffer.concat([
    		                bytes.subarray(0, sharedOffset),
    		                bytes.subarray(viewOffset, it.offset)
    		            ]);
    		        }
    		        discardChanges() {
    		            // discard shared changes
    		            let length = this.root.changes.length;
    		            if (length > 0) {
    		                while (length--) {
    		                    this.root.changes[length]?.endEncode();
    		                }
    		                this.root.changes.length = 0;
    		            }
    		            // discard filtered changes
    		            length = this.root.filteredChanges.length;
    		            if (length > 0) {
    		                while (length--) {
    		                    this.root.filteredChanges[length]?.endEncode();
    		                }
    		                this.root.filteredChanges.length = 0;
    		            }
    		        }
    		        tryEncodeTypeId(bytes, baseType, targetType, it) {
    		            const baseTypeId = this.context.getTypeId(baseType);
    		            const targetTypeId = this.context.getTypeId(targetType);
    		            if (targetTypeId === undefined) {
    		                console.warn(`@colyseus/schema WARNING: Class "${targetType.name}" is not registered on TypeRegistry - Please either tag the class with @entity or define a @type() field.`);
    		                return;
    		            }
    		            if (baseTypeId !== targetTypeId) {
    		                bytes[it.offset++] = TYPE_ID & 255;
    		                encode.number(bytes, targetTypeId, it);
    		            }
    		        }
    		        get hasChanges() {
    		            return (this.root.changes.length > 0 ||
    		                this.root.filteredChanges.length > 0);
    		        }
    		    }

    		    class DecodingWarning extends Error {
    		        constructor(message) {
    		            super(message);
    		            this.name = "DecodingWarning";
    		        }
    		    }
    		    class ReferenceTracker {
    		        constructor() {
    		            //
    		            // Relation of refId => Schema structure
    		            // For direct access of structures during decoding time.
    		            //
    		            this.refs = new Map();
    		            this.refIds = new WeakMap();
    		            this.refCounts = {};
    		            this.deletedRefs = new Set();
    		            this.callbacks = {};
    		            this.nextUniqueId = 0;
    		        }
    		        getNextUniqueId() {
    		            return this.nextUniqueId++;
    		        }
    		        // for decoding
    		        addRef(refId, ref, incrementCount = true) {
    		            this.refs.set(refId, ref);
    		            this.refIds.set(ref, refId);
    		            if (incrementCount) {
    		                this.refCounts[refId] = (this.refCounts[refId] || 0) + 1;
    		            }
    		            if (this.deletedRefs.has(refId)) {
    		                this.deletedRefs.delete(refId);
    		            }
    		        }
    		        // for decoding
    		        removeRef(refId) {
    		            const refCount = this.refCounts[refId];
    		            if (refCount === undefined) {
    		                try {
    		                    throw new DecodingWarning("trying to remove refId that doesn't exist: " + refId);
    		                }
    		                catch (e) {
    		                    console.warn(e);
    		                }
    		                return;
    		            }
    		            if (refCount === 0) {
    		                try {
    		                    const ref = this.refs.get(refId);
    		                    throw new DecodingWarning(`trying to remove refId '${refId}' with 0 refCount (${ref.constructor.name}: ${JSON.stringify(ref)})`);
    		                }
    		                catch (e) {
    		                    console.warn(e);
    		                }
    		                return;
    		            }
    		            if ((this.refCounts[refId] = refCount - 1) <= 0) {
    		                this.deletedRefs.add(refId);
    		            }
    		        }
    		        clearRefs() {
    		            this.refs.clear();
    		            this.deletedRefs.clear();
    		            this.callbacks = {};
    		            this.refCounts = {};
    		        }
    		        // for decoding
    		        garbageCollectDeletedRefs() {
    		            this.deletedRefs.forEach((refId) => {
    		                //
    		                // Skip active references.
    		                //
    		                if (this.refCounts[refId] > 0) {
    		                    return;
    		                }
    		                const ref = this.refs.get(refId);
    		                //
    		                // Ensure child schema instances have their references removed as well.
    		                //
    		                if (ref.constructor[Symbol.metadata] !== undefined) {
    		                    const metadata = ref.constructor[Symbol.metadata];
    		                    for (const index in metadata) {
    		                        const field = metadata[index].name;
    		                        const childRefId = typeof (ref[field]) === "object" && this.refIds.get(ref[field]);
    		                        if (childRefId && !this.deletedRefs.has(childRefId)) {
    		                            this.removeRef(childRefId);
    		                        }
    		                    }
    		                }
    		                else {
    		                    if (typeof (ref[$childType]) === "function") {
    		                        Array.from(ref.values())
    		                            .forEach((child) => {
    		                            const childRefId = this.refIds.get(child);
    		                            if (!this.deletedRefs.has(childRefId)) {
    		                                this.removeRef(childRefId);
    		                            }
    		                        });
    		                    }
    		                }
    		                this.refs.delete(refId); // remove ref
    		                delete this.refCounts[refId]; // remove ref count
    		                delete this.callbacks[refId]; // remove callbacks
    		            });
    		            // clear deleted refs.
    		            this.deletedRefs.clear();
    		        }
    		        addCallback(refId, fieldOrOperation, callback) {
    		            if (refId === undefined) {
    		                const name = (typeof (fieldOrOperation) === "number")
    		                    ? exports.OPERATION[fieldOrOperation]
    		                    : fieldOrOperation;
    		                throw new Error(`Can't addCallback on '${name}' (refId is undefined)`);
    		            }
    		            if (!this.callbacks[refId]) {
    		                this.callbacks[refId] = {};
    		            }
    		            if (!this.callbacks[refId][fieldOrOperation]) {
    		                this.callbacks[refId][fieldOrOperation] = [];
    		            }
    		            this.callbacks[refId][fieldOrOperation].push(callback);
    		            return () => this.removeCallback(refId, fieldOrOperation, callback);
    		        }
    		        removeCallback(refId, field, callback) {
    		            const index = this.callbacks?.[refId]?.[field]?.indexOf(callback);
    		            if (index !== -1) {
    		                spliceOne(this.callbacks[refId][field], index);
    		            }
    		        }
    		    }

    		    class Decoder {
    		        constructor(root, context) {
    		            this.currentRefId = 0;
    		            this.setState(root);
    		            this.context = context || new TypeContext(root.constructor);
    		            // console.log(">>>>>>>>>>>>>>>> Decoder types");
    		            // this.context.schemas.forEach((id, schema) => {
    		            //     console.log("type:", id, schema.name, Object.keys(schema[Symbol.metadata]));
    		            // });
    		        }
    		        setState(root) {
    		            this.state = root;
    		            this.root = new ReferenceTracker();
    		            this.root.addRef(0, root);
    		        }
    		        decode(bytes, it = { offset: 0 }, ref = this.state) {
    		            const allChanges = [];
    		            const $root = this.root;
    		            const totalBytes = bytes.byteLength;
    		            let decoder = ref['constructor'][$decoder];
    		            this.currentRefId = 0;
    		            while (it.offset < totalBytes) {
    		                //
    		                // Peek ahead, check if it's a switch to a different structure
    		                //
    		                if (bytes[it.offset] == SWITCH_TO_STRUCTURE) {
    		                    it.offset++;
    		                    this.currentRefId = decode.number(bytes, it);
    		                    const nextRef = $root.refs.get(this.currentRefId);
    		                    //
    		                    // Trying to access a reference that haven't been decoded yet.
    		                    //
    		                    if (!nextRef) {
    		                        throw new Error(`"refId" not found: ${this.currentRefId}`);
    		                    }
    		                    ref[$onDecodeEnd]?.();
    		                    ref = nextRef;
    		                    decoder = ref.constructor[$decoder];
    		                    continue;
    		                }
    		                const result = decoder(this, bytes, it, ref, allChanges);
    		                if (result === DEFINITION_MISMATCH) {
    		                    console.warn("@colyseus/schema: definition mismatch");
    		                    //
    		                    // keep skipping next bytes until reaches a known structure
    		                    // by local decoder.
    		                    //
    		                    const nextIterator = { offset: it.offset };
    		                    while (it.offset < totalBytes) {
    		                        if (bytes[it.offset] === SWITCH_TO_STRUCTURE) {
    		                            nextIterator.offset = it.offset + 1;
    		                            if ($root.refs.has(decode.number(bytes, nextIterator))) {
    		                                break;
    		                            }
    		                        }
    		                        it.offset++;
    		                    }
    		                    continue;
    		                }
    		            }
    		            // FIXME: DRY with SWITCH_TO_STRUCTURE block.
    		            ref[$onDecodeEnd]?.();
    		            // trigger changes
    		            this.triggerChanges?.(allChanges);
    		            // drop references of unused schemas
    		            $root.garbageCollectDeletedRefs();
    		            return allChanges;
    		        }
    		        getInstanceType(bytes, it, defaultType) {
    		            let type;
    		            if (bytes[it.offset] === TYPE_ID) {
    		                it.offset++;
    		                const type_id = decode.number(bytes, it);
    		                type = this.context.get(type_id);
    		            }
    		            return type || defaultType;
    		        }
    		        createInstanceOfType(type) {
    		            // let instance: Schema = new (type as any)();
    		            // // assign root on $changes
    		            // instance[$changes].root = this.root[$changes].root;
    		            // return instance;
    		            return new type();
    		        }
    		        removeChildRefs(ref, allChanges) {
    		            const needRemoveRef = typeof (ref[$childType]) !== "string";
    		            const refId = this.root.refIds.get(ref);
    		            ref.forEach((value, key) => {
    		                allChanges.push({
    		                    ref: ref,
    		                    refId,
    		                    op: exports.OPERATION.DELETE,
    		                    field: key,
    		                    value: undefined,
    		                    previousValue: value
    		                });
    		                if (needRemoveRef) {
    		                    this.root.removeRef(this.root.refIds.get(value));
    		                }
    		            });
    		        }
    		    }

    		    /**
    		     * Reflection
    		     */
    		    class ReflectionField extends Schema {
    		    }
    		    __decorate([
    		        type("string")
    		    ], ReflectionField.prototype, "name", void 0);
    		    __decorate([
    		        type("string")
    		    ], ReflectionField.prototype, "type", void 0);
    		    __decorate([
    		        type("number")
    		    ], ReflectionField.prototype, "referencedType", void 0);
    		    class ReflectionType extends Schema {
    		        constructor() {
    		            super(...arguments);
    		            this.fields = new ArraySchema();
    		        }
    		    }
    		    __decorate([
    		        type("number")
    		    ], ReflectionType.prototype, "id", void 0);
    		    __decorate([
    		        type("number")
    		    ], ReflectionType.prototype, "extendsId", void 0);
    		    __decorate([
    		        type([ReflectionField])
    		    ], ReflectionType.prototype, "fields", void 0);
    		    class Reflection extends Schema {
    		        constructor() {
    		            super(...arguments);
    		            this.types = new ArraySchema();
    		        }
    		        /**
    		         * Encodes the TypeContext of an Encoder into a buffer.
    		         *
    		         * @param encoder Encoder instance
    		         * @param it
    		         * @returns
    		         */
    		        static encode(encoder, it = { offset: 0 }) {
    		            const context = encoder.context;
    		            const reflection = new Reflection();
    		            const reflectionEncoder = new Encoder(reflection);
    		            // rootType is usually the first schema passed to the Encoder
    		            // (unless it inherits from another schema)
    		            const rootType = context.schemas.get(encoder.state.constructor);
    		            if (rootType > 0) {
    		                reflection.rootType = rootType;
    		            }
    		            const includedTypeIds = new Set();
    		            const pendingReflectionTypes = {};
    		            // add type to reflection in a way that respects inheritance
    		            // (parent types should be added before their children)
    		            const addType = (type) => {
    		                if (type.extendsId === undefined || includedTypeIds.has(type.extendsId)) {
    		                    includedTypeIds.add(type.id);
    		                    reflection.types.push(type);
    		                    const deps = pendingReflectionTypes[type.id];
    		                    if (deps !== undefined) {
    		                        delete pendingReflectionTypes[type.id];
    		                        deps.forEach((childType) => addType(childType));
    		                    }
    		                }
    		                else {
    		                    if (pendingReflectionTypes[type.extendsId] === undefined) {
    		                        pendingReflectionTypes[type.extendsId] = [];
    		                    }
    		                    pendingReflectionTypes[type.extendsId].push(type);
    		                }
    		            };
    		            context.schemas.forEach((typeid, klass) => {
    		                const type = new ReflectionType();
    		                type.id = Number(typeid);
    		                // support inheritance
    		                const inheritFrom = Object.getPrototypeOf(klass);
    		                if (inheritFrom !== Schema) {
    		                    type.extendsId = context.schemas.get(inheritFrom);
    		                }
    		                const metadata = klass[Symbol.metadata];
    		                //
    		                // FIXME: this is a workaround for inherited types without additional fields
    		                // if metadata is the same reference as the parent class - it means the class has no own metadata
    		                //
    		                if (metadata !== inheritFrom[Symbol.metadata]) {
    		                    for (const fieldIndex in metadata) {
    		                        const index = Number(fieldIndex);
    		                        const fieldName = metadata[index].name;
    		                        // skip fields from parent classes
    		                        if (!Object.prototype.hasOwnProperty.call(metadata, fieldName)) {
    		                            continue;
    		                        }
    		                        const reflectionField = new ReflectionField();
    		                        reflectionField.name = fieldName;
    		                        let fieldType;
    		                        const field = metadata[index];
    		                        if (typeof (field.type) === "string") {
    		                            fieldType = field.type;
    		                        }
    		                        else {
    		                            let childTypeSchema;
    		                            //
    		                            // TODO: refactor below.
    		                            //
    		                            if (Schema.is(field.type)) {
    		                                fieldType = "ref";
    		                                childTypeSchema = field.type;
    		                            }
    		                            else {
    		                                fieldType = Object.keys(field.type)[0];
    		                                if (typeof (field.type[fieldType]) === "string") {
    		                                    fieldType += ":" + field.type[fieldType]; // array:string
    		                                }
    		                                else {
    		                                    childTypeSchema = field.type[fieldType];
    		                                }
    		                            }
    		                            reflectionField.referencedType = (childTypeSchema)
    		                                ? context.getTypeId(childTypeSchema)
    		                                : -1;
    		                        }
    		                        reflectionField.type = fieldType;
    		                        type.fields.push(reflectionField);
    		                    }
    		                }
    		                addType(type);
    		            });
    		            // in case there are types that were not added due to inheritance
    		            for (const typeid in pendingReflectionTypes) {
    		                pendingReflectionTypes[typeid].forEach((type) => reflection.types.push(type));
    		            }
    		            const buf = reflectionEncoder.encodeAll(it);
    		            return Buffer.from(buf, 0, it.offset);
    		        }
    		        /**
    		         * Decodes the TypeContext from a buffer into a Decoder instance.
    		         *
    		         * @param bytes Reflection.encode() output
    		         * @param it
    		         * @returns Decoder instance
    		         */
    		        static decode(bytes, it) {
    		            const reflection = new Reflection();
    		            const reflectionDecoder = new Decoder(reflection);
    		            reflectionDecoder.decode(bytes, it);
    		            const typeContext = new TypeContext();
    		            // 1st pass, initialize metadata + inheritance
    		            reflection.types.forEach((reflectionType) => {
    		                const parentClass = typeContext.get(reflectionType.extendsId) ?? Schema;
    		                const schema = class _ extends parentClass {
    		                };
    		                // register for inheritance support
    		                TypeContext.register(schema);
    		                // // for inheritance support
    		                // Metadata.initialize(schema);
    		                typeContext.add(schema, reflectionType.id);
    		            }, {});
    		            // define fields
    		            const addFields = (metadata, reflectionType, parentFieldIndex) => {
    		                reflectionType.fields.forEach((field, i) => {
    		                    const fieldIndex = parentFieldIndex + i;
    		                    if (field.referencedType !== undefined) {
    		                        let fieldType = field.type;
    		                        let refType = typeContext.get(field.referencedType);
    		                        // map or array of primitive type (-1)
    		                        if (!refType) {
    		                            const typeInfo = field.type.split(":");
    		                            fieldType = typeInfo[0];
    		                            refType = typeInfo[1]; // string
    		                        }
    		                        if (fieldType === "ref") {
    		                            Metadata.addField(metadata, fieldIndex, field.name, refType);
    		                        }
    		                        else {
    		                            Metadata.addField(metadata, fieldIndex, field.name, { [fieldType]: refType });
    		                        }
    		                    }
    		                    else {
    		                        Metadata.addField(metadata, fieldIndex, field.name, field.type);
    		                    }
    		                });
    		            };
    		            // 2nd pass, set fields
    		            reflection.types.forEach((reflectionType) => {
    		                const schema = typeContext.get(reflectionType.id);
    		                // for inheritance support
    		                const metadata = Metadata.initialize(schema);
    		                const inheritedTypes = [];
    		                let parentType = reflectionType;
    		                do {
    		                    inheritedTypes.push(parentType);
    		                    parentType = reflection.types.find((t) => t.id === parentType.extendsId);
    		                } while (parentType);
    		                let parentFieldIndex = 0;
    		                inheritedTypes.reverse().forEach((reflectionType) => {
    		                    // add fields from all inherited classes
    		                    // TODO: refactor this to avoid adding fields from parent classes
    		                    addFields(metadata, reflectionType, parentFieldIndex);
    		                    parentFieldIndex += reflectionType.fields.length;
    		                });
    		            });
    		            const state = new (typeContext.get(reflection.rootType || 0))();
    		            return new Decoder(state, typeContext);
    		        }
    		    }
    		    __decorate([
    		        type([ReflectionType])
    		    ], Reflection.prototype, "types", void 0);
    		    __decorate([
    		        type("number")
    		    ], Reflection.prototype, "rootType", void 0);

    		    function getDecoderStateCallbacks(decoder) {
    		        const $root = decoder.root;
    		        const callbacks = $root.callbacks;
    		        const onAddCalls = new WeakMap();
    		        let currentOnAddCallback;
    		        decoder.triggerChanges = function (allChanges) {
    		            const uniqueRefIds = new Set();
    		            for (let i = 0, l = allChanges.length; i < l; i++) {
    		                const change = allChanges[i];
    		                const refId = change.refId;
    		                const ref = change.ref;
    		                const $callbacks = callbacks[refId];
    		                if (!$callbacks) {
    		                    continue;
    		                }
    		                //
    		                // trigger onRemove on child structure.
    		                //
    		                if ((change.op & exports.OPERATION.DELETE) === exports.OPERATION.DELETE &&
    		                    change.previousValue instanceof Schema) {
    		                    const deleteCallbacks = callbacks[$root.refIds.get(change.previousValue)]?.[exports.OPERATION.DELETE];
    		                    for (let i = deleteCallbacks?.length - 1; i >= 0; i--) {
    		                        deleteCallbacks[i]();
    		                    }
    		                }
    		                if (ref instanceof Schema) {
    		                    //
    		                    // Handle schema instance
    		                    //
    		                    if (!uniqueRefIds.has(refId)) {
    		                        // trigger onChange
    		                        const replaceCallbacks = $callbacks?.[exports.OPERATION.REPLACE];
    		                        for (let i = replaceCallbacks?.length - 1; i >= 0; i--) {
    		                            replaceCallbacks[i]();
    		                            // try {
    		                            // } catch (e) {
    		                            //     console.error(e);
    		                            // }
    		                        }
    		                    }
    		                    if ($callbacks.hasOwnProperty(change.field)) {
    		                        const fieldCallbacks = $callbacks[change.field];
    		                        for (let i = fieldCallbacks?.length - 1; i >= 0; i--) {
    		                            fieldCallbacks[i](change.value, change.previousValue);
    		                            // try {
    		                            // } catch (e) {
    		                            //     console.error(e);
    		                            // }
    		                        }
    		                    }
    		                }
    		                else {
    		                    //
    		                    // Handle collection of items
    		                    //
    		                    if ((change.op & exports.OPERATION.DELETE) === exports.OPERATION.DELETE) {
    		                        //
    		                        // FIXME: `previousValue` should always be available.
    		                        //
    		                        if (change.previousValue !== undefined) {
    		                            // triger onRemove
    		                            const deleteCallbacks = $callbacks[exports.OPERATION.DELETE];
    		                            for (let i = deleteCallbacks?.length - 1; i >= 0; i--) {
    		                                deleteCallbacks[i](change.previousValue, change.dynamicIndex ?? change.field);
    		                            }
    		                        }
    		                        // Handle DELETE_AND_ADD operations
    		                        if ((change.op & exports.OPERATION.ADD) === exports.OPERATION.ADD) {
    		                            const addCallbacks = $callbacks[exports.OPERATION.ADD];
    		                            for (let i = addCallbacks?.length - 1; i >= 0; i--) {
    		                                addCallbacks[i](change.value, change.dynamicIndex ?? change.field);
    		                            }
    		                        }
    		                    }
    		                    else if ((change.op & exports.OPERATION.ADD) === exports.OPERATION.ADD && change.previousValue === undefined) {
    		                        // triger onAdd
    		                        const addCallbacks = $callbacks[exports.OPERATION.ADD];
    		                        for (let i = addCallbacks?.length - 1; i >= 0; i--) {
    		                            addCallbacks[i](change.value, change.dynamicIndex ?? change.field);
    		                        }
    		                    }
    		                    // trigger onChange
    		                    if (change.value !== change.previousValue &&
    		                        // FIXME: see "should not encode item if added and removed at the same patch" test case.
    		                        // some "ADD" + "DELETE" operations on same patch are being encoded as "DELETE"
    		                        (change.value !== undefined || change.previousValue !== undefined)) {
    		                        const replaceCallbacks = $callbacks[exports.OPERATION.REPLACE];
    		                        for (let i = replaceCallbacks?.length - 1; i >= 0; i--) {
    		                            replaceCallbacks[i](change.value, change.dynamicIndex ?? change.field);
    		                        }
    		                    }
    		                }
    		                uniqueRefIds.add(refId);
    		            }
    		        };
    		        function getProxy(metadataOrType, context) {
    		            let metadata = context.instance?.constructor[Symbol.metadata] || metadataOrType;
    		            let isCollection = ((context.instance && typeof (context.instance['forEach']) === "function") ||
    		                (metadataOrType && typeof (metadataOrType[Symbol.metadata]) === "undefined"));
    		            if (metadata && !isCollection) {
    		                const onAddListen = function (ref, prop, callback, immediate) {
    		                    // immediate trigger
    		                    if (immediate &&
    		                        context.instance[prop] !== undefined &&
    		                        !onAddCalls.has(currentOnAddCallback) // Workaround for https://github.com/colyseus/schema/issues/147
    		                    ) {
    		                        callback(context.instance[prop], undefined);
    		                    }
    		                    return $root.addCallback($root.refIds.get(ref), prop, callback);
    		                };
    		                /**
    		                 * Schema instances
    		                 */
    		                return new Proxy({
    		                    listen: function listen(prop, callback, immediate = true) {
    		                        if (context.instance) {
    		                            return onAddListen(context.instance, prop, callback, immediate);
    		                        }
    		                        else {
    		                            // collection instance not received yet
    		                            let detachCallback = () => { };
    		                            context.onInstanceAvailable((ref, existing) => {
    		                                detachCallback = onAddListen(ref, prop, callback, immediate && existing && !onAddCalls.has(currentOnAddCallback));
    		                            });
    		                            return () => detachCallback();
    		                        }
    		                    },
    		                    onChange: function onChange(callback) {
    		                        return $root.addCallback($root.refIds.get(context.instance), exports.OPERATION.REPLACE, callback);
    		                    },
    		                    //
    		                    // TODO: refactor `bindTo()` implementation.
    		                    // There is room for improvement.
    		                    //
    		                    bindTo: function bindTo(targetObject, properties) {
    		                        if (!properties) {
    		                            properties = Object.keys(metadata).map((index) => metadata[index].name);
    		                        }
    		                        return $root.addCallback($root.refIds.get(context.instance), exports.OPERATION.REPLACE, () => {
    		                            properties.forEach((prop) => targetObject[prop] = context.instance[prop]);
    		                        });
    		                    }
    		                }, {
    		                    get(target, prop) {
    		                        const metadataField = metadata[metadata[prop]];
    		                        if (metadataField) {
    		                            const instance = context.instance?.[prop];
    		                            const onInstanceAvailable = ((callback) => {
    		                                const unbind = $(context.instance).listen(prop, (value, _) => {
    		                                    callback(value, false);
    		                                    // FIXME: by "unbinding" the callback here,
    		                                    // it will not support when the server
    		                                    // re-instantiates the instance.
    		                                    //
    		                                    unbind?.();
    		                                }, false);
    		                                // has existing value
    		                                if ($root.refIds.get(instance) !== undefined) {
    		                                    callback(instance, true);
    		                                }
    		                            });
    		                            return getProxy(metadataField.type, {
    		                                // make sure refId is available, otherwise need to wait for the instance to be available.
    		                                instance: ($root.refIds.get(instance) && instance),
    		                                parentInstance: context.instance,
    		                                onInstanceAvailable,
    		                            });
    		                        }
    		                        else {
    		                            // accessing the function
    		                            return target[prop];
    		                        }
    		                    },
    		                    has(target, prop) { return metadata[prop] !== undefined; },
    		                    set(_, _1, _2) { throw new Error("not allowed"); },
    		                    deleteProperty(_, _1) { throw new Error("not allowed"); },
    		                });
    		            }
    		            else {
    		                /**
    		                 * Collection instances
    		                 */
    		                const onAdd = function (ref, callback, immediate) {
    		                    // Trigger callback on existing items
    		                    if (immediate) {
    		                        ref.forEach((v, k) => callback(v, k));
    		                    }
    		                    return $root.addCallback($root.refIds.get(ref), exports.OPERATION.ADD, (value, key) => {
    		                        onAddCalls.set(callback, true);
    		                        currentOnAddCallback = callback;
    		                        callback(value, key);
    		                        onAddCalls.delete(callback);
    		                        currentOnAddCallback = undefined;
    		                    });
    		                };
    		                const onRemove = function (ref, callback) {
    		                    return $root.addCallback($root.refIds.get(ref), exports.OPERATION.DELETE, callback);
    		                };
    		                const onChange = function (ref, callback) {
    		                    return $root.addCallback($root.refIds.get(ref), exports.OPERATION.REPLACE, callback);
    		                };
    		                return new Proxy({
    		                    onAdd: function (callback, immediate = true) {
    		                        //
    		                        // https://github.com/colyseus/schema/issues/147
    		                        // If parent instance has "onAdd" registered, avoid triggering immediate callback.
    		                        //
    		                        if (context.instance) {
    		                            return onAdd(context.instance, callback, immediate && !onAddCalls.has(currentOnAddCallback));
    		                        }
    		                        else if (context.onInstanceAvailable) {
    		                            // collection instance not received yet
    		                            let detachCallback = () => { };
    		                            context.onInstanceAvailable((ref, existing) => {
    		                                detachCallback = onAdd(ref, callback, immediate && existing && !onAddCalls.has(currentOnAddCallback));
    		                            });
    		                            return () => detachCallback();
    		                        }
    		                    },
    		                    onRemove: function (callback) {
    		                        if (context.instance) {
    		                            return onRemove(context.instance, callback);
    		                        }
    		                        else if (context.onInstanceAvailable) {
    		                            // collection instance not received yet
    		                            let detachCallback = () => { };
    		                            context.onInstanceAvailable((ref) => {
    		                                detachCallback = onRemove(ref, callback);
    		                            });
    		                            return () => detachCallback();
    		                        }
    		                    },
    		                    onChange: function (callback) {
    		                        if (context.instance) {
    		                            return onChange(context.instance, callback);
    		                        }
    		                        else if (context.onInstanceAvailable) {
    		                            // collection instance not received yet
    		                            let detachCallback = () => { };
    		                            context.onInstanceAvailable((ref) => {
    		                                detachCallback = onChange(ref, callback);
    		                            });
    		                            return () => detachCallback();
    		                        }
    		                    },
    		                }, {
    		                    get(target, prop) {
    		                        if (!target[prop]) {
    		                            throw new Error(`Can't access '${prop}' through callback proxy. access the instance directly.`);
    		                        }
    		                        return target[prop];
    		                    },
    		                    has(target, prop) { return target[prop] !== undefined; },
    		                    set(_, _1, _2) { throw new Error("not allowed"); },
    		                    deleteProperty(_, _1) { throw new Error("not allowed"); },
    		                });
    		            }
    		        }
    		        function $(instance) {
    		            return getProxy(undefined, { instance });
    		        }
    		        return $;
    		    }

    		    function getRawChangesCallback(decoder, callback) {
    		        decoder.triggerChanges = callback;
    		    }

    		    class StateView {
    		        constructor(iterable = false) {
    		            this.iterable = iterable;
    		            /**
    		             * List of ChangeTree's that are visible to this view
    		             */
    		            this.visible = new WeakSet();
    		            /**
    		             * List of ChangeTree's that are invisible to this view
    		             */
    		            this.invisible = new WeakSet();
    		            /**
    		             * Manual "ADD" operations for changes per ChangeTree, specific to this view.
    		             * (This is used to force encoding a property, even if it was not changed)
    		             */
    		            this.changes = new Map();
    		            if (iterable) {
    		                this.items = [];
    		            }
    		        }
    		        // TODO: allow to set multiple tags at once
    		        add(obj, tag = DEFAULT_VIEW_TAG, checkIncludeParent = true) {
    		            const changeTree = obj?.[$changes];
    		            if (!changeTree) {
    		                console.warn("StateView#add(), invalid object:", obj);
    		                return this;
    		            }
    		            else if (!changeTree.parent &&
    		                changeTree.refId !== 0 // allow root object
    		            ) {
    		                /**
    		                 * TODO: can we avoid this?
    		                 *
    		                 * When the "parent" structure has the @view() tag, it is currently
    		                 * not possible to identify it has to be added to the view as well
    		                 * (this.addParentOf() is not called).
    		                 */
    		                throw new Error(`Cannot add a detached instance to the StateView. Make sure to assign the "${changeTree.ref.constructor.name}" instance to the state before calling view.add()`);
    		            }
    		            // FIXME: ArraySchema/MapSchema do not have metadata
    		            const metadata = obj.constructor[Symbol.metadata];
    		            this.visible.add(changeTree);
    		            // add to iterable list (only the explicitly added items)
    		            if (this.iterable && checkIncludeParent) {
    		                this.items.push(obj);
    		            }
    		            // add parent ChangeTree's
    		            // - if it was invisible to this view
    		            // - if it were previously filtered out
    		            if (checkIncludeParent && changeTree.parent) {
    		                this.addParentOf(changeTree, tag);
    		            }
    		            //
    		            // TODO: when adding an item of a MapSchema, the changes may not
    		            // be set (only the parent's changes are set)
    		            //
    		            let changes = this.changes.get(changeTree.refId);
    		            if (changes === undefined) {
    		                changes = {};
    		                this.changes.set(changeTree.refId, changes);
    		            }
    		            // set tag
    		            if (tag !== DEFAULT_VIEW_TAG) {
    		                if (!this.tags) {
    		                    this.tags = new WeakMap();
    		                }
    		                let tags;
    		                if (!this.tags.has(changeTree)) {
    		                    tags = new Set();
    		                    this.tags.set(changeTree, tags);
    		                }
    		                else {
    		                    tags = this.tags.get(changeTree);
    		                }
    		                tags.add(tag);
    		                // Ref: add tagged properties
    		                metadata?.[$fieldIndexesByViewTag]?.[tag]?.forEach((index) => {
    		                    if (changeTree.getChange(index) !== exports.OPERATION.DELETE) {
    		                        changes[index] = exports.OPERATION.ADD;
    		                    }
    		                });
    		            }
    		            else {
    		                const isInvisible = this.invisible.has(changeTree);
    		                const changeSet = (changeTree.filteredChanges !== undefined)
    		                    ? changeTree.allFilteredChanges
    		                    : changeTree.allChanges;
    		                for (let i = 0, len = changeSet.operations.length; i < len; i++) {
    		                    const index = changeSet.operations[i];
    		                    if (index === undefined) {
    		                        continue;
    		                    } // skip "undefined" indexes
    		                    const op = changeTree.indexedOperations[index] ?? exports.OPERATION.ADD;
    		                    const tagAtIndex = metadata?.[index].tag;
    		                    if (!changeTree.isNew && // new structures will be added as part of .encode() call, no need to force it to .encodeView()
    		                        (isInvisible || // if "invisible", include all
    		                            tagAtIndex === undefined || // "all change" with no tag
    		                            tagAtIndex === tag // tagged property
    		                        ) &&
    		                        op !== exports.OPERATION.DELETE) {
    		                        changes[index] = op;
    		                    }
    		                }
    		            }
    		            // Add children of this ChangeTree to this view
    		            changeTree.forEachChild((change, index) => {
    		                // Do not ADD children that don't have the same tag
    		                if (metadata &&
    		                    metadata[index].tag !== undefined &&
    		                    metadata[index].tag !== tag) {
    		                    return;
    		                }
    		                this.add(change.ref, tag, false);
    		            });
    		            return this;
    		        }
    		        addParentOf(childChangeTree, tag) {
    		            const changeTree = childChangeTree.parent[$changes];
    		            const parentIndex = childChangeTree.parentIndex;
    		            if (!this.visible.has(changeTree)) {
    		                // view must have all "changeTree" parent tree
    		                this.visible.add(changeTree);
    		                // add parent's parent
    		                const parentChangeTree = changeTree.parent?.[$changes];
    		                if (parentChangeTree && (parentChangeTree.filteredChanges !== undefined)) {
    		                    this.addParentOf(changeTree, tag);
    		                }
    		                // // parent is already available, no need to add it!
    		                // if (!this.invisible.has(changeTree)) { return; }
    		            }
    		            // add parent's tag properties
    		            if (changeTree.getChange(parentIndex) !== exports.OPERATION.DELETE) {
    		                let changes = this.changes.get(changeTree.refId);
    		                if (changes === undefined) {
    		                    changes = {};
    		                    this.changes.set(changeTree.refId, changes);
    		                }
    		                if (!this.tags) {
    		                    this.tags = new WeakMap();
    		                }
    		                let tags;
    		                if (!this.tags.has(changeTree)) {
    		                    tags = new Set();
    		                    this.tags.set(changeTree, tags);
    		                }
    		                else {
    		                    tags = this.tags.get(changeTree);
    		                }
    		                tags.add(tag);
    		                changes[parentIndex] = exports.OPERATION.ADD;
    		            }
    		        }
    		        remove(obj, tag = DEFAULT_VIEW_TAG, _isClear = false) {
    		            const changeTree = obj[$changes];
    		            if (!changeTree) {
    		                console.warn("StateView#remove(), invalid object:", obj);
    		                return this;
    		            }
    		            this.visible.delete(changeTree);
    		            // remove from iterable list
    		            if (this.iterable &&
    		                !_isClear // no need to remove during clear(), as it will be cleared entirely
    		            ) {
    		                spliceOne(this.items, this.items.indexOf(obj));
    		            }
    		            const ref = changeTree.ref;
    		            const metadata = ref.constructor[Symbol.metadata]; // ArraySchema/MapSchema do not have metadata
    		            let changes = this.changes.get(changeTree.refId);
    		            if (changes === undefined) {
    		                changes = {};
    		                this.changes.set(changeTree.refId, changes);
    		            }
    		            if (tag === DEFAULT_VIEW_TAG) {
    		                // parent is collection (Map/Array)
    		                const parent = changeTree.parent;
    		                if (!Metadata.isValidInstance(parent)) {
    		                    const parentChangeTree = parent[$changes];
    		                    let changes = this.changes.get(parentChangeTree.refId);
    		                    if (changes === undefined) {
    		                        changes = {};
    		                        this.changes.set(parentChangeTree.refId, changes);
    		                    }
    		                    // DELETE / DELETE BY REF ID
    		                    changes[changeTree.parentIndex] = exports.OPERATION.DELETE;
    		                }
    		                else {
    		                    // delete all "tagged" properties.
    		                    metadata?.[$viewFieldIndexes].forEach((index) => changes[index] = exports.OPERATION.DELETE);
    		                }
    		            }
    		            else {
    		                // delete only tagged properties
    		                metadata?.[$fieldIndexesByViewTag][tag].forEach((index) => changes[index] = exports.OPERATION.DELETE);
    		            }
    		            // remove tag
    		            if (this.tags && this.tags.has(changeTree)) {
    		                const tags = this.tags.get(changeTree);
    		                if (tag === undefined) {
    		                    // delete all tags
    		                    this.tags.delete(changeTree);
    		                }
    		                else {
    		                    // delete specific tag
    		                    tags.delete(tag);
    		                    // if tag set is empty, delete it entirely
    		                    if (tags.size === 0) {
    		                        this.tags.delete(changeTree);
    		                    }
    		                }
    		            }
    		            return this;
    		        }
    		        has(obj) {
    		            return this.visible.has(obj[$changes]);
    		        }
    		        hasTag(ob, tag = DEFAULT_VIEW_TAG) {
    		            const tags = this.tags?.get(ob[$changes]);
    		            return tags?.has(tag) ?? false;
    		        }
    		        clear() {
    		            if (!this.iterable) {
    		                throw new Error("StateView#clear() is only available for iterable StateView's. Use StateView(iterable: true) constructor.");
    		            }
    		            for (let i = 0, l = this.items.length; i < l; i++) {
    		                this.remove(this.items[i], DEFAULT_VIEW_TAG, true);
    		            }
    		            // clear items array
    		            this.items.length = 0;
    		        }
    		    }

    		    registerType("map", { constructor: MapSchema });
    		    registerType("array", { constructor: ArraySchema });
    		    registerType("set", { constructor: SetSchema });
    		    registerType("collection", { constructor: CollectionSchema, });

    		    exports.$changes = $changes;
    		    exports.$childType = $childType;
    		    exports.$decoder = $decoder;
    		    exports.$deleteByIndex = $deleteByIndex;
    		    exports.$encoder = $encoder;
    		    exports.$filter = $filter;
    		    exports.$getByIndex = $getByIndex;
    		    exports.$track = $track;
    		    exports.ArraySchema = ArraySchema;
    		    exports.ChangeTree = ChangeTree;
    		    exports.CollectionSchema = CollectionSchema;
    		    exports.Decoder = Decoder;
    		    exports.Encoder = Encoder;
    		    exports.MapSchema = MapSchema;
    		    exports.Metadata = Metadata;
    		    exports.Reflection = Reflection;
    		    exports.ReflectionField = ReflectionField;
    		    exports.ReflectionType = ReflectionType;
    		    exports.Schema = Schema;
    		    exports.SetSchema = SetSchema;
    		    exports.StateView = StateView;
    		    exports.TypeContext = TypeContext;
    		    exports.decode = decode;
    		    exports.decodeKeyValueOperation = decodeKeyValueOperation;
    		    exports.decodeSchemaOperation = decodeSchemaOperation;
    		    exports.defineCustomTypes = defineCustomTypes;
    		    exports.defineTypes = defineTypes;
    		    exports.deprecated = deprecated;
    		    exports.dumpChanges = dumpChanges;
    		    exports.encode = encode;
    		    exports.encodeArray = encodeArray;
    		    exports.encodeKeyValueOperation = encodeKeyValueOperation;
    		    exports.encodeSchemaOperation = encodeSchemaOperation;
    		    exports.entity = entity;
    		    exports.getDecoderStateCallbacks = getDecoderStateCallbacks;
    		    exports.getRawChangesCallback = getRawChangesCallback;
    		    exports.registerType = registerType;
    		    exports.schema = schema;
    		    exports.type = type;
    		    exports.view = view;

    		})); 
    	} (umd$1, umd$1.exports));
    	return umd$1.exports;
    }

    var umdExports = requireUmd();

    class H3TransportTransport {
        constructor(events) {
            this.events = events;
            this.isOpen = false;
            this.lengthPrefixBuffer = new Uint8Array(9); // 9 bytes is the maximum length of a length prefix
        }
        connect(url, options = {}) {
            const wtOpts = options.fingerprint && ({
                // requireUnreliable: true,
                // congestionControl: "default", // "low-latency" || "throughput"
                serverCertificateHashes: [{
                        algorithm: 'sha-256',
                        value: new Uint8Array(options.fingerprint).buffer
                    }]
            }) || undefined;
            this.wt = new WebTransport(url, wtOpts);
            this.wt.ready.then((e) => {
                console.log("WebTransport ready!", e);
                this.isOpen = true;
                this.unreliableReader = this.wt.datagrams.readable.getReader();
                this.unreliableWriter = this.wt.datagrams.writable.getWriter();
                const incomingBidi = this.wt.incomingBidirectionalStreams.getReader();
                incomingBidi.read().then((stream) => {
                    this.reader = stream.value.readable.getReader();
                    this.writer = stream.value.writable.getWriter();
                    // immediately write room/sessionId for establishing the room connection
                    this.sendSeatReservation(options.room.roomId, options.sessionId, options.reconnectionToken);
                    // start reading incoming data
                    this.readIncomingData();
                    this.readIncomingUnreliableData();
                }).catch((e) => {
                    console.error("failed to read incoming stream", e);
                    console.error("TODO: close the connection");
                });
                // this.events.onopen(e);
            }).catch((e) => {
                // this.events.onerror(e);
                // this.events.onclose({ code: e.closeCode, reason: e.reason });
                console.log("WebTransport not ready!", e);
                this._close();
            });
            this.wt.closed.then((e) => {
                console.log("WebTransport closed w/ success", e);
                this.events.onclose({ code: e.closeCode, reason: e.reason });
            }).catch((e) => {
                console.log("WebTransport closed w/ error", e);
                this.events.onerror(e);
                this.events.onclose({ code: e.closeCode, reason: e.reason });
            }).finally(() => {
                this._close();
            });
        }
        send(data) {
            const prefixLength = umdExports.encode.number(this.lengthPrefixBuffer, data.length, { offset: 0 });
            const dataWithPrefixedLength = new Uint8Array(prefixLength + data.length);
            dataWithPrefixedLength.set(this.lengthPrefixBuffer.subarray(0, prefixLength), 0);
            dataWithPrefixedLength.set(data, prefixLength);
            this.writer.write(dataWithPrefixedLength);
        }
        sendUnreliable(data) {
            const prefixLength = umdExports.encode.number(this.lengthPrefixBuffer, data.length, { offset: 0 });
            const dataWithPrefixedLength = new Uint8Array(prefixLength + data.length);
            dataWithPrefixedLength.set(this.lengthPrefixBuffer.subarray(0, prefixLength), 0);
            dataWithPrefixedLength.set(data, prefixLength);
            this.unreliableWriter.write(dataWithPrefixedLength);
        }
        close(code, reason) {
            try {
                this.wt.close({ closeCode: code, reason: reason });
            }
            catch (e) {
                console.error(e);
            }
        }
        readIncomingData() {
            return __awaiter(this, void 0, void 0, function* () {
                let result;
                while (this.isOpen) {
                    try {
                        result = yield this.reader.read();
                        //
                        // a single read may contain multiple messages
                        // each message is prefixed with its length
                        //
                        const messages = result.value;
                        const it = { offset: 0 };
                        do {
                            //
                            // QUESTION: should we buffer the message in case it's not fully read?
                            //
                            const length = umdExports.decode.number(messages, it);
                            this.events.onmessage({ data: messages.subarray(it.offset, it.offset + length) });
                            it.offset += length;
                        } while (it.offset < messages.length);
                    }
                    catch (e) {
                        if (e.message.indexOf("session is closed") === -1) {
                            console.error("H3Transport: failed to read incoming data", e);
                        }
                        break;
                    }
                    if (result.done) {
                        break;
                    }
                }
            });
        }
        readIncomingUnreliableData() {
            return __awaiter(this, void 0, void 0, function* () {
                let result;
                while (this.isOpen) {
                    try {
                        result = yield this.unreliableReader.read();
                        //
                        // a single read may contain multiple messages
                        // each message is prefixed with its length
                        //
                        const messages = result.value;
                        const it = { offset: 0 };
                        do {
                            //
                            // QUESTION: should we buffer the message in case it's not fully read?
                            //
                            const length = umdExports.decode.number(messages, it);
                            this.events.onmessage({ data: messages.subarray(it.offset, it.offset + length) });
                            it.offset += length;
                        } while (it.offset < messages.length);
                    }
                    catch (e) {
                        if (e.message.indexOf("session is closed") === -1) {
                            console.error("H3Transport: failed to read incoming data", e);
                        }
                        break;
                    }
                    if (result.done) {
                        break;
                    }
                }
            });
        }
        sendSeatReservation(roomId, sessionId, reconnectionToken) {
            const it = { offset: 0 };
            const bytes = [];
            umdExports.encode.string(bytes, roomId, it);
            umdExports.encode.string(bytes, sessionId, it);
            if (reconnectionToken) {
                umdExports.encode.string(bytes, reconnectionToken, it);
            }
            this.writer.write(new Uint8Array(bytes).buffer);
        }
        _close() {
            this.isOpen = false;
        }
    }

    var browser;
    var hasRequiredBrowser;

    function requireBrowser () {
    	if (hasRequiredBrowser) return browser;
    	hasRequiredBrowser = 1;

    	browser = function () {
    	  throw new Error(
    	    'ws does not work in the browser. Browser clients must use the native ' +
    	      'WebSocket object'
    	  );
    	};
    	return browser;
    }

    var browserExports = requireBrowser();
    var NodeWebSocket = /*@__PURE__*/getDefaultExportFromCjs(browserExports);

    const WebSocket = globalThis.WebSocket || NodeWebSocket;
    class WebSocketTransport {
        constructor(events) {
            this.events = events;
        }
        send(data) {
            this.ws.send(data);
        }
        sendUnreliable(data) {
            console.warn("colyseus.js: The WebSocket transport does not support unreliable messages");
        }
        /**
         * @param url URL to connect to
         * @param headers custom headers to send with the connection (only supported in Node.js. Web Browsers do not allow setting custom headers)
         */
        connect(url, headers) {
            try {
                // Node or Bun environments (supports custom headers)
                this.ws = new WebSocket(url, { headers, protocols: this.protocols });
            }
            catch (e) {
                // browser environment (custom headers not supported)
                this.ws = new WebSocket(url, this.protocols);
            }
            this.ws.binaryType = 'arraybuffer';
            this.ws.onopen = this.events.onopen;
            this.ws.onmessage = this.events.onmessage;
            this.ws.onclose = this.events.onclose;
            this.ws.onerror = this.events.onerror;
        }
        close(code, reason) {
            this.ws.close(code, reason);
        }
        get isOpen() {
            return this.ws.readyState === WebSocket.OPEN;
        }
    }

    class Connection {
        constructor(protocol) {
            this.events = {};
            switch (protocol) {
                case "h3":
                    this.transport = new H3TransportTransport(this.events);
                    break;
                default:
                    this.transport = new WebSocketTransport(this.events);
                    break;
            }
        }
        connect(url, options) {
            this.transport.connect.call(this.transport, url, options);
        }
        send(data) {
            this.transport.send(data);
        }
        sendUnreliable(data) {
            this.transport.sendUnreliable(data);
        }
        close(code, reason) {
            this.transport.close(code, reason);
        }
        get isOpen() {
            return this.transport.isOpen;
        }
    }

    // Use codes between 0~127 for lesser throughput (1 byte)
    exports.Protocol = void 0;
    (function (Protocol) {
        // Room-related (10~19)
        Protocol[Protocol["HANDSHAKE"] = 9] = "HANDSHAKE";
        Protocol[Protocol["JOIN_ROOM"] = 10] = "JOIN_ROOM";
        Protocol[Protocol["ERROR"] = 11] = "ERROR";
        Protocol[Protocol["LEAVE_ROOM"] = 12] = "LEAVE_ROOM";
        Protocol[Protocol["ROOM_DATA"] = 13] = "ROOM_DATA";
        Protocol[Protocol["ROOM_STATE"] = 14] = "ROOM_STATE";
        Protocol[Protocol["ROOM_STATE_PATCH"] = 15] = "ROOM_STATE_PATCH";
        Protocol[Protocol["ROOM_DATA_SCHEMA"] = 16] = "ROOM_DATA_SCHEMA";
        Protocol[Protocol["ROOM_DATA_BYTES"] = 17] = "ROOM_DATA_BYTES";
    })(exports.Protocol || (exports.Protocol = {}));
    exports.ErrorCode = void 0;
    (function (ErrorCode) {
        ErrorCode[ErrorCode["MATCHMAKE_NO_HANDLER"] = 4210] = "MATCHMAKE_NO_HANDLER";
        ErrorCode[ErrorCode["MATCHMAKE_INVALID_CRITERIA"] = 4211] = "MATCHMAKE_INVALID_CRITERIA";
        ErrorCode[ErrorCode["MATCHMAKE_INVALID_ROOM_ID"] = 4212] = "MATCHMAKE_INVALID_ROOM_ID";
        ErrorCode[ErrorCode["MATCHMAKE_UNHANDLED"] = 4213] = "MATCHMAKE_UNHANDLED";
        ErrorCode[ErrorCode["MATCHMAKE_EXPIRED"] = 4214] = "MATCHMAKE_EXPIRED";
        ErrorCode[ErrorCode["AUTH_FAILED"] = 4215] = "AUTH_FAILED";
        ErrorCode[ErrorCode["APPLICATION_ERROR"] = 4216] = "APPLICATION_ERROR";
    })(exports.ErrorCode || (exports.ErrorCode = {}));

    const serializers = {};
    function registerSerializer(id, serializer) {
        serializers[id] = serializer;
    }
    function getSerializer(id) {
        const serializer = serializers[id];
        if (!serializer) {
            throw new Error("missing serializer: " + id);
        }
        return serializer;
    }

    /**
     * The MIT License (MIT)
     *
     * Copyright 2016 Andrey Sitnik <andrey@sitnik.ru>
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy of
     * this software and associated documentation files (the "Software"), to deal in
     * the Software without restriction, including without limitation the rights to
     * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
     * the Software, and to permit persons to whom the Software is furnished to do so,
     * subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in all
     * copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
     * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
     * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
     * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
     * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     */
    const createNanoEvents = () => ({
        emit(event, ...args) {
            let callbacks = this.events[event] || [];
            for (let i = 0, length = callbacks.length; i < length; i++) {
                callbacks[i](...args);
            }
        },
        events: {},
        on(event, cb) {
            var _a;
            ((_a = this.events[event]) === null || _a === void 0 ? void 0 : _a.push(cb)) || (this.events[event] = [cb]);
            return () => {
                var _a;
                this.events[event] = (_a = this.events[event]) === null || _a === void 0 ? void 0 : _a.filter(i => cb !== i);
            };
        }
    });

    class EventEmitter {
        constructor() {
            this.handlers = [];
        }
        register(cb, once = false) {
            this.handlers.push(cb);
            return this;
        }
        invoke(...args) {
            this.handlers.forEach((handler) => handler.apply(this, args));
        }
        invokeAsync(...args) {
            return Promise.all(this.handlers.map((handler) => handler.apply(this, args)));
        }
        remove(cb) {
            const index = this.handlers.indexOf(cb);
            this.handlers[index] = this.handlers[this.handlers.length - 1];
            this.handlers.pop();
        }
        clear() {
            this.handlers = [];
        }
    }
    function createSignal() {
        const emitter = new EventEmitter();
        function register(cb) {
            return emitter.register(cb, this === null);
        }
        register.once = (cb) => {
            const callback = function (...args) {
                cb.apply(this, args);
                emitter.remove(callback);
            };
            emitter.register(callback);
        };
        register.remove = (cb) => emitter.remove(cb);
        register.invoke = (...args) => emitter.invoke(...args);
        register.invokeAsync = (...args) => emitter.invokeAsync(...args);
        register.clear = () => emitter.clear();
        return register;
    }

    function getStateCallbacks(room) {
        try {
            // SchemaSerializer
            return umdExports.getDecoderStateCallbacks(room['serializer'].decoder);
        }
        catch (e) {
            // NoneSerializer
            return undefined;
        }
    }
    class SchemaSerializer {
        setState(encodedState, it) {
            this.decoder.decode(encodedState, it);
        }
        getState() {
            return this.state;
        }
        patch(patches, it) {
            return this.decoder.decode(patches, it);
        }
        teardown() {
            this.decoder.root.clearRefs();
        }
        handshake(bytes, it) {
            if (this.state) {
                //
                // TODO: validate definitions against concreate this.state instance
                //
                umdExports.Reflection.decode(bytes, it); // no-op
                this.decoder = new umdExports.Decoder(this.state);
            }
            else {
                // initialize reflected state from server
                this.decoder = umdExports.Reflection.decode(bytes, it);
                this.state = this.decoder.state;
            }
        }
    }

    var decoder;
    try {
    	decoder = new TextDecoder();
    } catch(error) {}
    var src;
    var srcEnd;
    var position$1 = 0;
    var currentUnpackr = {};
    var currentStructures;
    var srcString;
    var srcStringStart = 0;
    var srcStringEnd = 0;
    var bundledStrings$1;
    var referenceMap;
    var currentExtensions = [];
    var dataView;
    var defaultOptions = {
    	useRecords: false,
    	mapsAsObjects: true
    };
    class C1Type {}
    const C1 = new C1Type();
    C1.name = 'MessagePack 0xC1';
    var sequentialMode = false;
    var inlineObjectReadThreshold = 2;
    var readStruct;
    // no-eval build
    try {
    	new Function('');
    } catch(error) {
    	// if eval variants are not supported, do not create inline object readers ever
    	inlineObjectReadThreshold = Infinity;
    }

    class Unpackr {
    	constructor(options) {
    		if (options) {
    			if (options.useRecords === false && options.mapsAsObjects === undefined)
    				options.mapsAsObjects = true;
    			if (options.sequential && options.trusted !== false) {
    				options.trusted = true;
    				if (!options.structures && options.useRecords != false) {
    					options.structures = [];
    					if (!options.maxSharedStructures)
    						options.maxSharedStructures = 0;
    				}
    			}
    			if (options.structures)
    				options.structures.sharedLength = options.structures.length;
    			else if (options.getStructures) {
    				(options.structures = []).uninitialized = true; // this is what we use to denote an uninitialized structures
    				options.structures.sharedLength = 0;
    			}
    			if (options.int64AsNumber) {
    				options.int64AsType = 'number';
    			}
    		}
    		Object.assign(this, options);
    	}
    	unpack(source, options) {
    		if (src) {
    			// re-entrant execution, save the state and restore it after we do this unpack
    			return saveState(() => {
    				clearSource();
    				return this ? this.unpack(source, options) : Unpackr.prototype.unpack.call(defaultOptions, source, options)
    			})
    		}
    		if (!source.buffer && source.constructor === ArrayBuffer)
    			source = typeof Buffer !== 'undefined' ? Buffer.from(source) : new Uint8Array(source);
    		if (typeof options === 'object') {
    			srcEnd = options.end || source.length;
    			position$1 = options.start || 0;
    		} else {
    			position$1 = 0;
    			srcEnd = options > -1 ? options : source.length;
    		}
    		srcStringEnd = 0;
    		srcString = null;
    		bundledStrings$1 = null;
    		src = source;
    		// this provides cached access to the data view for a buffer if it is getting reused, which is a recommend
    		// technique for getting data from a database where it can be copied into an existing buffer instead of creating
    		// new ones
    		try {
    			dataView = source.dataView || (source.dataView = new DataView(source.buffer, source.byteOffset, source.byteLength));
    		} catch(error) {
    			// if it doesn't have a buffer, maybe it is the wrong type of object
    			src = null;
    			if (source instanceof Uint8Array)
    				throw error
    			throw new Error('Source must be a Uint8Array or Buffer but was a ' + ((source && typeof source == 'object') ? source.constructor.name : typeof source))
    		}
    		if (this instanceof Unpackr) {
    			currentUnpackr = this;
    			if (this.structures) {
    				currentStructures = this.structures;
    				return checkedRead(options)
    			} else if (!currentStructures || currentStructures.length > 0) {
    				currentStructures = [];
    			}
    		} else {
    			currentUnpackr = defaultOptions;
    			if (!currentStructures || currentStructures.length > 0)
    				currentStructures = [];
    		}
    		return checkedRead(options)
    	}
    	unpackMultiple(source, forEach) {
    		let values, lastPosition = 0;
    		try {
    			sequentialMode = true;
    			let size = source.length;
    			let value = this ? this.unpack(source, size) : defaultUnpackr.unpack(source, size);
    			if (forEach) {
    				if (forEach(value, lastPosition, position$1) === false) return;
    				while(position$1 < size) {
    					lastPosition = position$1;
    					if (forEach(checkedRead(), lastPosition, position$1) === false) {
    						return
    					}
    				}
    			}
    			else {
    				values = [ value ];
    				while(position$1 < size) {
    					lastPosition = position$1;
    					values.push(checkedRead());
    				}
    				return values
    			}
    		} catch(error) {
    			error.lastPosition = lastPosition;
    			error.values = values;
    			throw error
    		} finally {
    			sequentialMode = false;
    			clearSource();
    		}
    	}
    	_mergeStructures(loadedStructures, existingStructures) {
    		loadedStructures = loadedStructures || [];
    		if (Object.isFrozen(loadedStructures))
    			loadedStructures = loadedStructures.map(structure => structure.slice(0));
    		for (let i = 0, l = loadedStructures.length; i < l; i++) {
    			let structure = loadedStructures[i];
    			if (structure) {
    				structure.isShared = true;
    				if (i >= 32)
    					structure.highByte = (i - 32) >> 5;
    			}
    		}
    		loadedStructures.sharedLength = loadedStructures.length;
    		for (let id in existingStructures || []) {
    			if (id >= 0) {
    				let structure = loadedStructures[id];
    				let existing = existingStructures[id];
    				if (existing) {
    					if (structure)
    						(loadedStructures.restoreStructures || (loadedStructures.restoreStructures = []))[id] = structure;
    					loadedStructures[id] = existing;
    				}
    			}
    		}
    		return this.structures = loadedStructures
    	}
    	decode(source, options) {
    		return this.unpack(source, options)
    	}
    }
    function checkedRead(options) {
    	try {
    		if (!currentUnpackr.trusted && !sequentialMode) {
    			let sharedLength = currentStructures.sharedLength || 0;
    			if (sharedLength < currentStructures.length)
    				currentStructures.length = sharedLength;
    		}
    		let result;
    		if (currentUnpackr.randomAccessStructure && src[position$1] < 0x40 && src[position$1] >= 0x20 && readStruct) ; else
    			result = read();
    		if (bundledStrings$1) { // bundled strings to skip past
    			position$1 = bundledStrings$1.postBundlePosition;
    			bundledStrings$1 = null;
    		}
    		if (sequentialMode)
    			// we only need to restore the structures if there was an error, but if we completed a read,
    			// we can clear this out and keep the structures we read
    			currentStructures.restoreStructures = null;

    		if (position$1 == srcEnd) {
    			// finished reading this source, cleanup references
    			if (currentStructures && currentStructures.restoreStructures)
    				restoreStructures();
    			currentStructures = null;
    			src = null;
    			if (referenceMap)
    				referenceMap = null;
    		} else if (position$1 > srcEnd) {
    			// over read
    			throw new Error('Unexpected end of MessagePack data')
    		} else if (!sequentialMode) {
    			let jsonView;
    			try {
    				jsonView = JSON.stringify(result, (_, value) => typeof value === "bigint" ? `${value}n` : value).slice(0, 100);
    			} catch(error) {
    				jsonView = '(JSON view not available ' + error + ')';
    			}
    			throw new Error('Data read, but end of buffer not reached ' + jsonView)
    		}
    		// else more to read, but we are reading sequentially, so don't clear source yet
    		return result
    	} catch(error) {
    		if (currentStructures && currentStructures.restoreStructures)
    			restoreStructures();
    		clearSource();
    		if (error instanceof RangeError || error.message.startsWith('Unexpected end of buffer') || position$1 > srcEnd) {
    			error.incomplete = true;
    		}
    		throw error
    	}
    }

    function restoreStructures() {
    	for (let id in currentStructures.restoreStructures) {
    		currentStructures[id] = currentStructures.restoreStructures[id];
    	}
    	currentStructures.restoreStructures = null;
    }

    function read() {
    	let token = src[position$1++];
    	if (token < 0xa0) {
    		if (token < 0x80) {
    			if (token < 0x40)
    				return token
    			else {
    				let structure = currentStructures[token & 0x3f] ||
    					currentUnpackr.getStructures && loadStructures()[token & 0x3f];
    				if (structure) {
    					if (!structure.read) {
    						structure.read = createStructureReader(structure, token & 0x3f);
    					}
    					return structure.read()
    				} else
    					return token
    			}
    		} else if (token < 0x90) {
    			// map
    			token -= 0x80;
    			if (currentUnpackr.mapsAsObjects) {
    				let object = {};
    				for (let i = 0; i < token; i++) {
    					let key = readKey();
    					if (key === '__proto__')
    						key = '__proto_';
    					object[key] = read();
    				}
    				return object
    			} else {
    				let map = new Map();
    				for (let i = 0; i < token; i++) {
    					map.set(read(), read());
    				}
    				return map
    			}
    		} else {
    			token -= 0x90;
    			let array = new Array(token);
    			for (let i = 0; i < token; i++) {
    				array[i] = read();
    			}
    			if (currentUnpackr.freezeData)
    				return Object.freeze(array)
    			return array
    		}
    	} else if (token < 0xc0) {
    		// fixstr
    		let length = token - 0xa0;
    		if (srcStringEnd >= position$1) {
    			return srcString.slice(position$1 - srcStringStart, (position$1 += length) - srcStringStart)
    		}
    		if (srcStringEnd == 0 && srcEnd < 140) {
    			// for small blocks, avoiding the overhead of the extract call is helpful
    			let string = length < 16 ? shortStringInJS(length) : longStringInJS(length);
    			if (string != null)
    				return string
    		}
    		return readFixedString(length)
    	} else {
    		let value;
    		switch (token) {
    			case 0xc0: return null
    			case 0xc1:
    				if (bundledStrings$1) {
    					value = read(); // followed by the length of the string in characters (not bytes!)
    					if (value > 0)
    						return bundledStrings$1[1].slice(bundledStrings$1.position1, bundledStrings$1.position1 += value)
    					else
    						return bundledStrings$1[0].slice(bundledStrings$1.position0, bundledStrings$1.position0 -= value)
    				}
    				return C1; // "never-used", return special object to denote that
    			case 0xc2: return false
    			case 0xc3: return true
    			case 0xc4:
    				// bin 8
    				value = src[position$1++];
    				if (value === undefined)
    					throw new Error('Unexpected end of buffer')
    				return readBin(value)
    			case 0xc5:
    				// bin 16
    				value = dataView.getUint16(position$1);
    				position$1 += 2;
    				return readBin(value)
    			case 0xc6:
    				// bin 32
    				value = dataView.getUint32(position$1);
    				position$1 += 4;
    				return readBin(value)
    			case 0xc7:
    				// ext 8
    				return readExt(src[position$1++])
    			case 0xc8:
    				// ext 16
    				value = dataView.getUint16(position$1);
    				position$1 += 2;
    				return readExt(value)
    			case 0xc9:
    				// ext 32
    				value = dataView.getUint32(position$1);
    				position$1 += 4;
    				return readExt(value)
    			case 0xca:
    				value = dataView.getFloat32(position$1);
    				if (currentUnpackr.useFloat32 > 2) {
    					// this does rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
    					let multiplier = mult10[((src[position$1] & 0x7f) << 1) | (src[position$1 + 1] >> 7)];
    					position$1 += 4;
    					return ((multiplier * value + (value > 0 ? 0.5 : -0.5)) >> 0) / multiplier
    				}
    				position$1 += 4;
    				return value
    			case 0xcb:
    				value = dataView.getFloat64(position$1);
    				position$1 += 8;
    				return value
    			// uint handlers
    			case 0xcc:
    				return src[position$1++]
    			case 0xcd:
    				value = dataView.getUint16(position$1);
    				position$1 += 2;
    				return value
    			case 0xce:
    				value = dataView.getUint32(position$1);
    				position$1 += 4;
    				return value
    			case 0xcf:
    				if (currentUnpackr.int64AsType === 'number') {
    					value = dataView.getUint32(position$1) * 0x100000000;
    					value += dataView.getUint32(position$1 + 4);
    				} else if (currentUnpackr.int64AsType === 'string') {
    					value = dataView.getBigUint64(position$1).toString();
    				} else if (currentUnpackr.int64AsType === 'auto') {
    					value = dataView.getBigUint64(position$1);
    					if (value<=BigInt(2)<<BigInt(52)) value=Number(value);
    				} else
    					value = dataView.getBigUint64(position$1);
    				position$1 += 8;
    				return value

    			// int handlers
    			case 0xd0:
    				return dataView.getInt8(position$1++)
    			case 0xd1:
    				value = dataView.getInt16(position$1);
    				position$1 += 2;
    				return value
    			case 0xd2:
    				value = dataView.getInt32(position$1);
    				position$1 += 4;
    				return value
    			case 0xd3:
    				if (currentUnpackr.int64AsType === 'number') {
    					value = dataView.getInt32(position$1) * 0x100000000;
    					value += dataView.getUint32(position$1 + 4);
    				} else if (currentUnpackr.int64AsType === 'string') {
    					value = dataView.getBigInt64(position$1).toString();
    				} else if (currentUnpackr.int64AsType === 'auto') {
    					value = dataView.getBigInt64(position$1);
    					if (value>=BigInt(-2)<<BigInt(52)&&value<=BigInt(2)<<BigInt(52)) value=Number(value);
    				} else
    					value = dataView.getBigInt64(position$1);
    				position$1 += 8;
    				return value

    			case 0xd4:
    				// fixext 1
    				value = src[position$1++];
    				if (value == 0x72) {
    					return recordDefinition(src[position$1++] & 0x3f)
    				} else {
    					let extension = currentExtensions[value];
    					if (extension) {
    						if (extension.read) {
    							position$1++; // skip filler byte
    							return extension.read(read())
    						} else if (extension.noBuffer) {
    							position$1++; // skip filler byte
    							return extension()
    						} else
    							return extension(src.subarray(position$1, ++position$1))
    					} else
    						throw new Error('Unknown extension ' + value)
    				}
    			case 0xd5:
    				// fixext 2
    				value = src[position$1];
    				if (value == 0x72) {
    					position$1++;
    					return recordDefinition(src[position$1++] & 0x3f, src[position$1++])
    				} else
    					return readExt(2)
    			case 0xd6:
    				// fixext 4
    				return readExt(4)
    			case 0xd7:
    				// fixext 8
    				return readExt(8)
    			case 0xd8:
    				// fixext 16
    				return readExt(16)
    			case 0xd9:
    			// str 8
    				value = src[position$1++];
    				if (srcStringEnd >= position$1) {
    					return srcString.slice(position$1 - srcStringStart, (position$1 += value) - srcStringStart)
    				}
    				return readString8(value)
    			case 0xda:
    			// str 16
    				value = dataView.getUint16(position$1);
    				position$1 += 2;
    				if (srcStringEnd >= position$1) {
    					return srcString.slice(position$1 - srcStringStart, (position$1 += value) - srcStringStart)
    				}
    				return readString16(value)
    			case 0xdb:
    			// str 32
    				value = dataView.getUint32(position$1);
    				position$1 += 4;
    				if (srcStringEnd >= position$1) {
    					return srcString.slice(position$1 - srcStringStart, (position$1 += value) - srcStringStart)
    				}
    				return readString32(value)
    			case 0xdc:
    			// array 16
    				value = dataView.getUint16(position$1);
    				position$1 += 2;
    				return readArray(value)
    			case 0xdd:
    			// array 32
    				value = dataView.getUint32(position$1);
    				position$1 += 4;
    				return readArray(value)
    			case 0xde:
    			// map 16
    				value = dataView.getUint16(position$1);
    				position$1 += 2;
    				return readMap(value)
    			case 0xdf:
    			// map 32
    				value = dataView.getUint32(position$1);
    				position$1 += 4;
    				return readMap(value)
    			default: // negative int
    				if (token >= 0xe0)
    					return token - 0x100
    				if (token === undefined) {
    					let error = new Error('Unexpected end of MessagePack data');
    					error.incomplete = true;
    					throw error
    				}
    				throw new Error('Unknown MessagePack token ' + token)

    		}
    	}
    }
    const validName = /^[a-zA-Z_$][a-zA-Z\d_$]*$/;
    function createStructureReader(structure, firstId) {
    	function readObject() {
    		// This initial function is quick to instantiate, but runs slower. After several iterations pay the cost to build the faster function
    		if (readObject.count++ > inlineObjectReadThreshold) {
    			let readObject = structure.read = (new Function('r', 'return function(){return ' + (currentUnpackr.freezeData ? 'Object.freeze' : '') +
    				'({' + structure.map(key => key === '__proto__' ? '__proto_:r()' : validName.test(key) ? key + ':r()' : ('[' + JSON.stringify(key) + ']:r()')).join(',') + '})}'))(read);
    			if (structure.highByte === 0)
    				structure.read = createSecondByteReader(firstId, structure.read);
    			return readObject() // second byte is already read, if there is one so immediately read object
    		}
    		let object = {};
    		for (let i = 0, l = structure.length; i < l; i++) {
    			let key = structure[i];
    			if (key === '__proto__')
    				key = '__proto_';
    			object[key] = read();
    		}
    		if (currentUnpackr.freezeData)
    			return Object.freeze(object);
    		return object
    	}
    	readObject.count = 0;
    	if (structure.highByte === 0) {
    		return createSecondByteReader(firstId, readObject)
    	}
    	return readObject
    }

    const createSecondByteReader = (firstId, read0) => {
    	return function() {
    		let highByte = src[position$1++];
    		if (highByte === 0)
    			return read0()
    		let id = firstId < 32 ? -(firstId + (highByte << 5)) : firstId + (highByte << 5);
    		let structure = currentStructures[id] || loadStructures()[id];
    		if (!structure) {
    			throw new Error('Record id is not defined for ' + id)
    		}
    		if (!structure.read)
    			structure.read = createStructureReader(structure, firstId);
    		return structure.read()
    	}
    };

    function loadStructures() {
    	let loadedStructures = saveState(() => {
    		// save the state in case getStructures modifies our buffer
    		src = null;
    		return currentUnpackr.getStructures()
    	});
    	return currentStructures = currentUnpackr._mergeStructures(loadedStructures, currentStructures)
    }

    var readFixedString = readStringJS;
    var readString8 = readStringJS;
    var readString16 = readStringJS;
    var readString32 = readStringJS;
    function readStringJS(length) {
    	let result;
    	if (length < 16) {
    		if (result = shortStringInJS(length))
    			return result
    	}
    	if (length > 64 && decoder)
    		return decoder.decode(src.subarray(position$1, position$1 += length))
    	const end = position$1 + length;
    	const units = [];
    	result = '';
    	while (position$1 < end) {
    		const byte1 = src[position$1++];
    		if ((byte1 & 0x80) === 0) {
    			// 1 byte
    			units.push(byte1);
    		} else if ((byte1 & 0xe0) === 0xc0) {
    			// 2 bytes
    			const byte2 = src[position$1++] & 0x3f;
    			units.push(((byte1 & 0x1f) << 6) | byte2);
    		} else if ((byte1 & 0xf0) === 0xe0) {
    			// 3 bytes
    			const byte2 = src[position$1++] & 0x3f;
    			const byte3 = src[position$1++] & 0x3f;
    			units.push(((byte1 & 0x1f) << 12) | (byte2 << 6) | byte3);
    		} else if ((byte1 & 0xf8) === 0xf0) {
    			// 4 bytes
    			const byte2 = src[position$1++] & 0x3f;
    			const byte3 = src[position$1++] & 0x3f;
    			const byte4 = src[position$1++] & 0x3f;
    			let unit = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0c) | (byte3 << 0x06) | byte4;
    			if (unit > 0xffff) {
    				unit -= 0x10000;
    				units.push(((unit >>> 10) & 0x3ff) | 0xd800);
    				unit = 0xdc00 | (unit & 0x3ff);
    			}
    			units.push(unit);
    		} else {
    			units.push(byte1);
    		}

    		if (units.length >= 0x1000) {
    			result += fromCharCode.apply(String, units);
    			units.length = 0;
    		}
    	}

    	if (units.length > 0) {
    		result += fromCharCode.apply(String, units);
    	}

    	return result
    }

    function readArray(length) {
    	let array = new Array(length);
    	for (let i = 0; i < length; i++) {
    		array[i] = read();
    	}
    	if (currentUnpackr.freezeData)
    		return Object.freeze(array)
    	return array
    }

    function readMap(length) {
    	if (currentUnpackr.mapsAsObjects) {
    		let object = {};
    		for (let i = 0; i < length; i++) {
    			let key = readKey();
    			if (key === '__proto__')
    				key = '__proto_';
    			object[key] = read();
    		}
    		return object
    	} else {
    		let map = new Map();
    		for (let i = 0; i < length; i++) {
    			map.set(read(), read());
    		}
    		return map
    	}
    }

    var fromCharCode = String.fromCharCode;
    function longStringInJS(length) {
    	let start = position$1;
    	let bytes = new Array(length);
    	for (let i = 0; i < length; i++) {
    		const byte = src[position$1++];
    		if ((byte & 0x80) > 0) {
    				position$1 = start;
    				return
    			}
    			bytes[i] = byte;
    		}
    		return fromCharCode.apply(String, bytes)
    }
    function shortStringInJS(length) {
    	if (length < 4) {
    		if (length < 2) {
    			if (length === 0)
    				return ''
    			else {
    				let a = src[position$1++];
    				if ((a & 0x80) > 1) {
    					position$1 -= 1;
    					return
    				}
    				return fromCharCode(a)
    			}
    		} else {
    			let a = src[position$1++];
    			let b = src[position$1++];
    			if ((a & 0x80) > 0 || (b & 0x80) > 0) {
    				position$1 -= 2;
    				return
    			}
    			if (length < 3)
    				return fromCharCode(a, b)
    			let c = src[position$1++];
    			if ((c & 0x80) > 0) {
    				position$1 -= 3;
    				return
    			}
    			return fromCharCode(a, b, c)
    		}
    	} else {
    		let a = src[position$1++];
    		let b = src[position$1++];
    		let c = src[position$1++];
    		let d = src[position$1++];
    		if ((a & 0x80) > 0 || (b & 0x80) > 0 || (c & 0x80) > 0 || (d & 0x80) > 0) {
    			position$1 -= 4;
    			return
    		}
    		if (length < 6) {
    			if (length === 4)
    				return fromCharCode(a, b, c, d)
    			else {
    				let e = src[position$1++];
    				if ((e & 0x80) > 0) {
    					position$1 -= 5;
    					return
    				}
    				return fromCharCode(a, b, c, d, e)
    			}
    		} else if (length < 8) {
    			let e = src[position$1++];
    			let f = src[position$1++];
    			if ((e & 0x80) > 0 || (f & 0x80) > 0) {
    				position$1 -= 6;
    				return
    			}
    			if (length < 7)
    				return fromCharCode(a, b, c, d, e, f)
    			let g = src[position$1++];
    			if ((g & 0x80) > 0) {
    				position$1 -= 7;
    				return
    			}
    			return fromCharCode(a, b, c, d, e, f, g)
    		} else {
    			let e = src[position$1++];
    			let f = src[position$1++];
    			let g = src[position$1++];
    			let h = src[position$1++];
    			if ((e & 0x80) > 0 || (f & 0x80) > 0 || (g & 0x80) > 0 || (h & 0x80) > 0) {
    				position$1 -= 8;
    				return
    			}
    			if (length < 10) {
    				if (length === 8)
    					return fromCharCode(a, b, c, d, e, f, g, h)
    				else {
    					let i = src[position$1++];
    					if ((i & 0x80) > 0) {
    						position$1 -= 9;
    						return
    					}
    					return fromCharCode(a, b, c, d, e, f, g, h, i)
    				}
    			} else if (length < 12) {
    				let i = src[position$1++];
    				let j = src[position$1++];
    				if ((i & 0x80) > 0 || (j & 0x80) > 0) {
    					position$1 -= 10;
    					return
    				}
    				if (length < 11)
    					return fromCharCode(a, b, c, d, e, f, g, h, i, j)
    				let k = src[position$1++];
    				if ((k & 0x80) > 0) {
    					position$1 -= 11;
    					return
    				}
    				return fromCharCode(a, b, c, d, e, f, g, h, i, j, k)
    			} else {
    				let i = src[position$1++];
    				let j = src[position$1++];
    				let k = src[position$1++];
    				let l = src[position$1++];
    				if ((i & 0x80) > 0 || (j & 0x80) > 0 || (k & 0x80) > 0 || (l & 0x80) > 0) {
    					position$1 -= 12;
    					return
    				}
    				if (length < 14) {
    					if (length === 12)
    						return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l)
    					else {
    						let m = src[position$1++];
    						if ((m & 0x80) > 0) {
    							position$1 -= 13;
    							return
    						}
    						return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m)
    					}
    				} else {
    					let m = src[position$1++];
    					let n = src[position$1++];
    					if ((m & 0x80) > 0 || (n & 0x80) > 0) {
    						position$1 -= 14;
    						return
    					}
    					if (length < 15)
    						return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
    					let o = src[position$1++];
    					if ((o & 0x80) > 0) {
    						position$1 -= 15;
    						return
    					}
    					return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o)
    				}
    			}
    		}
    	}
    }

    function readOnlyJSString() {
    	let token = src[position$1++];
    	let length;
    	if (token < 0xc0) {
    		// fixstr
    		length = token - 0xa0;
    	} else {
    		switch(token) {
    			case 0xd9:
    			// str 8
    				length = src[position$1++];
    				break
    			case 0xda:
    			// str 16
    				length = dataView.getUint16(position$1);
    				position$1 += 2;
    				break
    			case 0xdb:
    			// str 32
    				length = dataView.getUint32(position$1);
    				position$1 += 4;
    				break
    			default:
    				throw new Error('Expected string')
    		}
    	}
    	return readStringJS(length)
    }


    function readBin(length) {
    	return currentUnpackr.copyBuffers ?
    		// specifically use the copying slice (not the node one)
    		Uint8Array.prototype.slice.call(src, position$1, position$1 += length) :
    		src.subarray(position$1, position$1 += length)
    }
    function readExt(length) {
    	let type = src[position$1++];
    	if (currentExtensions[type]) {
    		let end;
    		return currentExtensions[type](src.subarray(position$1, end = (position$1 += length)), (readPosition) => {
    			position$1 = readPosition;
    			try {
    				return read();
    			} finally {
    				position$1 = end;
    			}
    		})
    	}
    	else
    		throw new Error('Unknown extension type ' + type)
    }

    var keyCache = new Array(4096);
    function readKey() {
    	let length = src[position$1++];
    	if (length >= 0xa0 && length < 0xc0) {
    		// fixstr, potentially use key cache
    		length = length - 0xa0;
    		if (srcStringEnd >= position$1) // if it has been extracted, must use it (and faster anyway)
    			return srcString.slice(position$1 - srcStringStart, (position$1 += length) - srcStringStart)
    		else if (!(srcStringEnd == 0 && srcEnd < 180))
    			return readFixedString(length)
    	} else { // not cacheable, go back and do a standard read
    		position$1--;
    		return asSafeString(read())
    	}
    	let key = ((length << 5) ^ (length > 1 ? dataView.getUint16(position$1) : length > 0 ? src[position$1] : 0)) & 0xfff;
    	let entry = keyCache[key];
    	let checkPosition = position$1;
    	let end = position$1 + length - 3;
    	let chunk;
    	let i = 0;
    	if (entry && entry.bytes == length) {
    		while (checkPosition < end) {
    			chunk = dataView.getUint32(checkPosition);
    			if (chunk != entry[i++]) {
    				checkPosition = 0x70000000;
    				break
    			}
    			checkPosition += 4;
    		}
    		end += 3;
    		while (checkPosition < end) {
    			chunk = src[checkPosition++];
    			if (chunk != entry[i++]) {
    				checkPosition = 0x70000000;
    				break
    			}
    		}
    		if (checkPosition === end) {
    			position$1 = checkPosition;
    			return entry.string
    		}
    		end -= 3;
    		checkPosition = position$1;
    	}
    	entry = [];
    	keyCache[key] = entry;
    	entry.bytes = length;
    	while (checkPosition < end) {
    		chunk = dataView.getUint32(checkPosition);
    		entry.push(chunk);
    		checkPosition += 4;
    	}
    	end += 3;
    	while (checkPosition < end) {
    		chunk = src[checkPosition++];
    		entry.push(chunk);
    	}
    	// for small blocks, avoiding the overhead of the extract call is helpful
    	let string = length < 16 ? shortStringInJS(length) : longStringInJS(length);
    	if (string != null)
    		return entry.string = string
    	return entry.string = readFixedString(length)
    }

    function asSafeString(property) {
    	// protect against expensive (DoS) string conversions
    	if (typeof property === 'string') return property;
    	if (typeof property === 'number' || typeof property === 'boolean' || typeof property === 'bigint') return property.toString();
    	if (property == null) return property + '';
    	if (currentUnpackr.allowArraysInMapKeys && Array.isArray(property) && property.flat().every(item => ['string', 'number', 'boolean', 'bigint'].includes(typeof item))) {
    		return property.flat().toString();
    	}
    	throw new Error(`Invalid property type for record: ${typeof property}`);
    }
    // the registration of the record definition extension (as "r")
    const recordDefinition = (id, highByte) => {
    	let structure = read().map(asSafeString); // ensure that all keys are strings and
    	// that the array is mutable
    	let firstByte = id;
    	if (highByte !== undefined) {
    		id = id < 32 ? -((highByte << 5) + id) : ((highByte << 5) + id);
    		structure.highByte = highByte;
    	}
    	let existingStructure = currentStructures[id];
    	// If it is a shared structure, we need to restore any changes after reading.
    	// Also in sequential mode, we may get incomplete reads and thus errors, and we need to restore
    	// to the state prior to an incomplete read in order to properly resume.
    	if (existingStructure && (existingStructure.isShared || sequentialMode)) {
    		(currentStructures.restoreStructures || (currentStructures.restoreStructures = []))[id] = existingStructure;
    	}
    	currentStructures[id] = structure;
    	structure.read = createStructureReader(structure, firstByte);
    	return structure.read()
    };
    currentExtensions[0] = () => {}; // notepack defines extension 0 to mean undefined, so use that as the default here
    currentExtensions[0].noBuffer = true;

    currentExtensions[0x42] = (data) => {
    	// decode bigint
    	let length = data.length;
    	let value = BigInt(data[0] & 0x80 ? data[0] - 0x100 : data[0]);
    	for (let i = 1; i < length; i++) {
    		value <<= BigInt(8);
    		value += BigInt(data[i]);
    	}
    	return value;
    };

    let errors = { Error, TypeError, ReferenceError };
    currentExtensions[0x65] = () => {
    	let data = read();
    	return (errors[data[0]] || Error)(data[1], { cause: data[2] })
    };

    currentExtensions[0x69] = (data) => {
    	// id extension (for structured clones)
    	if (currentUnpackr.structuredClone === false) throw new Error('Structured clone extension is disabled')
    	let id = dataView.getUint32(position$1 - 4);
    	if (!referenceMap)
    		referenceMap = new Map();
    	let token = src[position$1];
    	let target;
    	// TODO: handle Maps, Sets, and other types that can cycle; this is complicated, because you potentially need to read
    	// ahead past references to record structure definitions
    	if (token >= 0x90 && token < 0xa0 || token == 0xdc || token == 0xdd)
    		target = [];
    	else
    		target = {};

    	let refEntry = { target }; // a placeholder object
    	referenceMap.set(id, refEntry);
    	let targetProperties = read(); // read the next value as the target object to id
    	if (refEntry.used) // there is a cycle, so we have to assign properties to original target
    		return Object.assign(target, targetProperties)
    	refEntry.target = targetProperties; // the placeholder wasn't used, replace with the deserialized one
    	return targetProperties // no cycle, can just use the returned read object
    };

    currentExtensions[0x70] = (data) => {
    	// pointer extension (for structured clones)
    	if (currentUnpackr.structuredClone === false) throw new Error('Structured clone extension is disabled')
    	let id = dataView.getUint32(position$1 - 4);
    	let refEntry = referenceMap.get(id);
    	refEntry.used = true;
    	return refEntry.target
    };

    currentExtensions[0x73] = () => new Set(read());

    const typedArrays = ['Int8','Uint8','Uint8Clamped','Int16','Uint16','Int32','Uint32','Float32','Float64','BigInt64','BigUint64'].map(type => type + 'Array');

    let glbl = typeof globalThis === 'object' ? globalThis : window;
    currentExtensions[0x74] = (data) => {
    	let typeCode = data[0];
    	let typedArrayName = typedArrays[typeCode];
    	if (!typedArrayName) {
    		if (typeCode === 16) {
    			let ab = new ArrayBuffer(data.length - 1);
    			let u8 = new Uint8Array(ab);
    			u8.set(data.subarray(1));
    			return ab;
    		}
    		throw new Error('Could not find typed array for code ' + typeCode)
    	}
    	// we have to always slice/copy here to get a new ArrayBuffer that is word/byte aligned
    	return new glbl[typedArrayName](Uint8Array.prototype.slice.call(data, 1).buffer)
    };
    currentExtensions[0x78] = () => {
    	let data = read();
    	return new RegExp(data[0], data[1])
    };
    const TEMP_BUNDLE = [];
    currentExtensions[0x62] = (data) => {
    	let dataSize = (data[0] << 24) + (data[1] << 16) + (data[2] << 8) + data[3];
    	let dataPosition = position$1;
    	position$1 += dataSize - data.length;
    	bundledStrings$1 = TEMP_BUNDLE;
    	bundledStrings$1 = [readOnlyJSString(), readOnlyJSString()];
    	bundledStrings$1.position0 = 0;
    	bundledStrings$1.position1 = 0;
    	bundledStrings$1.postBundlePosition = position$1;
    	position$1 = dataPosition;
    	return read()
    };

    currentExtensions[0xff] = (data) => {
    	// 32-bit date extension
    	if (data.length == 4)
    		return new Date((data[0] * 0x1000000 + (data[1] << 16) + (data[2] << 8) + data[3]) * 1000)
    	else if (data.length == 8)
    		return new Date(
    			((data[0] << 22) + (data[1] << 14) + (data[2] << 6) + (data[3] >> 2)) / 1000000 +
    			((data[3] & 0x3) * 0x100000000 + data[4] * 0x1000000 + (data[5] << 16) + (data[6] << 8) + data[7]) * 1000)
    	else if (data.length == 12)// TODO: Implement support for negative
    		return new Date(
    			((data[0] << 24) + (data[1] << 16) + (data[2] << 8) + data[3]) / 1000000 +
    			(((data[4] & 0x80) ? -281474976710656 : 0) + data[6] * 0x10000000000 + data[7] * 0x100000000 + data[8] * 0x1000000 + (data[9] << 16) + (data[10] << 8) + data[11]) * 1000)
    	else
    		return new Date('invalid')
    }; // notepack defines extension 0 to mean undefined, so use that as the default here
    // registration of bulk record definition?
    // currentExtensions[0x52] = () =>

    function saveState(callback) {
    	let savedSrcEnd = srcEnd;
    	let savedPosition = position$1;
    	let savedSrcStringStart = srcStringStart;
    	let savedSrcStringEnd = srcStringEnd;
    	let savedSrcString = srcString;
    	let savedReferenceMap = referenceMap;
    	let savedBundledStrings = bundledStrings$1;

    	// TODO: We may need to revisit this if we do more external calls to user code (since it could be slow)
    	let savedSrc = new Uint8Array(src.slice(0, srcEnd)); // we copy the data in case it changes while external data is processed
    	let savedStructures = currentStructures;
    	let savedStructuresContents = currentStructures.slice(0, currentStructures.length);
    	let savedPackr = currentUnpackr;
    	let savedSequentialMode = sequentialMode;
    	let value = callback();
    	srcEnd = savedSrcEnd;
    	position$1 = savedPosition;
    	srcStringStart = savedSrcStringStart;
    	srcStringEnd = savedSrcStringEnd;
    	srcString = savedSrcString;
    	referenceMap = savedReferenceMap;
    	bundledStrings$1 = savedBundledStrings;
    	src = savedSrc;
    	sequentialMode = savedSequentialMode;
    	currentStructures = savedStructures;
    	currentStructures.splice(0, currentStructures.length, ...savedStructuresContents);
    	currentUnpackr = savedPackr;
    	dataView = new DataView(src.buffer, src.byteOffset, src.byteLength);
    	return value
    }
    function clearSource() {
    	src = null;
    	referenceMap = null;
    	currentStructures = null;
    }

    const mult10 = new Array(147); // this is a table matching binary exponents to the multiplier to determine significant digit rounding
    for (let i = 0; i < 256; i++) {
    	mult10[i] = +('1e' + Math.floor(45.15 - i * 0.30103));
    }
    var defaultUnpackr = new Unpackr({ useRecords: false });
    const unpack = defaultUnpackr.unpack;
    defaultUnpackr.unpackMultiple;
    defaultUnpackr.unpack;
    let f32Array = new Float32Array(1);
    new Uint8Array(f32Array.buffer, 0, 4);

    let textEncoder;
    try {
    	textEncoder = new TextEncoder();
    } catch (error) {}
    let extensions, extensionClasses;
    const hasNodeBuffer = typeof Buffer !== 'undefined';
    const ByteArrayAllocate = hasNodeBuffer ?
    	function(length) { return Buffer.allocUnsafeSlow(length) } : Uint8Array;
    const ByteArray = hasNodeBuffer ? Buffer : Uint8Array;
    const MAX_BUFFER_SIZE = hasNodeBuffer ? 0x100000000 : 0x7fd00000;
    let target, keysTarget;
    let targetView;
    let position = 0;
    let safeEnd;
    let bundledStrings = null;
    let writeStructSlots;
    const MAX_BUNDLE_SIZE = 0x5500; // maximum characters such that the encoded bytes fits in 16 bits.
    const hasNonLatin = /[\u0080-\uFFFF]/;
    const RECORD_SYMBOL = Symbol('record-id');
    class Packr extends Unpackr {
    	constructor(options) {
    		super(options);
    		this.offset = 0;
    		let start;
    		let hasSharedUpdate;
    		let structures;
    		let referenceMap;
    		let encodeUtf8 = ByteArray.prototype.utf8Write ? function(string, position) {
    			return target.utf8Write(string, position, target.byteLength - position)
    		} : (textEncoder && textEncoder.encodeInto) ?
    			function(string, position) {
    				return textEncoder.encodeInto(string, target.subarray(position)).written
    			} : false;

    		let packr = this;
    		if (!options)
    			options = {};
    		let isSequential = options && options.sequential;
    		let hasSharedStructures = options.structures || options.saveStructures;
    		let maxSharedStructures = options.maxSharedStructures;
    		if (maxSharedStructures == null)
    			maxSharedStructures = hasSharedStructures ? 32 : 0;
    		if (maxSharedStructures > 8160)
    			throw new Error('Maximum maxSharedStructure is 8160')
    		if (options.structuredClone && options.moreTypes == undefined) {
    			this.moreTypes = true;
    		}
    		let maxOwnStructures = options.maxOwnStructures;
    		if (maxOwnStructures == null)
    			maxOwnStructures = hasSharedStructures ? 32 : 64;
    		if (!this.structures && options.useRecords != false)
    			this.structures = [];
    		// two byte record ids for shared structures
    		let useTwoByteRecords = maxSharedStructures > 32 || (maxOwnStructures + maxSharedStructures > 64);
    		let sharedLimitId = maxSharedStructures + 0x40;
    		let maxStructureId = maxSharedStructures + maxOwnStructures + 0x40;
    		if (maxStructureId > 8256) {
    			throw new Error('Maximum maxSharedStructure + maxOwnStructure is 8192')
    		}
    		let recordIdsToRemove = [];
    		let transitionsCount = 0;
    		let serializationsSinceTransitionRebuild = 0;

    		this.pack = this.encode = function(value, encodeOptions) {
    			if (!target) {
    				target = new ByteArrayAllocate(8192);
    				targetView = target.dataView || (target.dataView = new DataView(target.buffer, 0, 8192));
    				position = 0;
    			}
    			safeEnd = target.length - 10;
    			if (safeEnd - position < 0x800) {
    				// don't start too close to the end,
    				target = new ByteArrayAllocate(target.length);
    				targetView = target.dataView || (target.dataView = new DataView(target.buffer, 0, target.length));
    				safeEnd = target.length - 10;
    				position = 0;
    			} else
    				position = (position + 7) & 0x7ffffff8; // Word align to make any future copying of this buffer faster
    			start = position;
    			if (encodeOptions & RESERVE_START_SPACE) position += (encodeOptions & 0xff);
    			referenceMap = packr.structuredClone ? new Map() : null;
    			if (packr.bundleStrings && typeof value !== 'string') {
    				bundledStrings = [];
    				bundledStrings.size = Infinity; // force a new bundle start on first string
    			} else
    				bundledStrings = null;
    			structures = packr.structures;
    			if (structures) {
    				if (structures.uninitialized)
    					structures = packr._mergeStructures(packr.getStructures());
    				let sharedLength = structures.sharedLength || 0;
    				if (sharedLength > maxSharedStructures) {
    					//if (maxSharedStructures <= 32 && structures.sharedLength > 32) // TODO: could support this, but would need to update the limit ids
    					throw new Error('Shared structures is larger than maximum shared structures, try increasing maxSharedStructures to ' + structures.sharedLength)
    				}
    				if (!structures.transitions) {
    					// rebuild our structure transitions
    					structures.transitions = Object.create(null);
    					for (let i = 0; i < sharedLength; i++) {
    						let keys = structures[i];
    						if (!keys)
    							continue
    						let nextTransition, transition = structures.transitions;
    						for (let j = 0, l = keys.length; j < l; j++) {
    							let key = keys[j];
    							nextTransition = transition[key];
    							if (!nextTransition) {
    								nextTransition = transition[key] = Object.create(null);
    							}
    							transition = nextTransition;
    						}
    						transition[RECORD_SYMBOL] = i + 0x40;
    					}
    					this.lastNamedStructuresLength = sharedLength;
    				}
    				if (!isSequential) {
    					structures.nextId = sharedLength + 0x40;
    				}
    			}
    			if (hasSharedUpdate)
    				hasSharedUpdate = false;
    			let encodingError;
    			try {
    				if (packr.randomAccessStructure && value && value.constructor && value.constructor === Object)
    					writeStruct(value);
    				else
    					pack(value);
    				let lastBundle = bundledStrings;
    				if (bundledStrings)
    					writeBundles(start, pack, 0);
    				if (referenceMap && referenceMap.idsToInsert) {
    					let idsToInsert = referenceMap.idsToInsert.sort((a, b) => a.offset > b.offset ? 1 : -1);
    					let i = idsToInsert.length;
    					let incrementPosition = -1;
    					while (lastBundle && i > 0) {
    						let insertionPoint = idsToInsert[--i].offset + start;
    						if (insertionPoint < (lastBundle.stringsPosition + start) && incrementPosition === -1)
    							incrementPosition = 0;
    						if (insertionPoint > (lastBundle.position + start)) {
    							if (incrementPosition >= 0)
    								incrementPosition += 6;
    						} else {
    							if (incrementPosition >= 0) {
    								// update the bundle reference now
    								targetView.setUint32(lastBundle.position + start,
    									targetView.getUint32(lastBundle.position + start) + incrementPosition);
    								incrementPosition = -1; // reset
    							}
    							lastBundle = lastBundle.previous;
    							i++;
    						}
    					}
    					if (incrementPosition >= 0 && lastBundle) {
    						// update the bundle reference now
    						targetView.setUint32(lastBundle.position + start,
    							targetView.getUint32(lastBundle.position + start) + incrementPosition);
    					}
    					position += idsToInsert.length * 6;
    					if (position > safeEnd)
    						makeRoom(position);
    					packr.offset = position;
    					let serialized = insertIds(target.subarray(start, position), idsToInsert);
    					referenceMap = null;
    					return serialized
    				}
    				packr.offset = position; // update the offset so next serialization doesn't write over our buffer, but can continue writing to same buffer sequentially
    				if (encodeOptions & REUSE_BUFFER_MODE) {
    					target.start = start;
    					target.end = position;
    					return target
    				}
    				return target.subarray(start, position) // position can change if we call pack again in saveStructures, so we get the buffer now
    			} catch(error) {
    				encodingError = error;
    				throw error;
    			} finally {
    				if (structures) {
    					resetStructures();
    					if (hasSharedUpdate && packr.saveStructures) {
    						let sharedLength = structures.sharedLength || 0;
    						// we can't rely on start/end with REUSE_BUFFER_MODE since they will (probably) change when we save
    						let returnBuffer = target.subarray(start, position);
    						let newSharedData = prepareStructures(structures, packr);
    						if (!encodingError) { // TODO: If there is an encoding error, should make the structures as uninitialized so they get rebuilt next time
    							if (packr.saveStructures(newSharedData, newSharedData.isCompatible) === false) {
    								// get updated structures and try again if the update failed
    								return packr.pack(value, encodeOptions)
    							}
    							packr.lastNamedStructuresLength = sharedLength;
    							// don't keep large buffers around
    							if (target.length > 0x40000000) target = null;
    							return returnBuffer
    						}
    					}
    				}
    				// don't keep large buffers around, they take too much memory and cause problems (limit at 1GB)
    				if (target.length > 0x40000000) target = null;
    				if (encodeOptions & RESET_BUFFER_MODE)
    					position = start;
    			}
    		};
    		const resetStructures = () => {
    			if (serializationsSinceTransitionRebuild < 10)
    				serializationsSinceTransitionRebuild++;
    			let sharedLength = structures.sharedLength || 0;
    			if (structures.length > sharedLength && !isSequential)
    				structures.length = sharedLength;
    			if (transitionsCount > 10000) {
    				// force a rebuild occasionally after a lot of transitions so it can get cleaned up
    				structures.transitions = null;
    				serializationsSinceTransitionRebuild = 0;
    				transitionsCount = 0;
    				if (recordIdsToRemove.length > 0)
    					recordIdsToRemove = [];
    			} else if (recordIdsToRemove.length > 0 && !isSequential) {
    				for (let i = 0, l = recordIdsToRemove.length; i < l; i++) {
    					recordIdsToRemove[i][RECORD_SYMBOL] = 0;
    				}
    				recordIdsToRemove = [];
    			}
    		};
    		const packArray = (value) => {
    			var length = value.length;
    			if (length < 0x10) {
    				target[position++] = 0x90 | length;
    			} else if (length < 0x10000) {
    				target[position++] = 0xdc;
    				target[position++] = length >> 8;
    				target[position++] = length & 0xff;
    			} else {
    				target[position++] = 0xdd;
    				targetView.setUint32(position, length);
    				position += 4;
    			}
    			for (let i = 0; i < length; i++) {
    				pack(value[i]);
    			}
    		};
    		const pack = (value) => {
    			if (position > safeEnd)
    				target = makeRoom(position);

    			var type = typeof value;
    			var length;
    			if (type === 'string') {
    				let strLength = value.length;
    				if (bundledStrings && strLength >= 4 && strLength < 0x1000) {
    					if ((bundledStrings.size += strLength) > MAX_BUNDLE_SIZE) {
    						let extStart;
    						let maxBytes = (bundledStrings[0] ? bundledStrings[0].length * 3 + bundledStrings[1].length : 0) + 10;
    						if (position + maxBytes > safeEnd)
    							target = makeRoom(position + maxBytes);
    						let lastBundle;
    						if (bundledStrings.position) { // here we use the 0x62 extension to write the last bundle and reserve space for the reference pointer to the next/current bundle
    							lastBundle = bundledStrings;
    							target[position] = 0xc8; // ext 16
    							position += 3; // reserve for the writing bundle size
    							target[position++] = 0x62; // 'b'
    							extStart = position - start;
    							position += 4; // reserve for writing bundle reference
    							writeBundles(start, pack, 0); // write the last bundles
    							targetView.setUint16(extStart + start - 3, position - start - extStart);
    						} else { // here we use the 0x62 extension just to reserve the space for the reference pointer to the bundle (will be updated once the bundle is written)
    							target[position++] = 0xd6; // fixext 4
    							target[position++] = 0x62; // 'b'
    							extStart = position - start;
    							position += 4; // reserve for writing bundle reference
    						}
    						bundledStrings = ['', '']; // create new ones
    						bundledStrings.previous = lastBundle;
    						bundledStrings.size = 0;
    						bundledStrings.position = extStart;
    					}
    					let twoByte = hasNonLatin.test(value);
    					bundledStrings[twoByte ? 0 : 1] += value;
    					target[position++] = 0xc1;
    					pack(twoByte ? -strLength : strLength);
    					return
    				}
    				let headerSize;
    				// first we estimate the header size, so we can write to the correct location
    				if (strLength < 0x20) {
    					headerSize = 1;
    				} else if (strLength < 0x100) {
    					headerSize = 2;
    				} else if (strLength < 0x10000) {
    					headerSize = 3;
    				} else {
    					headerSize = 5;
    				}
    				let maxBytes = strLength * 3;
    				if (position + maxBytes > safeEnd)
    					target = makeRoom(position + maxBytes);

    				if (strLength < 0x40 || !encodeUtf8) {
    					let i, c1, c2, strPosition = position + headerSize;
    					for (i = 0; i < strLength; i++) {
    						c1 = value.charCodeAt(i);
    						if (c1 < 0x80) {
    							target[strPosition++] = c1;
    						} else if (c1 < 0x800) {
    							target[strPosition++] = c1 >> 6 | 0xc0;
    							target[strPosition++] = c1 & 0x3f | 0x80;
    						} else if (
    							(c1 & 0xfc00) === 0xd800 &&
    							((c2 = value.charCodeAt(i + 1)) & 0xfc00) === 0xdc00
    						) {
    							c1 = 0x10000 + ((c1 & 0x03ff) << 10) + (c2 & 0x03ff);
    							i++;
    							target[strPosition++] = c1 >> 18 | 0xf0;
    							target[strPosition++] = c1 >> 12 & 0x3f | 0x80;
    							target[strPosition++] = c1 >> 6 & 0x3f | 0x80;
    							target[strPosition++] = c1 & 0x3f | 0x80;
    						} else {
    							target[strPosition++] = c1 >> 12 | 0xe0;
    							target[strPosition++] = c1 >> 6 & 0x3f | 0x80;
    							target[strPosition++] = c1 & 0x3f | 0x80;
    						}
    					}
    					length = strPosition - position - headerSize;
    				} else {
    					length = encodeUtf8(value, position + headerSize);
    				}

    				if (length < 0x20) {
    					target[position++] = 0xa0 | length;
    				} else if (length < 0x100) {
    					if (headerSize < 2) {
    						target.copyWithin(position + 2, position + 1, position + 1 + length);
    					}
    					target[position++] = 0xd9;
    					target[position++] = length;
    				} else if (length < 0x10000) {
    					if (headerSize < 3) {
    						target.copyWithin(position + 3, position + 2, position + 2 + length);
    					}
    					target[position++] = 0xda;
    					target[position++] = length >> 8;
    					target[position++] = length & 0xff;
    				} else {
    					if (headerSize < 5) {
    						target.copyWithin(position + 5, position + 3, position + 3 + length);
    					}
    					target[position++] = 0xdb;
    					targetView.setUint32(position, length);
    					position += 4;
    				}
    				position += length;
    			} else if (type === 'number') {
    				if (value >>> 0 === value) {// positive integer, 32-bit or less
    					// positive uint
    					if (value < 0x20 || (value < 0x80 && this.useRecords === false) || (value < 0x40 && !this.randomAccessStructure)) {
    						target[position++] = value;
    					} else if (value < 0x100) {
    						target[position++] = 0xcc;
    						target[position++] = value;
    					} else if (value < 0x10000) {
    						target[position++] = 0xcd;
    						target[position++] = value >> 8;
    						target[position++] = value & 0xff;
    					} else {
    						target[position++] = 0xce;
    						targetView.setUint32(position, value);
    						position += 4;
    					}
    				} else if (value >> 0 === value) { // negative integer
    					if (value >= -32) {
    						target[position++] = 0x100 + value;
    					} else if (value >= -128) {
    						target[position++] = 0xd0;
    						target[position++] = value + 0x100;
    					} else if (value >= -32768) {
    						target[position++] = 0xd1;
    						targetView.setInt16(position, value);
    						position += 2;
    					} else {
    						target[position++] = 0xd2;
    						targetView.setInt32(position, value);
    						position += 4;
    					}
    				} else {
    					let useFloat32;
    					if ((useFloat32 = this.useFloat32) > 0 && value < 0x100000000 && value >= -2147483648) {
    						target[position++] = 0xca;
    						targetView.setFloat32(position, value);
    						let xShifted;
    						if (useFloat32 < 4 ||
    								// this checks for rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
    								((xShifted = value * mult10[((target[position] & 0x7f) << 1) | (target[position + 1] >> 7)]) >> 0) === xShifted) {
    							position += 4;
    							return
    						} else
    							position--; // move back into position for writing a double
    					}
    					target[position++] = 0xcb;
    					targetView.setFloat64(position, value);
    					position += 8;
    				}
    			} else if (type === 'object' || type === 'function') {
    				if (!value)
    					target[position++] = 0xc0;
    				else {
    					if (referenceMap) {
    						let referee = referenceMap.get(value);
    						if (referee) {
    							if (!referee.id) {
    								let idsToInsert = referenceMap.idsToInsert || (referenceMap.idsToInsert = []);
    								referee.id = idsToInsert.push(referee);
    							}
    							target[position++] = 0xd6; // fixext 4
    							target[position++] = 0x70; // "p" for pointer
    							targetView.setUint32(position, referee.id);
    							position += 4;
    							return
    						} else
    							referenceMap.set(value, { offset: position - start });
    					}
    					let constructor = value.constructor;
    					if (constructor === Object) {
    						writeObject(value);
    					} else if (constructor === Array) {
    						packArray(value);
    					} else if (constructor === Map) {
    						if (this.mapAsEmptyObject) target[position++] = 0x80;
    						else {
    							length = value.size;
    							if (length < 0x10) {
    								target[position++] = 0x80 | length;
    							} else if (length < 0x10000) {
    								target[position++] = 0xde;
    								target[position++] = length >> 8;
    								target[position++] = length & 0xff;
    							} else {
    								target[position++] = 0xdf;
    								targetView.setUint32(position, length);
    								position += 4;
    							}
    							for (let [key, entryValue] of value) {
    								pack(key);
    								pack(entryValue);
    							}
    						}
    					} else {
    						for (let i = 0, l = extensions.length; i < l; i++) {
    							let extensionClass = extensionClasses[i];
    							if (value instanceof extensionClass) {
    								let extension = extensions[i];
    								if (extension.write) {
    									if (extension.type) {
    										target[position++] = 0xd4; // one byte "tag" extension
    										target[position++] = extension.type;
    										target[position++] = 0;
    									}
    									let writeResult = extension.write.call(this, value);
    									if (writeResult === value) { // avoid infinite recursion
    										if (Array.isArray(value)) {
    											packArray(value);
    										} else {
    											writeObject(value);
    										}
    									} else {
    										pack(writeResult);
    									}
    									return
    								}
    								let currentTarget = target;
    								let currentTargetView = targetView;
    								let currentPosition = position;
    								target = null;
    								let result;
    								try {
    									result = extension.pack.call(this, value, (size) => {
    										// restore target and use it
    										target = currentTarget;
    										currentTarget = null;
    										position += size;
    										if (position > safeEnd)
    											makeRoom(position);
    										return {
    											target, targetView, position: position - size
    										}
    									}, pack);
    								} finally {
    									// restore current target information (unless already restored)
    									if (currentTarget) {
    										target = currentTarget;
    										targetView = currentTargetView;
    										position = currentPosition;
    										safeEnd = target.length - 10;
    									}
    								}
    								if (result) {
    									if (result.length + position > safeEnd)
    										makeRoom(result.length + position);
    									position = writeExtensionData(result, target, position, extension.type);
    								}
    								return
    							}
    						}
    						// check isArray after extensions, because extensions can extend Array
    						if (Array.isArray(value)) {
    							packArray(value);
    						} else {
    							// use this as an alternate mechanism for expressing how to serialize
    							if (value.toJSON) {
    								const json = value.toJSON();
    								// if for some reason value.toJSON returns itself it'll loop forever
    								if (json !== value)
    									return pack(json)
    							}

    							// if there is a writeFunction, use it, otherwise just encode as undefined
    							if (type === 'function')
    								return pack(this.writeFunction && this.writeFunction(value));

    							// no extension found, write as plain object
    							writeObject(value);
    						}
    					}
    				}
    			} else if (type === 'boolean') {
    				target[position++] = value ? 0xc3 : 0xc2;
    			} else if (type === 'bigint') {
    				if (value < (BigInt(1)<<BigInt(63)) && value >= -(BigInt(1)<<BigInt(63))) {
    					// use a signed int as long as it fits
    					target[position++] = 0xd3;
    					targetView.setBigInt64(position, value);
    				} else if (value < (BigInt(1)<<BigInt(64)) && value > 0) {
    					// if we can fit an unsigned int, use that
    					target[position++] = 0xcf;
    					targetView.setBigUint64(position, value);
    				} else {
    					// overflow
    					if (this.largeBigIntToFloat) {
    						target[position++] = 0xcb;
    						targetView.setFloat64(position, Number(value));
    					} else if (this.largeBigIntToString) {
    						return pack(value.toString());
    					} else if (this.useBigIntExtension && value < BigInt(2)**BigInt(1023) && value > -(BigInt(2)**BigInt(1023))) {
    						target[position++] = 0xc7;
    						position++;
    						target[position++] = 0x42; // "B" for BigInt
    						let bytes = [];
    						let alignedSign;
    						do {
    							let byte = value & BigInt(0xff);
    							alignedSign = (byte & BigInt(0x80)) === (value < BigInt(0) ? BigInt(0x80) : BigInt(0));
    							bytes.push(byte);
    							value >>= BigInt(8);
    						} while (!((value === BigInt(0) || value === BigInt(-1)) && alignedSign));
    						target[position-2] = bytes.length;
    						for (let i = bytes.length; i > 0;) {
    							target[position++] = Number(bytes[--i]);
    						}
    						return
    					} else {
    						throw new RangeError(value + ' was too large to fit in MessagePack 64-bit integer format, use' +
    							' useBigIntExtension, or set largeBigIntToFloat to convert to float-64, or set' +
    							' largeBigIntToString to convert to string')
    					}
    				}
    				position += 8;
    			} else if (type === 'undefined') {
    				if (this.encodeUndefinedAsNil)
    					target[position++] = 0xc0;
    				else {
    					target[position++] = 0xd4; // a number of implementations use fixext1 with type 0, data 0 to denote undefined, so we follow suite
    					target[position++] = 0;
    					target[position++] = 0;
    				}
    			} else {
    				throw new Error('Unknown type: ' + type)
    			}
    		};

    		const writePlainObject = (this.variableMapSize || this.coercibleKeyAsNumber || this.skipValues) ? (object) => {
    			// this method is slightly slower, but generates "preferred serialization" (optimally small for smaller objects)
    			let keys;
    			if (this.skipValues) {
    				keys = [];
    				for (let key in object) {
    					if ((typeof object.hasOwnProperty !== 'function' || object.hasOwnProperty(key)) &&
    						!this.skipValues.includes(object[key]))
    						keys.push(key);
    				}
    			} else {
    				keys = Object.keys(object);
    			}
    			let length = keys.length;
    			if (length < 0x10) {
    				target[position++] = 0x80 | length;
    			} else if (length < 0x10000) {
    				target[position++] = 0xde;
    				target[position++] = length >> 8;
    				target[position++] = length & 0xff;
    			} else {
    				target[position++] = 0xdf;
    				targetView.setUint32(position, length);
    				position += 4;
    			}
    			let key;
    			if (this.coercibleKeyAsNumber) {
    				for (let i = 0; i < length; i++) {
    					key = keys[i];
    					let num = Number(key);
    					pack(isNaN(num) ? key : num);
    					pack(object[key]);
    				}

    			} else {
    				for (let i = 0; i < length; i++) {
    					pack(key = keys[i]);
    					pack(object[key]);
    				}
    			}
    		} :
    		(object) => {
    			target[position++] = 0xde; // always using map 16, so we can preallocate and set the length afterwards
    			let objectOffset = position - start;
    			position += 2;
    			let size = 0;
    			for (let key in object) {
    				if (typeof object.hasOwnProperty !== 'function' || object.hasOwnProperty(key)) {
    					pack(key);
    					pack(object[key]);
    					size++;
    				}
    			}
    			if (size > 0xffff) {
    				throw new Error('Object is too large to serialize with fast 16-bit map size,' +
    				' use the "variableMapSize" option to serialize this object');
    			}
    			target[objectOffset++ + start] = size >> 8;
    			target[objectOffset + start] = size & 0xff;
    		};

    		const writeRecord = this.useRecords === false ? writePlainObject :
    		(options.progressiveRecords && !useTwoByteRecords) ?  // this is about 2% faster for highly stable structures, since it only requires one for-in loop (but much more expensive when new structure needs to be written)
    		(object) => {
    			let nextTransition, transition = structures.transitions || (structures.transitions = Object.create(null));
    			let objectOffset = position++ - start;
    			let wroteKeys;
    			for (let key in object) {
    				if (typeof object.hasOwnProperty !== 'function' || object.hasOwnProperty(key)) {
    					nextTransition = transition[key];
    					if (nextTransition)
    						transition = nextTransition;
    					else {
    						// record doesn't exist, create full new record and insert it
    						let keys = Object.keys(object);
    						let lastTransition = transition;
    						transition = structures.transitions;
    						let newTransitions = 0;
    						for (let i = 0, l = keys.length; i < l; i++) {
    							let key = keys[i];
    							nextTransition = transition[key];
    							if (!nextTransition) {
    								nextTransition = transition[key] = Object.create(null);
    								newTransitions++;
    							}
    							transition = nextTransition;
    						}
    						if (objectOffset + start + 1 == position) {
    							// first key, so we don't need to insert, we can just write record directly
    							position--;
    							newRecord(transition, keys, newTransitions);
    						} else // otherwise we need to insert the record, moving existing data after the record
    							insertNewRecord(transition, keys, objectOffset, newTransitions);
    						wroteKeys = true;
    						transition = lastTransition[key];
    					}
    					pack(object[key]);
    				}
    			}
    			if (!wroteKeys) {
    				let recordId = transition[RECORD_SYMBOL];
    				if (recordId)
    					target[objectOffset + start] = recordId;
    				else
    					insertNewRecord(transition, Object.keys(object), objectOffset, 0);
    			}
    		} :
    		(object) => {
    			let nextTransition, transition = structures.transitions || (structures.transitions = Object.create(null));
    			let newTransitions = 0;
    			for (let key in object) if (typeof object.hasOwnProperty !== 'function' || object.hasOwnProperty(key)) {
    				nextTransition = transition[key];
    				if (!nextTransition) {
    					nextTransition = transition[key] = Object.create(null);
    					newTransitions++;
    				}
    				transition = nextTransition;
    			}
    			let recordId = transition[RECORD_SYMBOL];
    			if (recordId) {
    				if (recordId >= 0x60 && useTwoByteRecords) {
    					target[position++] = ((recordId -= 0x60) & 0x1f) + 0x60;
    					target[position++] = recordId >> 5;
    				} else
    					target[position++] = recordId;
    			} else {
    				newRecord(transition, transition.__keys__ || Object.keys(object), newTransitions);
    			}
    			// now write the values
    			for (let key in object)
    				if (typeof object.hasOwnProperty !== 'function' || object.hasOwnProperty(key)) {
    					pack(object[key]);
    				}
    		};

    		// create reference to useRecords if useRecords is a function
    		const checkUseRecords = typeof this.useRecords == 'function' && this.useRecords;

    		const writeObject = checkUseRecords ? (object) => {
    			checkUseRecords(object) ? writeRecord(object) : writePlainObject(object);
    		} : writeRecord;

    		const makeRoom = (end) => {
    			let newSize;
    			if (end > 0x1000000) {
    				// special handling for really large buffers
    				if ((end - start) > MAX_BUFFER_SIZE)
    					throw new Error('Packed buffer would be larger than maximum buffer size')
    				newSize = Math.min(MAX_BUFFER_SIZE,
    					Math.round(Math.max((end - start) * (end > 0x4000000 ? 1.25 : 2), 0x400000) / 0x1000) * 0x1000);
    			} else // faster handling for smaller buffers
    				newSize = ((Math.max((end - start) << 2, target.length - 1) >> 12) + 1) << 12;
    			let newBuffer = new ByteArrayAllocate(newSize);
    			targetView = newBuffer.dataView || (newBuffer.dataView = new DataView(newBuffer.buffer, 0, newSize));
    			end = Math.min(end, target.length);
    			if (target.copy)
    				target.copy(newBuffer, 0, start, end);
    			else
    				newBuffer.set(target.slice(start, end));
    			position -= start;
    			start = 0;
    			safeEnd = newBuffer.length - 10;
    			return target = newBuffer
    		};
    		const newRecord = (transition, keys, newTransitions) => {
    			let recordId = structures.nextId;
    			if (!recordId)
    				recordId = 0x40;
    			if (recordId < sharedLimitId && this.shouldShareStructure && !this.shouldShareStructure(keys)) {
    				recordId = structures.nextOwnId;
    				if (!(recordId < maxStructureId))
    					recordId = sharedLimitId;
    				structures.nextOwnId = recordId + 1;
    			} else {
    				if (recordId >= maxStructureId)// cycle back around
    					recordId = sharedLimitId;
    				structures.nextId = recordId + 1;
    			}
    			let highByte = keys.highByte = recordId >= 0x60 && useTwoByteRecords ? (recordId - 0x60) >> 5 : -1;
    			transition[RECORD_SYMBOL] = recordId;
    			transition.__keys__ = keys;
    			structures[recordId - 0x40] = keys;

    			if (recordId < sharedLimitId) {
    				keys.isShared = true;
    				structures.sharedLength = recordId - 0x3f;
    				hasSharedUpdate = true;
    				if (highByte >= 0) {
    					target[position++] = (recordId & 0x1f) + 0x60;
    					target[position++] = highByte;
    				} else {
    					target[position++] = recordId;
    				}
    			} else {
    				if (highByte >= 0) {
    					target[position++] = 0xd5; // fixext 2
    					target[position++] = 0x72; // "r" record defintion extension type
    					target[position++] = (recordId & 0x1f) + 0x60;
    					target[position++] = highByte;
    				} else {
    					target[position++] = 0xd4; // fixext 1
    					target[position++] = 0x72; // "r" record defintion extension type
    					target[position++] = recordId;
    				}

    				if (newTransitions)
    					transitionsCount += serializationsSinceTransitionRebuild * newTransitions;
    				// record the removal of the id, we can maintain our shared structure
    				if (recordIdsToRemove.length >= maxOwnStructures)
    					recordIdsToRemove.shift()[RECORD_SYMBOL] = 0; // we are cycling back through, and have to remove old ones
    				recordIdsToRemove.push(transition);
    				pack(keys);
    			}
    		};
    		const insertNewRecord = (transition, keys, insertionOffset, newTransitions) => {
    			let mainTarget = target;
    			let mainPosition = position;
    			let mainSafeEnd = safeEnd;
    			let mainStart = start;
    			target = keysTarget;
    			position = 0;
    			start = 0;
    			if (!target)
    				keysTarget = target = new ByteArrayAllocate(8192);
    			safeEnd = target.length - 10;
    			newRecord(transition, keys, newTransitions);
    			keysTarget = target;
    			let keysPosition = position;
    			target = mainTarget;
    			position = mainPosition;
    			safeEnd = mainSafeEnd;
    			start = mainStart;
    			if (keysPosition > 1) {
    				let newEnd = position + keysPosition - 1;
    				if (newEnd > safeEnd)
    					makeRoom(newEnd);
    				let insertionPosition = insertionOffset + start;
    				target.copyWithin(insertionPosition + keysPosition, insertionPosition + 1, position);
    				target.set(keysTarget.slice(0, keysPosition), insertionPosition);
    				position = newEnd;
    			} else {
    				target[insertionOffset + start] = keysTarget[0];
    			}
    		};
    		const writeStruct = (object) => {
    			let newPosition = writeStructSlots(object, target, start, position, structures, makeRoom, (value, newPosition, notifySharedUpdate) => {
    				if (notifySharedUpdate)
    					return hasSharedUpdate = true;
    				position = newPosition;
    				let startTarget = target;
    				pack(value);
    				resetStructures();
    				if (startTarget !== target) {
    					return { position, targetView, target }; // indicate the buffer was re-allocated
    				}
    				return position;
    			}, this);
    			if (newPosition === 0) // bail and go to a msgpack object
    				return writeObject(object);
    			position = newPosition;
    		};
    	}
    	useBuffer(buffer) {
    		// this means we are finished using our own buffer and we can write over it safely
    		target = buffer;
    		target.dataView || (target.dataView = new DataView(target.buffer, target.byteOffset, target.byteLength));
    		position = 0;
    	}
    	set position (value) {
    		position = value;
    	}
    	get position() {
    		return position;
    	}
    	set buffer (buffer) {
    		target = buffer;
    	}
    	get buffer () {
    		return target;
    	}
    	clearSharedData() {
    		if (this.structures)
    			this.structures = [];
    		if (this.typedStructs)
    			this.typedStructs = [];
    	}
    }

    extensionClasses = [ Date, Set, Error, RegExp, ArrayBuffer, Object.getPrototypeOf(Uint8Array.prototype).constructor /*TypedArray*/, C1Type ];
    extensions = [{
    	pack(date, allocateForWrite, pack) {
    		let seconds = date.getTime() / 1000;
    		if ((this.useTimestamp32 || date.getMilliseconds() === 0) && seconds >= 0 && seconds < 0x100000000) {
    			// Timestamp 32
    			let { target, targetView, position} = allocateForWrite(6);
    			target[position++] = 0xd6;
    			target[position++] = 0xff;
    			targetView.setUint32(position, seconds);
    		} else if (seconds > 0 && seconds < 0x100000000) {
    			// Timestamp 64
    			let { target, targetView, position} = allocateForWrite(10);
    			target[position++] = 0xd7;
    			target[position++] = 0xff;
    			targetView.setUint32(position, date.getMilliseconds() * 4000000 + ((seconds / 1000 / 0x100000000) >> 0));
    			targetView.setUint32(position + 4, seconds);
    		} else if (isNaN(seconds)) {
    			if (this.onInvalidDate) {
    				allocateForWrite(0);
    				return pack(this.onInvalidDate())
    			}
    			// Intentionally invalid timestamp
    			let { target, targetView, position} = allocateForWrite(3);
    			target[position++] = 0xd4;
    			target[position++] = 0xff;
    			target[position++] = 0xff;
    		} else {
    			// Timestamp 96
    			let { target, targetView, position} = allocateForWrite(15);
    			target[position++] = 0xc7;
    			target[position++] = 12;
    			target[position++] = 0xff;
    			targetView.setUint32(position, date.getMilliseconds() * 1000000);
    			targetView.setBigInt64(position + 4, BigInt(Math.floor(seconds)));
    		}
    	}
    }, {
    	pack(set, allocateForWrite, pack) {
    		if (this.setAsEmptyObject) {
    			allocateForWrite(0);
    			return pack({})
    		}
    		let array = Array.from(set);
    		let { target, position} = allocateForWrite(this.moreTypes ? 3 : 0);
    		if (this.moreTypes) {
    			target[position++] = 0xd4;
    			target[position++] = 0x73; // 's' for Set
    			target[position++] = 0;
    		}
    		pack(array);
    	}
    }, {
    	pack(error, allocateForWrite, pack) {
    		let { target, position} = allocateForWrite(this.moreTypes ? 3 : 0);
    		if (this.moreTypes) {
    			target[position++] = 0xd4;
    			target[position++] = 0x65; // 'e' for error
    			target[position++] = 0;
    		}
    		pack([ error.name, error.message, error.cause ]);
    	}
    }, {
    	pack(regex, allocateForWrite, pack) {
    		let { target, position} = allocateForWrite(this.moreTypes ? 3 : 0);
    		if (this.moreTypes) {
    			target[position++] = 0xd4;
    			target[position++] = 0x78; // 'x' for regeXp
    			target[position++] = 0;
    		}
    		pack([ regex.source, regex.flags ]);
    	}
    }, {
    	pack(arrayBuffer, allocateForWrite) {
    		if (this.moreTypes)
    			writeExtBuffer(arrayBuffer, 0x10, allocateForWrite);
    		else
    			writeBuffer(hasNodeBuffer ? Buffer.from(arrayBuffer) : new Uint8Array(arrayBuffer), allocateForWrite);
    	}
    }, {
    	pack(typedArray, allocateForWrite) {
    		let constructor = typedArray.constructor;
    		if (constructor !== ByteArray && this.moreTypes)
    			writeExtBuffer(typedArray, typedArrays.indexOf(constructor.name), allocateForWrite);
    		else
    			writeBuffer(typedArray, allocateForWrite);
    	}
    }, {
    	pack(c1, allocateForWrite) { // specific 0xC1 object
    		let { target, position} = allocateForWrite(1);
    		target[position] = 0xc1;
    	}
    }];

    function writeExtBuffer(typedArray, type, allocateForWrite, encode) {
    	let length = typedArray.byteLength;
    	if (length + 1 < 0x100) {
    		var { target, position } = allocateForWrite(4 + length);
    		target[position++] = 0xc7;
    		target[position++] = length + 1;
    	} else if (length + 1 < 0x10000) {
    		var { target, position } = allocateForWrite(5 + length);
    		target[position++] = 0xc8;
    		target[position++] = (length + 1) >> 8;
    		target[position++] = (length + 1) & 0xff;
    	} else {
    		var { target, position, targetView } = allocateForWrite(7 + length);
    		target[position++] = 0xc9;
    		targetView.setUint32(position, length + 1); // plus one for the type byte
    		position += 4;
    	}
    	target[position++] = 0x74; // "t" for typed array
    	target[position++] = type;
    	if (!typedArray.buffer) typedArray = new Uint8Array(typedArray);
    	target.set(new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength), position);
    }
    function writeBuffer(buffer, allocateForWrite) {
    	let length = buffer.byteLength;
    	var target, position;
    	if (length < 0x100) {
    		var { target, position } = allocateForWrite(length + 2);
    		target[position++] = 0xc4;
    		target[position++] = length;
    	} else if (length < 0x10000) {
    		var { target, position } = allocateForWrite(length + 3);
    		target[position++] = 0xc5;
    		target[position++] = length >> 8;
    		target[position++] = length & 0xff;
    	} else {
    		var { target, position, targetView } = allocateForWrite(length + 5);
    		target[position++] = 0xc6;
    		targetView.setUint32(position, length);
    		position += 4;
    	}
    	target.set(buffer, position);
    }

    function writeExtensionData(result, target, position, type) {
    	let length = result.length;
    	switch (length) {
    		case 1:
    			target[position++] = 0xd4;
    			break
    		case 2:
    			target[position++] = 0xd5;
    			break
    		case 4:
    			target[position++] = 0xd6;
    			break
    		case 8:
    			target[position++] = 0xd7;
    			break
    		case 16:
    			target[position++] = 0xd8;
    			break
    		default:
    			if (length < 0x100) {
    				target[position++] = 0xc7;
    				target[position++] = length;
    			} else if (length < 0x10000) {
    				target[position++] = 0xc8;
    				target[position++] = length >> 8;
    				target[position++] = length & 0xff;
    			} else {
    				target[position++] = 0xc9;
    				target[position++] = length >> 24;
    				target[position++] = (length >> 16) & 0xff;
    				target[position++] = (length >> 8) & 0xff;
    				target[position++] = length & 0xff;
    			}
    	}
    	target[position++] = type;
    	target.set(result, position);
    	position += length;
    	return position
    }

    function insertIds(serialized, idsToInsert) {
    	// insert the ids that need to be referenced for structured clones
    	let nextId;
    	let distanceToMove = idsToInsert.length * 6;
    	let lastEnd = serialized.length - distanceToMove;
    	while (nextId = idsToInsert.pop()) {
    		let offset = nextId.offset;
    		let id = nextId.id;
    		serialized.copyWithin(offset + distanceToMove, offset, lastEnd);
    		distanceToMove -= 6;
    		let position = offset + distanceToMove;
    		serialized[position++] = 0xd6;
    		serialized[position++] = 0x69; // 'i'
    		serialized[position++] = id >> 24;
    		serialized[position++] = (id >> 16) & 0xff;
    		serialized[position++] = (id >> 8) & 0xff;
    		serialized[position++] = id & 0xff;
    		lastEnd = offset;
    	}
    	return serialized
    }

    function writeBundles(start, pack, incrementPosition) {
    	if (bundledStrings.length > 0) {
    		targetView.setUint32(bundledStrings.position + start, position + incrementPosition - bundledStrings.position - start);
    		bundledStrings.stringsPosition = position - start;
    		let writeStrings = bundledStrings;
    		bundledStrings = null;
    		pack(writeStrings[0]);
    		pack(writeStrings[1]);
    	}
    }
    function prepareStructures(structures, packr) {
    	structures.isCompatible = (existingStructures) => {
    		let compatible = !existingStructures || ((packr.lastNamedStructuresLength || 0) === existingStructures.length);
    		if (!compatible) // we want to merge these existing structures immediately since we already have it and we are in the right transaction
    			packr._mergeStructures(existingStructures);
    		return compatible;
    	};
    	return structures
    }

    let defaultPackr = new Packr({ useRecords: false });
    defaultPackr.pack;
    defaultPackr.pack;
    const REUSE_BUFFER_MODE = 512;
    const RESET_BUFFER_MODE = 1024;
    const RESERVE_START_SPACE = 2048;

    class Room {
        constructor(name, rootSchema) {
            // Public signals
            this.onStateChange = createSignal();
            this.onError = createSignal();
            this.onLeave = createSignal();
            this.onJoin = createSignal();
            this.hasJoined = false;
            this.onMessageHandlers = createNanoEvents();
            this.roomId = null;
            this.name = name;
            this.packr = new Packr();
            // msgpackr workaround: force buffer to be created.
            this.packr.encode(undefined);
            if (rootSchema) {
                this.serializer = new (getSerializer("schema"));
                this.rootSchema = rootSchema;
                this.serializer.state = new rootSchema();
            }
            this.onError((code, message) => { var _a; return (_a = console.warn) === null || _a === void 0 ? void 0 : _a.call(console, `colyseus.js - onError => (${code}) ${message}`); });
            this.onLeave(() => this.removeAllListeners());
        }
        connect(endpoint, devModeCloseCallback, room = this, // when reconnecting on devMode, re-use previous room intance for handling events.
        options, headers) {
            const connection = new Connection(options.protocol);
            room.connection = connection;
            connection.events.onmessage = Room.prototype.onMessageCallback.bind(room);
            connection.events.onclose = function (e) {
                var _a;
                if (!room.hasJoined) {
                    (_a = console.warn) === null || _a === void 0 ? void 0 : _a.call(console, `Room connection was closed unexpectedly (${e.code}): ${e.reason}`);
                    room.onError.invoke(e.code, e.reason);
                    return;
                }
                if (e.code === CloseCode.DEVMODE_RESTART && devModeCloseCallback) {
                    devModeCloseCallback();
                }
                else {
                    room.onLeave.invoke(e.code, e.reason);
                    room.destroy();
                }
            };
            connection.events.onerror = function (e) {
                var _a;
                (_a = console.warn) === null || _a === void 0 ? void 0 : _a.call(console, `Room, onError (${e.code}): ${e.reason}`);
                room.onError.invoke(e.code, e.reason);
            };
            // FIXME: refactor this.
            if (options.protocol === "h3") {
                const url = new URL(endpoint);
                connection.connect(url.origin, options);
            }
            else {
                connection.connect(endpoint, headers);
            }
        }
        leave(consented = true) {
            return new Promise((resolve) => {
                this.onLeave((code) => resolve(code));
                if (this.connection) {
                    if (consented) {
                        this.packr.buffer[0] = exports.Protocol.LEAVE_ROOM;
                        this.connection.send(this.packr.buffer.subarray(0, 1));
                    }
                    else {
                        this.connection.close();
                    }
                }
                else {
                    this.onLeave.invoke(CloseCode.CONSENTED);
                }
            });
        }
        onMessage(type, callback) {
            return this.onMessageHandlers.on(this.getMessageHandlerKey(type), callback);
        }
        send(type, message) {
            const it = { offset: 1 };
            this.packr.buffer[0] = exports.Protocol.ROOM_DATA;
            if (typeof (type) === "string") {
                umdExports.encode.string(this.packr.buffer, type, it);
            }
            else {
                umdExports.encode.number(this.packr.buffer, type, it);
            }
            // force packr to use beginning of the buffer
            this.packr.position = 0;
            const data = (message !== undefined)
                ? this.packr.pack(message, 2048 + it.offset) // 2048 = RESERVE_START_SPACE
                : this.packr.buffer.subarray(0, it.offset);
            this.connection.send(data);
        }
        sendUnreliable(type, message) {
            const it = { offset: 1 };
            this.packr.buffer[0] = exports.Protocol.ROOM_DATA;
            if (typeof (type) === "string") {
                umdExports.encode.string(this.packr.buffer, type, it);
            }
            else {
                umdExports.encode.number(this.packr.buffer, type, it);
            }
            // force packr to use beginning of the buffer
            this.packr.position = 0;
            const data = (message !== undefined)
                ? this.packr.pack(message, 2048 + it.offset) // 2048 = RESERVE_START_SPACE
                : this.packr.buffer.subarray(0, it.offset);
            this.connection.sendUnreliable(data);
        }
        sendBytes(type, bytes) {
            const it = { offset: 1 };
            this.packr.buffer[0] = exports.Protocol.ROOM_DATA_BYTES;
            if (typeof (type) === "string") {
                umdExports.encode.string(this.packr.buffer, type, it);
            }
            else {
                umdExports.encode.number(this.packr.buffer, type, it);
            }
            // check if buffer needs to be resized
            // TODO: can we avoid this?
            if (bytes.byteLength + it.offset > this.packr.buffer.byteLength) {
                const newBuffer = new Uint8Array(it.offset + bytes.byteLength);
                newBuffer.set(this.packr.buffer);
                this.packr.useBuffer(newBuffer);
            }
            this.packr.buffer.set(bytes, it.offset);
            this.connection.send(this.packr.buffer.subarray(0, it.offset + bytes.byteLength));
        }
        get state() {
            return this.serializer.getState();
        }
        removeAllListeners() {
            this.onJoin.clear();
            this.onStateChange.clear();
            this.onError.clear();
            this.onLeave.clear();
            this.onMessageHandlers.events = {};
            if (this.serializer instanceof SchemaSerializer) {
                // Remove callback references
                this.serializer.decoder.root.callbacks = {};
            }
        }
        onMessageCallback(event) {
            const buffer = new Uint8Array(event.data);
            const it = { offset: 1 };
            const code = buffer[0];
            if (code === exports.Protocol.JOIN_ROOM) {
                const reconnectionToken = umdExports.decode.utf8Read(buffer, it, buffer[it.offset++]);
                this.serializerId = umdExports.decode.utf8Read(buffer, it, buffer[it.offset++]);
                // Instantiate serializer if not locally available.
                if (!this.serializer) {
                    const serializer = getSerializer(this.serializerId);
                    this.serializer = new serializer();
                }
                if (buffer.byteLength > it.offset && this.serializer.handshake) {
                    this.serializer.handshake(buffer, it);
                }
                this.reconnectionToken = `${this.roomId}:${reconnectionToken}`;
                this.hasJoined = true;
                this.onJoin.invoke();
                // acknowledge successfull JOIN_ROOM
                this.packr.buffer[0] = exports.Protocol.JOIN_ROOM;
                this.connection.send(this.packr.buffer.subarray(0, 1));
            }
            else if (code === exports.Protocol.ERROR) {
                const code = umdExports.decode.number(buffer, it);
                const message = umdExports.decode.string(buffer, it);
                this.onError.invoke(code, message);
            }
            else if (code === exports.Protocol.LEAVE_ROOM) {
                this.leave();
            }
            else if (code === exports.Protocol.ROOM_STATE) {
                this.serializer.setState(buffer, it);
                this.onStateChange.invoke(this.serializer.getState());
            }
            else if (code === exports.Protocol.ROOM_STATE_PATCH) {
                this.serializer.patch(buffer, it);
                this.onStateChange.invoke(this.serializer.getState());
            }
            else if (code === exports.Protocol.ROOM_DATA) {
                const type = (umdExports.decode.stringCheck(buffer, it))
                    ? umdExports.decode.string(buffer, it)
                    : umdExports.decode.number(buffer, it);
                const message = (buffer.byteLength > it.offset)
                    ? unpack(buffer, { start: it.offset })
                    : undefined;
                this.dispatchMessage(type, message);
            }
            else if (code === exports.Protocol.ROOM_DATA_BYTES) {
                const type = (umdExports.decode.stringCheck(buffer, it))
                    ? umdExports.decode.string(buffer, it)
                    : umdExports.decode.number(buffer, it);
                this.dispatchMessage(type, buffer.subarray(it.offset));
            }
        }
        dispatchMessage(type, message) {
            var _a;
            const messageType = this.getMessageHandlerKey(type);
            if (this.onMessageHandlers.events[messageType]) {
                this.onMessageHandlers.emit(messageType, message);
            }
            else if (this.onMessageHandlers.events['*']) {
                this.onMessageHandlers.emit('*', type, message);
            }
            else {
                (_a = console.warn) === null || _a === void 0 ? void 0 : _a.call(console, `colyseus.js: onMessage() not registered for type '${type}'.`);
            }
        }
        destroy() {
            if (this.serializer) {
                this.serializer.teardown();
            }
        }
        getMessageHandlerKey(type) {
            switch (typeof (type)) {
                // string
                case "string": return type;
                // number
                case "number": return `i${type}`;
                default: throw new Error("invalid message type.");
            }
        }
    }

    var fetch$1 = {};

    var hasRequiredFetch;

    function requireFetch () {
    	if (hasRequiredFetch) return fetch$1;
    	hasRequiredFetch = 1;
    	function apply(src, tar) {
    		tar.statusMessage = src.statusText;
    		tar.statusCode = src.status;
    		tar.data = src.body;
    	}

    	function send(method, uri, opts) {
    		opts = opts || {};
    		var timer, ctrl, tmp=opts.body;

    		opts.method = method;
    		opts.headers = opts.headers || {};

    		if (tmp instanceof FormData) ; else if (tmp && typeof tmp == 'object') {
    			opts.headers['content-type'] = 'application/json';
    			opts.body = JSON.stringify(tmp);
    		}

    		if (opts.withCredentials) {
    			opts.credentials = 'include';
    		}

    		if (opts.timeout) {
    			ctrl = new AbortController;
    			opts.signal = ctrl.signal;
    			timer = setTimeout(ctrl.abort, opts.timeout);
    		}

    		return new Promise((res, rej) => {
    			fetch(uri, opts).then((rr, reply) => {
    				clearTimeout(timer);

    				apply(rr, rr); //=> rr.headers
    				reply = rr.status >= 400 ? rej : res;

    				tmp = rr.headers.get('content-type');
    				if (!tmp || !~tmp.indexOf('application/json')) {
    					reply(rr);
    				} else {
    					rr.text().then(str => {
    						try {
    							rr.data = JSON.parse(str, opts.reviver);
    							reply(rr);
    						} catch (err) {
    							err.headers = rr.headers;
    							apply(rr, err);
    							rej(err);
    						}
    					});
    				}
    			}).catch(err => {
    				err.timeout = ctrl && ctrl.signal.aborted;
    				rej(err);
    			});
    		});
    	}

    	var get = /*#__PURE__*/ send.bind(send, 'GET');
    	var post = /*#__PURE__*/ send.bind(send, 'POST');
    	var patch = /*#__PURE__*/ send.bind(send, 'PATCH');
    	var del = /*#__PURE__*/ send.bind(send, 'DELETE');
    	var put = /*#__PURE__*/ send.bind(send, 'PUT');

    	fetch$1.del = del;
    	fetch$1.get = get;
    	fetch$1.patch = patch;
    	fetch$1.post = post;
    	fetch$1.put = put;
    	fetch$1.send = send;
    	return fetch$1;
    }

    var fetchExports = requireFetch();
    var index = /*@__PURE__*/getDefaultExportFromCjs(fetchExports);

    var httpie = /*#__PURE__*/_mergeNamespaces({
        __proto__: null,
        default: index
    }, [fetchExports]);

    class HTTP {
        constructor(client, headers = {}) {
            this.client = client;
            this.headers = headers;
        }
        get(path, options = {}) {
            return this.request("get", path, options);
        }
        post(path, options = {}) {
            return this.request("post", path, options);
        }
        del(path, options = {}) {
            return this.request("del", path, options);
        }
        put(path, options = {}) {
            return this.request("put", path, options);
        }
        request(method, path, options = {}) {
            return httpie[method](this.client['getHttpEndpoint'](path), this.getOptions(options)).catch((e) => {
                var _a;
                const status = e.statusCode; //  || -1
                const message = ((_a = e.data) === null || _a === void 0 ? void 0 : _a.error) || e.statusMessage || e.message; //  || "offline"
                if (!status && !message) {
                    throw e;
                }
                throw new ServerError(status, message);
            });
        }
        getOptions(options) {
            // merge default custom headers with user headers
            options.headers = Object.assign({}, this.headers, options.headers);
            if (this.authToken) {
                options.headers['Authorization'] = `Bearer ${this.authToken}`;
            }
            if (typeof (cc) !== 'undefined' && cc.sys && cc.sys.isNative) ;
            else {
                // always include credentials
                options.withCredentials = true;
            }
            return options;
        }
    }

    /// <reference path="../typings/cocos-creator.d.ts" />
    /**
     * We do not assign 'storage' to window.localStorage immediatelly for React
     * Native compatibility. window.localStorage is not present when this module is
     * loaded.
     */
    let storage;
    function getStorage() {
        if (!storage) {
            try {
                storage = (typeof (cc) !== 'undefined' && cc.sys && cc.sys.localStorage)
                    ? cc.sys.localStorage // compatibility with cocos creator
                    : window.localStorage; // RN does have window object at this point, but localStorage is not defined
            }
            catch (e) {
                // ignore error
            }
        }
        if (!storage && typeof (globalThis.indexedDB) !== 'undefined') {
            storage = new IndexedDBStorage();
        }
        if (!storage) {
            // mock localStorage if not available (Node.js or RN environment)
            storage = {
                cache: {},
                setItem: function (key, value) { this.cache[key] = value; },
                getItem: function (key) { this.cache[key]; },
                removeItem: function (key) { delete this.cache[key]; },
            };
        }
        return storage;
    }
    function setItem(key, value) {
        getStorage().setItem(key, value);
    }
    function removeItem(key) {
        getStorage().removeItem(key);
    }
    function getItem(key, callback) {
        const value = getStorage().getItem(key);
        if (typeof (Promise) === 'undefined' || // old browsers
            !(value instanceof Promise)) {
            // browser has synchronous return
            callback(value);
        }
        else {
            // react-native is asynchronous
            value.then((id) => callback(id));
        }
    }
    /**
     * When running in a Web Worker, we need to use IndexedDB to store data.
     */
    class IndexedDBStorage {
        constructor() {
            this.dbPromise = new Promise((resolve) => {
                const request = indexedDB.open('_colyseus_storage', 1);
                request.onupgradeneeded = () => request.result.createObjectStore('store');
                request.onsuccess = () => resolve(request.result);
            });
        }
        tx(mode, fn) {
            return __awaiter(this, void 0, void 0, function* () {
                const db = yield this.dbPromise;
                const store = db.transaction('store', mode).objectStore('store');
                return fn(store);
            });
        }
        setItem(key, value) {
            return this.tx('readwrite', store => store.put(value, key)).then();
        }
        getItem(key) {
            return __awaiter(this, void 0, void 0, function* () {
                const request = yield this.tx('readonly', store => store.get(key));
                return new Promise((resolve) => {
                    request.onsuccess = () => resolve(request.result);
                });
            });
        }
        removeItem(key) {
            return this.tx('readwrite', store => store.delete(key)).then();
        }
    }

    var _Auth__initialized, _Auth__initializationPromise, _Auth__signInWindow, _Auth__events;
    class Auth {
        constructor(http) {
            this.http = http;
            this.settings = {
                path: "/auth",
                key: "colyseus-auth-token",
            };
            _Auth__initialized.set(this, false);
            _Auth__initializationPromise.set(this, void 0);
            _Auth__signInWindow.set(this, undefined);
            _Auth__events.set(this, createNanoEvents());
            getItem(this.settings.key, (token) => this.token = token);
        }
        set token(token) {
            this.http.authToken = token;
        }
        get token() {
            return this.http.authToken;
        }
        onChange(callback) {
            const unbindChange = __classPrivateFieldGet(this, _Auth__events, "f").on("change", callback);
            if (!__classPrivateFieldGet(this, _Auth__initialized, "f")) {
                __classPrivateFieldSet(this, _Auth__initializationPromise, new Promise((resolve, reject) => {
                    this.getUserData().then((userData) => {
                        this.emitChange(Object.assign(Object.assign({}, userData), { token: this.token }));
                    }).catch((e) => {
                        // user is not logged in, or service is down
                        this.emitChange({ user: null, token: undefined });
                    }).finally(() => {
                        resolve();
                    });
                }), "f");
            }
            __classPrivateFieldSet(this, _Auth__initialized, true, "f");
            return unbindChange;
        }
        getUserData() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.token) {
                    return (yield this.http.get(`${this.settings.path}/userdata`)).data;
                }
                else {
                    throw new Error("missing auth.token");
                }
            });
        }
        registerWithEmailAndPassword(email, password, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const data = (yield this.http.post(`${this.settings.path}/register`, {
                    body: { email, password, options, },
                })).data;
                this.emitChange(data);
                return data;
            });
        }
        signInWithEmailAndPassword(email, password) {
            return __awaiter(this, void 0, void 0, function* () {
                const data = (yield this.http.post(`${this.settings.path}/login`, {
                    body: { email, password, },
                })).data;
                this.emitChange(data);
                return data;
            });
        }
        signInAnonymously(options) {
            return __awaiter(this, void 0, void 0, function* () {
                const data = (yield this.http.post(`${this.settings.path}/anonymous`, {
                    body: { options, }
                })).data;
                this.emitChange(data);
                return data;
            });
        }
        sendPasswordResetEmail(email) {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this.http.post(`${this.settings.path}/forgot-password`, {
                    body: { email, }
                })).data;
            });
        }
        signInWithProvider(providerName_1) {
            return __awaiter(this, arguments, void 0, function* (providerName, settings = {}) {
                return new Promise((resolve, reject) => {
                    const w = settings.width || 480;
                    const h = settings.height || 768;
                    // forward existing token for upgrading
                    const upgradingToken = this.token ? `?token=${this.token}` : "";
                    // Capitalize first letter of providerName
                    const title = `Login with ${(providerName[0].toUpperCase() + providerName.substring(1))}`;
                    const url = this.http['client']['getHttpEndpoint'](`${(settings.prefix || `${this.settings.path}/provider`)}/${providerName}${upgradingToken}`);
                    const left = (screen.width / 2) - (w / 2);
                    const top = (screen.height / 2) - (h / 2);
                    __classPrivateFieldSet(this, _Auth__signInWindow, window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left), "f");
                    const onMessage = (event) => {
                        // TODO: it is a good idea to check if event.origin can be trusted!
                        // if (event.origin.indexOf(window.location.hostname) === -1) { return; }
                        // require 'user' and 'token' inside received data.
                        if (event.data.user === undefined && event.data.token === undefined) {
                            return;
                        }
                        clearInterval(rejectionChecker);
                        __classPrivateFieldGet(this, _Auth__signInWindow, "f").close();
                        __classPrivateFieldSet(this, _Auth__signInWindow, undefined, "f");
                        window.removeEventListener("message", onMessage);
                        if (event.data.error !== undefined) {
                            reject(event.data.error);
                        }
                        else {
                            resolve(event.data);
                            this.emitChange(event.data);
                        }
                    };
                    const rejectionChecker = setInterval(() => {
                        if (!__classPrivateFieldGet(this, _Auth__signInWindow, "f") || __classPrivateFieldGet(this, _Auth__signInWindow, "f").closed) {
                            __classPrivateFieldSet(this, _Auth__signInWindow, undefined, "f");
                            reject("cancelled");
                            window.removeEventListener("message", onMessage);
                        }
                    }, 200);
                    window.addEventListener("message", onMessage);
                });
            });
        }
        signOut() {
            return __awaiter(this, void 0, void 0, function* () {
                this.emitChange({ user: null, token: null });
            });
        }
        emitChange(authData) {
            if (authData.token !== undefined) {
                this.token = authData.token;
                if (authData.token === null) {
                    removeItem(this.settings.key);
                }
                else {
                    // store key in localStorage
                    setItem(this.settings.key, authData.token);
                }
            }
            __classPrivateFieldGet(this, _Auth__events, "f").emit("change", authData);
        }
    }
    _Auth__initialized = new WeakMap(), _Auth__initializationPromise = new WeakMap(), _Auth__signInWindow = new WeakMap(), _Auth__events = new WeakMap();

    /**
     * Discord Embedded App SDK
     * https://github.com/colyseus/colyseus/issues/707
     *
     * All URLs must go through the local proxy from
     * https://<app_id>.discordsays.com/.proxy/<mapped_url>/...
     *
     * URL Mapping Examples:
     *
     * 1. Using Colyseus Cloud:
     *   - /colyseus/{subdomain} -> {subdomain}.colyseus.cloud
     *
     *   Example:
     *     const client = new Client("https://xxxx.colyseus.cloud");
     *
     * -------------------------------------------------------------
     *
     * 2. Using `cloudflared` tunnel:
     *   - /colyseus/ -> <your-cloudflared-url>.trycloudflare.com
     *
     *   Example:
     *     const client = new Client("https://<your-cloudflared-url>.trycloudflare.com");
     *
     * -------------------------------------------------------------
     *
     * 3. Providing a manual /.proxy/your-mapping:
     *   - /your-mapping/ -> your-endpoint.com
     *
     *   Example:
     *     const client = new Client("/.proxy/your-mapping");
     *
     */
    function discordURLBuilder(url) {
        var _a;
        const localHostname = ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.hostname) || "localhost";
        const remoteHostnameSplitted = url.hostname.split('.');
        const subdomain = (!url.hostname.includes("trycloudflare.com") && // ignore cloudflared subdomains
            !url.hostname.includes("discordsays.com") && // ignore discordsays.com subdomains
            remoteHostnameSplitted.length > 2)
            ? `/${remoteHostnameSplitted[0]}`
            : '';
        return (url.pathname.startsWith("/.proxy"))
            ? `${url.protocol}//${localHostname}${subdomain}${url.pathname}${url.search}`
            : `${url.protocol}//${localHostname}/.proxy/colyseus${subdomain}${url.pathname}${url.search}`;
    }

    var _a;
    class MatchMakeError extends Error {
        constructor(message, code) {
            super(message);
            this.code = code;
            this.name = "MatchMakeError";
            Object.setPrototypeOf(this, MatchMakeError.prototype);
        }
    }
    // - React Native does not provide `window.location`
    // - Cocos Creator (Native) does not provide `window.location.hostname`
    const DEFAULT_ENDPOINT = (typeof (window) !== "undefined" && typeof ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.hostname) !== "undefined")
        ? `${window.location.protocol.replace("http", "ws")}//${window.location.hostname}${(window.location.port && `:${window.location.port}`)}`
        : "ws://127.0.0.1:2567";
    class Client {
        constructor(settings = DEFAULT_ENDPOINT, options) {
            var _a, _b;
            if (typeof (settings) === "string") {
                //
                // endpoint by url
                //
                const url = (settings.startsWith("/"))
                    ? new URL(settings, DEFAULT_ENDPOINT)
                    : new URL(settings);
                const secure = (url.protocol === "https:" || url.protocol === "wss:");
                const port = Number(url.port || (secure ? 443 : 80));
                this.settings = {
                    hostname: url.hostname,
                    pathname: url.pathname,
                    port,
                    secure
                };
            }
            else {
                //
                // endpoint by settings
                //
                if (settings.port === undefined) {
                    settings.port = (settings.secure) ? 443 : 80;
                }
                if (settings.pathname === undefined) {
                    settings.pathname = "";
                }
                this.settings = settings;
            }
            // make sure pathname does not end with "/"
            if (this.settings.pathname.endsWith("/")) {
                this.settings.pathname = this.settings.pathname.slice(0, -1);
            }
            this.http = new HTTP(this, (options === null || options === void 0 ? void 0 : options.headers) || {});
            this.auth = new Auth(this.http);
            this.urlBuilder = options === null || options === void 0 ? void 0 : options.urlBuilder;
            //
            // Discord Embedded SDK requires a custom URL builder
            //
            if (!this.urlBuilder &&
                typeof (window) !== "undefined" &&
                ((_b = (_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.hostname) === null || _b === void 0 ? void 0 : _b.includes("discordsays.com"))) {
                this.urlBuilder = discordURLBuilder;
                console.log("Colyseus SDK: Discord Embedded SDK detected. Using custom URL builder.");
            }
        }
        joinOrCreate(roomName_1) {
            return __awaiter(this, arguments, void 0, function* (roomName, options = {}, rootSchema) {
                return yield this.createMatchMakeRequest('joinOrCreate', roomName, options, rootSchema);
            });
        }
        create(roomName_1) {
            return __awaiter(this, arguments, void 0, function* (roomName, options = {}, rootSchema) {
                return yield this.createMatchMakeRequest('create', roomName, options, rootSchema);
            });
        }
        join(roomName_1) {
            return __awaiter(this, arguments, void 0, function* (roomName, options = {}, rootSchema) {
                return yield this.createMatchMakeRequest('join', roomName, options, rootSchema);
            });
        }
        joinById(roomId_1) {
            return __awaiter(this, arguments, void 0, function* (roomId, options = {}, rootSchema) {
                return yield this.createMatchMakeRequest('joinById', roomId, options, rootSchema);
            });
        }
        /**
         * Re-establish connection with a room this client was previously connected to.
         *
         * @param reconnectionToken The `room.reconnectionToken` from previously connected room.
         * @param rootSchema (optional) Concrete root schema definition
         * @returns Promise<Room>
         */
        reconnect(reconnectionToken, rootSchema) {
            return __awaiter(this, void 0, void 0, function* () {
                if (typeof (reconnectionToken) === "string" && typeof (rootSchema) === "string") {
                    throw new Error("DEPRECATED: .reconnect() now only accepts 'reconnectionToken' as argument.\nYou can get this token from previously connected `room.reconnectionToken`");
                }
                const [roomId, token] = reconnectionToken.split(":");
                if (!roomId || !token) {
                    throw new Error("Invalid reconnection token format.\nThe format should be roomId:reconnectionToken");
                }
                return yield this.createMatchMakeRequest('reconnect', roomId, { reconnectionToken: token }, rootSchema);
            });
        }
        consumeSeatReservation(response, rootSchema, reuseRoomInstance // used in devMode
        ) {
            return __awaiter(this, void 0, void 0, function* () {
                const room = this.createRoom(response.room.name, rootSchema);
                room.roomId = response.room.roomId;
                room.sessionId = response.sessionId;
                const options = { sessionId: room.sessionId };
                // forward "reconnection token" in case of reconnection.
                if (response.reconnectionToken) {
                    options.reconnectionToken = response.reconnectionToken;
                }
                const targetRoom = reuseRoomInstance || room;
                room.connect(this.buildEndpoint(response.room, options, response.protocol), response.devMode && (() => __awaiter(this, void 0, void 0, function* () {
                    console.info(`[Colyseus devMode]: ${String.fromCodePoint(0x1F504)} Re-establishing connection with room id '${room.roomId}'...`); // 🔄
                    let retryCount = 0;
                    let retryMaxRetries = 8;
                    const retryReconnection = () => __awaiter(this, void 0, void 0, function* () {
                        retryCount++;
                        try {
                            yield this.consumeSeatReservation(response, rootSchema, targetRoom);
                            console.info(`[Colyseus devMode]: ${String.fromCodePoint(0x2705)} Successfully re-established connection with room '${room.roomId}'`); // ✅
                        }
                        catch (e) {
                            if (retryCount < retryMaxRetries) {
                                console.info(`[Colyseus devMode]: ${String.fromCodePoint(0x1F504)} retrying... (${retryCount} out of ${retryMaxRetries})`); // 🔄
                                setTimeout(retryReconnection, 2000);
                            }
                            else {
                                console.info(`[Colyseus devMode]: ${String.fromCodePoint(0x274C)} Failed to reconnect. Is your server running? Please check server logs.`); // ❌
                            }
                        }
                    });
                    setTimeout(retryReconnection, 2000);
                })), targetRoom, response, this.http.headers);
                return new Promise((resolve, reject) => {
                    const onError = (code, message) => reject(new ServerError(code, message));
                    targetRoom.onError.once(onError);
                    targetRoom['onJoin'].once(() => {
                        targetRoom.onError.remove(onError);
                        resolve(targetRoom);
                    });
                });
            });
        }
        createMatchMakeRequest(method_1, roomName_1) {
            return __awaiter(this, arguments, void 0, function* (method, roomName, options = {}, rootSchema, reuseRoomInstance) {
                const response = (yield this.http.post(`matchmake/${method}/${roomName}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(options)
                })).data;
                // FIXME: HTTP class is already handling this as ServerError.
                // @ts-ignore
                if (response.error) {
                    throw new MatchMakeError(response.error, response.code);
                }
                // forward reconnection token during "reconnect" methods.
                if (method === "reconnect") {
                    response.reconnectionToken = options.reconnectionToken;
                }
                return yield this.consumeSeatReservation(response, rootSchema, reuseRoomInstance);
            });
        }
        createRoom(roomName, rootSchema) {
            return new Room(roomName, rootSchema);
        }
        buildEndpoint(room, options = {}, protocol = "ws") {
            const params = [];
            // append provided options
            for (const name in options) {
                if (!options.hasOwnProperty(name)) {
                    continue;
                }
                params.push(`${name}=${options[name]}`);
            }
            if (protocol === "h3") {
                protocol = "http";
            }
            let endpoint = (this.settings.secure)
                ? `${protocol}s://`
                : `${protocol}://`;
            if (room.publicAddress) {
                endpoint += `${room.publicAddress}`;
            }
            else {
                endpoint += `${this.settings.hostname}${this.getEndpointPort()}${this.settings.pathname}`;
            }
            const endpointURL = `${endpoint}/${room.processId}/${room.roomId}?${params.join('&')}`;
            return (this.urlBuilder)
                ? this.urlBuilder(new URL(endpointURL))
                : endpointURL;
        }
        getHttpEndpoint(segments = '') {
            const path = segments.startsWith("/") ? segments : `/${segments}`;
            const endpointURL = `${(this.settings.secure) ? "https" : "http"}://${this.settings.hostname}${this.getEndpointPort()}${this.settings.pathname}${path}`;
            return (this.urlBuilder)
                ? this.urlBuilder(new URL(endpointURL))
                : endpointURL;
        }
        getEndpointPort() {
            return (this.settings.port !== 80 && this.settings.port !== 443)
                ? `:${this.settings.port}`
                : "";
        }
    }
    Client.VERSION = "0.16.16";

    class NoneSerializer {
        setState(rawState) { }
        getState() { return null; }
        patch(patches) { }
        teardown() { }
        handshake(bytes) { }
    }

    registerSerializer('schema', SchemaSerializer);
    registerSerializer('none', NoneSerializer);

    exports.Auth = Auth;
    exports.Client = Client;
    exports.MatchMakeError = MatchMakeError;
    exports.Room = Room;
    exports.SchemaSerializer = SchemaSerializer;
    exports.ServerError = ServerError;
    exports.getStateCallbacks = getStateCallbacks;
    exports.registerSerializer = registerSerializer;

}));
//# sourceMappingURL=colyseus.js.map
