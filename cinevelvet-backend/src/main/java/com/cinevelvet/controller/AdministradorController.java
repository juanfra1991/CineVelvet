package com.cinevelvet.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/administrador")
@CrossOrigin
public class AdministradorController {

    @Value("${admin.username}")
    private String username;

    @Value("${admin.password}")
    private String password;

    @PostMapping("/login")
    public boolean login(@RequestBody Map<String, String> credentials) {
        String inputUser = credentials.get("usuario");
        String inputPass = credentials.get("contrasena");

        return username.equals(inputUser) && password.equals(inputPass);
    }
}

