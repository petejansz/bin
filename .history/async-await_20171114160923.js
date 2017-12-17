function multiply( numbers, n )
{
    var results = []

    for ( let index = 0; index < numbers.length; index++ )
    {
        results[index] = n * numbers[index]
    }

    return results
}
// Long running method,
// find square-root of each number in numbers
function squareRooter( numbers )
{
    var results = []

    for ( let index = 0; index < numbers.length; index++ )
    {
        var number = numbers[index]
        var result = Math.sqrt( number )
        if ( isNaN( result ) )
        { throw 'Cannot process value: ' + number }
        results.push(result)
    }

    return results
}

function processResults( data ) { console.log( data ) }
function errorHandler( err ) { console.error( err ) }

const asyncSquareRooter = async ( numbers ) =>
{
    try
    {
        const data = await squareRooter( numbers )
        processResults( data )
    }
    catch ( err )
    {
        errorHandler( err )
    }
}

var numbersArray = Array.from( new Array( 10 ), ( x, i ) => i )
console.log('a')
asyncSquareRooter( numbersArray )
console.log('b')
asyncSquareRooter( multiply(numbersArray, 9))
console.log('c')
