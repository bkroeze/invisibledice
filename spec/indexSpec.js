require('jasmine-expect');
var aws = require('./aws_mocks');
var index = require('../app/index.js');

describe("Index Handler Tests", function() {
    var ctx;
    beforeEach(function() {
        ctx = new aws.Context();
    });

    it("Should return a JSON object with an error when called with nothing", function() {
        index.handler({}, ctx);
        expect(ctx).toHaveNonEmptyString('err');
        expect(ctx).not.toHaveObject('result');
    });

    it("Should have a result in the proper range", function() {
        for (var i=2; i<100; i++) {
            ctx = new aws.Context();
            index.handler({dice: "1d" + i}, ctx);
            expect(ctx.err).toBe(null);
            expect(ctx.result.result).toBeWithinRange(1,i);
        }
    });

    it("Should work on a large die roll", function() {
        index.handler({dice: "2d1000"}, ctx);
        expect(ctx.err).toBe(null);
        expect(ctx.result.result).toBeWithinRange(2,2000);
    });

    it("Should allow lazy entry of die size", function() {
        index.handler({dice: 100}, ctx);
        expect(ctx.err).toBe(null);
        expect(ctx.result.result).toBeWithinRange(1,100);
    });


});
