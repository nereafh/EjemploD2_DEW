-- create_table_usuarios.sql
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(150),
  dni VARCHAR(20) NOT NULL UNIQUE,
  correo_electronico VARCHAR(150) NOT NULL UNIQUE,
  telefono VARCHAR(30),
  contrasena VARCHAR(255) NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/*
mysql -u zonzamas -p
Csas1234!

CREATE DATABASE IF NOT EXISTS tienda;
USE tienda;

--Crear tablas ahí
--Utilizar lanzarote2026 como servidor, dar mi ip al profesor para que pueda verlo


*/