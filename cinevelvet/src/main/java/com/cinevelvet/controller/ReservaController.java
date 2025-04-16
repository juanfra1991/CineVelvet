package com.cinevelvet.controller;

import com.cinevelvet.model.Cliente;
import com.cinevelvet.model.Reserva;
import com.cinevelvet.service.ReservaService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    // DTO para recibir los datos de reserva
    @PostMapping
    public ResponseEntity<Reserva> crearReserva(@RequestBody ReservaRequest request) {
        Reserva reserva = reservaService.realizarReserva(
                request.getCliente(),
                request.getSesionId(),
                request.getButacasId()
        );
        return ResponseEntity.ok(reserva);
    }

    @GetMapping
    public List<Reserva> getAllReservas() {
        return reservaService.obtenerReservas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reserva> getReservaPorId(@PathVariable Long id) {
        Reserva reserva = reservaService.buscarPorId(id);
        if (reserva != null) {
            return ResponseEntity.ok(reserva);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Data
    public static class ReservaRequest {
        private Cliente cliente;
        private Long sesionId;
        private List<Long> butacasId;
    }
}
