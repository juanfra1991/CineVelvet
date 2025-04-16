package com.cinevelvet.controller;

import com.cinevelvet.model.Pelicula;
import com.cinevelvet.repository.PeliculaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/peliculas")
@CrossOrigin
public class PeliculaController {

    private final PeliculaRepository peliculaRepository;

    public PeliculaController(PeliculaRepository peliculaRepository) {
        this.peliculaRepository = peliculaRepository;
    }

    @GetMapping
    public List<Pelicula> getAllPeliculas() {
        return peliculaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pelicula> getPeliculaById(@PathVariable Long id) {
        return peliculaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Pelicula createPelicula(@RequestBody Pelicula pelicula) {
        return peliculaRepository.save(pelicula);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pelicula> updatePelicula(@PathVariable Long id, @RequestBody Pelicula updated) {
        return peliculaRepository.findById(id).map(p -> {
            p.setTitulo(updated.getTitulo());
            p.setDescripcion(updated.getDescripcion());
            p.setUrlCartel(updated.getUrlCartel());
            p.setDuracionMinutos(updated.getDuracionMinutos());
            p.setGenero(updated.getGenero());
            p.setEdades(updated.getEdades());
            return ResponseEntity.ok(peliculaRepository.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePelicula(@PathVariable Long id) {
        if (!peliculaRepository.existsById(id)) return ResponseEntity.notFound().build();
        peliculaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
