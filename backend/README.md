# Backend

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
- [Navigating the code](#Navigating-the-code)
- [Acknowledgements](#acknowledgements)
- [Roadmap](#roadmap)

# Overview

This folder stores the backend and API for the web application. The backend is created using MongoDB, Express and Node, and
tested using Postman and Docker.

## Getting Started

### Installation

1. [Clone](https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories) this repository

```console
git clone https://github.com/wes-w-z-h/laughing-couscous.git
```

2.  Install LTS version of [Node](https://nodejs.org/en) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

    Node version: 20.14.0

    npm version: 10.7.0

<br />

3.  Install backend dependencies

```console
cd backend/
```

```console
npm install
```

<br />

4. Setup the database. Guide to setting up MongoDB can be found [here](https://www.mongodb.com/docs/manual/tutorial/getting-started/)

   MongoDB version: 7.0.11

   Mongoose verison: 8.3.4

<br />

5. Configure environment variables

   Create a new file .env in the backend directory

   Insert the following environment variables in the file, replacing the text wrapped in <> with your own private keys

```console
PORT=4000
JWT_KEY=<YOUR_SECRET_KEY>
MONGO_URI=<YOUR_URI_TO_DB>
```

### Usage

1. To start the backend server, run:

```console
npm run dev
```

<br />

2. Open [http://localhost:4000](http://localhost:4000) to view it in the browser.

<br />

3. To test the API endpoints, use [Postman](https://learning.postman.com/docs/getting-started/overview/)
   or run the test script using the following commands:

```console
cd tests
./run_api_tests.sh local
```

## Navigating the code

This is the folder structure for the backend

```console
├── Dockerfile
├── README.md
├── app.ts
├── config
├── controllers
├── models
├── node_modules
├── package-lock.json
├── package.json
├── routes
├── server.ts
├── start_server.sh
├── tests
├── tsconfig.json
├── types
└── util
```

## Roadmap

### COMPLETED

1. [x] Database, Models and Schemas

2. [x] Routes for Users and Swaps

3. [x] User Login and Registration

### IN PROGRESS

1. [x] Authentication using JWT

2. [x] API for users

3. [x] Request Validation

4. [x] API Endpoints testing using Postman and Docker

### TODO

1. [ ] Matching algorithm to optimise matches

2. [ ] In-app Chat

3. [ ] Unit tests using Jest

## Acknowledgements

This project uses [ESLint](https://eslint.org/) with [Airbnb's ESLint config](https://www.npmjs.com/package/eslint-config-airbnb-typescript).
