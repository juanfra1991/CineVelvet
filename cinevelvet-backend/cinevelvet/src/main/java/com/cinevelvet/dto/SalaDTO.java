package com.cinevelvet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SalaDTO {
    private Long id;
    private String nombre;
    private int filas;
    private int columnas;
    private int capacidad;

}
