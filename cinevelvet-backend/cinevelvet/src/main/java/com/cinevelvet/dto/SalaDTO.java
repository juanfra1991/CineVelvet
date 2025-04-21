package com.cinevelvet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalaDTO {
    private Long id;
    private String nombre;
    private int filas;
    private int columnas;
    private int capacidad;
}
