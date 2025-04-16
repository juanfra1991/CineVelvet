package com.cinevelvet.repository;

import com.cinevelvet.model.Reserva;
import com.cinevelvet.model.Cliente;
import com.cinevelvet.model.Sesion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    List<Reserva> findByCliente(Cliente cliente);

    List<Reserva> findBySesion(Sesion sesion);
}
