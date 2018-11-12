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

/*
 *  BEER PAGE
 */

// show bars where this beer sells the most (again only top 10)
 router.post('/getBarsForBeer', (req, res) => {

        let beer = req.body.beer;
        let sql = "SELECT b1.bar, (SELECT COUNT(b3.item) as sold FROM Bill_Items b3 WHERE b1.bar = b3.bar AND b3.item = '" + beer + "') as sold FROM Bill_Items as b1 GROUP BY b1.bar ORDER BY sold DESC LIMIT 10;";

         pool.getConnection(function(err, connection) {

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

// drinkers who are the biggest consumers of this beer
  router.post('/getTopBeerConsumers', (req, res) => {

         let beer = req.body.beer;
         let sql = "SELECT b.drinker, COUNT(b.drinker) as bought FROM Bills b, Bill_Items bi WHERE b.id = bi.billid AND bi.item = '" + beer + "' GROUP BY b.drinker ORDER BY bought DESC LIMIT 10;";

          pool.getConnection(function(err, connection) {

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

  // time distribution of when this beer sells the most.
  // How many sold per date
    router.post('/beerTdDate', (req, res) => {

           let beer = req.body.beer;
           let sql = "SELECT DATE(b.date) as date, COUNT(b.id) as sold FROM Bills b, Bills b1, Bill_Items bi WHERE b.id = bi.billid AND b.id = b1.id AND b.bar = bi.bar AND bi.item = '" + beer + "' AND DATE(b.date) = DATE(b1.date) GROUP BY DATE(b.date) ORDER BY sold DESC;";

            pool.getConnection(function(err, connection) {

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

    // time distribution of when this beer sells the most.
    // How many sold per time of day
    router.post('/beerTdTime', (req, res) => {

           let beer = req.body.beer;
           let sql = "SELECT TIME(b.date) as time, COUNT(b.id) as sold FROM Bills b, Bills b1, Bill_Items bi WHERE b.id = bi.billid AND b.id = b1.id AND b.bar = bi.bar AND bi.item = '" + beer + "' AND TIME(b.date) = TIME(b1.date) GROUP BY TIME(b.date) ORDER BY sold DESC;";

            pool.getConnection(function(err, connection) {

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


/*
 *	DRINKERS PAGE
 */

// get transactions for a sepcific drinker ordered by time and grouped by bar

router.get('/getDrinkers', (req, res) => {

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

/*
 *  Bartenders
 */

 router.get('/getBartenders', (req, res) => {

         pool.getConnection(function(err, connection) {

         let sql = "SELECT * FROM Bartenders";
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

module.exports = router;
