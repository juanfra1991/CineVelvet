package com.cinevelvet.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Butaca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sala_id")
    private Sala sala;

    private int fila;
    private int columna;

    @OneToOne(mappedBy = "butaca")
    private Entrada entrada;

    public Butaca(Sala sala, int fila, int columna) {
        this.sala = sala;
        this.fila = fila;
        this.columna = columna;
    }
}
