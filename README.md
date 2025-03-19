# T11A_Cookies_SENG2021

# DynamoDB Local Setup Script

This script automates the download and setup of DynamoDB Local for development purposes.

## Usage
- This script is intended for internal or personal use only.
- It automates the download of DynamoDB Local from AWS's official source.

**Important**: DynamoDB Local is governed by AWS's [DynamoDB Local License Agreement](https://aws.amazon.com/dynamodb/local/). Please review the license before using.

## Disclaimer
This script does not redistribute DynamoDB Local. It will download the software directly from AWS. You are required to have a valid AWS account and comply with their licensing terms.



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
