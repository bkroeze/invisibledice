var Dice = require('node-dice-js');
var _ = require('lodash');
var getDBDoc = require('./app/data').getDBDoc;

function rollDice(roll) {
  var dice = new Dice({throttles: {faces: 1000}});
  return dice.execute(roll);
}

// Basic Logging Callback
var logResult = function(err, data) {
  if (err) {
    console.log("error", err, err.stack);
  } else {
    console.log("saved", data);
  }
};

exports.handler = function(event, context) {
  var roll = event.dice;
  var err = null;
  var rv = null;

  if (roll === undefined || roll == null) {
    err = ("No dice specified");
  } else {
    if (!isNaN(roll)) {
      roll = "1d" + roll;
    }

    var username = event.username || "dummy";
    var timestamp = Date.now();
    var datestamp = (new Date()).toJSON();

    var result= rollDice(roll);

    rv = {
      result: result.outcomes[0].total,
      detail: result,
      dice: event.dice,
      user: username,
      roll: roll,
      date: datestamp,
      timestamp: timestamp
      // request: event.request || "None"
    };

    saveRecord = {
      TableName: "rolls",
      Item: {
        result: result,
        roll: roll,
        user: username,
        timestamp: timestamp,
        date: datestamp
      }
    };
    //console.log(saveRecord);
    getDBDoc().put(saveRecord, function(err, data) {
      if (_.has(event, 'callback')) {
        event.callback(err, data);
      }
      else {
        logResult(err, data);
      }
    });

    //console.log('Received event:', JSON.stringify(event, null, 2));
  }
  context.done(err, rv);
};
