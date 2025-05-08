-- Eliminar si existen
DROP TABLE IF EXISTS entrada, reserva, cliente, sesion, butaca, sala, pelicula;

-- Tabla: Película
CREATE TABLE pelicula (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    duracion INT,
    fecha_estreno DATE NOT NULL,
    genero VARCHAR(50),
    edades VARCHAR(150),
    portada VARCHAR(1000),
    publicada BOOLEAN DEFAULT FALSE
);

-- Tabla: Sala
CREATE TABLE sala (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    filas INT NOT NULL,
    columnas INT NOT NULL,
    capacidad INT NOT NULL
);

-- Tabla: Butaca
CREATE TABLE butaca (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fila INT NOT NULL,
    butaca INT NOT NULL,
    sala_id BIGINT,
    bloqueada_hasta TIMESTAMP,
    usuario_id VARCHAR(255),
    FOREIGN KEY (sala_id) REFERENCES sala(id)
);

-- Tabla: Sesión
CREATE TABLE sesion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fecha_sesion DATETIME NOT NULL,
    pelicula_id BIGINT,
    sala_id BIGINT,
    FOREIGN KEY (pelicula_id) REFERENCES pelicula(id),
    FOREIGN KEY (sala_id) REFERENCES sala(id)
);

-- Tabla: Cliente
CREATE TABLE cliente (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL
);

-- Tabla: Reserva
CREATE TABLE reserva (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sesion_id BIGINT,
    cliente_id BIGINT,
    fecha_sesion DATETIME NOT NULL,
    fecha_reserva DATETIME NOT NULL,
    FOREIGN KEY (sesion_id) REFERENCES sesion(id),
    FOREIGN KEY (cliente_id) REFERENCES cliente(id)
);

-- Tabla: Entrada
CREATE TABLE entrada (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reserva_id BIGINT,
    butaca_id BIGINT,
    FOREIGN KEY (reserva_id) REFERENCES reserva(id),
    FOREIGN KEY (butaca_id) REFERENCES butaca(id),
    CONSTRAINT unique_reserva_butaca UNIQUE (reserva_id, butaca_id)
);

