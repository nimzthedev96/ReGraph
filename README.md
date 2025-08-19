# :signal_strength: ReGraph - Built for a university project

A web application that allows users to create reports from an uploaded file. Different types of reports (pie charts and bar graphs) can be generated at the click of a button. These reports can then be downloaded as a single PDF document.

This repository contains both the frontend and backend applications, in seperate directories. The two applications communicate via RESTful APIs (using JSON). Authentication is done via JWT tokens.

### Tech stack

- `node.js`
- `React`
- `MongoDB`
- And a number of `npm` packages (all available in this repository)

### Project structure

#### backend

- `app.js`: This is where the backend application runs
- `/models`: MongoDB models are defined here for each entity we store
- `/middleware`: Contains our custom middleware - currently only authentication
- `/routes`: Contains routes per module
- `/controllers`: Contains the main business logic for each module
- `/test`: Contains all unit tests for the application

#### frontend

- `/src/App.js`: The single page application component that controls what the user sees on screen based on state
- `/src/components`: Contains custom reusable react components
- `/src/context`: Contains context providers to manage global state for authentication and alerts
- `/src/modules`: Contains each modules components
- `/public`: Static assets that are served from the app

<br/>

## Installing and running the application locally

### Prerequisites

- [Create a MongoDB cloud account](https://account.mongodb.com/account/register). Follow the steps provided on screen. Once you have a DB connection string for your cluster, you may need to whitelist your IP address as well. You will see an error when starting the backend application indicating this, if required.
- [Download and install node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) on your machine

### Running the application locally

1. Download this repository
2. Configure environment variables in for the backend application in backend/.env\
   `DB_CONNECTION_STRING="Insert your Mongo Atlas DB connection string here"`\
   `UPLOADS_FILE_PATH=directory/to/save/uploaded/files`
   `PORT=3002`
3. Open your terminal and navigate to the `backend` directory and install all depencies by running\
   `npm install`
4. While still in `backend` directory, start the back-end application by running\
   `npm run start`\
   _Note that the backend application needs to be started before the frontend application_
5. Configure environment variables in for the frontend application in frontend/.env\
   _This is only required if you changed PORT environment variable in backend/.env_
   `REACT_APP_BACKEND_URL="http://localhost:3002"`\
6. Then navigate to the `frontend` directory and install all depencies by running\
   `npm install`
7. While still in `frontend` directory, and start the front-end application by running\
   `npm run start`\
   Your browser should open the application on localhost.

<br/>

## Running tests

Only the backend portion of the application has unit tests. Therefore, navigate to the backend directory and run\
`npm run test`
