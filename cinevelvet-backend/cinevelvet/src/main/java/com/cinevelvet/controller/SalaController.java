package com.cinevelvet.controller;

import com.cinevelvet.model.Sala;
import com.cinevelvet.repository.SalaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping
    public Sala createSala(@RequestBody Sala sala) {
        return salaRepository.save(sala);
    }
}
