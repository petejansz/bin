var fs = require( 'fs' );
var parse = require( 'C:/Users/pjansz/AppData/Roaming/npm/node_modules/csv/node_modules/csv-parse/lib/sync' );
var transform = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/csv/node_modules/stream-transform' );
var should = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/should' );

var input = '"FIRST_NAME","LAST_NAME"\n"Pete","value 2"';
var records = parse( input, { columns: true } );
console.log(records.FIRST_NAME);
records.should.eql( [{ FIRST_NAME: 'Pete', LAST_NAME: 'value 2' }] );