import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Config } from '../../api/Config';
import { useNavigate } from 'react-router-dom';
import '../../css/Peliculas.css';

const Peliculas = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [selectedPelicula, setSelectedPelicula] = useState(null);
  const navigate = useNavigate();

  // Función para obtener las películas
  const fetchPeliculas = async () => {
    try {
      const res = await axios.get(`${Config.urlBackend}/peliculas`);
      setPeliculas(res.data);
    } catch (error) {
      console.error('Error al obtener las películas:', error);
    }
  };

  // Función para eliminar una película
  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta película?')) {
      try {
        await axios.delete(`${Config.urlBackend}/peliculas/${id}`);
        fetchPeliculas();
      } catch (error) {
        console.error('Error al eliminar la película:', error);
      }
    }
  };

  useEffect(() => {
    fetchPeliculas();
  }, []);

  return (
    <div className="peliculas-admin-container">
      <h2>Listado de Películas</h2>

      {/* Botón de "Atrás" con ícono de flecha */}
      <button onClick={() => navigate(-1)} className="back-button">
        <i className="fas fa-arrow-left"></i> Atrás
      </button>

      {/* Botón para crear una nueva película */}
      <button onClick={() => navigate('/crear-pelicula')}>Crear Nueva Película</button>

      <hr />

      {/* Desplegable para seleccionar película */}
      <label>Selecciona una película:</label>
      <select
        value={selectedPelicula ? selectedPelicula.id : ''}
        onChange={(e) => {
          const selected = peliculas.find(pelicula => pelicula.id === Number(e.target.value));
          setSelectedPelicula(selected || null);
        }}
      >
        <option value="">Seleccione una película</option>
        {peliculas.map((pelicula) => (
          <option key={pelicula.id} value={pelicula.id}>
            {pelicula.titulo}
          </option>
        ))}
      </select>

      {/* Mostrar botones de editar y eliminar si hay una película seleccionada */}
      {selectedPelicula && (
        <div className="botones">
          <button onClick={() => navigate(`/editar-pelicula/${selectedPelicula.id}`)}>Editar</button>
          <button onClick={() => handleEliminar(selectedPelicula.id)}>Eliminar</button>
        </div>
      )}
    </div>
  );
};

export default Peliculas;
