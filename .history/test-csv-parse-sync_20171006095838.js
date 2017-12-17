var fs = require( 'fs' );
var parse = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/csv/node_modules/lib/sync' );
var transform = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/csv/node_modules/stream-transform' );
var should = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/should' );

var input = '"key_1","key_2"\n"value 1","value 2"';
var records = parse( input, { columns: true } );
records.should.eql( [{ key_1: 'value 1', key_2: 'value 2' }] );