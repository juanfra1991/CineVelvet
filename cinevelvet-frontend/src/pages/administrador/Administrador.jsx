import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/Home.css';
import logoCinema from '../../assets/logoCine.jpg';
import { Config } from '../../api/Config';
import { useNavigate } from 'react-router-dom';
import { FiXCircle } from "react-icons/fi";
import '../../css/Administrador.css';

const Administrador = () => {
    //Constantes utilizadas
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [recordar, setRecordar] = useState(false);
    const navigate = useNavigate();

    // Verificamos si el usuario y la contraseña están guardados en el localStorage
    useEffect(() => {
        const storedUsuario = localStorage.getItem('usuario');
        const storedContrasena = localStorage.getItem('contrasena');
        if (storedUsuario && storedContrasena) {
            setUsuario(storedUsuario);
            setContrasena(storedContrasena);
            setRecordar(true);
        }
    }, []);

    // Iniciamos la sesión
    const handleLogin = async () => {
        try {
            const response = await axios.post(`${Config.urlBackend}/administrador/login`, {
                usuario,
                contrasena
            });

            if (response.data === true) {
                // Si el checkbox "Recuerdame" está marcado, guardamos el usuario y la contraseña en localStorage
                if (recordar) {
                    localStorage.setItem('usuario', usuario);
                    localStorage.setItem('contrasena', contrasena);
                } else {
                    localStorage.removeItem('usuario');
                    localStorage.removeItem('contrasena');
                }
                navigate('/inicioAdministrador');
            } else {
                setError('Usuario o contraseña incorrectos');
            }
        } catch (error) {
            setError('Error al iniciar sesión');
        }
    };

    return (

        <div className="admin-container home-container">
            <header className="home-header" style={{ position: 'relative' }}>
                <div className="header-background"></div>

                <button
                    className="btn-cerrar-header admin-icon"
                    onClick={() => navigate('/')}
                    title="Volver al inicio"
                >
                    <FiXCircle size={28} color="white" />
                </button>

                <div className="header-content">
                    <img className='logo' src={logoCinema} alt="Cinema Logo" />
                    <h1 className='title'>Velvet Cinema</h1>
                </div>
            </header>

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
            <div>
                <label className="label-recuerdame">Recuerdame
                    <input
                        type="checkbox"
                        checked={recordar}
                        onChange={() => setRecordar(!recordar)}
                    />
                </label>
            </div>

            <button onClick={handleLogin}>Iniciar sesión</button>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Administrador;
