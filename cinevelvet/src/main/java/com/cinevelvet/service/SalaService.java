package com.cinevelvet.service;

import com.cinevelvet.model.Sala;
import com.cinevelvet.repository.SalaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SalaService {

    private final SalaRepository salaRepository;

    public List<Sala> listar() {
        return salaRepository.findAll();
    }

    public Sala guardar(Sala sala) {
        return salaRepository.save(sala);
    }

    public Sala buscarPorId(Long id) {
        return salaRepository.findById(id).orElse(null);
    }
}
