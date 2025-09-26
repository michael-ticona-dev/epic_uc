-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasena_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    fecha_nacimiento DATE,
    saldo DECIMAL(10, 2) DEFAULT 0.00,
    avatar_url VARCHAR(255),
    rol VARCHAR(20) DEFAULT 'usuario',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP NULL,
    verificado BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT chk_rol CHECK (rol IN ('usuario', 'admin', 'moderador'))
);

-- Tabla de juegos
CREATE TABLE juegos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    precio_descuento DECIMAL(10, 2),
    fecha_lanzamiento DATE,
    desarrollador VARCHAR(100),
    editor VARCHAR(100),
    clasificacion_edad VARCHAR(5),
    valoracion_promedio DECIMAL(3, 2) DEFAULT 0.00,
    num_valoraciones INT DEFAULT 0,
    miniatura_url VARCHAR(255),
    portada_url VARCHAR(255),
    trailer_url VARCHAR(255),
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla de categorías
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50)
);

-- Tabla de relación juegos-categorías (muchos a muchos)
CREATE TABLE juego_categorias (
    juego_id INT,
    categoria_id INT,
    PRIMARY KEY (juego_id, categoria_id),
    FOREIGN KEY (juego_id) REFERENCES juegos(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
);

-- Tabla de biblioteca de usuarios (juegos adquiridos)
CREATE TABLE biblioteca_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    juego_id INT,
    fecha_adquisicion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    horas_jugadas DECIMAL(10, 2) DEFAULT 0.00,
    ultimo_jugado TIMESTAMP NULL,
    favorito BOOLEAN DEFAULT FALSE,
    UNIQUE(usuario_id, juego_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (juego_id) REFERENCES juegos(id) ON DELETE CASCADE
);

-- Tabla de wishlist (deseos)
CREATE TABLE wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    juego_id INT,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, juego_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (juego_id) REFERENCES juegos(id) ON DELETE CASCADE
);

-- Tabla de carrito de compras
CREATE TABLE carrito_compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    juego_id INT,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, juego_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (juego_id) REFERENCES juegos(id) ON DELETE CASCADE
);

-- Tabla de órdenes/transacciones
CREATE TABLE ordenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    total DECIMAL(10, 2) NOT NULL,
    impuestos DECIMAL(10, 2) DEFAULT 0.00,
    metodo_pago VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_completacion TIMESTAMP NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT chk_estado CHECK (estado IN ('pendiente', 'completada', 'fallida', 'reembolsada'))
);

-- Tabla de detalles de órdenes
CREATE TABLE orden_detalles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_id INT,
    juego_id INT,
    precio DECIMAL(10, 2) NOT NULL,
    descuento DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE,
    FOREIGN KEY (juego_id) REFERENCES juegos(id) ON DELETE CASCADE
);

-- Tabla de reseñas y valoraciones
CREATE TABLE resenas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    juego_id INT,
    valoracion INT,
    comentario TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NULL,
    aprobada BOOLEAN DEFAULT FALSE,
    UNIQUE(usuario_id, juego_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (juego_id) REFERENCES juegos(id) ON DELETE CASCADE,
    CONSTRAINT chk_valoracion CHECK (valoracion >= 1 AND valoracion <= 5)
);

-- Tabla de promociones/descuentos
CREATE TABLE promociones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    juego_id INT,
    porcentaje_descuento INT,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (juego_id) REFERENCES juegos(id) ON DELETE CASCADE,
    CONSTRAINT chk_descuento CHECK (porcentaje_descuento >= 0 AND porcentaje_descuento <= 100)
);

-- Tabla de logros
CREATE TABLE logros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    juego_id INT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono_url VARCHAR(255),
    rareza VARCHAR(20) DEFAULT 'comun',
    FOREIGN KEY (juego_id) REFERENCES juegos(id) ON DELETE CASCADE,
    CONSTRAINT chk_rareza CHECK (rareza IN ('comun', 'raro', 'epico', 'legendario'))
);

-- Tabla de logros desbloqueados por usuarios
CREATE TABLE usuario_logros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    logro_id INT,
    fecha_desbloqueo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, logro_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (logro_id) REFERENCES logros(id) ON DELETE CASCADE
);

-- Tabla de sesiones de juego
CREATE TABLE sesiones_juego (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    juego_id INT,
    inicio_sesion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fin_sesion TIMESTAMP NULL,
    duracion_minutos INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (juego_id) REFERENCES juegos(id) ON DELETE CASCADE
);

-- Tabla de amigos
CREATE TABLE amigos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    amigo_id INT,
    fecha_amistad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'pendiente',
    UNIQUE(usuario_id, amigo_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (amigo_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT chk_estado_amistad CHECK (estado IN ('pendiente', 'aceptada', 'rechazada'))
);

-- Tabla de notificaciones
CREATE TABLE notificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    url_destino VARCHAR(255),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de tokens de verificación
CREATE TABLE tokens_verificacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    token VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NOT NULL,
    utilizado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT chk_tipo_token CHECK (tipo IN ('verificacion', 'recuperacion'))
);

-- Tabla de historial de precios
CREATE TABLE historial_precios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    juego_id INT,
    precio DECIMAL(10, 2) NOT NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (juego_id) REFERENCES juegos(id) ON DELETE CASCADE
);

-- Tabla de contenido adicional (DLCs)
CREATE TABLE contenido_adicional (
    id INT AUTO_INCREMENT PRIMARY KEY,
    juego_base_id INT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    fecha_lanzamiento DATE,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (juego_base_id) REFERENCES juegos(id) ON DELETE CASCADE
);

-- Tabla de relación usuarios-contenido adicional
CREATE TABLE usuario_contenido_adicional (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    contenido_id INT,
    fecha_adquisicion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, contenido_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (contenido_id) REFERENCES contenido_adicional(id) ON DELETE CASCADE
);

-- Tabla de movimientos de saldo
CREATE TABLE movimientos_saldo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    monto DECIMAL(10,2) NOT NULL,
    tipo VARCHAR(20),
    descripcion VARCHAR(255),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT chk_tipo_movimiento CHECK (tipo IN ('recarga','compra','reembolso', 'venta'))
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_nombre_usuario ON usuarios(nombre_usuario);
CREATE INDEX idx_juegos_titulo ON juegos(titulo);
CREATE INDEX idx_juegos_precio ON juegos(precio);
CREATE INDEX idx_juegos_fecha_lanzamiento ON juegos(fecha_lanzamiento);
CREATE INDEX idx_biblioteca_usuario_id ON biblioteca_usuario(usuario_id);
CREATE INDEX idx_ordenes_usuario_id ON ordenes(usuario_id);
CREATE INDEX idx_ordenes_fecha_creacion ON ordenes(fecha_creacion);
CREATE INDEX idx_resenas_juego_id ON resenas(juego_id);
CREATE INDEX idx_promociones_juego_id ON promociones(juego_id);
CREATE INDEX idx_promociones_activa ON promociones(activa);
CREATE INDEX idx_movimientos_saldo_usuario_id ON movimientos_saldo(usuario_id);
CREATE INDEX idx_movimientos_saldo_fecha ON movimientos_saldo(fecha);

-- Trigger para evitar amistades duplicadas bidireccionales
DELIMITER //
CREATE TRIGGER trigger_check_amistad_duplicada
    BEFORE INSERT ON amigos
    FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM amigos 
        WHERE (usuario_id = NEW.usuario_id AND amigo_id = NEW.amigo_id)
        OR (usuario_id = NEW.amigo_id AND amigo_id = NEW.usuario_id)
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La amistad ya existe entre estos usuarios';
    END IF;
END//
DELIMITER ;

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (id, nombre_usuario, email, contrasena_hash, nombre, apellido, rol, verificado, saldo)
VALUES 
(1, 'michael', 'michael@epic-uc.com', '$2b$12$4V3/5J6K7L8M9N0O1P2Q3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w', 'Michael', 'Admin', 'admin', TRUE, 1000.00)
ON DUPLICATE KEY UPDATE id = id;

-- Insertar categorías de ejemplo
INSERT INTO categorias (nombre, descripcion, icono) VALUES
('Acción', 'Juegos de acción y aventura', 'action-icon'),
('Aventura', 'Juegos de exploración y puzzles', 'adventure-icon'),
('RPG', 'Juegos de rol', 'rpg-icon'),
('Estrategia', 'Juegos de estrategia', 'strategy-icon'),
('Deportes', 'Juegos deportivos', 'sports-icon'),
('Shooter', 'Juegos de disparos en primera persona', 'shooter-icon'),
('Indie', 'Juegos independientes', 'indie-icon')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Ajustar el autoincrement para que comience después del usuario administrador
ALTER TABLE usuarios AUTO_INCREMENT = 2;