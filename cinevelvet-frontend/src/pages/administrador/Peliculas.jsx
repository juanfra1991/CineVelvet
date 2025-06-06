import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Config } from '../../api/Config';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import '../../css/Peliculas.css';
import '../../css/Home.css';
import '../../css/Dashboard.css';
import logoCinema from '../../assets/logoCine.jpg';
import { FiArrowLeftCircle } from "react-icons/fi";

const Peliculas = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [selectedPelicula, setSelectedPelicula] = useState(null);
  const [mensajeGuardado, setMensajeGuardado] = useState('');
  const [vistaActiva, setVistaActiva] = useState('crear');
  const navigate = useNavigate();

  const fetchPeliculas = async () => {
    try {
      const res = await axios.get(`${Config.urlBackend}/peliculas`);
      setPeliculas(res.data);
    } catch (error) {
      console.error('Error al obtener las películas:', error);
    }
  };

  const handleTogglePublicar = async (id) => {
    try {
      const res = await axios.patch(`${Config.urlBackend}/peliculas/${id}/publicar`);
      const updatedPelicula = res.data;
      setPeliculas(peliculas.map(pelicula =>
        pelicula.id === id ? updatedPelicula : pelicula
      ));
      setSelectedPelicula(updatedPelicula);
      setMensajeGuardado("Estado de publicación actualizado correctamente.");
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
      <header className="home-header">
        <div className="header-background">
          <button className="admin-icon" onClick={() => window.history.back()} title="Atrás">
            <FiArrowLeftCircle size={24} />
          </button>
        </div>
        <div className="header-content">
          <img className='logo' src={logoCinema} alt="Cinema Logo" />
          <h1 className='title'>Velvet Cinema</h1>
        </div>
      </header>

      <h2 className="titulo">Gestión de Películas</h2>
      {/* Navegación entre vistas */}
      <div className='dashboard-nav'>
        <button
          className={`flex-button ${vistaActiva === 'crear' ? 'btn-selected' : 'btn-unselected'}`}
          onClick={() => setVistaActiva('crear')}
        >
          Crear Película
        </button>
        <button
          className={`flex-button ${vistaActiva === 'lista' ? 'btn-selected' : 'btn-unselected'}`}
          onClick={() => setVistaActiva('lista')}
        >
          Lista de Películas
        </button>
      </div>

      {/* Vista: Crear Película */}
      {vistaActiva === 'crear' && (
        <div className="crear-container">
          <hr />
          <button onClick={() => navigate('/crear-pelicula')} className="crear-button">
            Ir al Formulario
          </button>
        </div>
      )}

      {/* Vista: Listado de Películas */}
      {vistaActiva === 'lista' && (
        <div>
          <hr />

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
            <div className="popup-mensaje-peliculas">
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
      )}
    </div>
  );
};

export default Peliculas;
