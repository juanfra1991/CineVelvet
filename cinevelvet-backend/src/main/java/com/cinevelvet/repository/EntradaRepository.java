package com.cinevelvet.repository;

import com.cinevelvet.model.Entrada;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EntradaRepository extends JpaRepository<Entrada, Long> {
    List<Entrada> findByReserva_Sesion_Id(Long sesionId);

    boolean existsByReserva_Sesion_IdAndButaca_Id(Long sesionId, Long butacaId);
}
