import { getData } from "./dataStore";
import { Address } from "./interface";
import { createItemV3, getCompany } from "./interfaceHelpers";
import * as validators from "./validationHelpers"
import HTTPError from 'http-errors';


export async function registerItem(token: string, companyId: string,  name: string, sku: string, unitPrice: string, description: string) {
    const user = await validators.validateToken(token);

    if (user.companyId !== companyId) throw HTTPError(403, 'Error: User is not a part of this company');
    
    const newItem = await createItemV3(name, sku, unitPrice, description);

    const data = getData();
    await data.put({TableName: "Items", Item: newItem});
    const updateExpression = 'SET itemsList = list_append(itemsList, :itemsList)';
    await data.update({
        TableName: "Companies",
        Key: { companyId: companyId },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: { ':itemsList': [newItem.itemId], },
    });
}

export async function listCompanyItems(token: string, companyId: string) {
    const data = getData();
    const user = await validators.validateToken(token);
    if (user.companyId !== companyId) throw HTTPError(403, 'Error: User is not a part of this company');
    const company = await getCompany(companyId); 
    if (user.companyId != company.companyId) {
        throw HTTPError(403, 'Error: User is not authorised')
    }
    return getItemList(company.itemsList);
}

async function getItemList(itemList: number[]) {
    const itemMap = itemList.map((item: number) => ({ itemId: item }));
    if (itemList.length === 0) return itemList;
    const data = getData();
    const response = await data.batchGet({
        RequestItems: { Items: { Keys: itemMap } }
    });
    return response.Responses.Items;
}
