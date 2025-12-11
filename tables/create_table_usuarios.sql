CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    correo_electronico VARCHAR(100) UNIQUE,
    contrasena VARCHAR(255)
);


/*
mysql -u zonzamas -p
Csas1234!

CREATE DATABASE IF NOT EXISTS tienda;
USE tienda;

--Crear tablas ahí
--Utilizar lanzarote2026 como servidor, dar mi ip al profesor para que pueda verlo


*/