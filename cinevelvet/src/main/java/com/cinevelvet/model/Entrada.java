package com.cinevelvet.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "entrada")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Entrada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reserva_id", nullable = false)
    private Reserva reserva;

    @ManyToOne
    @JoinColumn(name = "butaca_id", nullable = false)
    private Butaca butaca;
}
