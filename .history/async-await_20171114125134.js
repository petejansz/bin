function longRunningProcessor( numbers )
{
    var sum = 0
    for ( let index = 0; index < numbers.length; index++ )
    {
        var number = numbers[index]
        var result = Math.sqrt( number )
        if ( isNaN( result ) )
        { throw 'Cannot process value: '  + number}
        sum += result
    }

    return sum
}

const makeRequest = async ( numbers ) =>
{
    try
    {
        // this parse may fail
        //const data = JSON.parse( await getJSON() )
        const data = await longRunningProcessor( numbers )
        return ( data )
    }
    catch ( err )
    {
        console.log( err )
    }
}

// var list1 = Array.apply(null, Array(5)).map(function (_, i) {return i;})
var list2 = Array.from(new Array(500), (x,i) => i)
makeRequest( list2 )