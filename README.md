# Book CMS

**Description**: This is a Book CMS that allows users to create accounts, input book data, edit book details, delete books, and all the data is stored in the databases.

## Table of Contents

- [Requirements](#Requirements)
- [Installation](#installation)
- [Testing](#testing)
- [Running the Project](#running-the-project)
- [Usage](#usage)

## Requirements

- Docker
- Docker-compose
- AWS CLI (for DynamoDB local setup)
- Node.js

## Installation

1. Install dependencies:
    ```bash
    npm i
    ```

2. Use Docker Compose for development:
    ```bash
    docker-compose -f docker-compose.dev.yml up --build
    ```

3. Run PostgreSQL migrations inside Docker:
    ```bash
    docker exec -it nestjs_backend_dev npm run db:migrate
    ```

4. Create table in DynamoDB (local) for user activity logs:
    ```bash
    aws dynamodb create-table --cli-input-json file://dynamodb/createUserActivityTable.json --endpoint-url http://localhost:8000
    ```
## Running the Project

Development:
```bash
# Run all services
docker-compose -f docker-compose.dev.yml up
```

## Testing
Run unit tests:

```bash
npm run test
```

Run e2e tests inside Docker for DB connection:

```bash
docker exec -it nestjs_backend_dev npm run test:e2e
```

## Usage

You can use Postman API Collection for manual testing or developing APIs. Import the provided Postman collection to get started with testing the endpoints.

You can find the **CMS_API.postman_collection.json** file in the project.

This file contains the Postman API collection. To import it into your Postman, follow these steps:

1. Open Postman
2. Click on File > Import....
3. Simply drag and drop the file into the import window.

All requests have meaningful names that reflect their functions.
The request body and variables are also provided separately.

To perform basic book management operations, first execute the Create user request or Login user request if the user already exists. Then, take the token from the response and insert it into the headers:
**Authorization: Token yourtokenasdAasdfasfasf...**