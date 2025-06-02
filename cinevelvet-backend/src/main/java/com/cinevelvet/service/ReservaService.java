package com.cinevelvet.service;

import com.cinevelvet.model.*;
import com.cinevelvet.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final EntradaRepository entradaRepository;
    private final ClienteRepository clienteRepository;
    private final ButacaRepository butacaRepository;
    private final SesionRepository sesionRepository;

    private static final Logger logger = Logger.getLogger(ReservaService.class.getName());

    @Transactional
    public Reserva realizarReserva(Cliente cliente, Long sesionId, List<Long> butacasId) {
        logger.info("Iniciando proceso de reserva para cliente con ID: " + cliente.getId() + " y sesión con ID: " + sesionId);

        // Guardar cliente
        Cliente clienteGuardado = clienteRepository.save(cliente);
        logger.info("Cliente guardado con ID: " + clienteGuardado.getId());

        // Obtener sesión
        Sesion sesion = sesionRepository.findById(sesionId)
                .orElseThrow(() -> new RuntimeException("Sesión no encontrada con ID: " + sesionId));
        logger.info("Sesión encontrada: " + sesion.getId());

        // Crear la reserva
        Reserva reserva = new Reserva();
        reserva.setCliente(clienteGuardado);
        reserva.setSesion(sesion);
        reserva.setFechaSesion(sesion.getFecha());
        reserva.setFechaReserva(new Date());

        logger.info("Reserva creada para cliente ID: " + clienteGuardado.getId() + " en sesión: " + sesion.getId());

        // Crear las entradas
        List<Entrada> entradas = new ArrayList<>();
        for (Long butacaId : butacasId) {
            Butaca butaca = butacaRepository.findById(butacaId)
                    .orElseThrow(() -> new RuntimeException("Butaca no encontrada con ID: " + butacaId));

            Entrada entrada = Entrada.builder()
                    .reserva(reserva)
                    .butaca(butaca)
                    .build();

            entradas.add(entrada);
            logger.info("Entrada creada para butaca ID: " + butacaId);
        }

        reserva.setEntradas(entradas);
        reserva = reservaRepository.save(reserva);

        logger.info("Reserva guardada con ID: " + reserva.getId());

        return reserva;
    }

    public List<Reserva> obtenerReservas() {
        return reservaRepository.findAll();
    }

    public Reserva buscarPorId(Long id) {
        return reservaRepository.findById(id).orElse(null);
    }

    public List<Reserva> buscarPorClienteId(Long clienteId) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + clienteId));
        return reservaRepository.findByCliente(cliente);
    }

    public List<Reserva> buscarPorSesionId(Long sesionId) {
        Sesion sesion = sesionRepository.findById(sesionId)
                .orElseThrow(() -> new RuntimeException("Sesión no encontrada con ID: " + sesionId));
        return reservaRepository.findBySesion(sesion);
    }

    public void eliminarEntradaPorReservaYButaca(Long reservaId, Long butacaId) {
        Reserva reserva = reservaRepository.findById(reservaId).orElse(null);
        if (reserva == null) return;

        // Buscar la entrada asociada a esa butaca
        Optional<Entrada> entradaAEliminar = reserva.getEntradas().stream()
                .filter(e -> e.getButaca().getId().equals(butacaId))
                .findFirst();

        if (!entradaAEliminar.isPresent()) return;

        entradaRepository.delete(entradaAEliminar.get());
        reserva.getEntradas().remove(entradaAEliminar.get());

        if (reserva.getEntradas().isEmpty()) {
            reservaRepository.delete(reserva);
        } else {
            reservaRepository.save(reserva);
        }
    }

}
