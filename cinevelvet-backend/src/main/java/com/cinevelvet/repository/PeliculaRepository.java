package com.cinevelvet.repository;

import com.cinevelvet.model.Pelicula;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PeliculaRepository extends JpaRepository<Pelicula, Long> {
    List<Pelicula> findByPublicadaTrue();

    List<Pelicula> findByPublicadaFalse();
}
