package com.cinevelvet.repository;

import com.cinevelvet.model.Butaca;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ButacaRepository extends JpaRepository<Butaca, Long> {
    List<Butaca> findBySalaId(Long salaId);
    List<Butaca> findBySalaIdAndFilaAndColumna(Long salaId, int fila, int columna);
}
