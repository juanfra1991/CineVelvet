package com.cinevelvet.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteDTO {
    private String nombre;
    private String email;
    private String telefono;
}

