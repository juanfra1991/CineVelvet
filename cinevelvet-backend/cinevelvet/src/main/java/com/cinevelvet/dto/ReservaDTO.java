package com.cinevelvet.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservaDTO {
    private Long sesionId;
    private ClienteDTO cliente;
    private List<Long> butacasId;
}
