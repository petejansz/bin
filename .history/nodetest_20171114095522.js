function processArrayOfNumbers( numbers )
{
    var sum = 0
    for ( let index = 0; index < numbers.length; index++ )
    {
        var number = numbers[index]
        var result = Math.sqrt( number )
        if ( isNaN( result ) )
        { throw number + " is NaN!" }
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
        const data = await processArrayOfNumbers( numbers )
        console.log( data )
    }
    catch ( err )
    {
        console.log( err )
    }
}

makeRequest( [1, -2, 3, 4, 5, 6, 7, 8, 9] )