import { BillingMode, CreateTableCommand, DeleteTableCommand, DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

// TODO: Leave this as a reminder such that when we deploy the details change
const client: DynamoDBClient = new DynamoDBClient({
  region: 'localhost',
  endpoint: 'http://0.0.0.0:8000',
  credentials: {
    accessKeyId: 'FakeAccessKeyId',
    secretAccessKey: 'FakeSecretAccessKey'
  },
})

const data: DynamoDBDocument = DynamoDBDocument.from(client);

const createTable = (tableName: string, primaryKey: string) => {
    return new CreateTableCommand({
        TableName: tableName,
        BillingMode: BillingMode.PAY_PER_REQUEST,
        KeySchema: [{ AttributeName: primaryKey, KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: primaryKey, AttributeType: "S" }]
    });
}

const createUserTable = (): CreateTableCommand => {
  return new CreateTableCommand({
    TableName: "Users",
    BillingMode: BillingMode.PAY_PER_REQUEST,
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

const tableCommands: { [key: string]: CreateTableCommand }= {
    Users: createUserTable(),
    Invoices: createTable("Invoices", "invoiceId"),
    Companies: createTable("Companies", "companyId")
};

// This is a local function comment out when deploy
export async function checkTablesSetup() {
    const response = await client.send(new ListTablesCommand());
    const tables = response.TableNames;
    const neededTables = Object.keys(tableCommands);
  
    for (const tableName of neededTables) {
      if (!tables.includes(tableName)) {
        await data.send(tableCommands[tableName]);
        console.log(`Table ${tableName} created successfully.`);
      } else {
        console.log(`Table: ${tableName} already exists.`);
      }
    }
}

// This will now return the data (This is simple wrapper so we can do .put ectera )
// Later if we want to getData using more advnaced techniques like query we can use 
// DynamoDBDocumentClient a more advanced wrapper
export function getData(): DynamoDBDocument {
    return data;
}

export async function resetDataStore() {
    const response = await client.send(new ListTablesCommand());
    const tables = response.TableNames;
    
    // Delete all tables (Do not chnage to forEach)
    for (const table of tables) await client.send(new DeleteTableCommand({ TableName: table }));
    // Recreate the tables (Do not chnage to forEach)

    const neededTables = Object.keys(tableCommands);
    for (const table of neededTables) await client.send(tableCommands[table]);
}

