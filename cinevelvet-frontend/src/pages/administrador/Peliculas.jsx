import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Config } from '../../api/Config';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'; // Importamos React Select
import '../../css/Peliculas.css';

const Peliculas = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [selectedPelicula, setSelectedPelicula] = useState(null);
  const navigate = useNavigate();

  // Obtener las películas
  const fetchPeliculas = async () => {
    try {
      const res = await axios.get(`${Config.urlBackend}/peliculas`);
      setPeliculas(res.data);
    } catch (error) {
      console.error('Error al obtener las películas:', error);
    }
  };

  // Eliminar una película
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

  // Mapeamos las películas a un formato que React-Select pueda entender
  const opcionesPeliculas = peliculas.map((pelicula) => ({
    value: pelicula.id,
    label: pelicula.titulo
  }));

  return (
    <div className="peliculas-admin-container">
      <h2>Gestión de Películas</h2>

      {/* Botón de "Atrás" */}
      <button onClick={() => navigate(`/dashboard`)} className="back-button">
        <i className="fas fa-arrow-left"></i> Atrás
      </button>

      <hr />

      {/* Formulario para crear una nueva película */}
      <h3>Crear Nueva Película</h3>
      <button onClick={() => navigate('/crear-pelicula')} className="crear-button">
        Crear Nueva Película
      </button>

      <hr />

      {/* Listado de películas */}
      <h3>Listado de Películas</h3>
      <div className="campo">
        <label htmlFor="select-pelicula">Selecciona una película:</label>
        <Select
          id="select-pelicula"
          value={selectedPelicula ? { value: selectedPelicula.id, label: selectedPelicula.titulo } : null}
          onChange={(selectedOption) => {
            const selected = peliculas.find(pelicula => pelicula.id === selectedOption.value);
            setSelectedPelicula(selected || null);
          }}
          options={opcionesPeliculas}
          placeholder="Busca una película..."
          isSearchable
        />
      </div>

      {/* Botones de editar y eliminar si hay una película seleccionada */}
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
