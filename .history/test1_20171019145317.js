var map = new Map;

const numberRange = ( start, stop ) => Array.from(
    new Array( ( stop - start ) + 1 ),
    ( _, i ) => i + start
);

var years = numberRange( 2012, 2017 );
numberRange( 2012, 2017 ).forEach( function ( year )
{
    map.set( year, 0 );
} );

// Sort an iterator:
// console.log( [...map].sort() );
// console.log( map.values() );

var calendarMonthsMap = new Map();

var monthNum = 1;
["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"].forEach( function ( monthName )
{
    calendarMonthsMap.set( monthNum, monthName );
    monthNum++;
} );

// numberRange( 2012, 2017 ).forEach( function ( year )
// {
    // for ( var monthName of calendarMonthsMap.values() )
    // {
    //     console.log( monthName );
    // }
// } );

function undefined()
{
    return
        "Hello girl!";
}

console.log( undefined() );