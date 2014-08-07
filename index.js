/**
 * Gets JSON or plain text data and accumulates it in an object
 *
 * Example:
 *      getMulti([
 *          { name: 'name1', url: url1 },
 *          // type 'plain' means it will not be parsed as JSON
 *          { name: 'name2', url: url2, type: 'plain' }
 *      ], function( results ) {
 *
 *          console.log( results.name1 );   // parsed JSON from url1
 *          console.log( results.name2 );   // plain HTML from url2
 *
 *      })
 *
 */


var url  = require( 'url' );
var http = require( 'http' );
var https = require( 'https' );

/**
 * @param  {Object}   link   { name: '%alias%', url: '%url%', type: 'plain' }
 * @param  {Object}   _request      outside object request (for can use cookie)
 */
exports.get = function( link, callback, _as_object, _request ) {

    _as_object = typeof _as_object == 'undefined' ? false : true;
    if (  _request == 'undefined' ) {
        _request = false
    }

    var options = url.parse( link.url );
    options.method = 'GET';
    var buffer = [];

    // TODO: Beautify code, for get cookie from _request.cookies
    if ( _request ) {
        if ( _request.headers && _request.headers.cookie ) {
            options["headers"] = {
                "cookie": _request.headers.cookie
            }
        }
    }

    var data = function( chunk ) {
        buffer.push( chunk );
    }

    var err = function( e ) {
        console.log( ['error', e] );
    }

    var end = function() {
        if ( _as_object ) {
            var ret = {}
                , answer = buffer.join( '' );

            ret[ link.name ] = getRetPart( answer );
            callback( ret );
        } else {
            callback( buffer.join('') );
        }

        function getRetPart( answer ) {
            var retPart;

            if ( link.type === 'plain' ) {
                retPart = answer;
            } else {
                // assume it's JSON
                try {
                    retPart = JSON.parse( answer );
                } catch( e ) {
                    retPart = answer;
                }
            }

            return retPart;
        }
    }

    var resp = function( res ) {
        if ( res.statusCode == 200 ) {
            res.on( 'data', data ).on( 'end', end );
        } else {
            res.on( 'data', function( chunk ) {
                console.log( link.url + ': ' + res.statusCode );
            } ).on( 'end', function() {
                ret = {};
                ret[ link.name ] = ( link.type === 'plain' ) ? '' : {};
                callback(ret);
            } );
        }
    }

    var _transport = http;
    if (options.protocol === 'https:') {
        _transport = https;
    }
    var req = _transport.request( options, resp);
    req.setTimeout(5000,
        function(){
            console.log('Timed out: ' + link.url);
            callback( {} );
        }
    );
    req.on( 'error', err ).end();


};

/**
 * @param  {Array}   link   array with objects { name: '%alias%', url: '%url%', type: 'plain' }
 */
exports.getMulti = function( links, callback, _request ) {
    if ( typeof _request == 'undefined' ) {
        _request = false
    }
    var responses = {};
    var cnt_urls = links.length;
    var cnt_res = 0;

    var finish = function() {
        callback( responses );
    }

    var resp = function( res ) {
        cnt_res++;
        for ( var i in res ) {
            responses[ i ] = res[ i ];
        }
        if ( cnt_res === cnt_urls ) {
            finish();
        }
    }

    for ( var i = 0; i < links.length; i++ ) {
        this.get( links[i], resp, true, _request );
    }

    links.length === 0 ? finish() : '';
};
