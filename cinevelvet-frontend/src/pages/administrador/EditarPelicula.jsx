import { useEffect, useState } from "react";
import axios from "axios";
import { Config } from '../../api/Config';
import { useNavigate, useParams } from "react-router-dom";
import "../../css/Peliculas.css";

// Definición de las constantes fuera del componente
const generos = ["Terror", "Romance", "Acción", "Drama"];
const edades = ["+7", "+12", "+16", "+18"];

export default function EditarPelicula() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pelicula, setPelicula] = useState({
    titulo: "",
    descripcion: "",
    duracion: "",
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
      <h2>Editar Película</h2>

      <label>Título:</label>
      <input name="titulo" value={pelicula.titulo} onChange={handleChange} />

      <label>Descripción:</label>
      <textarea name="descripcion" value={pelicula.descripcion} onChange={handleChange} />

      <label>Duración (minutos):</label>
      <input type="number" name="duracion" value={pelicula.duracion} onChange={handleChange} />

      <label>Género:</label>
      <select name="genero" value={pelicula.genero} onChange={handleChange}>
        <option value="">Selecciona un género</option>
        {generos.map(genero => (
          <option key={genero} value={genero}>{genero}</option>
        ))}
      </select>

      <label>Edades permitidas:</label>
      <select name="edades" value={pelicula.edades} onChange={handleChange}>
        <option value="">Selecciona edad</option>
        {edades.map(edad => (
          <option key={edad} value={edad}>{edad}</option>
        ))}
      </select>

      <label>URL de portada:</label>
      <input name="portada" value={pelicula.portada} onChange={handleChange} />

      <button className="btn" type="submit" disabled={!isValid} onClick={handleSubmit}>
        Guardar Cambios
      </button>
    </div>
  );
}
