var fs = require( 'fs' );
var parse = require( 'C:/Users/pjansz/AppData/Roaming/npm/node_modules/csv/node_modules/csv-parse/lib/sync' );
var transform = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/csv/node_modules/stream-transform' );
var should = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/should' );

var input = '"FIRST_NAME","LAST_NAME"\n"Pete","Jansz"\n"Karen","Jansz"';
var records = parse( input, { columns: true } );
records[0].FIRST_NAME.should.eql( 'Pete' );
//records[1].should.eql( [{ FIRST_NAME: 'Karen', LAST_NAME: 'Jansz' }] );

var input = fs.readFileSync( process.env.USERPROFILE + '/Documents/pd/california/apl/2017.csv' );
records = parse( input, { columns: true } );
records.length.should.eql(2756);