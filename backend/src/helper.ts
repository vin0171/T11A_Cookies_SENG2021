import crypto from 'crypto';
import HTTPError from 'http-errors';
import { saveDataStore } from './dataStore';
import { Session, Company, Invoice, User } from './interface';



const SECRET = 'CookiesWillRuleTheWorld';

export function userNameValidator(name: string) : boolean {
    if (name.length < 2 || name.length > 20) return false;
  
    const reInvalidName = /[^a-zA-Z'\s-]/;
  
    if (reInvalidName.test(name) === true) return false;
    return true;
}
  
export function passwordValidator(password: string) : boolean {
    const reHasLetter = /[a-zA-Z]/;
    const reHasNumber = /[0-9]/;
  
    if (reHasLetter.test(password) === true && reHasNumber.test(password) === true) {
      return true;
    }
    return false;

}

// FIX
export const errorReturn = (status: number, error: string) => {
    saveDataStore();
    throw HTTPError(status, error);
};
  
  
export const getPasswordHash = (plaintext: string) => {
    return crypto.createHash('sha256').update(plaintext + SECRET).digest('hex');
};

export const getTokenHash = (plaintext: string) => {
	return crypto.createHash('sha256').update(plaintext + SECRET+"meow").digest('hex');
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
