package com.examly.springapp.exception;

public class DualAuthorizationRequiredException extends RuntimeException {
    public DualAuthorizationRequiredException(String message) {
        super(message);
    }
}
