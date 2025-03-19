# T11A_Cookies_SENG2021

## Getting Started

Follow these steps to set up and run the project on your local machine:

### 1. Clone the Repository

First, fork the repository on GitHub, then clone it to your WSL/local computer.

### 2. Navigate to the Repository

```sh
cd T11A_Cookies_SENG2021
```

### 3. Install Dependencies

Run the following command to install the required dependencies and modules:

```sh
npm i
```
Run the following shell script
```sh
./setupDynamoDbLocal.sh
```

### 4. Start the Server

Once all dependencies have been installed, start the server with:

```sh
npm run start
```

## Additional Commands

### Run Linter

To check for linting issues, run:

```sh
npm run lint
```

### Run Unit Tests

To execute unit tests, use:

```sh
npm run test
```
Note: DynamoDB Local is a tool provided by AWS for local development and testing. Please review the DynamoDB Local License Agreement https://aws.amazon.com/dynamodb/dynamodblocallicense/ to ensure compliance with the terms before using it. This setup is intended for local development use only, and DynamoDB Local should not be redistributed or used in a commercial service.