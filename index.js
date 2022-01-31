const express = require('express');
const app = express();
const routeConf = require('./src/config/routeConfig');
const dbConf = require('./src/config/dbConfig');
const errorHandler = require('./src/middlewares/errorHandler');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const auth = require('./src/routes/auth');

// Set env variables
require('dotenv').config();

// Middleware to parse json body and url
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set cookie parser
app.use(cookieParser());

// Enable CORS Policy
app.use(cors({ origin: process.env.FRONT_URL, credentials: true })); // allow url of front's request
// credentials: true adds the "Access-Control-Allow-Credentials: true" header

app.use('/auth', auth);

// Start the server and set the port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));

// Set all routes
routeConf(express, app);

// Set custom error middleware
app.use(errorHandler);

//Handle unhandled promise errors
process.on('unhandledRejection', err => {
    console.log(`Unhandled Error: ${err}`);
    process.exit(1);
});

// Establish database Connection
dbConf();