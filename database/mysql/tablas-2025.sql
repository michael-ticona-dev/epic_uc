/* =======================================================
   RESET Y CONFIG INICIAL
   ======================================================= */
DROP DATABASE IF EXISTS epic_uc;
CREATE DATABASE epic_uc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE epic_uc;

SET NAMES utf8mb4;
SET time_zone = '+00:00';

/* =======================================================
   USUARIOS & PERFILES
   ======================================================= */
CREATE TABLE usuarios (
  id_usuario           BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nombre               VARCHAR(120)  NOT NULL,
  usuario              VARCHAR(60)   NULL,
  correo               VARCHAR(190)  NOT NULL,
  correo_verificado_en TIMESTAMP NULL,
  contrasena           VARCHAR(255)  NOT NULL,
  url_avatar           VARCHAR(255)  NULL,
  recordar_token       VARCHAR(100)  NULL,
  creado_en            TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_usuarios_correo (correo),
  UNIQUE KEY uq_usuarios_usuario (usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE perfiles_usuarios (
  id_perfil        BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  id_usuario       BIGINT UNSIGNED NOT NULL,
  biografia        VARCHAR(280) NULL,
  pais             VARCHAR(80)  NULL,
  zona_horaria     VARCHAR(60)  NULL,
  fecha_nacimiento DATE         NULL,
  creado_en        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_perfil_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    ON DELETE CASCADE ON UPDATE CASCADE,
  KEY idx_perfil_usuario (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* =======================================================
   AMISTADES (SIMÉTRICA, SIN AUTO-AMISTAD) – ROBUSTA
   ======================================================= */
-- Triggers por si existían antes
DROP TRIGGER IF EXISTS amistades_no_autoreferencia_bi;
DROP TRIGGER IF EXISTS amistades_no_autoreferencia_bu;
-- Tabla
CREATE TABLE amistades (
  id_amistad      BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  id_usuario      BIGINT UNSIGNED NOT NULL,
  id_amigo        BIGINT UNSIGNED NOT NULL,
  estado          ENUM('pendiente','aceptada','bloqueada') NOT NULL DEFAULT 'pendiente',
  creado_en       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- columnas físicas normalizadas (evita problemas de columnas generadas)
  par_menor       BIGINT UNSIGNED NOT NULL,
  par_mayor       BIGINT UNSIGNED NOT NULL,

  -- índices
  KEY idx_amistades_usuario (id_usuario),
  KEY idx_amistades_amigo  (id_amigo),
  KEY idx_amistades_estado (estado),

  -- unique simétrico para (A,B) y (B,A)
  UNIQUE KEY uq_amistad_simetrica (par_menor, par_mayor),

  CONSTRAINT fk_amistades_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_amistades_amigo
    FOREIGN KEY (id_amigo)   REFERENCES usuarios(id_usuario)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELIMITER $$
CREATE TRIGGER amistades_no_autoreferencia_bi
BEFORE INSERT ON amistades
FOR EACH ROW
BEGIN
  IF NEW.id_usuario = NEW.id_amigo THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No puedes agregarte como amigo';
  END IF;
  SET NEW.par_menor = IF(NEW.id_usuario < NEW.id_amigo, NEW.id_usuario, NEW.id_amigo);
  SET NEW.par_mayor = IF(NEW.id_usuario < NEW.id_amigo, NEW.id_amigo, NEW.id_usuario);
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER amistades_no_autoreferencia_bu
BEFORE UPDATE ON amistades
FOR EACH ROW
BEGIN
  IF NEW.id_usuario = NEW.id_amigo THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No puedes agregarte como amigo';
  END IF;
  SET NEW.par_menor = IF(NEW.id_usuario < NEW.id_amigo, NEW.id_usuario, NEW.id_amigo);
  SET NEW.par_mayor = IF(NEW.id_usuario < NEW.id_amigo, NEW.id_amigo, NEW.id_usuario);
END$$
DELIMITER ;

/* =======================================================
   CATÁLOGO – PLATAFORMAS, JUEGOS, ETIQUETAS
   ======================================================= */
CREATE TABLE plataformas (
  id_plataforma  TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  slug           VARCHAR(40) NOT NULL,
  nombre         VARCHAR(60) NOT NULL,
  UNIQUE KEY uq_plataformas_slug (slug),
  UNIQUE KEY uq_plataformas_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO plataformas (id_plataforma, slug, nombre) VALUES
  (1,'pc','PC'),
  (2,'playstation','PlayStation'),
  (3,'xbox','Xbox'),
  (4,'switch','Switch');

CREATE TABLE juegos (
  id_juego              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  slug                  VARCHAR(120)  NOT NULL,
  titulo                VARCHAR(160)  NOT NULL,
  descripcion           TEXT          NULL,
  precio_soles          DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  descuento             DECIMAL(5,2)  NOT NULL DEFAULT 0.00,      -- 0.30 = 30%
  url_portada           VARCHAR(255)  NULL,
  calificacion_promedio DECIMAL(3,2)  NOT NULL DEFAULT 0.00,      -- 4.70
  fecha_lanzamiento     DATE          NULL,
  url_trailer           VARCHAR(255)  NULL,
  creado_en             TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_juegos_slug (slug),
  KEY idx_juegos_titulo (titulo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE FULLTEXT INDEX ft_juegos_titulo_desc ON juegos (titulo, descripcion);

CREATE TABLE juego_plataforma (
  id_juego      BIGINT UNSIGNED NOT NULL,
  id_plataforma TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (id_juego, id_plataforma),
  CONSTRAINT fk_juego_plataforma_juego
    FOREIGN KEY (id_juego) REFERENCES juegos(id_juego) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_juego_plataforma_plataforma
    FOREIGN KEY (id_plataforma) REFERENCES plataformas(id_plataforma) ON DELETE RESTRICT ON UPDATE CASCADE,
  KEY idx_juego_plataforma_plataforma (id_plataforma)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE etiquetas (
  id_etiqueta  INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  slug         VARCHAR(60) NOT NULL,
  nombre       VARCHAR(60) NOT NULL,
  UNIQUE KEY uq_etiquetas_slug (slug),
  UNIQUE KEY uq_etiquetas_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO etiquetas (id_etiqueta, slug, nombre) VALUES
  (1,'rpg','RPG'),
  (2,'mundo-abierto','Mundo abierto'),
  (3,'shooter','Shooter'),
  (4,'battle-royale','Battle Royale'),
  (5,'sandbox','Sandbox'),
  (6,'aventura','Aventura'),
  (7,'fantasia','Fantasía'),
  (8,'futurista','Futurista'),
  (9,'accion','Acción'),
  (10,'indie','Indie'),
  (11,'estrategia','Estrategia'),
  (12,'carreras','Carreras'),
  (13,'survival','Survival'),
  (14,'rogue-like','Rogue-like');

CREATE TABLE juego_etiqueta (
  id_juego    BIGINT UNSIGNED NOT NULL,
  id_etiqueta INT UNSIGNED    NOT NULL,
  PRIMARY KEY (id_juego, id_etiqueta),
  CONSTRAINT fk_juego_etiqueta_juego
    FOREIGN KEY (id_juego) REFERENCES juegos(id_juego) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_juego_etiqueta_etiqueta
    FOREIGN KEY (id_etiqueta) REFERENCES etiquetas(id_etiqueta) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY idx_juego_etiqueta_etiqueta (id_etiqueta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* =======================================================
   DESEOS & VALORACIONES
   ======================================================= */
CREATE TABLE deseos (
  id_deseo   BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  id_usuario BIGINT UNSIGNED NOT NULL,
  id_juego   BIGINT UNSIGNED NOT NULL,
  creado_en  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_deseo (id_usuario, id_juego),
  CONSTRAINT fk_deseo_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_deseo_juego   FOREIGN KEY (id_juego)   REFERENCES juegos(id_juego)   ON DELETE CASCADE ON UPDATE CASCADE,
  KEY idx_deseo_juego (id_juego)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE valoraciones (
  id_valoracion   BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  id_usuario      BIGINT UNSIGNED NOT NULL,
  id_juego        BIGINT UNSIGNED NOT NULL,
  puntuacion      TINYINT UNSIGNED NOT NULL,  -- 1..5
  resena          TEXT NULL,
  creado_en       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_valoracion (id_usuario, id_juego),
  CONSTRAINT fk_valoracion_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_valoracion_juego   FOREIGN KEY (id_juego)   REFERENCES juegos(id_juego)   ON DELETE CASCADE ON UPDATE CASCADE,
  KEY idx_valoracion_juego (id_juego)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* =======================================================
   CARRITOS & PEDIDOS
   ======================================================= */
CREATE TABLE carritos (
  id_carrito     BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  id_usuario     BIGINT UNSIGNED NOT NULL,
  estado         ENUM('abierto','convertido','abandonado') NOT NULL DEFAULT 'abierto',
  creado_en      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_carrito_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY idx_carrito_usuario_estado (id_usuario, estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE carrito_items (
  id_item_carrito     BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  id_carrito          BIGINT UNSIGNED NOT NULL,
  id_juego            BIGINT UNSIGNED NOT NULL,
  cantidad            INT UNSIGNED NOT NULL DEFAULT 1,
  precio_unitario     DECIMAL(10,2) NOT NULL DEFAULT 0.00,  -- snapshot precio
  descuento_unitario  DECIMAL(5,2)  NOT NULL DEFAULT 0.00,
  creado_en           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_item_carrito_carrito FOREIGN KEY (id_carrito) REFERENCES carritos(id_carrito) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_item_carrito_juego   FOREIGN KEY (id_juego)   REFERENCES juegos(id_juego)   ON DELETE RESTRICT ON UPDATE CASCADE,
  UNIQUE KEY uq_item_carrito (id_carrito, id_juego)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pedidos (
  id_pedido        BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  id_usuario       BIGINT UNSIGNED NOT NULL,
  estado_pago      ENUM('pendiente','pagado','fallido','devuelto') NOT NULL DEFAULT 'pendiente',
  estado_envio     ENUM('digital','en_proceso','enviado','entregado','cancelado') NOT NULL DEFAULT 'digital',
  total_soles      DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  moneda           CHAR(3) NOT NULL DEFAULT 'PEN',
  creado_en        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pedido_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY idx_pedidos_usuario (id_usuario),
  KEY idx_pedidos_estado (estado_pago, estado_envio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pedido_items (
  id_item_pedido     BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  id_pedido          BIGINT UNSIGNED NOT NULL,
  id_juego           BIGINT UNSIGNED NOT NULL,
  cantidad           INT UNSIGNED NOT NULL DEFAULT 1,
  precio_unitario    DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  descuento_unitario DECIMAL(5,2)  NOT NULL DEFAULT 0.00,
  subtotal_soles     DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  creado_en          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_item_pedido_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_item_pedido_juego  FOREIGN KEY (id_juego)  REFERENCES juegos(id_juego)  ON DELETE RESTRICT ON UPDATE CASCADE,
  KEY idx_items_pedido_pedido (id_pedido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* DIRECCIONES */
CREATE TABLE direcciones (
  id_direccion   BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  id_usuario     BIGINT UNSIGNED NOT NULL,
  etiqueta       VARCHAR(40)  NULL,      -- Casa, Trabajo, etc.
  receptor       VARCHAR(120) NULL,
  linea1         VARCHAR(160) NULL,
  linea2         VARCHAR(160) NULL,
  ciudad         VARCHAR(100) NULL,
  region         VARCHAR(100) NULL,
  pais           VARCHAR(2)   NULL,      -- ISO-3166-1 alpha-2
  codigo_postal  VARCHAR(20)  NULL,
  telefono       VARCHAR(40)  NULL,
  creado_en      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_direccion_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY idx_direcciones_usuario (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* PAGOS */
CREATE TABLE pagos (
  id_pago       BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  id_pedido     BIGINT UNSIGNED NOT NULL,
  proveedor     VARCHAR(40)  NOT NULL,   -- ej: 'culqi','stripe','paypal'
  referencia    VARCHAR(120) NOT NULL,   -- id transacción
  monto_soles   DECIMAL(12,2) NOT NULL,
  moneda        CHAR(3) NOT NULL DEFAULT 'PEN',
  estado        ENUM('pendiente','exitoso','fallido','reembolsado') NOT NULL DEFAULT 'pendiente',
  creado_en     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pago_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uq_pago_referencia (proveedor, referencia),
  KEY idx_pagos_pedido (id_pedido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* =======================================================
   SOCIAL – PUBLICACIONES (tipo Facebook)
   ======================================================= */
CREATE TABLE publicaciones (
  id_publicacion BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  id_usuario     BIGINT UNSIGNED NOT NULL,
  texto          TEXT NULL,
  visibilidad    ENUM('publico','amigos','privado') NOT NULL DEFAULT 'publico',
  creado_en      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_publicacion_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY idx_publicaciones_usuario (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE FULLTEXT INDEX ft_publicaciones_texto ON publicaciones (texto);

CREATE TABLE publicaciones_medios (
  id_medio       BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  id_publicacion BIGINT UNSIGNED NOT NULL,
  tipo           ENUM('imagen','video') NOT NULL,
  url            VARCHAR(255) NOT NULL,
  url_miniatura  VARCHAR(255) NULL,
  orden          SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  creado_en      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_medio_publicacion FOREIGN KEY (id_publicacion) REFERENCES publicaciones(id_publicacion) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY idx_medios_publicacion (id_publicacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE publicaciones_me_gusta (
  id_usuario     BIGINT UNSIGNED NOT NULL,
  id_publicacion BIGINT UNSIGNED NOT NULL,
  creado_en      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario, id_publicacion),
  CONSTRAINT fk_like_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_like_publicacion FOREIGN KEY (id_publicacion) REFERENCES publicaciones(id_publicacion) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY idx_likes_publicacion (id_publicacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE publicaciones_comentarios (
  id_comentario  BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  id_publicacion BIGINT UNSIGNED NOT NULL,
  id_usuario     BIGINT UNSIGNED NOT NULL,
  texto          VARCHAR(500) NOT NULL,
  creado_en      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_comentario_publicacion FOREIGN KEY (id_publicacion) REFERENCES publicaciones(id_publicacion) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_comentario_usuario     FOREIGN KEY (id_usuario)    REFERENCES usuarios(id_usuario)     ON DELETE CASCADE ON UPDATE CASCADE,
  KEY idx_comentarios_publicacion (id_publicacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE publicaciones_compartidos (
  id_compartido            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  id_publicacion_origen    BIGINT UNSIGNED NOT NULL,
  id_usuario_que_compartio BIGINT UNSIGNED NOT NULL,
  comentario               VARCHAR(500) NULL,
  creado_en                TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_compartido_publicacion FOREIGN KEY (id_publicacion_origen) REFERENCES publicaciones(id_publicacion) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_compartido_usuario     FOREIGN KEY (id_usuario_que_compartio) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY idx_compartidos_origen (id_publicacion_origen),
  KEY idx_compartidos_usuario (id_usuario_que_compartio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* =======================================================
   FIN — verificación rápida
   ======================================================= */
-- SHOW TABLES;
