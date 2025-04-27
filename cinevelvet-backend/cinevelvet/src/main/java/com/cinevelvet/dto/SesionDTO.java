package com.cinevelvet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SesionDTO {
    private Long id;
    private Date fecha;
    private String strFecha;
    private String strHora;
    private int peliculaId;
    private int salaId;

    private String peliculaTitulo;
    private String salaNombre;
}
