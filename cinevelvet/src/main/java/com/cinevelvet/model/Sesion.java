package com.cinevelvet.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;

@Entity
public class Sesion {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Pelicula pelicula;

    @ManyToOne
    private Sala sala;

    private LocalDateTime fechaHora;

    // Getters, Setters, Constructor vacío
}

