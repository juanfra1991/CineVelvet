package com.cinevelvet.controller;

import com.cinevelvet.dto.ButacaDTO;
import com.cinevelvet.dto.SalaDTO;
import com.cinevelvet.model.Butaca;
import com.cinevelvet.model.Sala;
import com.cinevelvet.repository.ButacaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/butacas")
public class ButacaController {

    @Autowired
    private ButacaRepository butacaRepository;

    @GetMapping
    public List<ButacaDTO> getAllButacas() {
        return butacaRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/sala/{salaId}")
    public List<ButacaDTO> getButacasPorSala(@PathVariable Long salaId) {
        return butacaRepository.findBySalaId(salaId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ButacaDTO convertToDTO(Butaca butaca) {
        Sala sala = butaca.getSala();
        SalaDTO salaDTO = new SalaDTO(
                sala.getId(),
                sala.getNombre(),
                sala.getFilas(),
                sala.getColumnas(),
                sala.getCapacidad()
        );

        return new ButacaDTO(
                butaca.getId(),
                butaca.getFila(),
                butaca.getColumna(),
                salaDTO
        );
    }
}
