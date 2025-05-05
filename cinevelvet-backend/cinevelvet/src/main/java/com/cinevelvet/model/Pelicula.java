package com.cinevelvet.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

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

    @Temporal(TemporalType.DATE)
    private Date fechaEstreno;

    @Column(length = 50)
    private String genero;

    @Column(length = 150)
    private String edades;

    @Column(length = 1000)
    private String portada;

    @Column(nullable = false)
    private boolean publicada = true;
}
