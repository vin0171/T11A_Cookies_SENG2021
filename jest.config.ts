module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    maxWorkers: 1,
    transform: {
      '^.+\\.(ts|tsx|js)$': 'ts-jest'
    },
    collectCoverage: false,  // Enable coverage collection
    collectCoverageFrom: ["backend/src/**/*.{ts,tsx,js}", "!backend/src/app.ts",], // Specify files to include
    coverageDirectory: "coverage", // Where to store reports
    coverageReporters: ["json", "text", "lcov"], // Output formats
};