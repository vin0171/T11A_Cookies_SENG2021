import { getData } from "./dataStore";
import * as helpers from './helper';
import {Gender, User, Session, TokenObject } from './interface';


export function createUser(email: string, password: string, nameFirst: string, nameLast: string, age: number) : User {
    const dataStore = getData();
    
    return {
        userId: dataStore.otherData.userCount + 1,
        companyId: -1,
        email: email,
        password: helpers.getPasswordHash(password),
        nameFirst: nameFirst,
        nameLast: nameLast,
        numSuccessfulLogins: 0,
        numFailedPasswordsSinceLastLogin: 0,
        age: age,
        gender: Gender.OTHER,
        timeCreated: new Date(),
        previousPasswords: []
    }
}

export function createSession(user: User) : Session {
    const dataStore = getData();
    const nextId = helpers.nextAvailableId(dataStore.sessions, 'session');
    const secureHash = helpers.getTokenHash(user.userId, nextId);

    return {
		sessionId: nextId,
		userId: user.userId,
		secureHash: secureHash,
		timeCreated: new Date(),
		expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
	};
}

export function createToken(session: Session) : TokenObject {
    return {
        token: JSON.stringify(session),
    }
}
