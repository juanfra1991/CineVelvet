package com.cinevelvet.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
public class Sesion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pelicula_id")
    private Pelicula pelicula;

    @ManyToOne
    @JoinColumn(name = "sala_id")
    private Sala sala;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_sesion")
    private Date fecha;

    public Sesion(Pelicula pelicula, Sala sala, Date fecha) {
        this.pelicula = pelicula;
        this.sala = sala;
        this.fecha = fecha;
    }
}
