"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPasswordHash = exports.errorReturn = exports.SECRET = void 0;
const crypto_1 = __importDefault(require("crypto"));
const http_errors_1 = __importDefault(require("http-errors"));
const dataStore_1 = require("./dataStore");
exports.SECRET = 'CookiesWillRuleTheWorld';
const errorReturn = (status, error) => {
    (0, dataStore_1.saveDataStore)();
    throw (0, http_errors_1.default)(status, error);
};
exports.errorReturn = errorReturn;
const getPasswordHash = (plaintext) => {
    return crypto_1.default.createHash('sha256').update(plaintext + exports.SECRET).digest('hex');
};
exports.getPasswordHash = getPasswordHash;
