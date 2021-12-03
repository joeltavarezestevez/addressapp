const express = require('express');
const request = require('request');
const app = express.Router();

// index page
app.get('/', function(req, res) {
    res.render('pages/index');
});

//Create new customer page
app.get('/create', function(req, res) {
    res.render('pages/create');
});

//Edit customer page
app.get('/edit/:customerId', function(req, res) {
    request({
        url: 'http://localhost:3000/api/v1/customers/' + req.params.customerId, //on 3000 put your port no.
        method: 'GET',
    }, function (error, response, body) {
        if(error) {
            alert(error.message);
            return;
        }
        res.render('pages/edit', {customer:JSON.parse(body)});
    });
});

//View customer page
app.get('/view/:customerId', function(req, res) {
    request({
        url: 'http://localhost:3000/api/v1/customers/' + req.params.customerId, //on 3000 put your port no.
        method: 'GET',
    }, function (error, response, body) {
        if(error) {
            alert(error.message);
            return;
        }
        res.render('pages/view', {customer:JSON.parse(body)});
    });
});

//Add new address page
app.get('/address/:customerId/new', function(req, res) {
    request({
        url: 'http://localhost:3000/api/v1/customers/' + req.params.customerId, //on 3000 put your port no.
        method: 'GET',
    }, function (error, response, body) {
        if(error) {
            alert(error.message);
            return;
        }
        res.render('pages/addressnew', {customer:JSON.parse(body)});
    });    
    
});

//Edit address page
app.get('/address/:customerId/edit/:addressId', function(req, res) {
    request({
        url: 'http://localhost:3000/api/v1/addresses/' + req.params.customerId + "/" + req.params.addressId,
        method: 'GET',
    }, function (error, response, body) {
        if(error) {
            alert(error.message);
            return;
        }
        console.log(JSON.parse(body).address);
        res.render('pages/addressedit', {
            customer: JSON.parse(body).customer,
            address: JSON.parse(body).address,
        });
    });
});

module.exports = app;