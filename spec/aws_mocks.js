var Context = function() {
  this.err = null;
  this.result = null;
};

Context.prototype.done = function(errObj, resultObj) {
  this.err = errObj;
  this.result = resultObj
};

Context.prototype.succeed = function(resultObj) {
  this.done(null, resultObj);
};

Context.prototype.fail = function(errObj) {
  this.done(errObj, null);
};

var DynamoMock = function() {
  this.items = [];
};

DynamoMock.prototype.putItem = function(item, callback) {
  this.items.push(item);
  callback(null, {});
};

var DynamoDocMock = function() {
  this.items = [];
};

DynamoDocMock.prototype.put = function(item, callback) {
  this.items.push(item);
  callback(null, {});
};


module.exports = {
  "ContextMock": Context,
  "DynamoMock": DynamoMock,
  "DynamoDocMock": DynamoDocMock
};
