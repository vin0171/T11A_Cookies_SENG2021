
export interface ErrorObject {
    status: number,
    error: string
  }

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EmptyObject {
}

export interface Invoice {

}

export interface Participant {

}

export interface User {

}

export interface Company {

}

export interface Session {

}

export interface DataStore {

    companies: Company[]
    users: User[],
    invoices: Invoice[],
    sessions: Session[],
}
