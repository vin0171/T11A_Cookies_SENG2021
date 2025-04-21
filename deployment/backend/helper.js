"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPasswordHash = exports.SECRET = void 0;
const crypto_1 = __importDefault(require("crypto"));
exports.SECRET = 'CookiesWillRuleTheWorld';
const getPasswordHash = (plaintext) => {
    return crypto_1.default.createHash('sha256').update(plaintext + exports.SECRET).digest('hex');
};
exports.getPasswordHash = getPasswordHash;
