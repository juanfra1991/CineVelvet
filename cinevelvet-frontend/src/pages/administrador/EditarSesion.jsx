import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Config } from '../../api/Config';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';
import '../../css/Sesiones.css';

const EditarSesion = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sesion, setSesion] = useState(null);
  const [peliculas, setPeliculas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [fecha, setFecha] = useState(null);
  const [peliculaId, setPeliculaId] = useState('');
  const [salaId, setSalaId] = useState('');
  const [mensajeGuardado, setMensajeGuardado] = useState('');

  const fetchSesion = async () => {
    try {
      const res = await axios.get(`${Config.urlBackend}/sesiones/${id}`);
      const data = res.data;
      setSesion(data);
      setFecha(new Date(data.fecha));
      setPeliculaId(data.peliculaId);
      setSalaId(data.salaId);
    } catch (error) {
      console.error('Error al obtener la sesión:', error);
    }
  };

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

  useEffect(() => {
    fetchSesion();
    fetchPeliculas();
    fetchSalas();
  }, []);

  const handleActualizarSesion = async () => {
    try {
      const sesionActualizada = {
        fecha: fecha.toISOString(),
        pelicula: { id: peliculaId },
        sala: { id: salaId },
      };
  
      await axios.put(`${Config.urlBackend}/sesiones/${id}`, sesionActualizada);
      setMensajeGuardado("Sesión actualizada correctamente.");
      setTimeout(() => setMensajeGuardado(""), 3000);
    } catch (error) {
      console.error('Error al actualizar la sesión:', error);
      setMensajeGuardado("Error al actualizar la sesión.");
      setTimeout(() => setMensajeGuardado(""), 3000);
    }
  };

  if (!sesion) return <div>Cargando sesión...</div>;

  return (
    <div className="sesiones-admin-container">
      <h2>Editar Sesión</h2>

      <button onClick={() => navigate('/sesiones')} className="back-button">
        <i className="fas fa-arrow-left"></i> Volver
      </button>

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
        <button onClick={handleActualizarSesion} className="btn">
          Actualizar Sesión
        </button>
      </div>
    </div>
  );
};

export default EditarSesion;
