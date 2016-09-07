var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');
var now = require("performance-now");

var client = new cassandra.Client({contactPoints: ['0.0.0.0']}); // ip here if not localhost
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
  var start = now();
  client.execute(query, [], function(err, result) {
    var end = now();
    var time = (end-start).toFixed(1);
    console.log(result);
    if (err) {
      res.render('index', {
        error: err,
        query: query
      });
    }
    else {
      res.render('index', {
        result: {
          rows: result.rows,
          rowLength: result.rowLength,
          time: time
        },
        query: query
      });
    }
  });
});

module.exports = router;
