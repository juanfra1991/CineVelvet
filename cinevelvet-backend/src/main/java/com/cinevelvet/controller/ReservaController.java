package com.cinevelvet.controller;

import com.cinevelvet.model.Cliente;
import com.cinevelvet.model.Reserva;
import com.cinevelvet.service.EmailService;
import com.cinevelvet.service.PDFService;
import com.cinevelvet.service.ReservaService;
import lombok.Data;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin
public class ReservaController {

    private final ReservaService reservaService;
    private final PDFService pdfService;
    private final EmailService emailService;


    public ReservaController(ReservaService reservaService, PDFService pdfService, EmailService emailService) {
        this.reservaService = reservaService;
        this.pdfService = pdfService;
        this.emailService = emailService;
    }

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

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Reserva>> getReservasPorCliente(@PathVariable Long clienteId) {
        List<Reserva> reservas = reservaService.buscarPorClienteId(clienteId);
        return ResponseEntity.ok(reservas);
    }

    @GetMapping("/sesion/{sesionId}")
    public ResponseEntity<List<Reserva>> getReservasPorSesion(@PathVariable Long sesionId) {
        List<Reserva> reservas = reservaService.buscarPorSesionId(sesionId);
        return ResponseEntity.ok(reservas);
    }

    @DeleteMapping("/entradas")
    public ResponseEntity<Void> eliminarEntradasPorReservaYButacas(
            @RequestParam Long reservaId,
            @RequestParam List<Long> butacasId
    ) {
        reservaService.eliminarEntradasPorReservaYButacas(reservaId, butacasId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> descargarPDF(@PathVariable Long id) {

        Reserva reserva = reservaService.buscarPorId(id);
        if (reserva == null) {
            return ResponseEntity.notFound().build();
        }

        byte[] pdfBytes = pdfService.generarPDFReserva(reserva);

        SimpleDateFormat sdfNombreArchivo = new SimpleDateFormat("yyyyMMddHHmmss");
        String nombreArchivo = "entradas_velvetcinema_" + sdfNombreArchivo.format(new Date()) + ".pdf";

        emailService.enviarEmailConPDF(reserva.getCliente().getEmail(), pdfBytes, nombreArchivo);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.builder("attachment").filename(nombreArchivo).build());

        headers.add("Access-Control-Expose-Headers", "Content-Disposition");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @Data
    public static class ReservaRequest {
        private Cliente cliente;
        private Long sesionId;
        private List<Long> butacasId;
    }
}
