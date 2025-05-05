import React, { useState } from 'react';
import axios from 'axios';
import { Config } from '../../api/Config';
import '../../css/Peliculas.css';

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

  const handleSubmit = async () => {
    try {
      await axios.post(`${Config.urlBackend}/peliculas`, form);
      alert('Película creada correctamente');
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
      alert('Error al crear la película');
    }
  };

  return (
    <div className="peliculas-admin-container">
      <h2>Crear Nueva Película</h2>

      <button onClick={() => window.history.back()} className="back-button">
        <i className="fas fa-arrow-left"></i> Atrás
      </button>

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
