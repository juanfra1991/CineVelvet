package com.cinevelvet.repository;

import com.cinevelvet.model.Sesion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SesionRepository extends JpaRepository<Sesion, Long> {
    List<Sesion> findByPeliculaId(Long peliculaId);
}
