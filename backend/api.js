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

// Dennies Functions
//
//

router.post('/getInv', (req, res) => {

  let bar = req.body.bar;
  let item = req.body.item;
  let date = req.body.date;

  let sql = "SELECT COUNT(*) as item_sales FROM Sells s, Bill_Items bi, Bills b WHERE s.bar = bi.bar AND s.item = bi.item AND bi.billId = b.id AND s.bar = '" + bar + "' AND bi.item = '" + item + "' AND DATE(b.date) = '" + date + "';";

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
});



router.post('/getSold', (req, res) => {

  let bar = req.body.bar;

  let sql = "SELECT s.item, COUNT(*) as items_sold FROM Sells s, Bill_Items b WHERE s.bar = b.bar AND s.item = b.item AND s.bar = '" + bar + "' GROUP BY s.item, s.bar;";

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
});

////////////////////////////////////////////////////////////////////////
///////////////////// END Dennies Functions ////////////////////////////
////////////////////////////////////////////////////////////////////////

/*
 *	DRINKERS PAGE
 */

// get transactions for a sepcific drinker ordered by time and grouped by bar
router.post('/getTransactionsForDrinker', (req, res) => {

  let drinker = req.body.drinker;

  let sql = "SELECT * FROM Bills WHERE drinker = '" + drinker + "' GROUP BY bar ORDER BY date;";

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
});

router.post('/getDrinkersTopBeers', (req, res) => {

  let drinker = req.body.drinker;

  let sql = "SELECT b.id, b.date, bi.item, COUNT(bi.item) as Quantity FROM Bills b, Bill_Items bi, Items i WHERE b.id = bi.billid AND bi.item = i.name AND i.type <> 'food' AND b.drinker = '" + drinker + "' GROUP BY bi.item ORDER BY Quantity DESC LIMIT 3;";

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
});


/*
 *   SQL INTERFACE PAGE
 */
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


/*
 *  BAR PAGE
 */

 // Given a bar, return top 10 drinkers who are the top spenders
router.post('/getTop10Spenders', (req, res) => {

  let bar = req.body.bar;

  let sql = "SELECT b.drinker, SUM(b.total) as spent FROM Bills b, Bills b1 WHERE b.drinker = b1.drinker AND b.id = b1.id AND b.bar = b1.bar AND b.bar = '" + bar + "' GROUP BY b.drinker ORDER BY spent DESC LIMIT 10;";

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

        let sql = "SELECT * FROM Drinkers";
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
