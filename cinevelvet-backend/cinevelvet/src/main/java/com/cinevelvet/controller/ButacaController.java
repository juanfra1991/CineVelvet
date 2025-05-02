package com.cinevelvet.controller;

import com.cinevelvet.dto.ButacaDTO;
import com.cinevelvet.dto.SalaDTO;
import com.cinevelvet.model.Butaca;
import com.cinevelvet.model.Entrada;
import com.cinevelvet.model.Sala;
import com.cinevelvet.model.Sesion;
import com.cinevelvet.repository.ButacaRepository;
import com.cinevelvet.repository.EntradaRepository;
import com.cinevelvet.repository.SalaRepository;
import com.cinevelvet.repository.SesionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/butacas")
@CrossOrigin
public class ButacaController {

    @Autowired
    private SesionRepository sesionRepository;

    @Autowired
    private SalaRepository salaRepository;

    @Autowired
    private ButacaRepository butacaRepository;

    @Autowired
    private EntradaRepository entradaRepository;

    @GetMapping
    public List<ButacaDTO> getAllButacas() {
        return butacaRepository.findAll()
                .stream()
                .map(butaca -> convertToDTO(butaca, false))
                .collect(Collectors.toList());
    }

    @GetMapping("/sala/{salaId}")
    public SalaDTO getSalaConButacas(@PathVariable Long salaId) {
        Sala sala = salaRepository.findById(salaId)
                .orElseThrow(() -> new RuntimeException("Sala no encontrada"));

        List<ButacaDTO> butacas = sala.getButacas().stream()
                .map(butaca -> convertToDTO(butaca, false))
                .toList();

        return new SalaDTO(
                sala.getId(),
                sala.getNombre(),
                sala.getFilas(),
                sala.getColumnas(),
                sala.getCapacidad(),
                butacas
        );
    }

    @GetMapping("/disponibles/{sesionId}/{salaId}")
    public List<ButacaDTO> getButacasDisponibles(@PathVariable Long sesionId, @PathVariable Long salaId) {
        Sesion sesion = sesionRepository.findById(sesionId)
                .orElseThrow(() -> new RuntimeException("Sesión no encontrada con ID: " + sesionId));

        List<Entrada> entradas = entradaRepository.findByReserva_Sesion_Id(sesion.getId());
        List<Butaca> butacasOcupadas = entradas.stream()
                .map(Entrada::getButaca)
                .toList();

        List<Butaca> todasButacas = butacaRepository.findBySalaId(salaId);

        return todasButacas.stream()
                .map(butaca -> {
                    // Comprobar si la butaca está ocupada
                    boolean ocupada = butacasOcupadas.contains(butaca);
                    return convertToDTO(butaca, ocupada);
                })
                .collect(Collectors.toList());
    }

    private ButacaDTO convertToDTO(Butaca butaca, boolean ocupada) {
        ButacaDTO dto = new ButacaDTO();
        dto.setId(butaca.getId());
        dto.setFila(butaca.getFila());
        dto.setButaca(butaca.getButaca());
        dto.setOcupada(ocupada);
        return dto;
    }
}
