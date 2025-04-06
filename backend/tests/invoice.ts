export const validUBLInvoice  = `<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
    xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
    xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
        
    <!-- Invoice Identification Number -->
    <cbc:ID>123</cbc:ID>

    <!-- Date when the invoice was issued -->
    <cbc:IssueDate>2011-09-22</cbc:IssueDate>

    <!-- Invoice Period: Defines the billing period covered by this invoice -->
    <cac:InvoicePeriod>
        <cbc:StartDate>2011-08-01</cbc:StartDate>  <!-- Start of the billing period -->
        <cbc:EndDate>2011-08-31</cbc:EndDate>      <!-- End of the billing period -->
    </cac:InvoicePeriod>

    <!-- Supplier Information -->
    <cac:AccountingSupplierParty>
        <cac:Party>
            <cac:PartyName>
                <cbc:Name>Custom Cotter Pins</cbc:Name>  <!-- Name of the supplier issuing the invoice -->
            </cac:PartyName>
        </cac:Party>
    </cac:AccountingSupplierParty>

    <!-- Customer Information -->
    <cac:AccountingCustomerParty>
        <cac:Party>
            <cac:PartyName>
                <cbc:Name>North American Veeblefetzer</cbc:Name>  <!-- Name of the customer receiving the invoice -->
            </cac:PartyName>
        </cac:Party>
    </cac:AccountingCustomerParty>

    <!-- Total amount payable for this invoice -->
    <cac:LegalMonetaryTotal>
        <cbc:PayableAmount currencyID="CAD">100.00</cbc:PayableAmount>  <!-- Invoice total in CAD (Canadian Dollars) -->
    </cac:LegalMonetaryTotal>

    <!-- Line Items: Details of goods/services billed in this invoice -->
    <cac:InvoiceLine>
        <cbc:ID>1</cbc:ID>  <!-- Line item number -->
        
        <cbc:LineExtensionAmount currencyID="CAD">100.00</cbc:LineExtensionAmount>  <!-- Amount for this line item -->

        <cac:Item>
            <cbc:Name>Cotter Pin</cbc:Name>
            <cbc:Description>Cotter pin, MIL-SPEC</cbc:Description>  <!-- Description of the item being billed -->
        </cac:Item>
    </cac:InvoiceLine>

</Invoice>`