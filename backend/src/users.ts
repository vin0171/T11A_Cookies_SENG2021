/**
 * Stub for the userRegister function.
 *
 * Register a user with an email, password, and names,
 * then returns a Token.
 *
 *
 * @param {string} email - email of the user
 * @param {string} password - password the user wants to use
 * @param {string} nameFirst - First name of the user
 * @param {string} nameLast - Last name of the user
 * @returns {{authUserId: number}}
 */
export function registerUser(email: string, password: string, nameFirst: string, nameLast: string): number {

    return null;
}


/**
 * Stub for the authLogin function.
 *
 * Login a user with an email and password,
 * then returns a Token.
 *
 *
 * @param {string} email - email of the user
 * @param {string} password - password the user wants to use
 * @returns {{authUserId: number}}
 */
export function authLogin(email: string, password: string): number {

    return null;
}


/**
 * Stub for the authLogout function.
 *
 * Logout a user with a token.
 *
 *
 * @param {string} token - token of the user
 * @returns {boolean}
 */
export function authLogout(token: string): boolean {

    return null;
}
