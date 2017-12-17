async function add(a, b)
{
    return await a + b
}

 function mul(a, b)
{
    return  a * b
}

var a1 = await add(3, 4)
console.log(mul(a1 * 10))