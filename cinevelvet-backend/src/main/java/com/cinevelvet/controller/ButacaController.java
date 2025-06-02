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
import java.util.Map;
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
                .map(butaca -> convertToDTO(butaca, false, butaca.getBloqueadaHasta() != null && butaca.getBloqueadaHasta().isAfter(LocalDateTime.now()), null))
                .collect(Collectors.toList());
    }

    @GetMapping("/sala/{salaId}")
    public SalaDTO getSalaConButacas(@PathVariable Long salaId) {
        Sala sala = salaRepository.findById(salaId)
                .orElseThrow(() -> new RuntimeException("Sala no encontrada"));

        List<ButacaDTO> butacas = sala.getButacas().stream()
                .map(butaca -> convertToDTO(butaca, false, butaca.getBloqueadaHasta() != null && butaca.getBloqueadaHasta().isAfter(LocalDateTime.now()), null))
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
        // Obtener todas las entradas para la sesión
        List<Entrada> entradas = entradaRepository.findByReserva_Sesion_Id(sesionId);

        // Mapear las entradas por butaca para recuperar el reservaId correspondiente
        Map<Butaca, Long> butacaReservaMap = entradas.stream()
                .collect(Collectors.toMap(Entrada::getButaca, entrada -> entrada.getReserva().getId()));

        List<Butaca> todasButacas = butacaRepository.findBySalaId(salaId);

        return todasButacas.stream()
                .map(butaca -> {
                    boolean ocupada = butacaReservaMap.containsKey(butaca);
                    boolean bloqueada = butaca.getBloqueadaHasta() != null && butaca.getBloqueadaHasta().isAfter(LocalDateTime.now());
                    Long reservaId = ocupada ? butacaReservaMap.get(butaca) : null;

                    return convertToDTO(butaca, ocupada, bloqueada, reservaId);
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

    private ButacaDTO convertToDTO(Butaca butaca, boolean ocupada, boolean bloqueada, Long reservaId) {
        return new ButacaDTO(
                butaca.getId(),
                butaca.getFila(),
                butaca.getButaca(),
                ocupada,
                bloqueada,
                butaca.getUsuarioId(),
                reservaId
        );
    }

}
