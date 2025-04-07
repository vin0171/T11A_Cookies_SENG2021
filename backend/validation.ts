import { XMLValidator } from 'fast-xml-parser';
import { DOMParser } from 'xmldom';
import xpath from 'xpath';
import { currencyCodes } from '../data/currencyCode.js';
import { validateToken } from './validationHelpers';

function isFormattedYYYYMMDD(str: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

function selectSingleNode(
  select: xpath.XPathSelect,
  xpathExpr: string,
  xmlDoc: Node,
  label: string,
  required: boolean = false
): Node | null {
  const nodes = select(xpathExpr, xmlDoc) as Node[];

  if (nodes.length > 1) {
    throw new Error(`${label} must occur at most once, but ${nodes.length} were found.`);
  }

  if (required && nodes.length === 0) {
    throw new Error(`${label} is required but not found.`);
  }

  return nodes[0] || null;
}

function validateParty(select: xpath.XPathSelect, party: Node, label: string): void {
  const nameNodes = select('cbc:Name/text()', party) as Node[];

  if (nameNodes) {
    const nameValues = nameNodes.map(n => n.nodeValue?.trim() || '');
    const seen = new Set<string>();

    for (const name of nameValues) {
      if (!name) {
        throw new Error(`${label} Name must not be empty.`);
      }
      if (seen.has(name)) {
        throw new Error(`Duplicate ${label} Name found: "${name}"`);
      }
      seen.add(name);
    }
  }
}

export function validateUBL(invoiceXML: string): boolean {
  const parser = new DOMParser({
    errorHandler: {
      warning: () => {},
    }
  });

  const xmlDoc = parser.parseFromString(invoiceXML, 'application/xml');
  // Check if XML is well-formed
  if (!(XMLValidator.validate(invoiceXML) === true)) {
    console.log('Invalid UBL XML structure!');
    return false;
  }

  const select = xpath.useNamespaces({
    ubl: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
    cac: 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
    cbc: 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
  });

  try {
    // Invoice ID
    const invoiceId = selectSingleNode(select, '/ubl:Invoice/cbc:ID/text()', xmlDoc, 'Invoice ID', true);
    if (!invoiceId || invoiceId.nodeValue?.trim() === '') {
      throw new Error('Invoice ID is required and must not be empty.');
    }

    // Issue Date
    const issueDate = selectSingleNode(select, '//cbc:IssueDate/text()', xmlDoc, 'Invoice Issue Date', true);
    if (!issueDate?.nodeValue || !isFormattedYYYYMMDD(issueDate.nodeValue)) {
      throw new Error('Invoice Issue Date must be in YYYY-MM-DD format.');
    }

    // Invoice Period
    const invoicePeriod = selectSingleNode(select, '//cac:InvoicePeriod', xmlDoc, 'Invoice Period', true);
    if (invoicePeriod) {
      const startDate = selectSingleNode(select, 'cbc:StartDate/text()', invoicePeriod, 'Invoice Period Start Date');
      const endDate = selectSingleNode(select, 'cbc:EndDate/text()', invoicePeriod, 'Invoice Period End Date');

      const hasStart = startDate && startDate.nodeValue?.trim() !== '';
      const hasEnd = endDate && endDate.nodeValue?.trim() !== '';

      if (!hasStart && !hasEnd) {
        throw new Error('InvoicePeriod is present, but neither StartDate nor EndDate is filled.');
      }
      if (hasStart && startDate && !isFormattedYYYYMMDD(startDate.nodeValue!)) {
        throw new Error('InvoicePeriod StartDate must be in YYYY-MM-DD format.');
      }
      if (hasEnd && endDate && !isFormattedYYYYMMDD(endDate.nodeValue!)) {
        throw new Error('InvoicePeriod EndDate must be in YYYY-MM-DD format.');
      }
    }

    // Supplier and Customer
    const supplier = selectSingleNode(select, '//cac:AccountingSupplierParty', xmlDoc, 'Supplier Information', true)!;
    const customer = selectSingleNode(select, '//cac:AccountingCustomerParty', xmlDoc, 'Customer Information', true)!;

    validateParty(select, selectSingleNode(select, 'cac:Party', supplier, 'Supplier Party', true)!, 'Supplier');
    validateParty(select, selectSingleNode(select, 'cac:Party', customer, 'Customer Party', true)!, 'Customer');

    // Totals
    const legalMonetaryTotal = selectSingleNode(select, '//cac:LegalMonetaryTotal', xmlDoc, 'Legal Monetary Total', true)!;
    const payableAmountElement = selectSingleNode(select, 'cbc:PayableAmount', legalMonetaryTotal, 'Payable Amount', true) as Element;

    const currencyID = payableAmountElement.getAttribute('currencyID');
    const payableAmount = payableAmountElement.textContent;

    if (!payableAmount?.trim()) {
      throw new Error('Invoice payable amount must not be empty.');
    }
    if (!/^\d+(\.\d{1,2})?$/.test(payableAmount.trim())) {
      throw new Error('Invoice payable amount must have no more than 2 decimal places.');
    }
    if (!currencyID?.trim()) {
      throw new Error('Invoice currency is required.');
    }
    if (!currencyCodes.includes(currencyID)) {
      throw new Error(`Invalid currency code: "${currencyID}". Must use ISO 4217 alpha-3 format.`);
    }

    // Line items
    const invoiceLines = select('//cac:InvoiceLine', xmlDoc) as Node[];
    if (invoiceLines.length === 0) {
      throw new Error('Invoice must contain at least one Invoice Line.');
    }

    for (const invoiceLine of invoiceLines) {
      selectSingleNode(select, 'cbc:ID/text()', invoiceLine, 'Invoice Line ID', true);

      const lineExtensionAmount = selectSingleNode(select, 'cbc:LineExtensionAmount', invoiceLine, 'Line Extension Amount', true) as Element;
      const lineCurrency = lineExtensionAmount.getAttribute('currencyID');

      if (lineCurrency !== currencyID) {
        throw new Error(`Line Extension Amount currency "${lineCurrency}" does not match Invoice currency "${currencyID}".`);
      }

      const item = selectSingleNode(select, 'cac:Item', invoiceLine, 'Invoice Line Item', true)!;
      selectSingleNode(select, 'cbc:Name/text()', item, 'Item Name', true);
      selectSingleNode(select, 'cbc:Description/text()', item, 'Item Description');
    }

    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log('Validation failed:', error.message);
    } else {
      console.log('Validation failed with unknown error:', error);
    }
    return false;
  }
}
