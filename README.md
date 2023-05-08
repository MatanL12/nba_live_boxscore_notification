# Live Box Score Web App

## Introduction
This is the backend of a web app that presents live box score to the client using web socket and enables the user to register to a notification service. The user can define conditions for receiving notifications based on the live score of the game.For example, the user can set conditions such as receiving a notification if the score difference between the teams is less than 10 points and the fourth quarter is about to start. 

**Please note that this app is still in development and may contain bugs or incomplete features.** 

## Requirements
To use this app, you will need to have the following installed on your system:

Node.js
NPM

## Installation
Clone the repository to your local machine.
Navigate to the root folder of the project in your terminal.
Run npm install to install the necessary dependencies.

## Usage
Start the server by running npm start.
The server will start listening on port 8080 by default.
Connect to the server using a WebSocket client to receive live box score updates.
Register for notifications by sending a POST request to the /alerts/addAlert endpoint with the desired notification conditions in the request body.