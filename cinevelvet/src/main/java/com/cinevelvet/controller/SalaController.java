package com.cinevelvet.controller;

import com.cinevelvet.model.Sala;
import com.cinevelvet.repository.SalaRepository;
import org.springframework.http.ResponseEntity;
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

    @PutMapping("/{id}")
    public ResponseEntity<Sala> updateSala(@PathVariable Long id, @RequestBody Sala updated) {
        return salaRepository.findById(id).map(sala -> {
            sala.setNombre(updated.getNombre());
            sala.setCapacidad(updated.getCapacidad());
            return ResponseEntity.ok(salaRepository.save(sala));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSala(@PathVariable Long id) {
        if (!salaRepository.existsById(id)) return ResponseEntity.notFound().build();
        salaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
