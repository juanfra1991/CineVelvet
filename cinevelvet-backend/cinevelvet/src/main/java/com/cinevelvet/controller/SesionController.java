package com.cinevelvet.controller;

import com.cinevelvet.dto.SalaDTO;
import com.cinevelvet.dto.SesionDTO;
import com.cinevelvet.model.Sala;
import com.cinevelvet.model.Sesion;
import com.cinevelvet.repository.SesionRepository;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/sesiones")
@CrossOrigin
public class SesionController {

    private final SesionRepository sesionRepository;

    public SesionController(SesionRepository sesionRepository) {
        this.sesionRepository = sesionRepository;
    }

    @GetMapping
    public List<Sesion> getAllSesiones() {
        return sesionRepository.findAll();
    }

    @GetMapping("/pelicula/{peliculaId}")
    public List<SesionDTO> getSesionesPorPelicula(@PathVariable Long peliculaId) {
        return sesionRepository.findAll().stream()
                .filter(s -> s.getPelicula().getId().equals(peliculaId))
                .map(this::convertToDTO)
                .toList();
    }
    private SesionDTO convertToDTO(Sesion s) {
        Sala sala = s.getSala();
        SalaDTO salaDTO = new SalaDTO(
                sala.getId(),
                sala.getNombre(),
                sala.getFilas(),
                sala.getColumnas(),
                sala.getCapacidad()
        );

        String fecha = s.getFecha().toInstant()
                .atZone(ZoneId.systemDefault())
                .format(DateTimeFormatter.ofPattern("EEE, dd/MM", Locale.forLanguageTag("es")));

        String hora = s.getFecha().toInstant()
                .atZone(ZoneId.systemDefault())
                .format(DateTimeFormatter.ofPattern("HH:mm"));

        return new SesionDTO(s.getId(), salaDTO, fecha, hora);
    }
}
