package com.cinevelvet.controller;

import com.cinevelvet.model.Pelicula;
import com.cinevelvet.repository.PeliculaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
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
    public ResponseEntity<Pelicula> createPelicula(@RequestBody Pelicula pelicula) {
        Pelicula nuevaPelicula = peliculaRepository.save(pelicula);
        return ResponseEntity.created(URI.create("/api/peliculas/" + nuevaPelicula.getId()))
                .body(nuevaPelicula);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pelicula> editarPelicula(@PathVariable Long id, @RequestBody Pelicula peliculaActualizada) {
        return peliculaRepository.findById(id)
                .map(pelicula -> {
                    pelicula.setTitulo(peliculaActualizada.getTitulo());
                    pelicula.setDescripcion(peliculaActualizada.getDescripcion());
                    pelicula.setDuracion(peliculaActualizada.getDuracion());
                    pelicula.setGenero(peliculaActualizada.getGenero());
                    pelicula.setEdades(peliculaActualizada.getEdades());
                    pelicula.setPortada(peliculaActualizada.getPortada());
                    Pelicula peliculaEditada = peliculaRepository.save(pelicula);
                    return ResponseEntity.ok(peliculaEditada);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletePelicula(@PathVariable Long id) {
        return peliculaRepository.findById(id)
                .map(pelicula -> {
                    peliculaRepository.delete(pelicula);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
