package com.cinevelvet.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pelicula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 150)
    private String titulo;

    @Column(length = 1000)
    private String descripcion;

    private int duracion;

    @Column(length = 50)
    private String genero;

    @Column(length = 150)
    private String edades;

    @Column(length = 1000)
    private String portada;
}
