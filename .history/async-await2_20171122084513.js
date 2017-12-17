// 🔥 Node 7.6 has async/await! Here is a quick run down on how async/await works

const axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )

function getCoffee()
{
    return new Promise( resolve =>
    {
        setTimeout( () => resolve( '☕' ), 2000 ); // it takes 2 seconds to make coffee
    } );
}

/*
*   add numbers a, b return a promise with the sum
*/
function promiseAddition(a, b)
{
    return new Promise(resolve =>
        {
            setTimeout(() => resolve(a + b), 0)
        }
    )
}
async function go()
{
    try
    {
        // but first, coffee
        const coffee = await getCoffee();
        console.log( coffee ); // ☕
        var v1 = await promiseAddition(5, 5)
        var v2 = await promiseAddition(v1, 5)
        var v3 = await promiseAddition(v2, 5)
        console.log(v3 === 20)
        // then we grab some data over an Ajax request
        const wes = await axios( 'https://api.github.com/users/wesbos' );
        console.log( wes.data ); // mediocre code
        // many requests should be concurrent - don't slow things down!
        // fire off three requests and save their promises
        const wordPromise = axios( 'http://www.setgetgo.com/randomword/get.php' );
        const userPromise = axios( 'https://randomuser.me/api/' );
        const namePromise = axios( 'https://uinames.com/api/' );
        // await all three promises to come back and destructure the result into their own variables
        const [word, user, name] = await Promise.all( [wordPromise, userPromise, namePromise] );
        console.log( word.data, user.data, name.data ); // cool, {...}, {....}
    }
    catch ( e )
    {
        console.error( e ); // 💩
    }
}

go();