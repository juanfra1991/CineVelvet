package com.cinevelvet.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @OneToMany(mappedBy = "reserva", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Entrada> entradas;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_reserva")
    private Date fecha;

    public Reserva(Cliente cliente, Sesion sesion, List<Entrada> entradas, Date fecha) {
        this.cliente = cliente;
        this.sesion = sesion;
        this.entradas = entradas;
        this.fecha = fecha;
    }
}
