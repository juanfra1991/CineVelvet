package com.cinevelvet.controller;

import com.cinevelvet.dto.ButacaDTO;
import com.cinevelvet.dto.SalaDTO;
import com.cinevelvet.model.Sala;
import com.cinevelvet.repository.SalaRepository;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/{id}")
    public ResponseEntity<SalaDTO> getSalaById(@PathVariable Long id) {
        return salaRepository.findById(id)
                .map(sala -> {
                    List<ButacaDTO> butacas = sala.getButacas().stream()
                            .map(butaca -> new ButacaDTO(butaca.getId(), butaca.getFila(), butaca.getButaca()))
                            .collect(Collectors.toList());

                    SalaDTO salaDTO = new SalaDTO(
                            sala.getId(),
                            sala.getNombre(),
                            sala.getFilas(),
                            sala.getColumnas(),
                            sala.getCapacidad(),
                            butacas
                    );

                    return ResponseEntity.ok(salaDTO);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}


