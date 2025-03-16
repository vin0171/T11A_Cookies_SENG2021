"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getData = getData;
exports.setData = setData;
exports.loadDataStore = loadDataStore;
exports.saveDataStore = saveDataStore;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));

// Path to the temporary data store file in Lambda's /tmp directory
const dataStorePath = path_1.default.join('/tmp', 'dataStore.json');

let data = {
    companies: [],
    users: [],
    invoices: [],
};

// Will change this to use NoSQL with Amazon DynamoDB later.
function getData() {
    return data;
}

function setData(newData) {
    data = newData;
}

// Function to load data from the temporary data store
function loadDataStore() {
    try {
        // Check if the file exists in /tmp, if it does, load it
        if (fs_1.default.existsSync(dataStorePath)) {
            const fileData = fs_1.default.readFileSync(dataStorePath, { flag: 'r' });
            setData(JSON.parse(fileData.toString()));
        } else {
            // If the file doesn't exist, initialize with default data
            setData({ companies: [], users: [], invoices: [] });
        }
    } catch (err) {
        console.error('Error loading data from dataStore:', err);
    }
}

// Function to save data to the temporary data store
function saveDataStore() {
    try {
        fs_1.default.writeFileSync(dataStorePath, JSON.stringify(data, null, 2), { flag: 'w' });
        console.log('Data saved to temporary data store');
    } catch (err) {
        console.error('Error saving data to dataStore:', err);
    }
}
