import { XMLValidator } from 'fast-xml-parser';
import { DOMParser } from "xmldom";
import xpath from 'xpath';

export default function validateUBL(invoiceXML: string) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(invoiceXML, "application/xml");

  if (!XMLValidator.validate(invoiceXML)) {
    return false;
  }

  const select = xpath.useNamespaces({
    'ubl': 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
    'cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
    'cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
  });

  try {
    const identifierId = (select('//cbc:ID/text()', xmlDoc) as Node[])[0].nodeValue;
    const issueDate = (select('//cbc:IssueDate/text()', xmlDoc) as Node[])[0].nodeValue;
    const invoicePeriod = (select('//cac:InvoicePeriod', xmlDoc) as Node[])[0];
    const startDate = (select('cbc:StartDate/text()', invoicePeriod) as Node[])[0].nodeValue;        
    const endDate = (select('cbc:EndDate/text()', invoicePeriod) as Node[])[0].nodeValue;
    const supplierName = (select('//cac:AccountingSupplierParty//cac:Party/cac:PartyName/cbc:Name/text()', xmlDoc) as Node[])[0].nodeValue;
    const customerName = (select('//cac:AccountingCustomerParty//cbc:Name/text()', xmlDoc) as Node[])[0].nodeValue;
    const payableAmountElement = (select('//cac:LegalMonetaryTotal/cbc:PayableAmount', xmlDoc) as Node[])[0] as Element;
    const payableAmount = payableAmountElement.textContent;
    const currency = payableAmountElement.getAttribute('currencyID');
    const items = select('//cac:InvoiceLine', xmlDoc) as Node[];

    for (let item of items) {
        const id = (select('cbc:ID/text()', item) as Node[])[0].nodeValue;
    
        const lineExtensionElement = (select('cbc:LineExtensionAmount', item) as Node[])[0] as Element;
        const amount = lineExtensionElement?.textContent;
        const itemCurrency = lineExtensionElement?.getAttribute('currencyID');
    
        const description = (select('cac:Item/cbc:Description/text()', item) as Node[])[0].nodeValue;

        if (!id || !/^\d+$/.test(id)) {
        throw new Error(`Invoice Line ID must be numeric.`);
        }

        if (!amount || Number(amount) <= 0) {
            throw new Error(`Invoice Line  amount must be a positive number.`);
        }

        if (!itemCurrency) {
            throw new Error(`Invoice Line currency is required.`);
        }

        if (!description) {
            throw new Error(`Invoice Line description is empty.`);
        }

    }
    if (!startDate || isNaN(Date.parse(startDate))) {
        throw new Error('Invoice Period StartDate must be a valid date.');
    }
    

    if (!endDate || isNaN(Date.parse(endDate))) {
        throw new Error('Invoice Period EndDate must be a valid date.');
    }

    if (new Date(startDate) > new Date(endDate)) {
        throw new Error('Invoice Period StartDate must be earlier than EndDate.');
    }
    
    if (!identifierId || !/^\d+$/.test(identifierId)) {
        throw new Error('Invoice ID must be a numeric value.');
    }

    if (!issueDate || isNaN(Date.parse(issueDate))) {
        throw new Error('Invoice Issue Date must be a valid date.');
    }

    if (!supplierName || !customerName) {
        throw new Error('Supplier and Customer must not be empty.');
    }

    if (!payableAmount || Number(payableAmount) <= 0) {
        throw new Error('Invoice payable amount must be a positive number.');
    }

    if (!currency) {
        throw new Error('Invoice currency is required.');
    }

    return true;
    } catch (error) {
    return false;
    } 
}    

