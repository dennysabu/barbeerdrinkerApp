var config = require('./config.json'); // MySQL DB config data
var mysql = require('mysql'); // MySQL CRUD
var express = require('express'); // Backend config

// Create Express router to route to index.js express app
var router = express.Router();

// MySQL Create a Pool for Connection
var pool = mysql.createPool({
        host: config.host,
        user: config.user,
        port: config.port,
        password: config.password,
        database: config.database,
	      multipleStatements: true
});

// CREATE
router.post('/createCustomer', (req, res) => {

	pool.getConnection(function(err, connection) {

	let customer = {name: req.body.name, address: req.body.address};
	let sql = "INSERT INTO customers (name, address) VALUES ('" + customer.name + "', '" + customer.address + "')";
	connection.query(sql, function(error, results, fields) {
        	connection.release();

		if (!error) {
		res.json({
        		statusCode: 200,
        		response: "New Customer Added!"
        	});
		} else {
		res.json({
			statusCode: 400,
			response: err
		});
		}
       	});
	});
});

// READ
router.get('/getCustomers', (req, res) => {

        pool.getConnection(function(err, connection) {

        let customer = {name: req.body.name, address: req.body.address};
        let sql = "SELECT * FROM customers";
        connection.query(sql, function(error, results, fields) {
                connection.release();

                if (!error) {
                res.json({
                        statusCode: 200,
                        response: results
                });
                } else {
                res.json({
                        statusCode: 400,
                        response: err
                });
                }
        });
        });
});

// UPDATE
router.patch('/updateCustomer', (req, res) => {

        pool.getConnection(function(err, connection) {

        let customer = {name: req.body.name, address: req.body.address};
        let sql = "UPDATE customers SET address = '" + customer.address + "' WHERE name = '" + customer.name + "'";
        connection.query(sql, function(error, results, fields) {
                connection.release();

                if (!error) {
                res.json({
                        statusCode: 200,
                        response: "Customer Updated!"
                });
                } else {
                res.json({
                        statusCode: 400,
                        response: err
                });
                }
        });
        });
});

// DELETE
router.delete('/removeCustomer', (req, res) => {

        pool.getConnection(function(err, connection) {

        let customerName = req.body.name;
        let sql = "DELETE FROM customers WHERE name = '" + customerName + "'";
        connection.query(sql, function(error, results, fields) {
                connection.release();

                if (!error) {
                res.json({
                        statusCode: 200,
                        response: "Customer Deleted!"
                });
                } else {
                res.json({
                        statusCode: 400,
                        response: err
                });
                }
        });
        });
});


module.exports = router;
