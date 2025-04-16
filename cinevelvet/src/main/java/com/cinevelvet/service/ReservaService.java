package com.cinevelvet.service;

import com.cinevelvet.model.*;
import com.cinevelvet.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final EntradaRepository entradaRepository;
    private final ClienteRepository clienteRepository;
    private final ButacaRepository butacaRepository;
    private final SesionRepository sesionRepository;

    @Transactional
    public Reserva realizarReserva(Cliente cliente, Long sesionId, List<Long> butacasId) {
        Cliente clienteGuardado = clienteRepository.save(cliente);

        Sesion sesion = sesionRepository.findById(sesionId)
                .orElseThrow(() -> new RuntimeException("Sesión no encontrada con ID: " + sesionId));

        Reserva reserva = new Reserva();
        reserva.setCliente(clienteGuardado);
        reserva.setSesion(sesion);
        reserva = reservaRepository.save(reserva);

        for (Long butacaId : butacasId) {
            Butaca butaca = butacaRepository.findById(butacaId)
                    .orElseThrow(() -> new RuntimeException("Butaca no encontrada con ID: " + butacaId));

            Entrada entrada = Entrada.builder()
                    .reserva(reserva)
                    .butaca(butaca)
                    .build();

            entradaRepository.save(entrada);
        }

        return reserva;
    }

    public List<Reserva> obtenerReservas() {
        return reservaRepository.findAll();
    }

    public Reserva buscarPorId(Long id) {
        return reservaRepository.findById(id).orElse(null);
    }
}
