import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Config } from '../../api/Config';
import { useNavigate } from 'react-router-dom';
import logoCinema from '../../assets/logoCine.jpg';
import { FiArrowLeftCircle } from "react-icons/fi";
import { es } from 'date-fns/locale';
import '../../css/Sesiones.css';
import '../../css/Home.css';
import '../../css/Dashboard.css';
import '../../css/Sala.css';
import butacaImg from '../../assets/butaca.svg';
import iconoCheck from '../../assets/iconoCheck.svg';
import iconoNocheck from '../../assets/iconoNocheck.svg';

const Sesiones = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [sesiones, setSesiones] = useState([]);
  const [fecha, setFecha] = useState(null);
  const [peliculaId, setPeliculaId] = useState('');
  const [salaId, setSalaId] = useState('');
  const [selectedSesion, setSelectedSesion] = useState(null);
  const [mensajeGuardado, setMensajeGuardado] = useState('');
  const [vistaActiva, setVistaActiva] = useState('crear');
  const [peliculaFiltroId, setPeliculaFiltroId] = useState('');
  const [salaFiltroId, setSalaFiltroId] = useState('');
  const [butacasSesion, setButacasSesion] = useState([]);
  const [mostrarDistribucion, setMostrarDistribucion] = useState(false);
  const [salaDetalle, setSalaDetalle] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPeliculas();
    fetchSalas();
    fetchSesiones();
  }, []);

  const fetchPeliculas = async () => {
    try {
      const res = await axios.get(`${Config.urlBackend}/peliculas`);
      setPeliculas(res.data);
    } catch (error) {
      console.error('Error al obtener las películas:', error);
    }
  };

  const fetchSalas = async () => {
    try {
      const res = await axios.get(`${Config.urlBackend}/salas/sin-sesiones-sin-butacas`);
      setSalas(res.data);
    } catch (error) {
      console.error('Error al obtener las salas:', error);
    }
  };

  const fetchSesiones = async () => {
    try {
      const res = await axios.get(`${Config.urlBackend}/sesiones/futuras`);
      setSesiones(res.data);
    } catch (error) {
      console.error('Error al obtener las sesiones:', error);
    }
  };

  const handleCrearSesion = async () => {
    if (!fecha || !peliculaId || !salaId) {
      setMensajeGuardado("Debes completar todos los campos.");
      setTimeout(() => setMensajeGuardado(""), 3000);
      return;
    }

    try {
      await axios.post(`${Config.urlBackend}/sesiones`, { fecha, peliculaId, salaId });
      setMensajeGuardado("Sesión creada correctamente.");
      setTimeout(() => setMensajeGuardado(""), 3000);
      setFecha(null);
      setPeliculaId('');
      setSalaId('');
      fetchSesiones();
    } catch (error) {
      console.error('Error al crear la sesión:', error);
      setMensajeGuardado("Error al crear la sesión.");
      setTimeout(() => setMensajeGuardado(""), 3000);
    }
  };

  const handleEliminarSesion = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta sesión?')) {
      try {
        await axios.delete(`${Config.urlBackend}/sesiones/${id}`);
        fetchSesiones();
        setSelectedSesion(null);
      } catch (error) {
        console.error('Error al eliminar la sesión:', error);
      }
    }
  };

  const formatDate = (date) => {
    return date.toLocaleString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const salasConSesionesDePelicula = salas.filter(sala =>
    sesiones.some(s => s.peliculaId === Number(peliculaFiltroId) && s.salaId === sala.id)
  );

  const sesionesFiltradas = sesiones.filter(s =>
    s.peliculaId === Number(peliculaFiltroId) && s.salaId === Number(salaFiltroId)
  );

  return (
    <div className="sesiones-admin-container home-container">
      <div>
        <header className="home-header">
          <div className="header-background header-content">
            <button className="admin-icon" onClick={() => window.history.back()} title="Cerrar Sesión">
              <FiArrowLeftCircle size={24} />
            </button>
            <img className='logo' src={logoCinema} alt="Cinema Logo" />
            <div>
              <h1 className='title'>Velvet Cinema</h1>
            </div>
          </div>
        </header>
      </div>
      <h2 className="titulo">Gestión de Sesiones</h2>

      <div className='dashboard-nav'>
        <button className={`flex-button ${vistaActiva === 'crear' ? 'btn-selected' : 'btn-unselected'}`} onClick={() => setVistaActiva('crear')}>Crear sesión</button>
        <button className={`flex-button ${vistaActiva === 'lista' ? 'btn-selected' : 'btn-unselected'}`} onClick={() => setVistaActiva('lista')}>Lista de sesiones</button>
      </div>

      {vistaActiva === 'crear' && (
        <>
          <h3 className='margin'>Crear Nueva Sesión</h3>
          <div className="formulario-editar">
            <div className="campo">
              <label>Fecha de la sesión:</label>
              <DatePicker selected={fecha} onChange={(date) => setFecha(date)} showTimeSelect timeIntervals={5} dateFormat="Pp" className="input-field" locale={es} placeholderText="Selecciona una fecha y hora" />
            </div>
            <div className="campo">
              <label>Película:</label>
              <select value={peliculaId} onChange={(e) => setPeliculaId(e.target.value)} className="input-field">
                <option value="">Seleccione una película</option>
                {peliculas.map((pelicula) => (
                  <option key={pelicula.id} value={pelicula.id}>{pelicula.titulo}</option>
                ))}
              </select>
            </div>
            <div className="campo">
              <label>Sala:</label>
              <select value={salaId} onChange={(e) => setSalaId(e.target.value)} className="input-field">
                <option value="">Seleccione una sala</option>
                {salas.map((sala) => (
                  <option key={sala.id} value={sala.id}>{sala.nombre} (Capacidad: {sala.capacidad})</option>
                ))}
              </select>
            </div>
            {mensajeGuardado && <div className="popup-mensaje">{mensajeGuardado}</div>}
            <button onClick={handleCrearSesion} className="btn" disabled={!fecha || !peliculaId || !salaId}>Crear Sesión</button>
          </div>
        </>
      )}

      {vistaActiva === 'lista' && (
        <>
          <h3>Listado de Sesiones</h3>
          <div className="campo">
            <label>Selecciona una película:</label>
            <select value={peliculaFiltroId} onChange={(e) => { setPeliculaFiltroId(e.target.value); setSalaFiltroId(''); setSelectedSesion(null); setMostrarDistribucion(false); }} className="input-field">
              <option value="">Seleccione una película</option>
              {peliculas.map((pelicula) => (
                <option key={pelicula.id} value={pelicula.id}>{pelicula.titulo}</option>
              ))}
            </select>
          </div>

          {peliculaFiltroId && (
            <div className="campo">
              <label>Selecciona una sala:</label>
              <select value={salaFiltroId} onChange={(e) => { setSalaFiltroId(e.target.value); setSelectedSesion(null); setMostrarDistribucion(false); }} className="input-field">
                <option value="">Seleccione una sala</option>
                {salasConSesionesDePelicula.map((sala) => (
                  <option key={sala.id} value={sala.id}>{sala.nombre}</option>
                ))}
              </select>
            </div>
          )}

          {peliculaFiltroId && salaFiltroId && sesionesFiltradas.length > 0 && (
            <div className="campo">
              <label>Selecciona una sesión:</label>
              <select value={selectedSesion ? selectedSesion.id : ''} onChange={async (e) => {
                const selected = sesionesFiltradas.find(s => s.id === Number(e.target.value));
                setSelectedSesion(selected || null);
                setMostrarDistribucion(false);
                if (selected) {
                  try {
                    const res = await axios.get(`${Config.urlBackend}/butacas/disponibles/${selected.id}/${selected.salaId}`);
                    setButacasSesion(res.data);
                  } catch (error) {
                    console.error('Error al cargar las butacas:', error);
                  }
                }
              }} className="input-field">
                <option value="">Seleccione una sesión</option>
                {sesionesFiltradas.map((sesion) => (
                  <option key={sesion.id} value={sesion.id}>{formatDate(new Date(sesion.fecha))}</option>
                ))}
              </select>
            </div>
          )}

          {selectedSesion && (
            <div className="botones">
              <button onClick={() => navigate(`/editar-sesion/${selectedSesion.id}`)}>Editar</button>
              <button onClick={() => handleEliminarSesion(selectedSesion.id)}>Eliminar</button>
              <button onClick={async () => {
                try {
                  const salaRes = await axios.get(`${Config.urlBackend}/butacas/sala/${selectedSesion.salaId}`);
                  setSalaDetalle(salaRes.data);
                  setMostrarDistribucion(prev => !prev);
                } catch (error) {
                  console.error('Error al cargar la sala:', error);
                }
              }}>
                {mostrarDistribucion ? 'Ocultar distribución' : 'Distribución de sala'}
              </button>
            </div>
          )}

          {mostrarDistribucion && salaDetalle && (
            <div>
              <div className="seatplan__cinema-screen txt-center uppercase">
                <span>Pantalla</span>
              </div>

              <div className="sala-grid">
                {Array.from({ length: salaDetalle.filas }).map((_, filaIndex) => {
                  const fila = filaIndex + 1;
                  return Array.from({ length: salaDetalle.columnas + 1 }).map((_, colIndex) => {
                    // Insertamos el pasillo visualmente al centro
                    const mitad = Math.floor(salaDetalle.columnas / 2);
                    if (colIndex === mitad) {
                      return <div className="pasillo" key={`pasillo-${filaIndex}-${colIndex}`} />;
                    }

                    // Si pasamos la mitad, corremos el índice una unidad para evitar superposición con pasillo
                    const columna = colIndex > mitad ? colIndex : colIndex + 1;
                    const indexButaca = (filaIndex * salaDetalle.columnas) + (columna - 1);
                    const butaca = butacasSesion[indexButaca];

                    return (
                      <div
                        key={`butaca-${filaIndex}-${columna}`}
                        className={`butaca ${butaca?.ocupada ? 'butaca-ocupada' : ''}`}
                      >
                        <div className="butaca-contenedor">
                          <img src={butacaImg} alt={`Butaca F${fila}B${columna}`} className="butaca-img" />
                          <img
                            src={butaca?.ocupada ? iconoNocheck : iconoCheck}
                            alt={butaca?.ocupada ? 'Ocupada' : 'Libre'}
                            className="icono-check"
                          />
                        </div>
                      </div>
                    );
                  });
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Sesiones;
