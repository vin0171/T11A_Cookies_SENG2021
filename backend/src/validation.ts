import { XMLValidator } from 'fast-xml-parser';
import { DOMParser } from "xmldom";
import xpath from 'xpath';

import { invoice } from "./imvoice.js"; // Invoices


function validateUBL(invoiceXML) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(invoiceXML, "application/xml");

    // Check if XML is well-formed
    if (!(XMLValidator.validate(invoiceXML) === true)) {
        console.error("❌ Invalid UBL XML structure!")
        return false;
    }
    // console.log("✅ UBL XML is well-formed!");

    // Basic checks to confirm structure:
    const select = xpath.useNamespaces({
        'ubl': 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
        'cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
        'cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
    });

    try {
        // Check Invoice Identifier
        const identifierId = select('//cbc:ID/text()', xmlDoc)[0].nodeValue;

        // Check Issues date
        const issueDate = select('//cbc:IssueDate/text()', xmlDoc)[0].nodeValue;

        // Check Supplier Information
        const supplierName = select('//cac:AccountingSupplierParty//cac:Party/cac:PartyName/cbc:Name/text()', xmlDoc)[0].nodeValue;
        
        // Check Customer Information
        const customerName = select('//cac:AccountingCustomerParty//cbc:Name/text()', xmlDoc)[0].nodeValue;

        // Check Monetary Totals and Currency
        const payableAmountElement = select('//cac:LegalMonetaryTotal/cbc:PayableAmount', xmlDoc)[0];
        const payableAmount = payableAmountElement.textContent;
        const currency = payableAmountElement.getAttribute('currencyID');

        // Check Invoice Line Details
        const items = select('//cac:InvoiceLine', xmlDoc);

        for (let item of items) {
          const id = select('cbc:ID/text()', item)[0]?.nodeValue;
        
          const lineExtensionElement = select('cbc:LineExtensionAmount', item)[0];
          const amount = lineExtensionElement?.textContent;
          const itemCurrency = lineExtensionElement?.getAttribute('currencyID');
        
          const description = select('cac:Item/cbc:Description/text()', item)[0]?.nodeValue;

          if (!id || !/^\d+$/.test(id)) {
            throw new Error(`Invoice Line ID must be numeric.`);
          }

          if (!amount || isNaN(amount) || Number(amount) <= 0) {
              throw new Error(`Invoice Line  amount must be a positive number.`);
          }

          if (!itemCurrency) {
              throw new Error(`Invoice Line currency is required.`);
          }

          if (!description) {
              throw new Error(`Invoice Line description is empty.`);
          }
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

        if (!payableAmount || isNaN(payableAmount) || Number(payableAmount) <= 0) {
            throw new Error('Invoice payable amount must be a positive number.');
        }

        if (!currency) {
            throw new Error('Invoice currency is required.');
        }

        return true;
      } catch (error) {
        console.error('❌ Validation failed:', error.message);
        return false;
      }
}    

// Run validation
validateUBL(invoice);
