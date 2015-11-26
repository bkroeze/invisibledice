var Dice = require('node-dice-js');

function rollDice(roll) {
    var dice = new Dice({throttles: {faces: 1000}});
    return dice.execute(roll);
}

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

        var result= rollDice(roll);

        var rv = {
            result: result.outcomes[0].total,
            detail: result,
            dice: event.dice,
            roll: roll
            // request: event.request || "None"
        };
        //console.log('Received event:', JSON.stringify(event, null, 2));
    }
    context.done(err, rv);
};
