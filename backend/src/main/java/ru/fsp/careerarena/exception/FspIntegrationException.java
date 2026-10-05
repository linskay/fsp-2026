package ru.fsp.careerarena.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_GATEWAY)
public class FspIntegrationException extends RuntimeException {
    public FspIntegrationException(String message) {
        super(message);
    }

    public FspIntegrationException(String message, Throwable cause) {
        super(message, cause);
    }
}
