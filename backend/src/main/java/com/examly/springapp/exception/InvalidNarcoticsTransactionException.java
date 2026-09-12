package com.examly.springapp.exception;

public class InvalidNarcoticsTransactionException extends RuntimeException {
    public InvalidNarcoticsTransactionException(String message) {
        super(message);
    }
}
