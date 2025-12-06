export class ErrorHandler extends Error {
    constructor(errorMessage, statusCode) {
        super(errorMessage);
        this.name = "ErrorHandler"; 
        this.statusCode = statusCode;

        // Clean up the stack trace:
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
