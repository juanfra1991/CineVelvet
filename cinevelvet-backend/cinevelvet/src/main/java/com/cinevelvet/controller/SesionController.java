package com.cinevelvet.controller;

import com.cinevelvet.dto.SesionDTO;
import com.cinevelvet.model.Pelicula;
import com.cinevelvet.model.Sala;
import com.cinevelvet.model.Sesion;
import com.cinevelvet.repository.PeliculaRepository;
import com.cinevelvet.repository.SalaRepository;
import com.cinevelvet.repository.SesionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sesiones")
@CrossOrigin
public class SesionController {

    private final SesionRepository sesionRepository;
    private final PeliculaRepository peliculaRepository;
    private final SalaRepository salaRepository;

    public SesionController(SesionRepository sesionRepository,
                            PeliculaRepository peliculaRepository,
                            SalaRepository salaRepository) {
        this.sesionRepository = sesionRepository;
        this.peliculaRepository = peliculaRepository;
        this.salaRepository = salaRepository;
    }

    @GetMapping
    public List<SesionDTO> getAllSesiones() {
        return sesionRepository.findAll().stream()
                .map(this::convertToFullDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/futuras")
    public List<SesionDTO> getSesionesFuturas() {
        LocalDateTime now = LocalDateTime.now();

        return sesionRepository.findAll().stream()
                .filter(sesion -> {
                    LocalDateTime sesionFecha = sesion.getFecha().toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDateTime();
                    return sesionFecha.isEqual(now) || sesionFecha.isAfter(now);
                })
                .map(this::convertToFullDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SesionDTO> getSesionById(@PathVariable Long id) {
        return sesionRepository.findById(id)
                .map(this::convertToFullDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/pelicula/{peliculaId}")
    public List<SesionDTO> getSesionesPorPelicula(@PathVariable Long peliculaId) {
        return sesionRepository.findAll().stream()
                .filter(s -> s.getPelicula().getId().equals(peliculaId))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/pelicula/{peliculaId}/futuras")
    public List<SesionDTO> getSesionesFuturasPorPelicula(@PathVariable Long peliculaId) {
        LocalDateTime now = LocalDateTime.now();

        return sesionRepository.findAll().stream()
                .filter(s -> s.getPelicula().getId().equals(peliculaId))
                .filter(sesion -> {
                    LocalDateTime sesionFecha = sesion.getFecha().toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDateTime();
                    return sesionFecha.isEqual(now) || sesionFecha.isAfter(now);
                })
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<Sesion> createSesion(@RequestBody SesionDTO sesionDTO) {
        try {
            Sesion sesion = new Sesion();

            Date fechaHora = sesionDTO.getFecha();
            sesion.setFecha(fechaHora);

            Pelicula pelicula = peliculaRepository.findById((long) sesionDTO.getPeliculaId())
                    .orElseThrow(() -> new RuntimeException("Película no encontrada"));
            Sala sala = salaRepository.findById((long) sesionDTO.getSalaId())
                    .orElseThrow(() -> new RuntimeException("Sala no encontrada"));

            sesion.setPelicula(pelicula);
            sesion.setSala(sala);

            Sesion savedSesion = sesionRepository.save(sesion);
            return ResponseEntity.ok(savedSesion);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sesion> editSesion(@PathVariable Long id, @RequestBody Sesion sesionActualizada) {
        return sesionRepository.findById(id)
                .map(sesion -> {
                    sesion.setFecha(sesionActualizada.getFecha());

                    if (sesionActualizada.getPelicula() != null) {
                        sesion.setPelicula(sesionActualizada.getPelicula());
                    }
                    if (sesionActualizada.getSala() != null) {
                        sesion.setSala(sesionActualizada.getSala());
                    }
                    Sesion sesionEditada = sesionRepository.save(sesion);
                    return ResponseEntity.ok(sesionEditada);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSesion(@PathVariable Long id) {
        if (sesionRepository.existsById(id)) {
            sesionRepository.deleteById(id);
            return ResponseEntity.ok("Sesión eliminada correctamente.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private SesionDTO convertToDTO(Sesion s) {

        Date fechaHora = s.getFecha();

        String strFecha = s.getFecha().toInstant()
                .atZone(ZoneId.systemDefault())
                .format(DateTimeFormatter.ofPattern("EEE, dd/MM", Locale.forLanguageTag("es")));

        String strHora = s.getFecha().toInstant()
                .atZone(ZoneId.systemDefault())
                .format(DateTimeFormatter.ofPattern("HH:mm"));

        int peliculaId = s.getPelicula().getId().intValue();
        String peliculaTitulo = s.getPelicula().getTitulo();
        int salaId = s.getSala().getId().intValue();
        String salaNombre = s.getSala().getNombre();

        return new SesionDTO(s.getId(), fechaHora, strFecha, strHora, peliculaId, peliculaTitulo, salaId, salaNombre);
    }

    private SesionDTO convertToFullDTO(Sesion s) {
        SesionDTO dto = convertToDTO(s);
        dto.setPeliculaTitulo(s.getPelicula().getTitulo());
        dto.setSalaNombre(s.getSala().getNombre());
        return dto;
    }
}
