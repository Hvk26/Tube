// this utility class is inherited from Error class of Express and is being used to define a structure to handle different kinds of errors

class ApiError extends Error{ 
    constructor( // this constructor will take different values to process errors using already defined Error class
        statusCode,
        message = "something went wrong",
        errors = [],
        stack = ""
    ){
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.data = null;
        this.success = false;

        if(stack){
            this.stack = stack;
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError};