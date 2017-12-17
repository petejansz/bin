function processArrayOfNumbers(numbers)
{
var sum = 0
for (let index = 0; index < numbers.length; index++)
{
    sum += numbers[index]
}
}

const makeRequest = async (numbers) =>
{
    try
    {
        // this parse may fail
        //const data = JSON.parse( await getJSON() )
        const date = await processArrayOfNumbers(numbers)
        console.log( sum )
    }
    catch ( err )
    {
        console.log( err )
    }
}

makeRequest('asdf')