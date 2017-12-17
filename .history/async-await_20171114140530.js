// Long running method,
// find square-root of each number in array and return the sum.
function squareRooter( numbers )
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

function processResults(data) { console.log(data)}
function errorHandler(err) {console.error( err )}

const asyncSquareRooter = async ( numbers ) =>
{
    try
    {
        const data = await squareRooter( numbers )
        processResults(data)
    }
    catch ( err )
    {
        errorHandler( err )
    }
}

var numbersArray = Array.from(new Array(5000000), (x,i) => i)
asyncSquareRooter( numbersArray )
asyncSquareRooter( numbersArray )
