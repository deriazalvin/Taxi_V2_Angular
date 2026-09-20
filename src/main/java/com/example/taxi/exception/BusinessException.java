package com.example.taxi.exception;

/**
 * Classe de base des erreurs métier.
 */
public class BusinessException extends RuntimeException {

    private static final long serialVersionUID = 1L;

	public BusinessException(String message) {
        super(message);
    }
}