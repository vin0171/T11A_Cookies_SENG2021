import { DOMParser } from "xmldom";
import xpath from "xpath";

type InvoiceItem = {
  id: string;
  currency: string;
  unitPrice: string;
  itemName: string;
  description: string;
}

type InvoiceData = {
  invoiceId: string;
  issueDate: string;
  invoicePeriod: {
    startDate: string;
    endDate: string;
  };
  supplier: {
    name: string;
  };
  customer: {
    name: string;
  };
  payableAmount: string;
  currencyID: string;
  items: InvoiceItem[];
};

function selectSingleNode(
    select: xpath.XPathSelect,
    xpathExpr: string,
    xmlDoc: Node,
    label: string,
    required: boolean = false): Node | null {
    const rawResult = select(xpathExpr, xmlDoc);
  
    if (!Array.isArray(rawResult)) {
      throw new Error(`${label} must be a node list, but got ${typeof rawResult}`);
    }
  
    const nodes = rawResult as Node[];
  
    if (nodes.length > 1) {
      throw new Error(`${label} must occur at most once, but ${nodes.length} were found.`);
    }
  
    if (required && nodes.length === 0) {
      throw new Error(`${label} is required but not found.`);
    }
  
    return nodes[0] || null;
}
  

export function readInvoices(invoiceXML: string): InvoiceData {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(invoiceXML, "application/xml");

  const result: InvoiceData = {
    invoiceId: '',
    issueDate: '',
    invoicePeriod: {
      startDate: '',
      endDate: ''
    },
    supplier: {
      name: ''
    },
    customer: {
      name: ''
    },
    payableAmount: '',
    currencyID: '',
    items: []
  };

  const select = xpath.useNamespaces({
    ubl: "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
    cac: "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
    cbc: "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
  });

  const getText = (node: Node | null): string =>
    node ? (node.nodeValue || "").trim() : "";

  try {
    result.invoiceId = getText(
      selectSingleNode(select, "/ubl:Invoice/cbc:ID/text()", xmlDoc, "Invoice ID")
    );

    result.issueDate = getText(
      selectSingleNode(select, "//cbc:IssueDate/text()", xmlDoc, "Issue Date")
    );

    const invoicePeriod = selectSingleNode(
      select,
      "//cac:InvoicePeriod",
      xmlDoc,
      "Invoice Period"
    );

    if (invoicePeriod) {
      result.invoicePeriod.startDate = getText(
        selectSingleNode(select, "cbc:StartDate/text()", invoicePeriod, "Start Date")
      );
      result.invoicePeriod.endDate = getText(
        selectSingleNode(select, "cbc:EndDate/text()", invoicePeriod, "End Date")
      );
    }

    const supplierParty = selectSingleNode(
      select,
      "//cac:AccountingSupplierParty/cac:Party",
      xmlDoc,
      "Supplier Party"
    );

    result.supplier.name = getText(
      selectSingleNode(
        select,
        "cac:PartyName/cbc:Name/text()",
        supplierParty,
        "Supplier Name"
      )
    );

    const customerParty = selectSingleNode(
      select,
      "//cac:AccountingCustomerParty/cac:Party",
      xmlDoc,
      "Customer Party"
    );

    result.customer.name = getText(
      selectSingleNode(
        select,
        "cac:PartyName/cbc:Name/text()",
        customerParty,
        "Customer Name"
      )
    );

    const legalMonetaryTotal = selectSingleNode(
      select,
      "//cac:LegalMonetaryTotal",
      xmlDoc,
      "Legal Monetary Total"
    );

    const payableAmountElement = selectSingleNode(
      select,
      "cbc:PayableAmount",
      legalMonetaryTotal,
      "Payable Amount"
    ) as Element | null;

    result.payableAmount = payableAmountElement?.textContent?.trim() || "";
    result.currencyID = payableAmountElement?.getAttribute("currencyID") || "";

    const invoiceLines = select("//cac:InvoiceLine", xmlDoc) as Node[];

    for (const line of invoiceLines) {
      const lineId = getText(
        selectSingleNode(select, "cbc:ID/text()", line, "Line ID")
      );

      const amountElement = selectSingleNode(
        select,
        "cbc:LineExtensionAmount",
        line,
        "Line Amount"
      ) as Element | null;

      const lineAmount = amountElement?.textContent?.trim() || "";
      const lineCurrency = amountElement?.getAttribute("currencyID") || "";

      const item = selectSingleNode(select, "cac:Item", line, "Item");

      const itemName = getText(
        selectSingleNode(select, "cbc:Name/text()", item, "Item Name")
      );

      const itemDescription = getText(
        selectSingleNode(select, "cbc:Description/text()", item, "Item Description")
      );

      result.items.push({
        id: lineId,
        currency: lineCurrency,
        unitPrice: lineAmount,
        itemName: itemName,
        description: itemDescription
      });
    }
  } catch (error) {
    console.error("⚠️ Error parsing XML:", (error as Error).message);
  }

  return result;
}
