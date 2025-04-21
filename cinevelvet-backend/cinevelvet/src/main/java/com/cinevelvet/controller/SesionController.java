package com.cinevelvet.controller;

import com.cinevelvet.dto.SesionDTO;
import com.cinevelvet.model.Sesion;
import com.cinevelvet.repository.PeliculaRepository;
import com.cinevelvet.repository.SalaRepository;
import com.cinevelvet.repository.SesionRepository;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Locale;

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

    @GetMapping("/pelicula/{peliculaId}")
    public List<SesionDTO> getSesionesPorPelicula(@PathVariable Long peliculaId) {
        Locale locale = Locale.forLanguageTag("es-ES");
        SimpleDateFormat formatoFecha = new SimpleDateFormat("EEE, dd/MM", locale);
        SimpleDateFormat formatoHora = new SimpleDateFormat("HH:mm");

        return sesionRepository.findAll().stream()
                .filter(s -> s.getPelicula().getId().equals(peliculaId))
                .map(s -> new SesionDTO(
                        s.getId(),
                        s.getSala().getNombre(),
                        formatoFecha.format(s.getFecha()),
                        formatoHora.format(s.getFecha())
                ))
                .toList();
    }
}
