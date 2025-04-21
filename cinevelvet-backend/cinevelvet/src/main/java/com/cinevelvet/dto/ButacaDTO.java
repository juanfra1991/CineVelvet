package com.cinevelvet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ButacaDTO {
    private Long id;
    private int fila;
    private int butaca;
    private SalaDTO sala;
}
