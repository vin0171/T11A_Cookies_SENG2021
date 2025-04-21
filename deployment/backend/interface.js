"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = exports.Gender = exports.InvoiceState = exports.InvoiceStatus = void 0;
const promises_1 = require("inspector/promises");
Object.defineProperty(exports, "Session", { enumerable: true, get: function () { return promises_1.Session; } });
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["DRAFT"] = "DRAFT";
    InvoiceStatus["SENT"] = "SENT";
    InvoiceStatus["PAID"] = "PAID";
    InvoiceStatus["CANCELLED"] = "CANCELLED";
})(InvoiceStatus || (exports.InvoiceStatus = InvoiceStatus = {}));
var InvoiceState;
(function (InvoiceState) {
    InvoiceState["MAIN"] = "MAIN";
    InvoiceState["ARCHIVED"] = "ARCHIVED";
    InvoiceState["TRASHED"] = "TRASHED";
})(InvoiceState || (exports.InvoiceState = InvoiceState = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
    Gender["OTHER"] = "OTHER";
})(Gender || (exports.Gender = Gender = {}));
