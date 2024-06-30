class CustomError extends Error {
     // this is example of inheritance class
    constructor(message, statusCode) {

        super(message)
        // super() is a constructor of parent class which is mandatory to call

        this.statusCode =statusCode
    }

}
// this is child class used to make error object 
//with help of constructor taking message and code as parameter

module.exports = CustomError