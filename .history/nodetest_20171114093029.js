const makeRequest = async (numbers) =>
{
    try
    {
        // this parse may fail
        //const data = JSON.parse( await getJSON() )
        var sum = 0
        for (let index = 0; index < numbers.length; index++)
        {
            sum += array[index]
        }

        console.log( data )
    }
    catch ( err )
    {
        console.log( err )
    }
}

makeRequest([2, 4, 6, 8])