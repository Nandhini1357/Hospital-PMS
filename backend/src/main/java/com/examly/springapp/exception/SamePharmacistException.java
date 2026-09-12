package com.examly.springapp.exception;

public class SamePharmacistException extends RuntimeException {
    public SamePharmacistException(String message) {
        super(message);
    }
}
