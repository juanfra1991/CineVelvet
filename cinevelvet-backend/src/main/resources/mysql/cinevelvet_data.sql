-- Inserción de 6 películas
INSERT INTO pelicula (titulo, descripcion, duracion, fecha_estreno, genero, edades, trailer, portada, publicada) VALUES
('Matrix', 'Un hacker descubre una realidad alternativa.', 136, '1997-12-19', 'Ciencia Ficción', 'No recomendada para menores de 16 años', 'https://www.youtube.com/watch?v=m8e-FF8MsqU', null, TRUE),
('Titanic', 'Historia de amor a bordo de un transatlántico.', 195, '1997-12-19', 'Romance', 'Apta para todos los públicos', 'https://www.youtube.com/watch?v=2e-eXJ6HgkQ', null, TRUE),
('El Rey León', 'El viaje de Simba hacia su destino como rey.', 88, '1994-06-24', 'Animación', 'Apta para todos los públicos', 'https://www.youtube.com/watch?v=7TavVZMewpY', null, TRUE),
('Avatar', 'Una aventura en el mundo de Pandora.', 162, '2009-12-18', 'Fantasía', 'No recomendada para menores de 12 años', 'https://www.youtube.com/watch?v=5PSNL1qE6VY', null, TRUE),
('Parásitos', 'Una crítica social en forma de thriller.', 132, '2019-05-30', 'Drama', 'No recomendada para menores de 16 años', 'https://www.youtube.com/watch?v=5xH0HfJHsaY', null, TRUE),
('Interstellar', 'Viaje interestelar para salvar la humanidad.', 169, '2014-11-07', 'Ciencia Ficción', 'No recomendada para menores de 12 años', 'https://www.youtube.com/watch?v=zSWdZVtXT7E', null, TRUE);


-- Inserción de 6 salas
INSERT INTO sala (nombre, filas, columnas, capacidad) VALUES
('Sala A', 8, 10, 80),
('Sala B', 7, 10, 70),
('Sala C', 6, 10, 60),
('Sala D', 12, 10, 120),
('Sala E', 4, 10, 40),
('Sala F', 9, 10, 90);

-- Asumiendo que tienes películas con IDs del 1 al 6 y salas con IDs del 1 al 3
INSERT INTO sesion (fecha_sesion, pelicula_id, sala_id) VALUES
-- Día 1
('2025-06-20 16:00:00', 1, 1),
('2025-06-20 18:30:00', 2, 2),
('2025-06-20 20:00:00', 3, 3),
-- Día 2
('2025-06-21 17:00:00', 4, 4),
('2025-06-21 19:30:00', 5, 5),
('2025-06-21 22:00:00', 6, 6),
-- Día 3
('2025-06-22 15:45:00', 1, 2),
('2025-06-22 18:00:00', 2, 3),
('2025-06-22 20:15:00', 3, 4),
-- Día 4
('2025-06-23 17:30:00', 4, 5),
('2025-06-23 19:45:00', 5, 6),
('2025-06-23 21:00:00', 6, 1);

-- Sala A (ID 1), 8 filas x 10 butacas (ascendente)
INSERT INTO butaca (fila, butaca, sala_id, bloqueada_hasta, usuario_id)
SELECT f, c, 1, NULL, NULL
FROM (SELECT 1 AS f UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8) AS filas,
     (SELECT 1 AS c UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10) AS butacas
ORDER BY f ASC, c ASC;

-- Sala B (ID 2), 7 filas x 10 butacas (ascendente)
INSERT INTO butaca (fila, butaca, sala_id, bloqueada_hasta, usuario_id)
SELECT f, c, 2, NULL, NULL
FROM (SELECT 1 AS f UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7) AS filas,
     (SELECT 1 AS c UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10) AS butacas
ORDER BY f ASC, c ASC;

-- Sala C (ID 3), 6 filas x 10 butacas (ascendente)
INSERT INTO butaca (fila, butaca, sala_id, bloqueada_hasta, usuario_id)
SELECT f, c, 3, NULL, NULL
FROM (SELECT 1 AS f UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6) AS filas,
     (SELECT 1 AS c UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10) AS butacas
ORDER BY f ASC, c ASC;

-- Sala D (ID 4), 12 filas x 10 butacas (ascendente)
INSERT INTO butaca (fila, butaca, sala_id, bloqueada_hasta, usuario_id)
SELECT f, c, 4, NULL, NULL
FROM (SELECT 1 AS f UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12) AS filas,
     (SELECT 1 AS c UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10) AS butacas
ORDER BY f ASC, c ASC;

-- Sala E (ID 5), 4 filas x 10 butacas (ascendente)
INSERT INTO butaca (fila, butaca, sala_id, bloqueada_hasta, usuario_id)
SELECT f, c, 5, NULL, NULL
FROM (SELECT 1 AS f UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) AS filas,
     (SELECT 1 AS c UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10) AS butacas
ORDER BY f ASC, c ASC;

-- Sala F (ID 6), 9 filas x 10 butacas (ascendente)
INSERT INTO butaca (fila, butaca, sala_id, bloqueada_hasta, usuario_id)
SELECT f, c, 6, NULL, NULL
FROM (SELECT 1 AS f UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS filas,
     (SELECT 1 AS c UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10) AS butacas
ORDER BY f ASC, c ASC;
