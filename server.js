require('dotenv').config()

// Modules required for the server
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//database config file
const dbConfig = require('./config/database.config.js');

//Routes required
var appRouter = require('./routes/app.routes.js');
var customerRouter = require('./routes/customer.routes.js');
var addressRouter = require('./routes/address.routes.js');

//Creates an express app
const app = express();

//Set ejs as the template engine
app.set('view engine', 'ejs');

//Setting to parse application/x-www-form-urlencoded request
app.use(bodyParser.urlencoded({ extended: true }))

//Setting to parse application/json requests
app.use(bodyParser.json())

//Setting static files path
app.use(express.static(__dirname + '/public'));

// Configuring and connecting to the database
mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. See error below...', err);
    process.exit();
});

app.use('/app', appRouter);
app.use('/api/v1/customers', customerRouter);
app.use('/api/v1/addresses', addressRouter);

app.listen(process.env.PORT, function() {
  console.log('Addressapp server is listening on '+ process.env.PORT);
})

