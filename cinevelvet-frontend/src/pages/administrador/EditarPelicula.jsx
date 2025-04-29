import { useEffect, useState } from "react";
import axios from "axios";
import { Config } from '../../api/Config';
import { useNavigate, useParams } from "react-router-dom";
import "../../css/Peliculas.css";

const generos = ["Terror", "Romance", "Acción", "Drama"];
const edades = ["+7", "+12", "+16", "+18"];

export default function EditarPelicula() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pelicula, setPelicula] = useState({
    titulo: "",
    descripcion: "",
    duracion: "",
    fechaEstreno: "",
    genero: "",
    edades: "",
    portada: ""
  });

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    axios.get(`${Config.urlBackend}/peliculas/${id}`)
      .then(res => setPelicula(res.data))
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    const campos = Object.values(pelicula);
    setIsValid(campos.every(val => String(val).trim() !== ""));
  }, [pelicula]);

  const handleChange = e => {
    const { name, value } = e.target;
    setPelicula({ ...pelicula, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.put(`${Config.urlBackend}/peliculas/${id}`, pelicula)
      .then(() => navigate("/peliculas"))
      .catch(err => console.error(err));
  };

  return (
    <div className="peliculas-admin-container">
      <h2 className="titulo">Editar Película</h2>

      <button onClick={() => navigate('/peliculas')} className="back-button">
        <i className="fas fa-arrow-left"></i> Atrás
      </button>

      <form onSubmit={handleSubmit} className="formulario-editar">
        <div className="campo">
          <label htmlFor="titulo">Título:</label>
          <input
            id="titulo"
            name="titulo"
            value={pelicula.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={pelicula.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="duracion">Duración (minutos):</label>
          <input
            type="number"
            id="duracion"
            name="duracion"
            value={pelicula.duracion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="fechaEstreno">Fecha de estreno:</label>
          <input
            type="date"
            id="fechaEstreno"
            name="fechaEstreno"
            value={pelicula.fechaEstreno}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="genero">Género:</label>
          <select
            id="genero"
            name="genero"
            value={pelicula.genero}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un género</option>
            {generos.map(genero => (
              <option key={genero} value={genero}>{genero}</option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label htmlFor="edades">Edades permitidas:</label>
          <select
            id="edades"
            name="edades"
            value={pelicula.edades}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona edad</option>
            {edades.map(edad => (
              <option key={edad} value={edad}>{edad}</option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label htmlFor="portada">URL de portada:</label>
          <input
            id="portada"
            name="portada"
            value={pelicula.portada}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn" type="submit" disabled={!isValid}>
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
