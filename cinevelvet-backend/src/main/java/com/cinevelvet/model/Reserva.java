package com.cinevelvet.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "sesion_id")
    private Sesion sesion;

    @OneToMany(mappedBy = "reserva", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Entrada> entradas = new ArrayList<>();

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_sesion")
    private Date fechaSesion;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_reserva")
    private Date fechaReserva;

    public Reserva(Cliente cliente, Sesion sesion, List<Entrada> entradas, Date fechaSesion, Date fechaReserva) {
        this.cliente = cliente;
        this.sesion = sesion;
        this.entradas = entradas;
        this.fechaSesion = fechaSesion;
        this.fechaReserva = fechaReserva;
    }
}
