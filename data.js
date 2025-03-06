let data = {
    companies : [
        {
            companyId: 1,
            name: "Company 1",
            address: "20 Barker Street",
            city: "Sydney",
            state: "NSW",
            postcode: "2000",
            phone: "123-456-7890",
            email: "pleaseHireMe@gmail.com",
            // A userId corresponding to the owner of this company
            owner: 1,
            // A list of userIds that are admins of this company
            admins: [ 1, 2 ],
            // A list of userIds that are members of this company
            members: [ 3 ],
            // Invoices are divided into three groups: MAIN, TRASH and ARCHIVE
            invoices: {
                // Invoice ID's
                main: [ 1, 2, 3 ],
                trash: [],
                archive:[]
            }
        },
    ],

    users : [
        {
            authUserId: 1,
            email: "janecitizen@gmail.com",
            // Stores the hash of the password
            password: "passwordHash",
            nameFirst: "Jane",
            nameLast: "Citizen",
            numSuccessfulLogins: 1,
            numFailedPasswordsSinceLastLogin: 0,
            age: 18,
            gender: "Female",
            //  Using unix timestamps to avoid timezone issues as well as international trades
            timeCreated: 1683125870,     
            previousPasswords: []
        },
    ],

    invoices: [
        {
            invoiceId: 1,
            sender: {
                companyName: "Company 1",
                address: "20 Barker Street",
                phone: "555-4321",
                email: "sales@xyzltd.com",
                vatNumber: "US987654321",
                taxIdentificationNumber: "987-65-4321"
            },
            receiver: {
                companyName: "Company 2",
                address: "21 Barker Street",
                phone: "04-555-4321",
                email: "sales@abcltd.com",
                vatNumber: "US987654321",
                taxIdentificationNumber: "987-65-4311"                           
            },
            //  Using unix timestamps to avoid timezone issues as well as international trades
            issueDate: 1741238400,
            dueDate: 1743830400,
            repeating: true,
            // Not to be confused with groups: but this should be an ENUM: COMPLETE, PENDING ectera
            status: PENDING,
            // This will either be in MAIN, TRASH or ARCHIVE
            groupState: MAIN,
            items: [
                {  
                    // SKU is for businesses inventory management i think its needed here 
                    itemSku: "skt4234324",
                    itemName: "Tree",
                    description: "Stylised Tree",
                    quantity: 20,
                    unitPrice: 12.05,
                    discountAmount: 13.04,
                    taxAmount: 0.0,
                    taxRate: 0.0,
                    totalAmount: 247.86
                }
            ],
            currency: "AUD",
            notes: "thumbs up me in discord if you ACTUALLY read this"
        },
    ],
    
    sessions: [
        {
            sessionId: 1,
            userId: 1,
        }
    ],
    noOfCompanies: 1,
    noOfUsers: 3,
}
