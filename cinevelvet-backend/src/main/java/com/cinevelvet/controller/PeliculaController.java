package com.cinevelvet.controller;

import com.cinevelvet.model.Pelicula;
import com.cinevelvet.repository.PeliculaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/peliculas")
@CrossOrigin
public class PeliculaController {

    private static final Logger logger = Logger.getLogger(PeliculaController.class.getName());
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
        return peliculaRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/publicadas")
    public List<Pelicula> getPeliculasPublicadas() {
        return peliculaRepository.findByPublicadaTrue();
    }

    @PatchMapping("/{id}/publicar")
    public ResponseEntity<Pelicula> cambiarEstadoPublicacion(@PathVariable Long id) {
        return peliculaRepository.findById(id).map(pelicula -> {
            System.out.println("Película encontrada: " + pelicula.getTitulo());
            pelicula.setPublicada(!pelicula.isPublicada());
            Pelicula actualizada = peliculaRepository.save(pelicula);
            return ResponseEntity.ok(actualizada);
        }).orElseGet(() -> {
            System.out.println("Película no encontrada con id: " + id);
            return ResponseEntity.notFound().build();
        });
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Pelicula> createPelicula(
            @RequestParam("titulo") String titulo,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("duracion") String duracion,
            @RequestParam("fechaEstreno") String fechaEstreno,
            @RequestParam("genero") String genero,
            @RequestParam("edades") String edades,
            @RequestParam("trailer") String trailer,
            @RequestParam("portada") MultipartFile portada) {

        try {
            // Convertir la imagen a base64
            byte[] bytes = portada.getBytes();
            String base64Portada = Base64.getEncoder().encodeToString(bytes);

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date fecha = sdf.parse(fechaEstreno);

            Pelicula pelicula = new Pelicula();
            pelicula.setTitulo(titulo);
            pelicula.setDescripcion(descripcion);
            pelicula.setDuracion(Integer.parseInt(duracion));
            pelicula.setFechaEstreno(fecha);
            pelicula.setGenero(genero);
            pelicula.setEdades(edades);
            pelicula.setPortada(base64Portada);
            pelicula.setTrailer(trailer);

            Pelicula nuevaPelicula = peliculaRepository.save(pelicula);
            return ResponseEntity.created(URI.create("/api/peliculas/" + nuevaPelicula.getId())).body(nuevaPelicula);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Pelicula> editPelicula(
            @PathVariable Long id,
            @RequestParam("titulo") String titulo,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("duracion") String duracion,
            @RequestParam("fechaEstreno") String fechaEstreno,
            @RequestParam("genero") String genero,
            @RequestParam("edades") String edades,
            @RequestParam("trailer") String trailer,
            @RequestParam(value = "portada", required = false) MultipartFile portada) {

        Optional<Pelicula> optionalPelicula = peliculaRepository.findById(id);

        if (optionalPelicula.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Pelicula pelicula = optionalPelicula.get();

        try {
            if (portada != null && !portada.isEmpty()) {
                byte[] bytes = portada.getBytes();
                String base64Portada = Base64.getEncoder().encodeToString(bytes);
                pelicula.setPortada(base64Portada);
            }

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date fecha = sdf.parse(fechaEstreno);

            pelicula.setTitulo(titulo);
            pelicula.setDescripcion(descripcion);
            pelicula.setDuracion(Integer.parseInt(duracion));
            pelicula.setFechaEstreno(fecha);
            pelicula.setGenero(genero);
            pelicula.setEdades(edades);
            pelicula.setTrailer(trailer);

            Pelicula peliculaEditada = peliculaRepository.save(pelicula);
            return ResponseEntity.ok(peliculaEditada);

        } catch (IOException e) {
            logger.severe(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (ParseException e) {
            logger.severe(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletePelicula(@PathVariable Long id) {
        return peliculaRepository.findById(id).map(pelicula -> {
            peliculaRepository.delete(pelicula);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
