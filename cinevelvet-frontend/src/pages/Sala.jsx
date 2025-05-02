import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Sala.css';
import '../css/Home.css';
import butacaImg from '../assets/butaca.svg';
import iconoCheck from '../assets/iconoCheck.svg';
import logoCinema from '../assets/logoCine.jpg';
import pantallaCine from '../assets/pantallaCine.png';
import { Config } from '../api/Config';

// Importaciones iguales

const Sala = () => {
    const { salaId, sesionId } = useParams();
    const navigate = useNavigate();
    const [sala, setSala] = useState(null);
    const [sesion, setSesion] = useState(null);
    const [butacas, setButacas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [butacasSeleccionadas, setButacasSeleccionadas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const salaResponse = await axios.get(`${Config.urlBackend}/butacas/sala/${salaId}`);
                setSala(salaResponse.data);

                const sesionResponse = await axios.get(`${Config.urlBackend}/sesiones/${sesionId}`);
                setSesion(sesionResponse.data);

                const butacasResponse = await axios.get(`${Config.urlBackend}/butacas/disponibles/${sesionId}/${salaId}`);
                setButacas(butacasResponse.data);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [salaId, sesionId]);

    if (loading) return <p>Cargando sala...</p>;
    if (!sala || !sesion) return <p>No se encontró la sala o la sesión.</p>;

    const toggleSeleccion = (fila, columna) => {
        const yaSeleccionada = butacasSeleccionadas.some(b => b.fila === fila && b.columna === columna);
        if (yaSeleccionada) {
            setButacasSeleccionadas(prev =>
                prev.filter(b => !(b.fila === fila && b.columna === columna))
            );
        } else {
            setButacasSeleccionadas(prev => [...prev, { fila, columna }]);
        }
    };

    const mostrarButacasSeleccionadas = butacasSeleccionadas.length
        ? `${butacasSeleccionadas.length} butacas, (${butacasSeleccionadas.map(b => `Fila ${b.fila}, Butaca ${b.columna}`).join(' | ')})`
        : 'por favor, selecciona las butacas deseadas';

    const handleComprarClick = () => {
        if (butacasSeleccionadas.length > 0) {
            const idsSeleccionados = butacasSeleccionadas.map(b => {
                const butaca = butacas.find(
                    (butaca) => butaca.fila === b.fila && butaca.butaca === b.columna
                );
                return butaca?.id;
            }).filter(id => id !== undefined);

            console.log("IDs reales:", idsSeleccionados);

            navigate('/reservas', {
                state: {
                    sesionId,
                    butacasSeleccionadas: idsSeleccionados
                }
            });
        } else {
            alert("Selecciona al menos una butaca.");
        }
    };


    return (
        <div className="home-container">
            <header className="home-header">
                <div className="header-background"></div>
                <div className="header-content">
                    <img className='logo' src={logoCinema} alt="Cinema Logo" />
                    <div>
                        <h1 className='title'>Velvet Cinema</h1>
                    </div>
                </div>
            </header>

            <p><strong>Velvet Cinema</strong></p>
            <div className="info-pelicula">
                <p><strong>Película:</strong> {sesion.peliculaTitulo}, {sesion.strFechaLarga} {sesion.strHora}, {sala.nombre}</p>
            </div>

            <p><strong>Selección de butacas: </strong>{mostrarButacasSeleccionadas}</p>

            <div>
                <img src={pantallaCine} alt="Pantalla de Cine" style={{ width: '100%', height: 'auto' }} />
            </div>

            <div className="sala-grid" style={{
                gridTemplateColumns: `repeat(${sala.columnas}, 1fr)`,
            }}>
                {Array.from({ length: sala.filas }).map((_, filaIndex) => (
                    Array.from({ length: sala.columnas }).map((_, colIndex) => {
                        const fila = filaIndex + 1;
                        const columna = colIndex + 1;
                        const index = filaIndex * sala.columnas + colIndex;
                        const butaca = butacas[index];
                        const seleccionada = butacasSeleccionadas.some(b => b.fila === fila && b.columna === columna);

                        return (
                            <div
                                key={butaca.id}
                                className={`butaca ${seleccionada ? 'butaca-seleccionada' : ''} ${butaca.ocupada ? 'butaca-ocupada' : ''}`}
                                onClick={() => !butaca.ocupada && toggleSeleccion(fila, columna)}
                            >
                                <div className="butaca-contenedor">
                                    <img src={butacaImg} alt={`Butaca F${fila}B${columna}`} className="butaca-img" />
                                    <img src={iconoCheck} alt="Seleccionada" className="icono-check" />
                                </div>
                            </div>
                        );
                    })
                ))}
            </div>

            <div className="boton-comprar-container">
                <button className="boton-comprar" onClick={handleComprarClick}>Comprar</button>
            </div>
        </div>
    );
};

export default Sala;
