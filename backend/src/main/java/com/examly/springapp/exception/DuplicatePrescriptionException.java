package com.examly.springapp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicatePrescriptionException extends RuntimeException {
    public DuplicatePrescriptionException(String message) {
        super(message);
    }
}
