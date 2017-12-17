function processArrayOfNumbers( numbers )
{
    var sum = 0
    for ( let index = 0; index < numbers.length; index++ )
    {
        sum += numbers[index]
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

makeRequest( [3, 6, 9, 15] )