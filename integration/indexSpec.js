require('jasmine-expect');
var aws = require('../spec/aws_mocks');
var index = require('../index.js');
var db = require('../app/data');

function createTestTable(done) {
  var table = {
    TableName: 'rolls',
    KeySchema: [
      {
        AttributeName: 'user',
        KeyType: "HASH"
      },
      {
        AttributeName: 'timestamp',
        KeyType: "RANGE"
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'user',
        AttributeType: "S"
      },
      {
        AttributeName: 'timestamp',
        AttributeType: "N"
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 2,
      WriteCapacityUnits: 2
    }
  };
  console.log('Creating rolls table');
  db.getDB().createTable(table, function(err, res) {
    if (err) {
      throw err;
    }
    //console.log("result", res);
  });
  setTimeout(waitUntilActive, 200, 'rolls', done)
}

function waitUntilActive(name, done) {
  db.getDB().describeTable({TableName: name}, function(err, res) {
    if (err) {
      return done(err);
    }
    if (res.Table.TableStatus == 'ACTIVE') {
      return done(null, res);
    }
    console.log('waiting for table creation');
    setTimeout(waitUntilActive, 200, name, done)
  });
}

describe("Index Handler Tests", function() {
  var ctx;

  beforeAll(function(done) {
    createTestTable(done);
  });

  beforeEach(function() {
    ctx = new aws.ContextMock();
  });

  it("Should return a JSON object with an error when called with nothing", function() {
    index.handler({}, ctx);
    expect(ctx).toHaveNonEmptyString('err');
    expect(ctx).not.toHaveObject('result');
  });

  xit("Should have a result in the proper range", function() {
    for (var i=2; i<100; i++) {
      ctx = new aws.ContextMock();
      index.handler({dice: "1d" + i}, ctx);
      expect(ctx.err).toBe(null);
      expect(ctx.result.result).toBeWithinRange(1,i);
    }
  });

  it("Should work on a large die roll", function(done) {

    var doubleChecker = function(err, data) {
      //console.log('doubleChecker hit! with', err, data);
      expect(err).toBe(null);
      expect(data).not.toBe(null);
      expect(data.Item.roll).toEqual('2d200');
      done();
    };

    index.handler({
      dice: "2d200",
      callback: function(err, data) {
        db.getDBDoc().get({TableName: 'rolls', Key: {user: 'dummy', timestamp: ctx.result.timestamp}}, doubleChecker);
      }
    }, ctx);
    //db.getDBDoc().get("")
    console.log(ctx.result);
  });

  it("Should allow lazy entry of die size", function(done) {
    var doubleChecker = function(err, data) {
      //console.log('doubleChecker hit! with', err, data);
      expect(err).toBe(null);
      expect(data).not.toBe(null);
      expect(data.Item.roll).toEqual('1d100');
      done();
    };

    index.handler({dice: 100, callback: function(err, data) {
      db.getDBDoc().get({TableName: 'rolls', Key: {user: 'dummy', timestamp: ctx.result.timestamp}}, doubleChecker);
    }}, ctx);
    expect(ctx.err).toBe(null);
    expect(ctx.result.result).toBeWithinRange(1,100);
  });
});
