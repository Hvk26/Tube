// this utilities is created to handle api response after a successful connection 

class ApiResponse {
    constructor(statusCode, data, message = "Success"){ //this constructor is taking different parameters of connection values
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400; // this range is defined to follow a proffesional format according to MDN
    }
}