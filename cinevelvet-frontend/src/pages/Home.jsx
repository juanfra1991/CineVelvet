import React, { useEffect, useState } from 'react';
import { Config } from '../api/Config';
import Pelicula from '../components/Pelicula';
import axios from 'axios';

const Home = () => {
    const [peliculas, setPeliculas] = useState([]);

    // Cargar las películas al montar el componente
    useEffect(() => {
        const fetchPeliculas = async () => {
            try {
                const response = await axios.get(`${Config.urlBackend}/peliculas`);
                setPeliculas(response.data);
            } catch (error) {
                console.error("Error al cargar las películas:", error);
            }
        };
        fetchPeliculas();
    }, []);

    return (
        <div className="home-container">
            <h1>Películas Disponibles</h1>
            <div className="peliculas-list">
                {peliculas.length > 0 ? (
                    peliculas.map((pelicula) => (
                        <Pelicula key={pelicula.id} pelicula={pelicula} />
                    ))
                ) : (
                    <p>No hay películas disponibles</p>
                )}
            </div>
        </div>
    );
};

export default Home;
