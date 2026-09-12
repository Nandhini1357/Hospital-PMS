package com.examly.springapp.exception;

public class VarianceExceededException extends RuntimeException {
    public VarianceExceededException(String message) {
        super(message);
    }
}
