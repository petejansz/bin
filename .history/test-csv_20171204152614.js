var csv = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/csv' )

//var obj = csv()

function MyCSV( playerId, lastLoginDate )
{
    this.playerId = playerId
    this.lastLoginDate = lastLoginDate
}

// MyData array will contain the data from the CSV file and it will be sent to the clients request over HTTP.
var MyData = []

csv.from.path( 'C:/Users/pjansz/Documents/pd/california/apl/2017.csv' ).to.array( function ( data )
{
    for ( var index = 0; index < data.length; index++ )
    {
        MyData.push( new MyCSV( data[index][0], data[index][1] ) );
    }

    console.log( MyData );
} );