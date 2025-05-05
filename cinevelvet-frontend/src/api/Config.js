// src/api/Config.js

export const API_URL = 'http://localhost:8080/api';
export const generos = [
    "Acción",
    "Aventura",
    "Animación",
    "Biografía",
    "Comedia",
    "Crimen",
    "Documental",
    "Drama",
    "Familia",
    "Fantasía",
    "Historia",
    "Musical",
    "Misterio",
    "Romance",
    "Ciencia ficción",
    "Terror",
    "Suspense",
    "Bélico",
    "Western",
    "Deportes",
    "Superhéroes",
    "Noir",
    "Cine independiente",
    "Cortometraje",
    "Experimental"
];

export const edades = [
    "Apta para todos los públicos",
    "No recomendada para menores de 12 años",
    "No recomendada para menores de 16 años",
    "No recomendada para menores de 18 años"];

export const Config = {
    urlBackend: API_URL,
    generos: generos,
    edades: edades
};
