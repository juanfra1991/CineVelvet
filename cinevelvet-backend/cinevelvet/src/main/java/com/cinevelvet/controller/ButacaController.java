package com.cinevelvet.controller;

import com.cinevelvet.dto.ButacaDTO;
import com.cinevelvet.dto.SalaDTO;
import com.cinevelvet.model.*;
import com.cinevelvet.repository.ButacaRepository;
import com.cinevelvet.repository.EntradaRepository;
import com.cinevelvet.repository.SalaRepository;
import com.cinevelvet.repository.SesionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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
                .map(butaca -> convertToDTO(butaca, false, butaca.getBloqueadaHasta() != null && butaca.getBloqueadaHasta().isAfter(LocalDateTime.now())))
                .collect(Collectors.toList());
    }

    @GetMapping("/sala/{salaId}")
    public SalaDTO getSalaConButacas(@PathVariable Long salaId) {
        Sala sala = salaRepository.findById(salaId)
                .orElseThrow(() -> new RuntimeException("Sala no encontrada"));

        List<ButacaDTO> butacas = sala.getButacas().stream()
                .map(butaca -> convertToDTO(butaca, false, butaca.getBloqueadaHasta() != null && butaca.getBloqueadaHasta().isAfter(LocalDateTime.now())))
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

    @GetMapping("/{id}")
    public ResponseEntity<Butaca> getButacaById(@PathVariable Long id) {
        return butacaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/lista")
    public ResponseEntity<List<Butaca>> getButacasByIds(@RequestParam List<Long> ids) {
        List<Butaca> butacas = butacaRepository.findAllById(ids);
        return ResponseEntity.ok(butacas);
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
                    boolean ocupada = butacasOcupadas.contains(butaca);
                    boolean bloqueada = butaca.getBloqueadaHasta() != null && butaca.getBloqueadaHasta().isAfter(LocalDateTime.now());
                    return convertToDTO(butaca, ocupada, bloqueada);
                })
                .collect(Collectors.toList());
    }

    @PutMapping("/bloquear")
    public ResponseEntity<String> bloquearButacas(@RequestParam("usuarioId") String usuarioId, @RequestBody List<Long> butacaIds) {
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime bloqueadaHasta = ahora.plusMinutes(5);

        List<Butaca> butacas = butacaRepository.findAllById(butacaIds);

        for (Butaca butaca : butacas) {
            // Verificamos si la butaca está bloqueada por otro usuario
            if (butaca.getBloqueadaHasta() != null && butaca.getBloqueadaHasta().isAfter(ahora) && !butaca.getUsuarioId().equals(usuarioId)) {
                return ResponseEntity.status(403).body("La butaca está bloqueada por otro usuario.");
            }

            // Bloqueamos la butaca y asociamos al usuario que la bloquea
            butaca.setUsuarioId(usuarioId);
            butaca.setBloqueadaHasta(bloqueadaHasta);
            butacaRepository.save(butaca);
        }

        return ResponseEntity.ok("Butacas bloqueadas por 5 minutos.");
    }

    private ButacaDTO convertToDTO(Butaca butaca, boolean ocupada, boolean bloqueada) {
        ButacaDTO dto = new ButacaDTO();
        dto.setId(butaca.getId());
        dto.setFila(butaca.getFila());
        dto.setButaca(butaca.getButaca());
        dto.setOcupada(ocupada);
        dto.setBloqueada(bloqueada);
        dto.setUsuarioId(butaca.getUsuarioId());
        return dto;
    }
}
