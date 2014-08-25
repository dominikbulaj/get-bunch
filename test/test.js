var assert = require("assert")
var getBunch = require('../index');

var URL_1 = 'http://www.webit.pl';
var URL_2 = 'http://www.example.com';
var NOT_VALID_URL = 'ftp://www.example.com';

describe('get-bunch', function () {
    describe('running with incorrect parameters', function () {
        it('missing array config - should throw exception', function () {

            assert.throws(
                function () {
                    getBunch.getMulti();
                },
                Error
            );
        });
        it('empty array as config - should throw exception', function () {

            assert.throws(
                function () {
                    getBunch.getMulti([]);
                },
                Error
            );
        });
    });
    describe('fetching single URL', function () {
        it('should return object with page html code as url1 value', function (done) {
            getBunch.getMulti([
                { name: 'url1', url: URL_1}
            ], function (results) {
                assert(typeof results == 'object');
                assert(typeof results.url1 == 'string');
                assert(results.url1.match(/<html[^>]*>/g));
                done();
            });
        });
        it('running ftp:/ protocol - should throw exception', function (done) {

            assert.throws(
                function () {
                    getBunch.getMulti([
                        { name: 'url1', url: NOT_VALID_URL}
                    ], function (results) {
                    });
                }, /Protocol:.+not supported/);
            done();
        });
    });
    describe('fetching multiple URLs', function () {
        it('should return object with url1 and utl2 keys both with html pages', function (done) {
            getBunch.getMulti([
                { name: 'url1', url: URL_1},
                { name: 'url2', url: URL_2}
            ], function (results) {
                assert(typeof results == 'object');
                assert(typeof results.url1 == 'string');
                assert(typeof results.url2 == 'string');
                assert(results.url1.match(/<html[^>]*>/g));
                assert(results.url2.match(/<html[^>]*>/g));
                done();
            });
        });
    });
});