
export interface ErrorObject {
  status: number,
  error: string
}

export type EmptyObject = Record<string, never>;

export enum InvoiceStatus {
    DRAFT = 'DRAFT',
    SENT = 'SENT',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED'
}

export enum InvoiceState {
    MAIN = 'MAIN',
    ARCHIVED = 'ARCHIVED',
    TRASHED = 'TRASHED',
}

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
}

export interface Participant {
  companyName: string,
  address: string,
  country: string,
  phone: string,
  email: string,
  taxIdentificationNumber: string,
  bankName: string,
  bankAccount: string,
  iban: string,
  swift: string,
  website?: string,
  logo?: string,
  notes?: string
}

export interface InvoiceItem {
  itemSku: string,
  itemName: string,
  description: string,
  quantity: number,
  unitPrice: number,
  discountAmount: number,
  taxAmount: number,
  taxRate: number,
  totalAmount: number
}

export interface Invoice {
  invoiceId: number,
  companyOwnerId: number,
  sender: Participant,
  receiver: Participant,
  issueDate: number,
  dueDate: number,
  repeating: boolean,
  status: InvoiceStatus,
  state: InvoiceState,
  items: InvoiceItem[],
  currency: string,
  total: number,
  notes: string,
  terms: string,
}


export interface User {
  userId: number,
  companyId: number,
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string,
  numSuccessfulLogins: number,
  numFailedPasswordsSinceLastLogin: number,
  age: number,
  gender: Gender,
  timeCreated: Date,
  previousPasswords: string[]
  worksAt: number | null
}

export interface InvoiceGroups {
  [InvoiceState.MAIN]: number[],
  [InvoiceState.ARCHIVED]: number[],
  [InvoiceState.TRASHED]: number[],
}

export interface Location {
  address: string,
  city: string,
  state: string,
  postcode: string,
  country: string,
}

export interface Company {
  companyId: number,
  name: string,
  abn: string,
  headquarters: Location,
  phone: string,
  email: string,
  owner: number,
  admins: number[],
  members: number[],
  invoices: InvoiceGroups
}

export interface companyRequestBody {
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
  password: string;
}

// use jwts
export interface Session {
  sessionId: number,
  userId: number,
  secureHash: string,
  timeCreated: Date,
  expiry: Date
}

export interface OtherData {
  companiesCount: number,
  userCount: number,
  invoiceCount: number,
  sessionCount: number,
}

export interface DataStore {
    companies: Company[]
    users: User[],
    invoices: Invoice[],
    sessions: Session[],
    otherData: OtherData
}

export interface TokenObject {
  token: string
}

export interface UserSessionInfo {
  user: User,
  company: Company,
}
