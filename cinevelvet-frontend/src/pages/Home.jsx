import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Config } from '../api/Config';
import axios from 'axios';
import logoCinema from '../assets/logoCine.jpg';
import { FiSettings } from 'react-icons/fi';
import '../css/Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [peliculas, setPeliculas] = useState([]);
    const [sesionesPorPelicula, setSesionesPorPelicula] = useState({});

    // Cargar las películas
    const fetchPeliculas = async () => {
        try {
            const response = await axios.get(`${Config.urlBackend}/peliculas`);
            setPeliculas(response.data);
        } catch (error) {
            console.error("Error al cargar las películas:", error);
        }
    };

    // Cargar las sesiones por película
    const fetchSesionesPorPelicula = async (peliculaId) => {
        try {
            const response = await axios.get(`${Config.urlBackend}/sesiones/pelicula/${peliculaId}/futuras`);
            setSesionesPorPelicula(prev => ({
                ...prev,
                [peliculaId]: response.data
            }));
        } catch (error) {
            console.error(`Error al cargar las sesiones para la película ${peliculaId}:`, error);
        }
    };

    useEffect(() => {
        fetchPeliculas();
    }, []);

    useEffect(() => {
        peliculas.forEach(pelicula => {
            fetchSesionesPorPelicula(pelicula.id);
        });
    }, [peliculas]);

    return (
        <div className="home-container">
            <div>
                <header className="home-header">
                    <div className="header-background">
                    <button className="admin-icon" onClick={() => navigate('/administrador')}>
                            <FiSettings size={24} />
                        </button>
                    </div>
                    <div className="header-content">
                        <img className='logo' src={logoCinema} alt="Cinema Logo" />
                        <div>
                            <h1 className='title'>Velvet Cinema</h1>
                        </div>
                        
                    </div>
                </header>
            </div>

            <div className="peliculas-list">
                {peliculas.length > 0 ? (
                    peliculas.map(pelicula => (
                        <div key={pelicula.id} className="pelicula-card">
                            <img src={pelicula.portada} alt={pelicula.titulo} width="100px" />
                            <div className="pelicula-info">
                                <h2>{pelicula.titulo}</h2>
                                <p>{pelicula.duracion} min | {pelicula.genero} | {pelicula.edades}</p>
                                <p>{pelicula.descripcion}</p>

                                <div className="sesiones">
                                    {sesionesPorPelicula[pelicula.id] ? (
                                        sesionesPorPelicula[pelicula.id].length > 0 ? (
                                            Object.entries(
                                                sesionesPorPelicula[pelicula.id].reduce((acc, sesion) => {
                                                    if (!acc[sesion.strFecha]) acc[sesion.strFecha] = [];
                                                    acc[sesion.strFecha].push(sesion);
                                                    return acc;
                                                }, {})
                                            ).map(([strFecha, sesiones], index) => (
                                                <div key={index} className="sesion-item">
                                                    <span className="sesion-fecha">{strFecha}</span>
                                                    <div className="sesion-horas">
                                                        {sesiones.map((sesion, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => {
                                                                    console.log("Sesión seleccionada:", sesion);
                                                                    navigate(`/salas/${sesion.salaId}`);
                                                                }}
                                                            >
                                                                {sesion.strHora}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))

                                        ) : (
                                            <p>No hay sesiones disponibles</p>
                                        )
                                    ) : (
                                        <p>Cargando sesiones...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hay películas disponibles</p>
                )}
            </div>
        </div>
    );
}

export default Home;
