package hotelbooking.exception;

/*
 * Exception thrown when request is invalid
 * Returns 400 Bad Request
*/

public class BadRequestException extends RuntimeException {
    
    public BadRequestException(String message) {
        super(message);
    }
    
    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}


