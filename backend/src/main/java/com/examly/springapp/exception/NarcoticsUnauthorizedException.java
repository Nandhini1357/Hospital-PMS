package com.examly.springapp.exception;

public class NarcoticsUnauthorizedException extends RuntimeException {
    public NarcoticsUnauthorizedException(String message) {
        super(message);
    }
}
