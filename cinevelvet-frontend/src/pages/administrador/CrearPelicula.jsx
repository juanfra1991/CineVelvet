import React, { useState } from 'react';
import axios from 'axios';
import { Config } from '../../api/Config';
import { useNavigate, useParams } from "react-router-dom";
import "../../css/Peliculas.css";
import '../../css/Home.css';
import { FiArrowLeftCircle } from "react-icons/fi";
import logoCinema from '../../assets/logoCine.jpg';


const Peliculas = () => {

  const navigate = useNavigate();
  
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    form.portada instanceof File &&
    Object.entries(form).every(([key, value]) => {
      if (key === 'portada') return true;
      return typeof value === 'string' && value.trim() !== '';
    });

  const [mensajeGuardado, setMensajeGuardado] = useState("");

  const handleSubmit = async () => {

    if (!['image/jpeg', 'image/png'].includes(form.portada.type)) {
      setMensajeGuardado("Solo se permiten imágenes JPG o PNG.");
      setTimeout(() => setMensajeGuardado(""), 3000);
      return;
    }

    const formData = new FormData();
    formData.append("titulo", form.titulo);
    formData.append("descripcion", form.descripcion);
    formData.append("duracion", form.duracion);
    formData.append("fechaEstreno", form.fechaEstreno);
    formData.append("genero", form.genero);
    formData.append("edades", form.edades);
    formData.append("trailer", form.trailer);
    formData.append("portada", form.portada);

    try {
      await axios.post(`${Config.urlBackend}/peliculas`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMensajeGuardado("Película creada correctamente.");
      setTimeout(() => {
        setMensajeGuardado("");
      }, 2000);

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
    } catch (error) {
      console.error('Error al crear la película:', error);
      setMensajeGuardado("Error al crear la película.");
      setTimeout(() => setMensajeGuardado(""), 3000);
    }
  };

  return (
    <div className="peliculas-admin-container">
      <header className="home-header">
        <div className="header-background header-content">
          <button className="admin-icon" onClick={() => window.history.back()} title="Cerrar Sesión">
            <FiArrowLeftCircle size={24} />
          </button>
          <img className="logo" src={logoCinema} alt="Cinema Logo" />
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

      <label>Trailer:</label>
      <input
        type="text"
        name="trailer"
        value={form.trailer}
        onChange={handleChange}
        className="input-field"
      />

      <label>Imagen de portada:</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setForm(prev => ({ ...prev, portada: e.target.files[0] }))}
        className="input-field"
      />

      {mensajeGuardado && (
        <div className="popup-mensaje-peliculas">
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
