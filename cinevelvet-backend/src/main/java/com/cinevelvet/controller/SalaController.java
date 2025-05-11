package com.cinevelvet.controller;

import com.cinevelvet.dto.SalaDTO;
import com.cinevelvet.model.Sala;
import com.cinevelvet.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/salas")
@CrossOrigin
public class SalaController {

    private final SalaRepository salaRepository;

    public SalaController(SalaRepository salaRepository) {
        this.salaRepository = salaRepository;
    }

    @GetMapping
    public List<Sala> getAllSalas() {
        return salaRepository.findAll();
    }

    @GetMapping("/sin-sesiones-sin-butacas")
    public List<SalaDTO> getAllSalasSinSesionesYButacas() {
        return salaRepository.findAll().stream()
                .map(sala -> new SalaDTO(
                        sala.getId(),
                        sala.getNombre(),
                        sala.getFilas(),
                        sala.getColumnas(),
                        sala.getCapacidad(),
                        null
                ))
                .collect(Collectors.toList());
    }
}
