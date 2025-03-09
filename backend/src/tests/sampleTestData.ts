
export const sampleInvoiceDetails = {
    sender: {
        companyName: "ABC Corp",
        address: "123 Business St, City, Country",
        country: "USA",  
        phone: "+123456789",
        email: "billing@abccorp.com",
        taxIdentificationNumber: "AB123456",
        bankName: "Bank XYZ",
        bankAccount: "987654321",
        iban: "US12345678901234567890",  
        swift: "XYZBANK123"  
    },
    receiver: {
        companyName: "GlobalTech GmbH",
        address: "456 Innovation Blvd, Berlin, Germany",
        country: "Germany",
        phone: "+49 30 1234567",
        email: "billing@globaltech.com",
        taxIdentificationNumber: "DE123456789",
        bankName: "Deutsche Bank",
        bankAccount: "1234567890",
        iban: "DE89370400440532013000",
        swift: "DEUTDEFF"
    },
    issueDate: 1741394440, 
    dueDate: 1753490385089,
    repeating: false,
    currency: "USD",
    notes: "Random note for testing pruposes",
    items: [{
        itemSku: "SKU7984",
        itemName: "Product Beta",
        description: "Description for Product Beta",
        quantity: 9,
        unitPrice: 324.38,
        discountAmount: 43.9,
        taxAmount: 42.07,
        taxRate: 15,
        totalAmount: 2902.95
      }
    ],
    terms: "Net 30 days, 2% discount if paid within 10 days. Late fee of 1.5% per month after due date."
}

export const sampleInvoiceDetails1 = {
    sender: {
        companyName: "TechPro Solutions",
        address: "789 Silicon Valley, San Jose, CA, USA",
        country: "USA",
        phone: "+14085551234",
        email: "accounts@techprosolutions.com",
        taxIdentificationNumber: "US987654321",
        bankName: "Wells Fargo",
        bankAccount: "246813579",
        iban: "US98765432101234567890",
        swift: "WFBIUS6S"
    },
    receiver: {
        companyName: "Innovatech Ltd.",
        address: "321 Tech Park, London, UK",
        country: "UK",
        phone: "+44 20 79461234",
        email: "billing@innovatech.co.uk",
        taxIdentificationNumber: "GB987654321",
        bankName: "Barclays",
        bankAccount: "1122334455",
        iban: "GB29BARC20201530093459",
        swift: "BARCGB22"
    },
    issueDate: 1744057580,
    dueDate: 1756306486593,
    repeating: true,
    currency: "GBP",
    notes: "Thank you for your business. Please ensure timely payment.",
    items: [{
        itemSku: "SKU4521",
        itemName: "Product Alpha",
        description: "Premium quality Product Alpha with all features.",
        quantity: 15,
        unitPrice: 499.99,
        discountAmount: 75.0,
        taxAmount: 60.00,
        taxRate: 12,
        totalAmount: 7499.85
      },
      {
        itemSku: "SKU6732",
        itemName: "Product Gamma",
        description: "Product Gamma with enhanced performance and specifications.",
        quantity: 7,
        unitPrice: 849.00,
        discountAmount: 60.0,
        taxAmount: 95.88,
        taxRate: 15,
        totalAmount: 5581.88
      }
    ],
    terms: "Net 45 days, 5% discount if paid within 15 days. Late fee of 2% per month after due date."
};

export const sampleInvoiceDetails2 = {
    sender: {
        companyName: "GreenTech Industries",
        address: "123 Greenway Ave, New York, NY, USA",
        country: "USA",
        phone: "+12124567890",
        email: "accounts@greentech.com",
        taxIdentificationNumber: "US456789012",
        bankName: "Citibank",
        bankAccount: "345678901",
        iban: "US45678901234567890123",
        swift: "CITIUS33"
    },
    receiver: {
        companyName: "Tech Innovators Ltd.",
        address: "987 Innovation Rd, Toronto, Canada",
        country: "Canada",
        phone: "+1 416 5559876",
        email: "billing@techinnovators.ca",
        taxIdentificationNumber: "CA123456789",
        bankName: "Royal Bank of Canada",
        bankAccount: "9876543210",
        iban: "CA12345678901234567890",
        swift: "ROYCANM4"
    },
    issueDate: 1745018280,
    dueDate: 1757237283478,
    repeating: false,
    currency: "CAD",
    notes: "Please refer to the invoice number for any inquiries.",
    items: [{
        itemSku: "SKU9983",
        itemName: "Product Delta",
        description: "High-end Product Delta for industrial use.",
        quantity: 5,
        unitPrice: 1500.75,
        discountAmount: 200.00,
        taxAmount: 180.09,
        taxRate: 12,
        totalAmount: 7403.75
      },
      {
        itemSku: "SKU5401",
        itemName: "Product Omega",
        description: "Product Omega with advanced functionality for professionals.",
        quantity: 10,
        unitPrice: 920.50,
        discountAmount: 120.00,
        taxAmount: 138.08,
        taxRate: 15,
        totalAmount: 9605.00
      }
    ],
    terms: "Net 30 days, 3% discount if paid within 10 days. Late fee of 1% per month after due date."
};

export const companyData = {
    name: 'Tech Corp',
    address: '123 Tech Street',
    city: 'San Francisco',
    state: 'CA',
    postcode: '94105',
    phone: '123-456-7890',
    email: 'adminOfCompanyEmail@gmail.com',
    password: 'adminOfCompanyPw@gmail.com', 
};


export const companyData2 = {
    name: 'Company Two',
    address: '123 Tech Street',
    city: 'San Francisco',
    state: 'CA',
    postcode: '94105',
    phone: '123-456-7890',
    email: 'company2@example.com',
    password: 'password123',
};