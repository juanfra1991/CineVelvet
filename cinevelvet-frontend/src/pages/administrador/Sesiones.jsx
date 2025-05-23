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


const Sesiones = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [sesiones, setSesiones] = useState([]);
  const [fecha, setFecha] = useState(null);
  const [peliculaId, setPeliculaId] = useState('');
  const [salaId, setSalaId] = useState('');
  const [selectedSesion, setSelectedSesion] = useState(null);
  const [mensajeGuardado, setMensajeGuardado] = useState('');
  const navigate = useNavigate();

  // Obtener películas
  const fetchPeliculas = async () => {
    try {
      const res = await axios.get(`${Config.urlBackend}/peliculas`);
      setPeliculas(res.data);
    } catch (error) {
      console.error('Error al obtener las películas:', error);
    }
  };

  // Obtener salas
  const fetchSalas = async () => {
    try {
      const res = await axios.get(`${Config.urlBackend}/salas/sin-sesiones-sin-butacas`);
      setSalas(res.data);
    } catch (error) {
      console.error('Error al obtener las salas:', error);
    }
  };

  // Obtener sesiones
  const fetchSesiones = async () => {
    try {
      const res = await axios.get(`${Config.urlBackend}/sesiones/futuras`);
      setSesiones(res.data);
    } catch (error) {
      console.error('Error al obtener las sesiones:', error);
    }
  };

  useEffect(() => {
    fetchPeliculas();
    fetchSalas();
    fetchSesiones();
  }, []);

  // Crear nueva sesión
  const handleCrearSesion = async () => {
    if (!fecha || !peliculaId || !salaId) {
      setMensajeGuardado("Debes completar todos los campos.");
      setTimeout(() => setMensajeGuardado(""), 3000);
      return;
    }

    try {
      await axios.post(`${Config.urlBackend}/sesiones`, {
        fecha,
        peliculaId,
        salaId,
      });
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

  // Eliminar sesión
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

  // Función para formatear la fecha y hora
  const formatDate = (date) => {
    return date.toLocaleString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  // Validación de los campos para habilitar/deshabilitar el botón
  const isFormValid = fecha && peliculaId && salaId;

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

      {/* Botón de "Atrás" */}
      <button onClick={() => navigate(`/dashboard`)} className="back-button">
        <i className="fas fa-arrow-left"></i> Atrás
      </button>

      <hr />

      {/* Formulario de creación */}
      <h3>Crear Nueva Sesión</h3>

      <div className="formulario-editar">
        <div className="campo">
          <label>Fecha de la sesión:</label>
          <DatePicker
            selected={fecha}
            onChange={(date) => setFecha(date)}
            showTimeSelect
            timeIntervals={5}
            dateFormat="Pp"
            className="input-field"
            locale={es}
            placeholderText="Selecciona una fecha y hora"
          />
        </div>

        <div className="campo">
          <label>Película:</label>
          <select
            value={peliculaId}
            onChange={(e) => setPeliculaId(e.target.value)}
            className="input-field"
          >
            <option value="">Seleccione una película</option>
            {peliculas.map((pelicula) => (
              <option key={pelicula.id} value={pelicula.id}>
                {pelicula.titulo}
              </option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label>Sala:</label>
          <select
            value={salaId}
            onChange={(e) => setSalaId(e.target.value)}
            className="input-field"
          >
            <option value="">Seleccione una sala</option>
            {salas.map((sala) => (
              <option key={sala.id} value={sala.id}>
                {sala.nombre} (Capacidad: {sala.capacidad})
              </option>
            ))}
          </select>
        </div>
        {mensajeGuardado && (
          <div className="popup-mensaje">
            {mensajeGuardado}
          </div>
        )}
        <button
          onClick={handleCrearSesion}
          className="btn"
          disabled={!isFormValid}
        >
          Crear Sesión
        </button>
      </div>

      <hr />

      {/* Listado de sesiones existentes */}
      <h3>Listado de Sesiones</h3>

      <label>Selecciona una sesión:</label>
      <select
        value={selectedSesion ? selectedSesion.id : ''}
        onChange={(e) => {
          const selected = sesiones.find(sesion => sesion.id === Number(e.target.value));
          setSelectedSesion(selected || null);
        }}
        className="input-field"
      >
        <option value="">Seleccione una sesión</option>
        {sesiones.map((sesion) => (
          <option key={sesion.id} value={sesion.id}>
            {formatDate(new Date(sesion.fecha))} - {sesion.peliculaTitulo} en {sesion.salaNombre}
          </option>
        ))}
      </select>

      {/* Botones de acciones si hay sesión seleccionada */}
      {selectedSesion && (
        <div className="botones">
          <button onClick={() => navigate(`/editar-sesion/${selectedSesion.id}`)}>Editar</button>
          <button onClick={() => handleEliminarSesion(selectedSesion.id)}>Eliminar</button>
        </div>
      )}
    </div>
  );
};

export default Sesiones;
