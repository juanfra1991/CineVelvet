package com.cinevelvet.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class Butaca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sala_id")
    @JsonBackReference
    private Sala sala;

    private int fila;
    private int butaca;
    private LocalDateTime bloqueadaHasta;

    private String usuarioId;

    public Butaca(Sala sala, int fila, int butaca, LocalDateTime bloqueadaHasta, String usuarioId) {
        this.sala = sala;
        this.fila = fila;
        this.butaca = butaca;
        this.bloqueadaHasta = bloqueadaHasta;
        this.usuarioId = usuarioId;
    }
}
