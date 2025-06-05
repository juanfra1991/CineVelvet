package com.cinevelvet.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
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
    @JsonManagedReference
    private List<Sesion> sesiones;
}
