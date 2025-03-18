
import { create } from 'xmlbuilder2';
import { Invoice, InvoiceItem } from './interface';
import { XMLBuilder } from 'xmlbuilder2/lib/interfaces';

const XML_NAMESPACES = {
  xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
  'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
  'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2'
};

export class InvoiceConverter {
    private root: XMLBuilder;
    private invoice: Invoice;

    constructor(invoice: Invoice) {
      this.invoice = invoice;
      this.root = create({ version: '1.0' })
          .ele('Invoice', XML_NAMESPACES);
    }

    setID(invoiceId: string): InvoiceConverter {
      this.root.ele('cbc:ID').txt(invoiceId);
      return this;
    }

    setInvoicePeriod(issueDate: string, endDate: string) {
      const invoicePeriod = this.root.ele('cac:InvoicePeriod');
      invoicePeriod.ele('cbc:IssueDate').txt(issueDate);
      invoicePeriod.ele('cbc:EndDate').txt(endDate);
      return this;
    }

    setCurrency(currency: string = 'USD'): InvoiceConverter {
      this.root.ele('cbc:DocumentCurrencyCode').txt(currency);
      return this;
    }

    addParties(supplier: string, consumer: string): InvoiceConverter {
      const supplierParty = this.root.ele('cac:AccountingSupplierParty')
        .ele('cac:Party');
      supplierParty.ele('cac:PartyName').ele('cbc:Name').txt(supplier);

      const consumerParty = this.root.ele('cac:AccountingConsumerParty')
        .ele('cac:Party');
      consumerParty.ele('cac:PartyName').ele('cbc.Name').txt(consumer);

      return this;
    }
    
    addItems(items: InvoiceItem[]): InvoiceConverter {
      items.forEach((item, index) => {
        const itemLines = this.root.ele('cac:InvoiceLine');
        itemLines.ele('cbc:ID').txt((index + 1).toString());
        const cacItem = itemLines.ele('cac:Item');
        Object.entries(item).forEach(([key, value]) => {
          cacItem.ele(`cac:${key}`).txt(value);
        });
      })

      return this;
    }

    create(headless = true): string {
      return this.root.end({ prettyPrint: true, headless });
    }

    parseToUBL(): string {
      return this
        .setID(this.invoice.invoiceId)
        .setInvoicePeriod(this.invoice.details.issueDate.toString(), this.invoice.details.dueDate.toString())
        .setCurrency(this.invoice.details.currency)
        .addParties(this.invoice.details.sender.companyName, this.invoice.details.receiver.companyName)
        .addItems(this.invoice.details.items)
        .create();
    }
}