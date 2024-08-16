# Email Notification System

## Overview
A Node.js-based system for processing and sending emails.

## Installation
1. Clone the repository:https://github.com/kartik-tlp/mailnotify_api.git

# Install dependencies:

Open two separate terminal windows.

* Navigate to the main server directory in the first terminal and install the required dependencies by running:

cd /path/to/main/server
npm install

* In the second terminal, navigate to the worker directory and install its dependencies by running

cd /path/to/worker
npm install


# Configure Environment Files.

* Ensure that all necessary credentials (such as database connection strings, API keys, etc.) are stored in the .env files for both the main server and the worker microservice.

* The .env file should include variables that are referenced in the code using process.env.

3. Set Up Environment Variables

* For the main server, ensure the .env file is correctly placed in the root directory of the main server. Verify that it contains all necessary credentials and environment-specific settings.

* Similarly, for the worker microservice, place the .env file in the root directory of the worker and ensure it has all required configurations.

# Establish Redis And Database Connection

* Database Connection 
  Download Xampp and start the apache and Mysql server
  Create a database (emailnotificationdb)
  Create table (user_email_data)
  Integrate all the credentials into db.js file other put it into .env

* Redis Connection 
  Download file by the given link below :-
  https://github.com/tporadowski/redis/releases/download/v5.0.14.1/Redis-x64-5.0.14.1.msi
  Setup redis in your system 
  Open CMD and navigate to programme files start redis server
  

# start the application 

* In the first terminal (main server directory), start the server by running:
  npm start

You should see the following in the terminal:
 * Server listening on port 3000
 * Database connected
 *  Redis connected

 * In the second terminal (worker directory), start the worker process by running:
   npm start

 The terminal should display
 * Waiting for new email in the queue...

 * By following these steps, you’ll have both the main server and worker microservice running, with the main server handling incoming requests and the worker processing emails from the queue asynchronously

## Architecture

Whole Node.js Application follows the format of MVC (Model view Controller)


# server
* app.js serves as the entry point for the main server.
* bin/www contains the server logic and integration.
* SQL queries are managed within userModel.
* Application logic is handled by userController.
* SMTP is utilized for sending emails.
* router/index.js file is sending request to controller where the logical function to handle request is defined 
* config/db.js contains the databse connection 
* redisConnection.js contains the redis connection

# worker
* index.js serves as the main the file in which functional is written to monitor the queue
* Mail sending logic where the SMTP is integrated is written in the controller/mailController.js
* Mail Model is served as update mail status logic is written , update mail status function is triggered when the send mail function gives status == 'success'
* db.js contain the databse credentials 



* Express.js Framework: This serves as the core of the server-side application, handling HTTP requests and routing them to the appropriate controllers. Express is lightweight and perfect for building RESTful APIs

* Database Layer :-MySQL: Relational database, offering a structured schema for storing email information.

* RESTful API Endpoints:
 /api/compose: Handles POST requests to compose  an email for sending having default status pending. The request body includes to, mailsubject, and content fields

 /api/sendMail: Handle Post Request to send an email into queue . The request body includes emailId.

 /api/getEmailStatus : Handle POST requests to fetch email status from the database based on the request body. If the body contains an emailId, return the email data corresponding to that ID. If the body includes a status, return email data filtered by that status. If neither emailId nor status is provided, return all email records

 * Process
 When a request to send an email is made, the /api/sendMail endpoint processes the request by retrieving the email data from the database based on the provided email ID and then enqueues it for sending. The email payload is sent to a queue worker service that processes emails in a First-Come-First-Out (FIFO) order

If the queue is empty, the worker logs a message to the console stating "Waiting for new emails in the queue." If there are emails in the queue, the worker logs a message indicating "Processing to send emails" along with the number of emails remaining in the queue. As each email is processed, the count of remaining emails decreases accordingly. The worker sends a success response upon successful integration of the send mail function.

## 2 The db.js and redisConnection.js files have been created to address deployment issues. When the application is deployed, the  worker directorie were unable to access the credentials for Redis and the database from the environment files located in the server directory, leading to errors. These files ensure that both the server and worker services have access to the necessary credentials.








 



