import { getData } from "./dataStore";
import { Address } from "./interface";
import { createCustomerV3, getCompany } from "./interfaceHelpers";
import * as validators from "./validationHelpers"
import HTTPError from 'http-errors';


export async function registerCustomer(token: string, name: string, companyId: string, billingAddress: Address, shippingAddress: Address, email: string, bankName: string, bankAccount: string): Promise<string> {
    const user = await validators.validateToken(token);
    if (user.companyId !== companyId) throw HTTPError(403, 'Error: User is not a part of this company');

    const newCustomer = await createCustomerV3(name, billingAddress, shippingAddress, email, bankName, bankAccount);
    const data = getData();
    await data.put({TableName: "Customers", Item: newCustomer});
    const updateExpression = 'SET customers = list_append(customers, :customerId)';
    await data.update({
        TableName: "Companies",
        Key: { companyId: companyId },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: { ':customerId': [newCustomer.customerId], },
    });
        
    return newCustomer.customerId;
}

export async function listCompanyCustomers(token: string, companyId: string) {
    const data = getData();
    const user = await validators.validateToken(token);
    if (user.companyId !== companyId) throw HTTPError(403, 'Error: User is not a part of this company');
    const company = await getCompany(companyId); 
    if (user.companyId != company.companyId) {
        throw HTTPError(403, 'Error: User is not authorised')
    }
    return getCustomerList(company.customers);
}

async function getCustomerList(cusList: number[]) {
    const cusMap = cusList.map((cus: number) => ({ customerId: cus }));
    if (cusList.length === 0) return cusList;
    const data = getData();
    const response = await data.batchGet({
        RequestItems: { Customers: { Keys: cusMap } }
    });
    return response.Responses.Customers;
}
