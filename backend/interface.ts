import { Session } from "inspector/promises";
import { Dayjs } from 'dayjs';
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
  phone?: string,
  email: string,
  taxIdentificationNumber: string,
  bankName: string,
  bankAccount: string,
  iban?: string,
  swift?: string,
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

export interface InvoiceItemV2 {
  id: number,
  isNew: boolean,
  itemSku: string,
  itemName: string,
  description: string,
  quantity: number,
  unitPrice: number,
  discountAmount: number,
  totalAmount: number
}

export interface InvoiceDetails {
  sender: Participant,
  receiver: Participant,
  issueDate: number,
  dueDate: number,
  invoiceNumber: number,
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

export interface Address {
  addressLine1: string,
  addressLine2: string,
  suburb: string,
  state: string,
  postcode: string,
  country: string
}

export interface ParticipantV2 {
  companyName: string,
  billingAddress: Address,
  shippingAddress: Address,
  email: string,
  bankName: string,
  bankAccount: string,
}

// these should be parsed as a float/ int when used
export interface ShippingCostDetails {
  shippingTax?: string,
  shippingCost?: string 
}

// these should be parsed as a float/ int when used
export interface Tax {
  taxType: string,
  taxOption?: string,
  taxAmount?: string
}

export interface InvoiceDetailsV2 {
  receiver: ParticipantV2,
  issueDate: Dayjs,
  dueDate: Dayjs,
  invoiceNumber: number,
  status: InvoiceStatus,
  shippingChecked: boolean,
  state: InvoiceState,
  items: InvoiceItemV2[],
  wideDiscount: number,
  tax: Tax,
  shippingCostDetails: ShippingCostDetails,
  format: string,
  currency: string,
  subtotal: number,
  total: number,
  notes: string,
}

export interface InvoiceV2 {
  invoiceId: string,
  userId: string,
  companyId: string,
  details: InvoiceDetailsV2
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

