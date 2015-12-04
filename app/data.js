var _ = require('lodash');
var AWS = require('aws-sdk');
var DOC = require('dynamodb-doc');
var db;
var dbDoc;

var config = {
  region: "us-west-2",
  accessKeyId: "myKeyId",
  secretAccessKey: "secretKey"
};

function updateConfig(update) {
  if (update) {
    config = _.extend(config, update);
  }
  AWS.config.update(config);
}

function getDB() {
  if (!db) {
    setDB();
  }
  return db;
}

function getDBDoc() {
  if (!dbDoc) {
    setDB();
  }
  return dbDoc;
}

function setDB(dbInstance, dbDocInstance) {
  if (dbInstance) {
    db = dbInstance;
  }
  else {
    db = new AWS.DynamoDB();
    if (_.has(config, 'endpoint')) {
      db.setEndpoint(config.endpoint)
    }
  }
  if (dbDocInstance) {
    dbDoc = dbDocInstance;
  }
  else {
    dbDoc = new AWS.DynamoDB.DocumentClient();
  }

}

exports = exports || {};

exports = _.extend(exports, {
  getDB: getDB,
  setDB: setDB,
  updateConfig: updateConfig,
  getDBDoc: getDBDoc
});