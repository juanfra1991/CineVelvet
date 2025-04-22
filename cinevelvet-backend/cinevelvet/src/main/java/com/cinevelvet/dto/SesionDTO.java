package com.cinevelvet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SesionDTO {
    private Long id;
    private String fecha;
    private String hora;
    private int peliculaId;
    private int salaId;
}
