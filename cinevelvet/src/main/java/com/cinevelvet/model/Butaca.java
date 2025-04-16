package com.cinevelvet.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Butaca {
    @Id
    @GeneratedValue
    private Long id;

    private int fila;
    private int columna;

    @ManyToOne
    private Reserva reserva;

    // Getters, Setters, Constructor vacío
}

