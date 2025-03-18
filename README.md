Development 

docker-compose -f docker-compose.dev.yml up --build

Production

docker-compose -f docker-compose.prod.yml up --build

Run DB migrations

sudo docker exec -it nestjs_backend_dev npm run db:migrate

Connect to DB with this command

sudo docker exec -it nestjs_db_dev psql -U admin -d holywater

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
