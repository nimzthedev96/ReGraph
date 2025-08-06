# :signal_strength: ReGraph - Built for a university project
A web application that allows users to create reports from an uploaded file. Different types of reports (pie charts and bar graphs) can be generated at the click of a button. These reports can then be downloaded as a single PDF document.

This repository contains both the frontend and backend applications, in seperate directories. The two applications communicate via RESTful APIs (using JSON). Authentication is done via JWT tokens.

### Tech stack
* `node.js`
* `React`
* `MongoDB` 
* And a number of `npm`  packages (all available in this repository)

<br/>

## Installing and running the application locally

### Prerequisites
* [Create a MongoDB cloud account](https://account.mongodb.com/account/register). Follow the steps provided on screen. Once you have a DB connection string for your cluster, you may need to whitelist your IP address as well. You will see an error when starting the backend application indicating this, if required.
*  [Download and install node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) on your machine

### Running the application locally

1. Download this repository
2. Configure environment variables in backend/config.env\
   `DB_CONNECTION_STRING="Insert your Mongo Atlas DB connection string here"`\
   `UPLOADS_FILE_PATH=directory/to/save/uploaded/files`
3. Navigate to the backend directory and start the backend application by running\
   `npm run start`\
   _Note that the backend application needs to be started before the frontend application_
4. Then navigate to the frontend directory and start the front end application by running\
   `npm run start`\
   Your browser should open the application on localhost.

<br/>

## Running tests
Only the backend portion of the application has unit tests. Therefore, navigate to the backend directory and run\
`npm run test`
