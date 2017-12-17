var PeteNamespace = ( function ()
{
    var privateMethod = function ()
    {
        console.log( 'privateMethod' )
    }

    return {
        publicMethod: function ()
        {
            console.log( 'publicMethod' )
        }
    }
} )();