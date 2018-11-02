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

// Executes any MySQL query that does not delete data
router.post('/query', (req, res) => {

  let sql = req.body.query + ";";
  if (sql.toLowerCase().includes("delete from"))
  {
    res.status(403);
    res.send(JSON.stringify({ sqlMessage: "Attempt to delete user prohibited data" }));
  } else {

  // gets a sql connection
	pool.getConnection(function(err, connection) {

  // sends query to db
	connection.query(sql, function(error, results, fields) {
        	connection.release(); // releases connection after query goes through

		if (!error) {
      res.status(200); // sends a status code
      res.send(JSON.stringify(results)); // sends results recieved from sql
		} else {
      res.status(400);
      res.send(JSON.stringify(error));
		}
  });
	});
  }
});

// CREATE
router.post('/createCustomer', (req, res) => {

  // gets a sql connection
	pool.getConnection(function(err, connection) {

  // creates an object from json data passed from React fetch request
	let customer = {name: req.body.name, address: req.body.address};
  // sql query
	let sql = "INSERT INTO customers (name, address) VALUES ('" + customer.name + "', '" + customer.address + "')";
  // sends query to db
	connection.query(sql, function(error, results, fields) {
        	connection.release(); // releases connection after query goes through

		if (!error) {
      res.status(200); // sends a status code
      res.send(JSON.stringify(results)); // sends results recieved from sql
		} else {
      res.status(400);
      res.send(JSON.stringify(error));
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
                res.status(200);
                res.send(JSON.stringify(results));
                } else {
                res.status(400);
                res.send(JSON.stirngify(error));
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
                res.status(200);
                res.send(JSON.stringify(results));
                } else {
                  res.status(400);
                  res.send(JSON.stringify(error));
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
                  res.status(200);
                  res.send(JSON.stringify(results));
                } else {
                  res.status(400);
                  res.send(JSON.stringify(error));
                }
        });
        });
});


module.exports = router;
