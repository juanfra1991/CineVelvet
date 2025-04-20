import React from 'react';

const Pelicula = ({ pelicula }) => {
    return (
        <div className="pelicula-card">
            <h3>{pelicula.titulo}</h3>
            <p>{pelicula.descripcion}</p>
            <p><strong>Género:</strong> {pelicula.genero}</p>
            <p><strong>Duracion:</strong> {pelicula.duracion} min</p>
            <p>{pelicula.edades}</p>
            <img src={pelicula.portada} alt={pelicula.titulo} width="120" height="150"/>
        </div>
    );
};

export default Pelicula;
