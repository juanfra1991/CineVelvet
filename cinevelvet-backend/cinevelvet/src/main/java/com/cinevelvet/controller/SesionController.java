package com.cinevelvet.controller;

import com.cinevelvet.model.Sesion;
import com.cinevelvet.repository.PeliculaRepository;
import com.cinevelvet.repository.SalaRepository;
import com.cinevelvet.repository.SesionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sesiones")
@CrossOrigin
public class SesionController {

    private final SesionRepository sesionRepository;
    private final PeliculaRepository peliculaRepository;
    private final SalaRepository salaRepository;

    public SesionController(SesionRepository sesionRepository, PeliculaRepository peliculaRepository, SalaRepository salaRepository) {
        this.sesionRepository = sesionRepository;
        this.peliculaRepository = peliculaRepository;
        this.salaRepository = salaRepository;
    }

    @GetMapping
    public List<Sesion> getAllSesiones() {
        return sesionRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Sesion> createSesion(@RequestBody Sesion sesion) {
        // Validar película y sala si es necesario
        return ResponseEntity.ok(sesionRepository.save(sesion));
    }

    @GetMapping("/pelicula/{peliculaId}")
    public List<Sesion> getSesionesPorPelicula(@PathVariable Long peliculaId) {
        return sesionRepository.findAll().stream()
                .filter(s -> s.getPelicula().getId().equals(peliculaId))
                .toList();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSesion(@PathVariable Long id) {
        if (!sesionRepository.existsById(id)) return ResponseEntity.notFound().build();
        sesionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
