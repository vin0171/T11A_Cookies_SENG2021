
let data = {
    // users + quizzes here

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
            owner: {
                authUserId: 1,
                email: "owner@gmail.com"
            },
            admins : [
                {
                    authUserId: 1,
                    email: "owner@gmail.com"
                },
                {
                    authUserId: 2,
                    email: "admin2@gmail.com"
                },
            ],
            members : [
                {
                    authUserId: 3,
                    email: "member1@gmail.com"
                },
            ],

        },
    ],
    users : [
        {
            authUserId: 1,
            email: "janecitizen@gmail.com",
            password: "password",
            nameFirst: "Jane",
            nameLast: "Citizen",
            numSuccessfulLogins: 1,
            numFailedPasswordsSinceLastLogin: 0,
            age: 18,
            gender: "Male",
            dateCreated: "01/01/2000",
            previousPasswords: []

        },
    ],
    sessions: [
        {
            sessionId: 1,
            userId: 1,
        }
    ]
}
