import { DataStore } from './interface';
import fs from 'fs';


let data: DataStore = {
    companies: [],
    users: [],
    invoices: [],
};


// Will change this to use NoSQL with Amazon DynamoDB later.

export function getData(): DataStore {
    return data;
}

export function setData(newData: DataStore): void {
    data = newData;
}

export function loadDataStore(): void {
    setData(JSON.parse(String(fs.readFileSync('./data/dataStore.json', { flag: 'r' }))))
}

export function saveDataStore(): void {
    data = getData();
    fs.writeFileSync('./data/dataStore.json', JSON.stringify(data, null, 2), { flag: 'w' });
}
