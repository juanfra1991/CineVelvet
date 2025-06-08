import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Sala.css';
import '../css/Home.css';
import HeaderTabs from '../components/HeaderTabs';
import butacaImg from '../assets/butaca.svg';
import iconoCheck from '../assets/iconoCheck.svg';
import iconoNocheck from '../assets/iconoNocheck.svg';
import logoCinema from '../assets/logoCine.jpg';
import { FiArrowLeftCircle } from "react-icons/fi";
import { Config } from '../api/Config';

const Sala = () => {
    //Constantes utilizadas
    const { salaId, sesionId } = useParams();
    const navigate = useNavigate();
    const [sala, setSala] = useState(null);
    const [sesion, setSesion] = useState(null);
    const [butacas, setButacas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [butacasSeleccionadas, setButacasSeleccionadas] = useState([]);
    const [mensajeErrorButaca, setMensajeErrorButaca] = useState(false);
    const [fechaSesion, setFechaSesion] = useState(null);
    const [sesionExpirada, setSesionExpirada] = useState(false);
    const [butacaOcupada, setButacaOcupada] = useState('');
    const usuarioID = localStorage.getItem('usuarioId');
    const [maximoButacasSuperado, setMaximoButacasSuperado] = useState(false);

    useEffect(() => {
        //Método para mostrar la información completa de la sala
        const fetchData = async () => {
            try {
                const salaResponse = await axios.get(`${Config.urlBackend}/butacas/sala/${salaId}`);
                setSala(salaResponse.data);

                const sesionResponse = await axios.get(`${Config.urlBackend}/sesiones/${sesionId}`);
                const fecha = new Date(sesionResponse.data.fecha);
                setFechaSesion(fecha);
                const ahora = new Date();
                if (fecha < ahora) {
                    setSesionExpirada(true);
                }
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


    useEffect(() => {
        let usuarioID = localStorage.getItem('usuarioId');

        if (!usuarioID) {
            // Si no hay usuarioId, crear uno nuevo y guardarlo en el localStorage
            usuarioID = `invitado-${Date.now()}`;
            localStorage.setItem('usuarioId', usuarioID);
        }
    }, []);

    if (loading) return <p>Cargando sala...</p>;
    if (!sala || !sesion) return <p>No se encontró la sala o la sesión.</p>;

    //Método para seleccionar o deseleccionar las butacas, máximo 10
    const toggleSeleccion = (fila, columna) => {
        const yaSeleccionada = butacasSeleccionadas.some(b => b.fila === fila && b.columna === columna);

        if (yaSeleccionada) {
            setButacasSeleccionadas(prev =>
                prev.filter(b => !(b.fila === fila && b.columna === columna))
            );
        } else {
            if (butacasSeleccionadas.length >= 10) {
                setMaximoButacasSuperado(true);
                return;
            }
            setButacasSeleccionadas(prev => [...prev, { fila, columna }]);
        }
    };

    //Método para mostrar en la información las butacas seleccionadas.
    const mostrarButacasSeleccionadas = butacasSeleccionadas.length
        ? `${butacasSeleccionadas.length} butacas, (${butacasSeleccionadas.map(b => `Fila ${b.fila}, Butaca ${b.columna}`).join(' | ')})`
        : 'por favor, selecciona las butacas deseadas';


    //Método para comprar las butacas seleccionadas
    const handleComprarClick = async () => {
        const usuarioID = localStorage.getItem('usuarioId');

        if (!usuarioID) {
            return;
        }

        const ahora = new Date();
        if (fechaSesion && fechaSesion < ahora) {
            setSesionExpirada(true);
            return;
        }

        if (butacasSeleccionadas.length > 0) {
            const idsSeleccionados = butacasSeleccionadas.map(b => {
                const butaca = butacas.find(
                    (butaca) => butaca.fila === b.fila && butaca.butaca === b.columna
                );
                return butaca?.id;
            }).filter(id => id !== undefined);

            try {
                await axios.put(
                    `${Config.urlBackend}/butacas/bloquear?usuarioId=${usuarioID}`,
                    idsSeleccionados
                );
                navigate('/reservas', {
                    state: {
                        sesionId,
                        butacasSeleccionadas: idsSeleccionados,
                        usuarioID
                    }
                });
            } catch (error) {
                console.error("Error al bloquear las butacas:", error.response ? error.response.data : error);
                setButacaOcupada('ocupada');
            }
        } else {
            setMensajeErrorButaca(true);
        }
    };

    //Realizamos la partición de la sala en dos para mostrar un pasillo
    const pasilloSala = Math.floor(sala.columnas / 2);

    return (
        <div className="home-container">
            <HeaderTabs />

            <p><strong>Velvet Cinema</strong></p>
            <div className="info-pelicula">
                <p><strong>Película:</strong> {sesion.peliculaTitulo}, {sesion.strFechaLarga} {sesion.strHora}, {sala.nombre}</p>
            </div>
            <div>
                <div>
                    <strong>Selección de butacas:</strong>{' '}
                    {butacasSeleccionadas.length === 0 ? (
                        <span>por favor, selecciona las butacas deseadas.</span>
                    ) : (
                        <span>{butacasSeleccionadas.length} butacas</span>
                    )}
                </div>
                {butacasSeleccionadas.length > 0 && (
                    <div style={{ marginTop: '0.5em' }}>
                        {butacasSeleccionadas
                            .reduce((grupoButacas, butacaSelect, indice) => {
                                const grupoButacasInfo = Math.floor(indice / 8);
                                if (!grupoButacas[grupoButacasInfo]) grupoButacas[grupoButacasInfo] = [];
                                grupoButacas[grupoButacasInfo].push(`Fila ${butacaSelect.fila}, Butaca ${butacaSelect.columna}`);
                                return grupoButacas;
                            }, [])
                            .map((grupo, indiceButacas) => (
                                <div key={indiceButacas}>{grupo.join(' | ')}</div>
                            ))}
                    </div>
                )}
            </div>
            <div className="leyenda-butacas">
                <div className="leyenda-item">
                    <div className="butaca-contenedor-leyenda">
                        <img src={butacaImg} className="leyenda-icono seleccionada" alt="Butaca seleccionada" />
                        <img src={iconoCheck} alt="Disponible" className="icono-check" />
                    </div>
                    <span>Butacas seleccionadas</span>
                </div>
                <div className="leyenda-item">
                    <div className="butaca-contenedor-leyenda">
                        <img src={butacaImg} className="leyenda-icono no-disponible" alt="No disponible" />
                        <img src={iconoNocheck} alt="No disponible" className="icono-check" />
                    </div>
                    <span>No disponible</span>
                </div>
                <div className="leyenda-item">
                    <div className="butaca-contenedor-leyenda">
                        <img src={butacaImg} className="leyenda-icono bloqueada" alt="Butaca bloqueada" />
                        <img src={iconoNocheck} alt="Bloqueada" className="icono-check" />
                    </div>
                    <span>Butaca bloqueada</span>
                </div>
            </div>
            <div className='seatplan__cinema-screen txt-center uppercase'>
                <span>Pantalla</span>
            </div>
            <div className="sala-grid">
                {Array.from({ length: sala.filas }).flatMap((_, filaIndex) => {
                    const fila = filaIndex + 1;
                    const rowElements = [];

                    for (let colIndex = 0; colIndex < sala.columnas; colIndex++) {
                        const columna = colIndex + 1;
                        const index = filaIndex * sala.columnas + colIndex;
                        const butaca = butacas[index];
                        const seleccionada = butacasSeleccionadas.some(b => b.fila === fila && b.columna === columna);
                        const isBlockedByCurrentUser = butaca.bloqueada && butaca.usuarioId === usuarioID;

                        if (colIndex === pasilloSala) {
                            rowElements.push(<div className="pasillo" key={`pasillo-${filaIndex}`} />);
                        }

                        rowElements.push(
                            <div
                                key={butaca.id}
                                className={`butaca 
                        ${seleccionada ? 'butaca-seleccionada' : ''} 
                        ${butaca.ocupada || (butaca.bloqueada && butaca.usuarioId !== usuarioID) ? 'butaca-ocupada' : ''}`}
                                onClick={() =>
                                    !butaca.ocupada && !(butaca.bloqueada && !isBlockedByCurrentUser) &&
                                    toggleSeleccion(fila, columna)
                                }
                            >
                                <div className="butaca-contenedor">
                                    <img src={butacaImg} alt={`Butaca F${fila}B${columna}`} className="butaca-img" />
                                    {butaca.ocupada || (butaca.bloqueada && butaca.usuarioId !== usuarioID) ? (
                                        <img src={iconoNocheck} alt="Ocupada" className="icono-check" />
                                    ) : (
                                        <img src={iconoCheck} alt="Disponible" className="icono-check" />
                                    )}
                                </div>
                            </div>
                        );
                    }
                    return rowElements;
                })}
            </div>

            <div>
                <br />
                <p className='font'>*No incluye gastos adicionales.</p>
                <div>
                    <img src={`/assets/payment/payment_creditcards.svg`} className='margenes' alt="Tarjeta de crédito" width="55" />
                    <img src={`/assets/payment/payment_paypal.svg`} className='margenes' alt="PayPal" width="55" />
                    <img src={`/assets/payment/payment_bizum.svg`} className='margenes' alt="Bizum" width="55" />
                </div>
            </div>
            {mensajeErrorButaca && (
                <div className="popup-overlay">
                    <div className="popup-mensaje">
                        <p>Por favor seleccione al menos una butaca.</p>
                        <button onClick={() => setMensajeErrorButaca(false)}>Cerrar</button>
                    </div>
                </div>
            )}
            {butacaOcupada && <div className="popup-overlay">
                <div className="popup-mensaje">
                    <p>La selección de butacas está ocupada por otro usuario.</p>
                    <button onClick={() => window.location.reload()}>Cerrar</button>
                </div>
            </div>}
            {sesionExpirada && (
                <div className="popup-overlay">
                    <div className="popup-mensaje">
                        <p>Esta sesión ha expirado. No puedes comprar en esta sesión.</p>
                        <button onClick={() => navigate('/')}>Ir a la cartelera</button>
                    </div>
                </div>
            )}
            {butacasSeleccionadas.length > 0 && (
                <div className="resumen-compra">

                    <div className="total-precio">
                        {butacasSeleccionadas.length} entrada{butacasSeleccionadas.length > 1 ? 's' : ''} × 5,00 € = {(butacasSeleccionadas.length * 5).toFixed(2).replace('.', ',')} €
                    </div>
                </div>
            )}
            {maximoButacasSuperado && (
                <div className="popup-overlay">
                    <div className="popup-mensaje">
                        <p>Has superado el máximo de 10 entradas permitidas.</p>
                        <button onClick={() => setMaximoButacasSuperado(false)}>Cerrar</button>
                    </div>
                </div>
            )}
            <div className="boton-comprar-container">
                <button
                    onClick={handleComprarClick}
                    disabled={sesionExpirada}
                    className={`boton-comprar ${sesionExpirada ? 'boton-desactivado' : ''}`}
                >
                    Comprar
                </button>

            </div>
        </div>
    );
};

export default Sala;
