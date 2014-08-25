# get-bunch

get-bunch collects remote data from different sources and passes it into callback.

**Forked from: [clexit/get-bunch](https://github.com/clexit/get-bunch)**

[![Build Status](https://travis-ci.org/dominikbulaj/get-bunch.svg)](https://travis-ci.org/dominikbulaj/get-bunch)

## Changes to original code

1. added support for HTTPS protocol (created pull request to original repository)
2. added Mocha tests
3. added Travis CI support

## Installation

```
npm install https://github.com/dominikbulaj/get-bunch/tarball/master
```

## Example

```javascript

var getBunch = require( 'get-bunch' );

getBunch.getMulti([
    { name: 'name1', url: url1 },
    // type 'plain' means it will not be parsed as JSON
    { name: 'name2', url: url2, type: 'plain' }
], function( results ) {

    console.log( results.name1 );   // parsed JSON from url1
    console.log( results.name2 );   // plain HTML from url2

})

```

## Methods

### get( obj )

Get data from one source.

param: {Object}

```
{
    name: 'name1',  // property name that will contain data
    url: url1,      // URL
    type: 'plain'   // optional, 'plain' will not be JSON parsed
}
```

### getMulti( Array, callback )

Gets data from many sources (Array of objects described in `get`) and passes it in one object into callback.