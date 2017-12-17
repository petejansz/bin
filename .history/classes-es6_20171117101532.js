class baseModel {
  constructor(options = {}, data = []) { // class constructor
    this.name = 'Base'
    this.url = 'http://azat.co/api'
    this.data = data
    this.options = options
  }

    getName() { // class method
      console.log(`Class name: ${this.name}`)
    }
}