// src/pages/Peliculas.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const Peliculas = () => {
  const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/peliculas')
      .then(response => setPeliculas(response.data))
      .catch(error => console.error('Error al obtener películas:', error));
  }, []);

  return (
    <div className="peliculas">
      <h1>🎬 Cartelera CineVelvet</h1>
      {peliculas.length === 0 ? (
        <p>No hay películas disponibles</p>
      ) : (
        <ul>
          {peliculas.map(pelicula => (
            <li key={pelicula.id}>
              <h2>{pelicula.titulo}</h2>
              <img src={pelicula.urlCartel} alt={pelicula.titulo} width="150" />
              <p>{pelicula.descripcion}</p>
              <p>🎞️ Género: {pelicula.genero}</p>
              <p>⏱️ Duración: {pelicula.duracionMinutos} minutos</p>
              <p>🔞 Edad recomendada: {pelicula.edades}+</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Peliculas;
