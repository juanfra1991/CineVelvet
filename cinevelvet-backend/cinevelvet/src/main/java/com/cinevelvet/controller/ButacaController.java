package com.cinevelvet.controller;

import com.cinevelvet.dto.ButacaDTO;
import com.cinevelvet.dto.SalaDTO;
import com.cinevelvet.model.Butaca;
import com.cinevelvet.model.Sala;
import com.cinevelvet.repository.ButacaRepository;
import com.cinevelvet.repository.SalaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/butacas")
@CrossOrigin
public class ButacaController {

    @Autowired
    private SalaRepository salaRepository;

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
    public SalaDTO getSalaConButacas(@PathVariable Long salaId) {
        Sala sala = salaRepository.findById(salaId)
                .orElseThrow(() -> new RuntimeException("Sala no encontrada"));

        List<ButacaDTO> butacas = sala.getButacas().stream()
                .map(this::convertToDTO)
                .toList();

        return new SalaDTO(
                sala.getId(),
                sala.getNombre(),
                sala.getFilas(),
                sala.getColumnas(),
                sala.getCapacidad(),
                butacas
        );
    }

    private ButacaDTO convertToDTO(Butaca butaca) {
        return new ButacaDTO(
                butaca.getId(),
                butaca.getFila(),
                butaca.getButaca()
        );
    }
}
