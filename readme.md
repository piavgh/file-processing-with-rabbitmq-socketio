## Metron Cloud

### 1. Prerequisites

- [NodeJs](https://nodejs.org/en/)
- [NPM](https://npmjs.org/) - Node package manager

### 2. Installation
 
You need to setup RabbitMQ first (or use an instance from cloudampq.com)

You also need to install node-gyp library (in order to build bcrypt)
Instruction: https://github.com/nodejs/node-gyp#installation

Or for short on Windows:
```
$ npm install --global windows-build-tools
$ npm install -g node-gyp
```

```
 $ git clone https://scopic.git.beanstalkapp.com/MetronCloud.git
 $ cd MetronCloud
 $ cp .env.example .env (edit it with your secret key, database information, RabbitMQ connection, image folders, ...)
 $ npm install
 $ npm run migrate
 ```
 Finally, start and build the application:
 
 ```
 $ npm run build (For development)
 $ npm run build:prod (For production)
 ```
 In case you want to use the fake_service (to simulate the Windows desktop service in case you don't want to install to real service in your computer)

 ```
 $ npm run fake_service 
```

### 3. Usage

URL : http://localhost:3000/

Navigate to http://localhost:3000/swagger for the API documentation.

### 4. Useful Link
- Web framework for Node.js - [Express](http://expressjs.com/)
- JavaScript ORM  for Node.js - [Bookshelf](http://bookshelfjs.org/)
- SQL Query Builder for Postgres, MSSQL, MySQL, MariaDB, SQLite3, and Oracle - [Knex](http://knexjs.org/)
- JSON Web Tokens(jwt) - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- Logging Library - [Winston](https://www.npmjs.com/package/winston)
- Object schema validation  - [Joi](https://www.npmjs.com/package/joi)
- API documentation using [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc) and [swagger-ui](https://www.npmjs.com/package/swagger-ui)
- JavaScript library for building user interfaces - [React](https://facebook.github.io/react/)
- Predictable state container - [Redux](http://redux.js.org/)
- A React component library implementing Google's Material Design - [Material-UI](https://material-ui-1dab0.firebaseapp.com/)
- Redux Form - [Redux Form](http://redux-form.com/7.4.2/)
- Declarative routing for React - [React-Router](https://reacttraining.com/react-router/)
- Promise based HTTP client - [Axios](https://github.com/mzabriskie/axios)
- Code linting tool - [ESLint](http://eslint.org/)

### 2. Build
1. Build frontend app:

Config base url in client/config/config.js

npm run build:client

Result in folder client-build
Zip the folder and deploy to server
