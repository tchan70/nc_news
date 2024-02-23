# Toby News API

## Overview

Welcome to the Toby News API! This project serves as a backend service for accessing application data programmatically, similar to popular platforms like Reddit. Built with Node.js and PostgreSQL, this API provides endpoints to interact with various resources such as topics, articles, comments, and users.

You can access the hosted version of the news API at [toby-news](https://toby-news.onrender.com)

## Installation

To get started locally, follow these steps:

1. Clone the repository:

   ```git clone https://github.com/tchan70/nc_news```

2. Navigate into the project directory:

   ```cd nc_news```

3. Install dependencies:
 
   ```npm install```

4. Create the necessary environment files:
   
   i.  Create a ```.env.development``` file in the parent file, for development environment variables and link it to the development database.
  
   ii. Create a ```.env.test``` file in the parent file, for test environment variables and link it to the test database.
  
   An example of what it should look like can be seen at the ```.env-example``` file

5. Setup your local PSQL database and seed it with the initial data:

   ```npm run setup-dbs```

## Running tests

To run tests you will use the following commmand:
```npm test```

You will also need to require in the following:
```
const app = require("../app.js")
const db = require("../db/connection")
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index.js')
const endpoints = require('../endpoints.json')
beforeEach(() => seed(testData))
afterAll(() => db.end())
```
## Minimum Requirements

To run the project locally, ensure you have the following minimum versions installed:
Node.js: v21.5 or higher
PostgreSQL: v14.1.0 or higher
