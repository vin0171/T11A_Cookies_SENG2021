import crypto from 'crypto';
import isEmail from 'validator/lib/isEmail.js';
import HTTPError from 'http-errors';
import { saveDataStore } from './dataStore';
import { Session, Company, Invoice, User } from './interface';

const SECRET = 'CookiesWillRuleTheWorld';
    

export const errorReturn = (status: number, error: string) => {
    saveDataStore();
    throw HTTPError(status, error);
};
  
  
export const getPasswordHash = (plaintext: string) => {
    return crypto.createHash('sha256').update(plaintext + SECRET).digest('hex');
};

export const getTokenHash = (userId: number, sessionId: number) => {
	const plaintext = "" + userId + sessionId;
	return crypto.createHash('sha256').update(plaintext + SECRET + "meow").digest('hex');
};
  

export function nextAvailableId(
	dataArray: (Session | Company | User | Invoice)[],
  	idType: 'session' | 'company' | 'user' | 'invoice'
) : number {
	let availableId = 1;

	const idSelectors = {
		session: (object: Session) => object.sessionId ,
		company: (object: Company) => object.companyId,
		user: (object: User) => object.userId,
		invoice: (object: Invoice) => object.invoiceId,
	}

	const getId = idSelectors[idType] as (object: any) => number;

	while (dataArray.some(obj => getId(obj) === availableId)) {
		availableId++;
	  }

	return availableId;
}
