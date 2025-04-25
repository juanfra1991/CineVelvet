// src/pages/Administrador.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Config } from '../../api/Config';
import { useNavigate } from 'react-router-dom';
import '../../css/Administrador.css';

const Administrador = () => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${Config.urlBackend}/administrador/login`, {
                usuario,
                contrasena
            });

            if (response.data === true) {
                navigate('/dashboard');
            } else {
                setError('Usuario o contraseña incorrectos');
            }
        } catch (error) {
            setError('Error al iniciar sesión');
        }
    };

    return (
        <div className="admin-container">
            <h2>Acceso Administrador</h2>
            <input
                type="text"
                placeholder="Usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
            />
            <button onClick={handleLogin}>Iniciar sesión</button>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Administrador;
