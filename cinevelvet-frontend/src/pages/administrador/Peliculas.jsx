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
  const navigate = useNavigate();
  const [peliculas, setPeliculas] = useState([]);
  const [selectedPelicula, setSelectedPelicula] = useState(null);
  const [mensajeGuardado, setMensajeGuardado] = useState('');
  const [vistaActiva, setVistaActiva] = useState('crear');

  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    duracion: '',
    fechaEstreno: '',
    genero: '',
    edades: '',
    trailer: '',
    portada: '',
  });

  const isFormValid =
    form.portada instanceof File &&
    Object.entries(form).every(([key, value]) => {
      if (key === 'portada') return true;
      return typeof value === 'string' && value.trim() !== '';
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!['image/jpeg', 'image/png'].includes(form.portada.type)) {
      setMensajeGuardado("Solo se permiten imágenes JPG o PNG.");
      setTimeout(() => setMensajeGuardado(""), 3000);
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await axios.post(`${Config.urlBackend}/peliculas`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMensajeGuardado("Película creada correctamente.");
      setForm({
        titulo: '',
        descripcion: '',
        duracion: '',
        fechaEstreno: '',
        genero: '',
        edades: '',
        trailer: '',
        portada: '',
      });

      fetchPeliculas();
    } catch (error) {
      console.error('Error al crear la película:', error);
      setMensajeGuardado("Error al crear la película.");
    } finally {
      setTimeout(() => setMensajeGuardado(""), 3000);
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

  const handleTogglePublicar = async (id) => {
    try {
      const res = await axios.patch(`${Config.urlBackend}/peliculas/${id}/publicar`);
      const updated = res.data;
      setPeliculas(prev =>
        prev.map(p => (p.id === id ? updated : p))
      );
      setSelectedPelicula(updated);
      setMensajeGuardado("Estado de publicación actualizado.");
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      setMensajeGuardado("Error al actualizar la película.");
    } finally {
      setTimeout(() => setMensajeGuardado(""), 3000);
    }
  };

  useEffect(() => {
    fetchPeliculas();
  }, []);

  const opcionesPeliculas = peliculas.map((p) => ({
    value: p.id,
    label: p.titulo,
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

      {/* Tabs */}
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

      {/* Crear */}
      {vistaActiva === 'crear' && (
        <>
          <hr />
          <label>Título:</label>
          <input type="text" name="titulo" value={form.titulo} onChange={handleChange} className="input-field" />

          <label>Descripción:</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="input-field" />

          <label>Duración (min):</label>
          <input type="number" name="duracion" value={form.duracion} onChange={handleChange} className="input-field" />

          <label>Fecha de estreno:</label>
          <input type="date" name="fechaEstreno" value={form.fechaEstreno} onChange={handleChange} className="input-field" />

          <label>Género:</label>
          <select name="genero" value={form.genero} onChange={handleChange} className="input-field">
            <option value="">Selecciona un género</option>
            {Config.generos.map(g => <option key={g} value={g}>{g}</option>)}
          </select>

          <label>Edades permitidas:</label>
          <select name="edades" value={form.edades} onChange={handleChange} className="input-field">
            <option value="">Selecciona una edad</option>
            {Config.edades.map(e => <option key={e} value={e}>{e}</option>)}
          </select>

          <label>Trailer (YouTube):</label>
          <input type="text" name="trailer" value={form.trailer} onChange={handleChange} className="input-field" />

          <label>Imagen de portada:</label>
          <input type="file" accept="image/*" onChange={(e) => setForm(prev => ({ ...prev, portada: e.target.files[0] }))} className="input-field" />

          {mensajeGuardado && <div className="popup-mensaje-peliculas">{mensajeGuardado}</div>}

          <button className="btn" disabled={!isFormValid} onClick={handleSubmit}>
            Crear Película
          </button>
        </>
      )}

      {/* Lista */}
      {vistaActiva === 'lista' && (
        <>
          <hr />
          <div className="campo">
            <label htmlFor="select-pelicula">Selecciona una película:</label>
            <Select
              id="select-pelicula"
              value={selectedPelicula ? { value: selectedPelicula.id, label: selectedPelicula.titulo } : null}
              onChange={(selectedOption) => {
                const found = peliculas.find(p => p.id === selectedOption.value);
                setSelectedPelicula(found || null);
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
        </>
      )}
    </div>
  );
};

export default Peliculas;
