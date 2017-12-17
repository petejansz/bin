class Model
{
    constructor( options = {}, data = [] )
    { // class constructor
        this.name = 'Base'
        this.url = 'http://azat.co/api'
        this.data = data
        this.options = options
    }

    getName()
    { // class method
        console.log( `Class name: ${this.name}` )
    }
}

let b1 = new baseModel()
b1.name = 'Pete'
b1.getName()