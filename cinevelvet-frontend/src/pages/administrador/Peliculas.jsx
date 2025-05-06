import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Config } from '../../api/Config';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import '../../css/Peliculas.css';

const Peliculas = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [selectedPelicula, setSelectedPelicula] = useState(null);
  const [mensajeGuardado, setMensajeGuardado] = useState('');
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

  // Publicar / Ocultar película
  const handleTogglePublicar = async (id) => {
    try {
      const res = await axios.patch(`${Config.urlBackend}/peliculas/${id}/publicar`);
      
      const updatedPelicula = res.data;
      setPeliculas(peliculas.map(pelicula => 
        pelicula.id === id ? updatedPelicula : pelicula
      ));
      
      setSelectedPelicula(updatedPelicula);
      setMensajeGuardado("Estado de publicación actualizado exitosamente.");
      setTimeout(() => setMensajeGuardado(""), 3000);
    } catch (error) {
      console.error('Error al cambiar el estado de publicación:', error);
      setMensajeGuardado("Hubo un error al actualizar el estado de la película.");
      setTimeout(() => setMensajeGuardado(""), 3000);
    }
  };

  useEffect(() => {
    fetchPeliculas();
  }, []);

  const opcionesPeliculas = peliculas.map((pelicula) => ({
    value: pelicula.id,
    label: pelicula.titulo
  }));

  return (
    <div className="peliculas-admin-container">
      <h2>Gestión de Películas</h2>

      <button onClick={() => navigate(`/dashboard`)} className="back-button">
        <i className="fas fa-arrow-left"></i> Atrás
      </button>

      <hr />

      <h3>Crear Nueva Película</h3>
      <button onClick={() => navigate('/crear-pelicula')} className="crear-button">
        Crear Nueva Película
      </button>

      <hr />

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
      {mensajeGuardado && (
          <div className="popup-mensaje">
            {mensajeGuardado}
          </div>
        )}
      {selectedPelicula && (
        <div className="botones">
          
          <button onClick={() => navigate(`/editar-pelicula/${selectedPelicula.id}`)}>Editar</button>
          <button onClick={() => handleTogglePublicar(selectedPelicula.id)}>
            {selectedPelicula.publicada ? 'Ocultar' : 'Publicar'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Peliculas;
