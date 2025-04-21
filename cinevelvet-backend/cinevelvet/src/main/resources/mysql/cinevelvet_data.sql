-- Inserción de 6 películas
INSERT INTO pelicula (titulo, descripcion, duracion, genero, edades, portada) VALUES
('Matrix', 'Un hacker descubre una realidad alternativa.', 136, 'Ciencia Ficción', '+16', ''),
('Titanic', 'Historia de amor a bordo de un transatlántico.', 195, 'Romance', 'Todos', ''),
('El Rey León', 'El viaje de Simba hacia su destino como rey.', 88, 'Animación', 'Todos', ''),
('Avatar', 'Una aventura en el mundo de Pandora.', 162, 'Fantasía', '+13', ''),
('Parásitos', 'Una crítica social en forma de thriller.', 132, 'Drama', '+16', ''),
('Interstellar', 'Viaje interestelar para salvar la humanidad.', 169, 'Ciencia Ficción', '+13', '');

-- Inserción de 6 salas
INSERT INTO sala (nombre, filas, columnas, capacidad) VALUES
('Sala A', 8, 10, 80),
('Sala B', 7, 9, 63),
('Sala C', 6, 10, 60),
('Sala D', 10, 12, 120),
('Sala E', 5, 8, 40),
('Sala F', 9, 10, 90);

-- Asumiendo que tienes películas con IDs del 1 al 6 y salas con IDs del 1 al 3
INSERT INTO sesion (fecha_sesion, pelicula_id, sala_id) VALUES
-- Día 1
('2025-04-20 16:00:00', 1, 1),
('2025-04-20 18:30:00', 2, 2),
('2025-04-20 20:00:00', 3, 3),
-- Día 2
('2025-04-21 17:00:00', 4, 4),
('2025-04-21 19:30:00', 5, 5),
('2025-04-21 22:00:00', 6, 6),
-- Día 3
('2025-04-22 15:45:00', 1, 2),
('2025-04-22 18:00:00', 2, 3),
('2025-04-22 20:15:00', 3, 4),
-- Día 4
('2025-04-23 17:30:00', 4, 5),
('2025-04-23 19:45:00', 5, 6),
('2025-04-23 21:00:00', 6, 1);

-- Inserción de butacas para cada sala
-- Sala A (ID 1), 8 filas x 10 columnas
INSERT INTO butaca (fila, columna, sala_id)
SELECT f, c, 1 FROM (SELECT 1 AS f UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8) AS filas,
                    (SELECT 1 AS c UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10) AS columnas;

-- Sala B (ID 2), 7 filas x 9 columnas
INSERT INTO butaca (fila, columna, sala_id)
SELECT f, c, 2 FROM (SELECT 1 AS f UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7) AS filas,
                    (SELECT 1 AS c UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS columnas;

-- Sala C (ID 3), 6 filas x 10 columnas
INSERT INTO butaca (fila, columna, sala_id)
SELECT f, c, 3 FROM (SELECT 1 AS f UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6) AS filas,
                    (SELECT 1 AS c UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10) AS columnas;

-- Sala D (ID 4), 10 filas x 12 columnas
INSERT INTO butaca (fila, columna, sala_id)
SELECT f, c, 4 FROM (SELECT 1 AS f UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10) AS filas,
                    (SELECT 1 AS c UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12) AS columnas;

-- Sala E (ID 5), 5 filas x 8 columnas
INSERT INTO butaca (fila, columna, sala_id)
SELECT f, c, 5 FROM (SELECT 1 AS f UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5) AS filas,
                    (SELECT 1 AS c UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8) AS columnas;

-- Sala F (ID 6), 9 filas x 10 columnas
INSERT INTO butaca (fila, columna, sala_id)
SELECT f, c, 6 FROM (SELECT 1 AS f UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS filas,
                    (SELECT 1 AS c UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10) AS columnas;
