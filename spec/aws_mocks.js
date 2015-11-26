var Context = function() {
    this.err = null;
    this.result = null;
};

Context.prototype.done = function(errObj, resultObj) {
    this.err = errObj;
    this.result = resultObj
}

Context.prototype.succeed = function(resultObj) {
    this.done(null, resultObj);
}

Context.prototype.fail = function(errObj) {
    this.done(errObj, null);
}

module.exports = {
    "Context": Context
}
