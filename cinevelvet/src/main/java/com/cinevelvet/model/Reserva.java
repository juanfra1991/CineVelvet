package com.cinevelvet.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime fecha;

    @ManyToOne
    private Cliente cliente;

    @ManyToOne
    private Sesion sesion;

    @OneToMany(mappedBy = "reserva", cascade = CascadeType.ALL)
    private List<Entrada> entradas;
}
