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
    private String strFechaLarga;
    private String strHora;
    private int peliculaId;
    private String peliculaTitulo;
    private int salaId;
    private String salaNombre;
}
