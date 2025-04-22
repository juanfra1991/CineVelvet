package com.cinevelvet.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sala {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private int filas;

    private int columnas;

    private int capacidad;

    @OneToMany(mappedBy = "sala", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Butaca> butacas;

    @OneToMany(mappedBy = "sala", cascade = CascadeType.ALL)
    private List<Sesion> sesiones;
}
