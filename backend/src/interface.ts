import { Session } from "inspector/promises";
import { StringMappingType } from "typescript";

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

export interface InvoiceDetails {
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

export interface Invoice {
  invoiceId: string,
  userId: string,
  companyId: string,
  details: InvoiceDetails
}

export interface User {
  token: string,
  userId: string,
  companyId: string,
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string,
  numSuccessfulLogins: number,
  numFailedPasswordsSinceLastLogin: number,
  age: number,
  gender: Gender,
  timeCreated: Date,
  previousPasswords: string[],
  invoices: Invoice[]
}

export interface Location {
  address: string,
  city: string,
  state: string,
  postcode: string,
  country: string,
}

export interface Company {
  companyId: string,
  name: string,
  abn: string,
  headquarters: Location,
  phone: string,
  email: string,
  owner: string,
  admins: string[],
  members: string[],
  invoices: Invoice[]
}


export interface companyRequestBody {
  companyName: string,
  companyAbn: string,
  companyEmail: string, 
  contactNumber: string,
  address: string, 
  city: string, 
  state: string, 
  postcode: string, 
  country: string
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
}

export interface UserSessionInfo {
  user: User,
  company: Company,
}

// Basically means that there is must be at least a userId or an email present, but not both.
export type UserOptions = 
  | { userId: string; email?: never }  
  | { email: string; userId?: never };

export { Session };

