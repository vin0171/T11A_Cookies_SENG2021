"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerItem = registerItem;
exports.listCompanyItems = listCompanyItems;
const dataStore_1 = require("./dataStore");
const interfaceHelpers_1 = require("./interfaceHelpers");
const validators = __importStar(require("./validationHelpers"));
const http_errors_1 = __importDefault(require("http-errors"));
function registerItem(token, companyId, name, sku, unitPrice, description) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield validators.validateToken(token);
        if (user.companyId !== companyId)
            throw (0, http_errors_1.default)(403, 'Error: User is not a part of this company');
        const newItem = yield (0, interfaceHelpers_1.createItemV3)(name, sku, description, unitPrice);
        const data = (0, dataStore_1.getData)();
        yield data.put({ TableName: "Items", Item: newItem });
        const updateExpression = 'SET itemsList = list_append(itemsList, :itemsList)';
        yield data.update({
            TableName: "Companies",
            Key: { companyId: companyId },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: { ':itemsList': [newItem.itemId], },
        });
        return newItem.itemId;
    });
}
function listCompanyItems(token, companyId) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, dataStore_1.getData)();
        const user = yield validators.validateToken(token);
        if (user.companyId !== companyId)
            throw (0, http_errors_1.default)(403, 'Error: User is not a part of this company');
        const company = yield (0, interfaceHelpers_1.getCompany)(companyId);
        if (user.companyId != company.companyId) {
            throw (0, http_errors_1.default)(403, 'Error: User is not authorised');
        }
        return getItemList(company.itemsList);
    });
}
function getItemList(itemList) {
    return __awaiter(this, void 0, void 0, function* () {
        const itemMap = itemList.map((item) => ({ itemId: item }));
        if (itemList.length === 0)
            return itemList;
        const data = (0, dataStore_1.getData)();
        const response = yield data.batchGet({
            RequestItems: { Items: { Keys: itemMap } }
        });
        return response.Responses.Items;
    });
}
