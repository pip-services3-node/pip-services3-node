"use strict";
/**
 * @module mustache
 * @preferred
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MustacheTemplate = exports.MustacheException = void 0;
__exportStar(require("./tokenizers"), exports);
__exportStar(require("./parsers"), exports);
var MustacheException_1 = require("./MustacheException");
Object.defineProperty(exports, "MustacheException", { enumerable: true, get: function () { return MustacheException_1.MustacheException; } });
var MustacheTemplate_1 = require("./MustacheTemplate");
Object.defineProperty(exports, "MustacheTemplate", { enumerable: true, get: function () { return MustacheTemplate_1.MustacheTemplate; } });
//# sourceMappingURL=index.js.map