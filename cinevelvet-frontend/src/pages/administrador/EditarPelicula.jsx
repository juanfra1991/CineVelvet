import { useEffect, useState } from "react";
import axios from "axios";
import { Config } from '../../api/Config';
import { useNavigate, useParams } from "react-router-dom";
import "../../css/Peliculas.css";
import '../../css/Home.css';
import { FiArrowLeftCircle } from "react-icons/fi";
import logoCinema from '../../assets/logoCine.jpg';

export default function EditarPelicula() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    duracion: '',
    fechaEstreno: '',
    genero: '',
    edades: '',
    portada: '',
  });
  const [mensajeGuardado, setMensajeGuardado] = useState("");

  useEffect(() => {
    axios.get(`${Config.urlBackend}/peliculas/${id}`)
      .then(res => setForm(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = Object.values(form).every(value => String(value).trim() !== '');

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("titulo", form.titulo);
  formData.append("descripcion", form.descripcion);
  formData.append("duracion", form.duracion);
  formData.append("fechaEstreno", form.fechaEstreno);
  formData.append("genero", form.genero);
  formData.append("edades", form.edades);

  if (form.portada && form.portada instanceof File) {
    formData.append("portada", form.portada);
  }

  try {
    await axios.put(`${Config.urlBackend}/peliculas/${id}`, formData);
    setMensajeGuardado("Cambios guardados correctamente.");
    setTimeout(() => setMensajeGuardado(""), 3000);
  } catch (error) {
    console.error('Error al editar la película:', error);
    setMensajeGuardado("Error al guardar los cambios.");
    setTimeout(() => setMensajeGuardado(""), 3000);
  }
};


  return (
    <div className="peliculas-admin-container">

      <header className="home-header">
        <div className="header-background header-content">
          <button className="admin-icon" onClick={() => window.history.back()} title="Atras">
            <FiArrowLeftCircle size={24} />
          </button>
          <img className="logo" src={logoCinema} alt="Cinema Logo" />
          <div>
            <h1 className='title'>Velvet Cinema</h1>
          </div>
        </div>
      </header>

      <h2 className='h2'>Editar Película</h2>
      <hr />

      <form onSubmit={handleSubmit} >
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
            <option key={g} value={g}>{g}</option>
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
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        <label>Imagen de portada:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm(prev => ({ ...prev, portada: e.target.files[0] }))}
          className="input-field"
        />

        {mensajeGuardado && (
          <div className="popup-mensaje">{mensajeGuardado}</div>
        )}

        <button className="btn" type="submit" disabled={!isFormValid}>
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
