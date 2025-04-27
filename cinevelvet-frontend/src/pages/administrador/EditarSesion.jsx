import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Config } from '../../api/Config';
import '../../css/Sesiones.css';

const EditarSesion = () => {
  const { state } = useLocation();
  const { sesion } = state || {};
  const [fecha, setFecha] = useState(sesion ? sesion.fecha : '');
  const [peliculaId, setPeliculaId] = useState(sesion ? sesion.peliculaId : '');
  const [salaId, setSalaId] = useState(sesion ? sesion.salaId : '');
  const [peliculas, setPeliculas] = useState([]);
  const [salas, setSalas] = useState([]);
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

  useEffect(() => {
    fetchPeliculas();
    fetchSalas();
  }, []);

  // Guardar cambios en la sesión
  const handleGuardarSesion = async () => {
    if (!fecha || !peliculaId || !salaId) {
      alert('Debes completar todos los campos.');
      return;
    }

    try {
      await axios.put(`${Config.urlBackend}/sesiones/${sesion.id}`, {
        fecha,
        peliculaId,
        salaId,
      });
      alert('Sesión editada correctamente.');
      navigate('/sesiones');
    } catch (error) {
      console.error('Error al editar la sesión:', error);
      alert('Error al editar la sesión.');
    }
  };

  return (
    <div className="sesiones-admin-container">
      <h2>Editar Sesión</h2>

      <button onClick={() => navigate('/sesiones')} className="back-button">
        <i className="fas fa-arrow-left"></i> Atrás
      </button>

      <hr />

      <div className="form-group">
        <label>Fecha de la sesión:</label>
        <input
          type="datetime-local"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Película:</label>
        <select
          value={peliculaId}
          onChange={(e) => setPeliculaId(e.target.value)}
        >
          <option value="">Seleccione una película</option>
          {peliculas.map((pelicula) => (
            <option key={pelicula.id} value={pelicula.id}>
              {pelicula.titulo}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Sala:</label>
        <select
          value={salaId}
          onChange={(e) => setSalaId(e.target.value)}
        >
          <option value="">Seleccione una sala</option>
          {salas.map((sala) => (
            <option key={sala.id} value={sala.id}>
              {sala.nombre} (Capacidad: {sala.capacidad})
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleGuardarSesion} className="crear-button">
        Guardar Cambios
      </button>
    </div>
  );
};

export default EditarSesion;
