import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Config } from '../api/Config';
import axios from 'axios';
import logoCinema from '../assets/logoCine.jpg';
import { FiSettings, FiPlay } from 'react-icons/fi';
import Modal from 'react-modal';
import '../css/Home.css';
import '../css/Sesiones.css';

const Home = () => {
    const navigate = useNavigate();
    const [peliculas, setPeliculas] = useState([]);
    const [sesionesPorPelicula, setSesionesPorPelicula] = useState({});
    const [modalAbierto, setModalAbierto] = useState(false);
    const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null);

    useEffect(() => {
        Modal.setAppElement('#root');
        fetchPeliculas();
    }, []);

    useEffect(() => {
        peliculas.forEach(pelicula => {
            fetchSesionesPorPelicula(pelicula.id);
        });
    }, [peliculas]);

    const fetchPeliculas = async () => {
        try {
            const response = await axios.get(`${Config.urlBackend}/peliculas/publicadas`);
            setPeliculas(response.data);
        } catch (error) {
            console.error("Error al cargar las películas:", error);
        }
    };

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

    const abrirModal = (pelicula) => {
        setPeliculaSeleccionada(pelicula);
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setPeliculaSeleccionada(null);
        setModalAbierto(false);
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <div className="header-background header-content">
                    <button className="admin-icon" onClick={() => navigate('/administrador')}>
                        <FiSettings size={24} />
                    </button>
                    <img className='logo' src={logoCinema} alt="Cinema Logo" />
                    <h1 className='title'>Velvet Cinema</h1>
                </div>
            </header>

            <div className="peliculas-list">
                {peliculas.length > 0 ? (
                    peliculas.map(pelicula => (
                        <div key={pelicula.id} className="pelicula-card">
                            <div className="portada-container" onClick={() => abrirModal(pelicula)}>
                                <img
                                    src={`${Config.urlAssets}/portadas/${pelicula.portada}`}
                                    alt={pelicula.titulo}
                                />
                                <div className="play-icon-overlay">
                                    <FiPlay size={36} />
                                </div>
                            </div>

                            <div className="pelicula-info">
                                <h2>{pelicula.titulo}</h2>
                                <p>{pelicula.duracion} min | {pelicula.genero} | {pelicula.edades}</p>

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
                                                                onClick={() => navigate(`/salas/${sesion.salaId}/sesion/${sesion.id}`)}
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

            <Modal
                isOpen={modalAbierto}
                onRequestClose={cerrarModal}
                contentLabel="Descripción de la película"
                className="popup-mensaje"
                overlayClassName="custom-overlay"
                ariaHideApp={false}
            >
                {peliculaSeleccionada && (
                    <div>
                        <h2 className="h2">{peliculaSeleccionada.titulo}</h2>
                        <p>{peliculaSeleccionada.descripcion}</p>
                        <button className="btn" onClick={cerrarModal}>Cerrar</button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Home;
