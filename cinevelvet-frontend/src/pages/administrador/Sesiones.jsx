import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Config } from '../../api/Config';
import { useNavigate } from 'react-router-dom';
import logoCinema from '../../assets/logoCine.jpg';
import { FiArrowLeftCircle, FiX } from "react-icons/fi";
import { es } from 'date-fns/locale';
import '../../css/Sesiones.css';
import '../../css/Home.css';
import '../../css/Dashboard.css';
import '../../css/Sala.css';
import butacaImg from '../../assets/butaca.svg';
import iconoCheck from '../../assets/iconoCheck.svg';
import iconoNocheck from '../../assets/iconoNocheck.svg';
import { setHours, setMinutes } from 'date-fns';

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

  // Modales
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false);
  const [sesionAEliminar, setSesionAEliminar] = useState(null);
  const [modalMensajeVisible, setModalMensajeVisible] = useState(false);
  const [modalMensajeTexto, setModalMensajeTexto] = useState('');
  const [modalEliminarButacaVisible, setModalEliminarButacaVisible] = useState(false);
  const [butacaAEliminar, setButacaAEliminar] = useState(null);
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
  const resetFormulario = () => {
    setFecha(null);
    setPeliculaId('');
    setSalaId('');
  };

  const handleCrearSesion = async () => {
    if (!fecha || !peliculaId || !salaId) {
      setMensajeGuardado("Debes completar todos los campos.");
      setTimeout(() => setMensajeGuardado(""), 3000);
      return;
    }

    // Verifica si ya existe una sesión con los mismos datos
    const sesionExistente = sesiones.find(s =>
      s.salaId === Number(salaId) &&
      normalizarFecha(s.fecha) === normalizarFecha(fecha)
    );

    if (sesionExistente) {
      setModalMensajeTexto("Ya hay una película programada para esta hora.");
      setModalMensajeVisible(true);

      // Ocultar el mensaje después de 3 segundos (3000 ms)
      setTimeout(() => {
        setModalMensajeVisible(false);
      }, 3000);

      return;
    }

    try {
      await axios.post(`${Config.urlBackend}/sesiones`, { fecha, peliculaId, salaId });

      resetFormulario();
      fetchSesiones();

      // Mostrar el modal de confirmación
      setModalMensajeTexto("Sesión creada correctamente.");
      setModalMensajeVisible(true);

      setTimeout(() => {
        setModalMensajeVisible(false);
      }, 2500);

    } catch (error) {
      console.error('Error al crear la sesión:', error);
      setModalMensajeTexto("Error al crear la sesión.");
      setModalMensajeVisible(true);
    }
  };

  const confirmarEliminarSesion = (id) => {
    setSesionAEliminar(id);
    setModalEliminarVisible(true);
  };

  const handleEliminarConfirmado = async () => {
    if (!sesionAEliminar) return;

    try {
      await axios.delete(`${Config.urlBackend}/sesiones/${sesionAEliminar}`);
      fetchSesiones();
      setSelectedSesion(null);
    } catch (error) {
      console.error('Error al eliminar la sesión:', error);
    } finally {
      setModalEliminarVisible(false);
      setSesionAEliminar(null);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const normalizarFecha = (fecha) => {
    const f = new Date(fecha);
    f.setSeconds(0);
    f.setMilliseconds(0);
    return f.getTime();
  };

  const salasConSesionesDePelicula = salas.filter(sala =>
    sesiones.some(s => s.peliculaId === Number(peliculaFiltroId) && s.salaId === sala.id)
  );

  const sesionesFiltradas = sesiones.filter(s =>
    s.peliculaId === Number(peliculaFiltroId) && s.salaId === Number(salaFiltroId)
  );

  const toggleOcupacionButaca = async (butacaId, ocupada, reservaId) => {
    if (!ocupada) return;

    setButacaAEliminar({ butacaId, reservaId });
    setModalEliminarButacaVisible(true);

    try {
      const res = await axios.get(`${Config.urlBackend}/butacas/disponibles/${selectedSesion.id}/${selectedSesion.salaId}`);
      setButacasSesion(res.data);
    } catch (error) {
      console.error('Error al liberar la butaca:', error);
    }
  };

  const handleEliminarButacaConfirmado = async () => {
    if (!butacaAEliminar) return;

    try {
      await axios.delete(`${Config.urlBackend}/reservas/entradas`, {
        params: {
          reservaId: butacaAEliminar.reservaId,
          butacaId: butacaAEliminar.butacaId
        }
      });

      const res = await axios.get(`${Config.urlBackend}/butacas/disponibles/${selectedSesion.id}/${selectedSesion.salaId}`);
      setButacasSesion(res.data);
    } catch (error) {
      console.error('Error al liberar la butaca:', error);
    } finally {
      setModalEliminarButacaVisible(false);
      setButacaAEliminar(null);
    }
  };

  return (
    <div className="sesiones-admin-container home-container">
      {/* HEADER */}
      <header className="home-header">
        <div className="header-background header-content">
          <button className="admin-icon" onClick={() => window.history.back()} title="Atrás">
            <FiArrowLeftCircle size={24} />
          </button>
          <img className='logo' src={logoCinema} alt="Cinema Logo" />
          <h1 className='title'>Velvet Cinema</h1>
        </div>
      </header>

      <h2 className="titulo">Gestión de Sesiones</h2>

      <div className='dashboard-nav'>
        <button className={`flex-button ${vistaActiva === 'crear' ? 'btn-selected' : 'btn-unselected'}`} onClick={() => setVistaActiva('crear')}>Crear sesión</button>
        <button className={`flex-button ${vistaActiva === 'lista' ? 'btn-selected' : 'btn-unselected'}`} onClick={() => setVistaActiva('lista')}>Lista de sesiones</button>
      </div>

      {vistaActiva === 'crear' && (
        <>
          <hr />
          <div className="formulario-editar">
            <div className="campo">
              <label>Película:</label>
              <select value={peliculaId} onChange={(e) => setPeliculaId(e.target.value)} className="input-field">
                <option value="">Seleccione una película</option>
                {peliculas.map(p => (
                  <option key={p.id} value={p.id}>{p.titulo}</option>
                ))}
              </select>
            </div>
            <div className="campo">
              <label>Sala:</label>
              <select value={salaId} onChange={(e) => setSalaId(e.target.value)} className="input-field">
                <option value="">Seleccione una sala</option>
                {salas.map(s => (
                  <option key={s.id} value={s.id}>{s.nombre} (Capacidad: {s.capacidad})</option>
                ))}
              </select>
            </div>
            <div className="campo">
              <label>Fecha de la sesión:</label>
              <DatePicker
                selected={fecha}
                onChange={setFecha}
                showTimeSelect
                timeIntervals={15}
                minDate={new Date()}
                dateFormat="Pp"
                className="input-field"
                locale={es}
                placeholderText="Selecciona una fecha y hora"
                minTime={setHours(setMinutes(new Date(), 45), 15)}
                maxTime={setHours(setMinutes(new Date(), 30), 22)}
              />
            </div>
            {modalMensajeVisible && (
              <div className="popup-mensaje-peliculas">
                {modalMensajeTexto}
              </div>
            )}
            {mensajeGuardado && <div className="popup-mensaje-peliculas">{mensajeGuardado}</div>}
            <button onClick={handleCrearSesion} className="btn" disabled={!fecha || !peliculaId || !salaId}>Crear Sesión</button>
          </div>
        </>
      )}

      {vistaActiva === 'lista' && (
        <>
          <hr />
          <div className="campo">
            <label>Película:</label>
            <select value={peliculaFiltroId} onChange={(e) => { setPeliculaFiltroId(e.target.value); setSalaFiltroId(''); setSelectedSesion(null); setMostrarDistribucion(false); }} className="input-field">
              <option value="">Seleccione una película</option>
              {peliculas.map(p => (
                <option key={p.id} value={p.id}>{p.titulo}</option>
              ))}
            </select>
          </div>

          {peliculaFiltroId && (
            <div className="campo">
              <label>Sala:</label>
              <select value={salaFiltroId} onChange={(e) => { setSalaFiltroId(e.target.value); setSelectedSesion(null); setMostrarDistribucion(false); }} className="input-field">
                <option value="">Seleccione una sala</option>
                {salasConSesionesDePelicula.map(s => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
            </div>
          )}

          {peliculaFiltroId && salaFiltroId && sesionesFiltradas.length > 0 && (
            <div className="campo">
              <label>Sesión:</label>
              <select value={selectedSesion?.id || ''} onChange={async (e) => {
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
                {sesionesFiltradas.map(s => (
                  <option key={s.id} value={s.id}>{formatDate(new Date(s.fecha))}</option>
                ))}
              </select>
            </div>
          )}

          {selectedSesion && (
            <div className="botones">
              <button onClick={() => navigate(`/editar-sesion/${selectedSesion.id}`)}>Editar</button>
              <button onClick={() => confirmarEliminarSesion(selectedSesion.id)}>Eliminar</button>
              <button onClick={async () => {
                try {
                  const res = await axios.get(`${Config.urlBackend}/butacas/sala/${selectedSesion.salaId}`);
                  setSalaDetalle(res.data);
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
                    const mitad = Math.floor(salaDetalle.columnas / 2);
                    if (colIndex === mitad) return <div className="pasillo" key={`pasillo-${filaIndex}-${colIndex}`} />;
                    const columna = colIndex > mitad ? colIndex : colIndex + 1;
                    const indexButaca = (filaIndex * salaDetalle.columnas) + (columna - 1);
                    const butaca = butacasSesion[indexButaca];
                    return (
                      <div key={`butaca-${filaIndex}-${columna}`} className={`butaca ${butaca?.ocupada ? 'butaca-ocupada' : ''}`} onClick={() => toggleOcupacionButaca(butaca.id, butaca.ocupada, butaca.reservaId)} title={butaca.ocupada ? `Ocupada (Reserva ID: ${butaca.reservaId})` : 'Libre'}>
                        <div className="butaca-contenedor">
                          <img src={butacaImg} alt={`Butaca F${fila}B${columna}`} className="butaca-img" />
                          <img src={butaca?.ocupada ? iconoNocheck : iconoCheck} alt={butaca?.ocupada ? 'Ocupada' : 'Libre'} className="icono-check" />
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
      {modalEliminarVisible && (
        <div className="custom-overlay">
          <div className="popup-mensaje-modal">
            <h3 className="modal-titulo">¿Estás seguro de que deseas eliminar esta sesión?</h3>
            <div className="modal-botones">
              <button onClick={handleEliminarConfirmado} className="btn-aceptar">
                Aceptar
              </button>
              <button onClick={() => setModalEliminarVisible(false)} className="btn-unselected">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {modalEliminarButacaVisible && (
        <div className="custom-overlay">
          <div className="popup-mensaje-modal">
            <h3 className="modal-titulo">¿Deseas liberar esta butaca?</h3>
            <div className="modal-botones">
              <button onClick={handleEliminarButacaConfirmado} className="btn-aceptar">
                Aceptar
              </button>
              <button onClick={() => { setModalEliminarButacaVisible(false); setButacaAEliminar(null); }} className='btn-unselected'>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sesiones;
