import crypto from 'crypto';
import HTTPError from 'http-errors';
import { saveDataStore } from './dataStore';
import { Session, Company, Invoice, User } from './interface';



const SECRET = 'CookiesWillRuleTheWorld';

export function isValidName(nameFirst: string, nameLast: string) : boolean {
	const MIN_NAME_LEN = 2;
	const MAX_NAME_LEN = 20;
	const ALLOWED_CHARS = /[^a-zA-Z '-]/;
  
	if (nameFirst.length < MIN_NAME_LEN || nameFirst.length > MAX_NAME_LEN) {
	  return false;
	}
  
	if (ALLOWED_CHARS.test(nameFirst)) {
	  return false;
	}
  
	if (nameLast.length < MIN_NAME_LEN || nameLast.length > MAX_NAME_LEN) {
	  return false;
	}
  
	if (ALLOWED_CHARS.test(nameLast)) {
	  return false;
	}
  
	return true;
  
}
  
export function isValidPass(password: string): boolean {
	const MIN_PASSWORD_LEN = 8;
	const LOWERCASE_LETTERS = /[a-z]/;
	const UPPERCASE_LETTERS = /[A-Z]/;
	const NUMBERS = /[0-9]/;
  
	if (password.length < MIN_PASSWORD_LEN) {
	  return false;
	}
  
	if (((LOWERCASE_LETTERS.test(password) || UPPERCASE_LETTERS.test(password)) &&
		NUMBERS.test(password)) === false) {
	  return false;
	}
  
	return true;
};
  
  

// FIX
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
