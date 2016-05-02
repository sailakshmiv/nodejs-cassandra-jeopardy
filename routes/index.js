var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints: ['localhost']}); // ip here if not localhost
client.connect(function(err, res) {
  console.log('index: cassandra connected');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  var query;
  if (req.query.query !== undefined)
    query = req.query.query;
  else
    query = "SELECT * FROM leaks.jeopardy LIMIT 10;";
  client.execute(query, [], function(err, result) {
    console.log(result);
    if (err) {
      res.render('index', {
        error: err,
        result: {
          rows: []
        },
        query: query
      });
    }
    else {
      res.render('index', {
        result: {
          rows: result.rows,
          rowLength: result.rowLength
        },
        query: query
      });
    }
  });
});

module.exports = router;
