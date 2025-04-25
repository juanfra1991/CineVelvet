import React, { useState } from 'react';
import axios from 'axios';
import { Config } from '../../api/Config';
import '../../css/Peliculas.css';

const Peliculas = () => {
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    duracion: '',
    genero: '',
    edades: '',
    portada: '',
  });

  const generos = ['Acción', 'Comedia', 'Drama', 'Terror', 'Romance', 'Ciencia Ficción'];
  const edadesPermitidas = ['+7', '+12', '+16', '+18'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = Object.values(form).every(value => value.trim() !== '');

  const handleSubmit = async () => {
    try {
      await axios.post(`${Config.urlBackend}/peliculas`, form);
      alert('Película creada correctamente');
      setForm({ titulo: '', descripcion: '', duracion: '', genero: '', edades: '', portada: '' });
    } catch (error) {
      console.error('Error al crear la película:', error);
      alert('Error al crear la película');
    }
  };

  return (
    <div className="peliculas-admin-container">
      <h2>Crear Nueva Película</h2>

      <label>Título:</label>
      <input type="text" name="titulo" value={form.titulo} onChange={handleChange} />

      <label>Descripción:</label>
      <textarea name="descripcion" value={form.descripcion} onChange={handleChange} />

      <label>Duración (minutos):</label>
      <input type="number" name="duracion" value={form.duracion} onChange={handleChange} />

      <label>Género:</label>
      <select name="genero" value={form.genero} onChange={handleChange}>
        <option value="">Selecciona un género</option>
        {generos.map(g => <option key={g} value={g}>{g}</option>)}
      </select>

      <label>Edades permitidas:</label>
      <select name="edades" value={form.edades} onChange={handleChange}>
        <option value="">Selecciona una edad</option>
        {edadesPermitidas.map(e => <option key={e} value={e}>{e}</option>)}
      </select>

      <label>URL de portada:</label>
      <input type="text" name="portada" value={form.portada} onChange={handleChange} />

      <button disabled={!isFormValid} onClick={handleSubmit}>
        Crear Película
      </button>
    </div>
  );
};

export default Peliculas;
