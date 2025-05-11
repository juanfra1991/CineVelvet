import React, { useState } from 'react';
import axios from 'axios';
import { Config } from '../../api/Config';
import '../../css/Peliculas.css';
import '../../css/Home.css';
import { FiArrowRightCircle } from "react-icons/fi";
import logoCinema from '../../assets/logoCine.jpg';

const Peliculas = () => {
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    duracion: '',
    fechaEstreno: '',
    genero: '',
    edades: '',
    portada: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = Object.values(form).every(value => value.trim() !== '');
  const [mensajeGuardado, setMensajeGuardado] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post(`${Config.urlBackend}/peliculas`, form);
      setMensajeGuardado("Película creada correctamente.");
      setTimeout(() => setMensajeGuardado(""), 3000);
      setForm({
        titulo: '',
        descripcion: '',
        duracion: '',
        fechaEstreno: '',
        genero: '',
        edades: '',
        portada: '',
      });
    } catch (error) {
      console.error('Error al crear la película:', error);
      setMensajeGuardado("Error al crear la película.");
      setTimeout(() => setMensajeGuardado(""), 3000);
    }
  };

  return (
    <div className="peliculas-admin-container">

      <header className="home-header">
          <div className="header-background">
            <button className="admin-icon" onClick={() => window.history.back()} title="Cerrar Sesión">
              <FiArrowRightCircle size={24} />
            </button>
          </div>
      
          <div className="header-content">
            <img
              className="logo"
              src={logoCinema}
              alt="Cinema Logo"
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            />
            <div>
              <h1 className='title'>Velvet Cinema</h1>
            </div>
          </div>
        </header>

      <h2 className='h2'>Crear Nueva Película</h2>
      <hr />

      <label>Título:</label>
      <input
        type="text"
        name="titulo"
        value={form.titulo}
        onChange={handleChange}
        className="input-field"
      />

      <label>Descripción:</label>
      <textarea
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        className="input-field"
      />

      <label>Duración (minutos):</label>
      <input
        type="number"
        name="duracion"
        value={form.duracion}
        onChange={handleChange}
        className="input-field"
      />

      <label>Fecha de estreno:</label>
      <input
        type="date"
        name="fechaEstreno"
        value={form.fechaEstreno}
        onChange={handleChange}
        className="input-field"
      />

      <label>Género:</label>
      <select
        name="genero"
        value={form.genero}
        onChange={handleChange}
        className="input-field"
      >
        <option value="">Selecciona un género</option>
        {Config.generos.map(g => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      <label>Edades permitidas:</label>
      <select
        name="edades"
        value={form.edades}
        onChange={handleChange}
        className="input-field"
      >
        <option value="">Selecciona una edad</option>
        {Config.edades.map(e => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>

      <label>Imagen de portada:</label>
      <input
        type="text"
        name="portada"
        value={form.portada}
        onChange={handleChange}
        className="input-field"
      />
      {mensajeGuardado && (
        <div className="popup-mensaje">
          {mensajeGuardado}
        </div>
      )}
      <button
        className="btn"
        disabled={!isFormValid}
        onClick={handleSubmit}
      >
        Crear Película
      </button>
    </div>
  );
};

export default Peliculas;
