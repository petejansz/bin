var fs = require( 'fs' );
var parse = require( 'C:/Users/pjansz/AppData/Roaming/npm/node_modules/csv/node_modules/csv-parse/lib/sync' );
var transform = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/csv/node_modules/stream-transform' );
var should = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/should' );

function sortUniq( a )
{
    return a.sort().filter( function ( item, pos, ary )
    {
        return !pos || item != ary[pos - 1];
    } );
}

function convertArrayToMap( a )
{
    var seen = {};
    return a.filter( function ( item )
    {
        return seen.hasOwnProperty( item ) ? false : ( seen[item] = true );
    } );
}

//console.log( "2017-12-31".split( '-' )[0] );

var input = '"FIRST_NAME","LAST_NAME"\n"Pete","Jansz"\n"Karen","Jansz"';
var records = parse( input, { columns: true } );
records[0].FIRST_NAME.should.eql( 'Pete' );
//records[1].should.eql( [{ FIRST_NAME: 'Karen', LAST_NAME: 'Jansz' }] );

var input = fs.readFileSync( process.env.USERPROFILE + '/Documents/pd/california/apl/emailVerified-2ndchance-last_login_date.csv' );
records = parse( input, { columns: true } );
//records.length.should.eql(2755);
var years = [];
for (var i=0; i<records.length; i++)
{
    var playerId = records[i].PLAYER_ID;
    var lastLoginDate = records[i].LAST_LOGIN_DATE;
    var lastLoginYear = lastLoginDate.split( '-' )[0];
    years.push(lastLoginYear);
}

years = sortUniq(years);
console.log(years);
