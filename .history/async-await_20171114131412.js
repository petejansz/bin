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

var reportResults = function(data) { console.log(data)}
var errorHandler = function(err) {console.error( err )}

const makeRequest = async ( numbers, reportResults, errorHandler ) =>
{
    try
    {
        const data = await longRunningProcessor( numbers )
        reportResults(data)//console.log(data)
    }
    catch ( err )
    {
        console.error( err )
    }
}

// var list1 = Array.apply(null, Array(5)).map(function (_, i) {return i;})
var list2 = Array.from(new Array(500), (x,i) => i)
var promise = makeRequest( list2 )
