async function add(a, b)
{
    return await a + b
}

async function mul(a, b)
{
    return await a * b
}

var a1 = add(3, 4)
console.log(mul(a1 * 10))