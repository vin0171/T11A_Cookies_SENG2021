module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    maxWorkers: 1,
    transform: {
        '^.+\\.(ts|tsx|js)$': 'ts-jest'
    },
    collectCoverage: false, // Enable coverage collection
    collectCoverageFrom: ["backend/*.{ts,tsx,js}", "!backend/app.ts", "!backend/InvoiceConverter.ts"], // Specify files to include
    coverageDirectory: "coverage", // Where to store reports
    coverageReporters: ["json", "text", "lcov"], // Output formats
};
