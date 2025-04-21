"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTablesSetup = checkTablesSetup;
exports.getData = getData;
exports.resetDataStore = resetDataStore;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
// TODO: Leave this as a reminder such that when we deploy the details change
const client = new client_dynamodb_1.DynamoDBClient({
    region: "us-east-1",
});
const data = lib_dynamodb_1.DynamoDBDocument.from(client);
const createTable = (tableName, primaryKey) => {
    return new client_dynamodb_1.CreateTableCommand({
        TableName: tableName,
        BillingMode: client_dynamodb_1.BillingMode.PAY_PER_REQUEST,
        KeySchema: [{ AttributeName: primaryKey, KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: primaryKey, AttributeType: "S" }]
    });
};
const createUserTable = () => {
    return new client_dynamodb_1.CreateTableCommand({
        TableName: "Users",
        BillingMode: client_dynamodb_1.BillingMode.PAY_PER_REQUEST,
        KeySchema: [{ AttributeName: "userId", KeyType: "HASH" }],
        AttributeDefinitions: [
            { AttributeName: "userId", AttributeType: "S" },
            { AttributeName: "email", AttributeType: "S" }
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: "EmailIndex",
                KeySchema: [{ AttributeName: "email", KeyType: "HASH" }],
                Projection: { ProjectionType: "ALL" },
            },
        ],
    });
};
const createCustomerTable = () => {
    return new client_dynamodb_1.CreateTableCommand({
        TableName: "Customers",
        BillingMode: client_dynamodb_1.BillingMode.PAY_PER_REQUEST,
        KeySchema: [{ AttributeName: "customerId", KeyType: "HASH" }],
        AttributeDefinitions: [
            { AttributeName: "customerId", AttributeType: "S" },
            { AttributeName: "email", AttributeType: "S" }
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: "EmailIndex",
                KeySchema: [{ AttributeName: "email", KeyType: "HASH" }],
                Projection: { ProjectionType: "ALL" },
            },
        ],
    });
};
const createItemTable = () => {
    return new client_dynamodb_1.CreateTableCommand({
        TableName: "Items",
        BillingMode: client_dynamodb_1.BillingMode.PAY_PER_REQUEST,
        KeySchema: [{ AttributeName: "itemId", KeyType: "HASH" }],
        AttributeDefinitions: [
            { AttributeName: "itemId", AttributeType: "S" },
            { AttributeName: "sku", AttributeType: "S" }
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: "SkuIndex",
                KeySchema: [{ AttributeName: "sku", KeyType: "HASH" }],
                Projection: { ProjectionType: "ALL" },
            },
        ],
    });
};
const tableCommands = {
    Users: createUserTable(),
    Invoices: createTable("Invoices", "invoiceId"),
    Companies: createTable("Companies", "companyId"),
    Items: createItemTable(),
    Customers: createCustomerTable()
};
// This is a local function comment out when deploy
function checkTablesSetup() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield client.send(new client_dynamodb_1.ListTablesCommand());
        const tables = response.TableNames;
        const neededTables = Object.keys(tableCommands);
        for (const tableName of neededTables) {
            if (!tables.includes(tableName)) {
                yield data.send(tableCommands[tableName]);
                console.log(`Table ${tableName} created successfully.`);
            }
            else {
                console.log(`Table: ${tableName} already exists.`);
            }
        }
    });
}
// This will now return the data (This is simple wrapper so we can do .put ectera )
// Later if we want to getData using more advnaced techniques like query we can use 
// DynamoDBDocumentClient a more advanced wrapper
function getData() {
    return data;
}
function resetDataStore() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield client.send(new client_dynamodb_1.ListTablesCommand());
        const tables = response.TableNames;
        // Delete all tables (Do not chnage to forEach)
        for (const table of tables)
            yield client.send(new client_dynamodb_1.DeleteTableCommand({ TableName: table }));
        // Recreate the tables (Do not chnage to forEach)
        const neededTables = Object.keys(tableCommands);
        for (const table of neededTables)
            yield client.send(tableCommands[table]);
    });
}
