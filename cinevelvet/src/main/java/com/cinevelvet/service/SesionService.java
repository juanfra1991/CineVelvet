package com.cinevelvet.service;

import com.cinevelvet.model.Sesion;
import com.cinevelvet.repository.SesionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SesionService {

    private final SesionRepository sesionRepository;

    public List<Sesion> listar() {
        return sesionRepository.findAll();
    }

    public Sesion guardar(Sesion sesion) {
        return sesionRepository.save(sesion);
    }

    public Sesion buscarPorId(Long id) {
        return sesionRepository.findById(id).orElse(null);
    }
}
