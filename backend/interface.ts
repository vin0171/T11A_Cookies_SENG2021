import { Session } from "inspector/promises";

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
  timeCreated: string,
  previousPasswords: string[],
  invoices: number[]
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


export interface DataStore {
    companies: Company[]
    users: User[],
    invoices: Invoice[],
}

export interface UserSessionInfo {
  user: User,
  company: Company,
}

export { Session };

