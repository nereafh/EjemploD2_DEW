<?php
// db.php - Conexión PDO reutilizable
// Cambia los datos de conexión si tu servidor usa otros.
$DB_HOST = "127.0.0.1";
$DB_NAME = "tienda";          // ajusta a tu BD, gestion_usuarios
$DB_USER = "zonzamas";        // tu usuario
$DB_PASS = "Csas1234!";       // tu contraseña

try {
    $pdo = new PDO("mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4", $DB_USER, $DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // En producción no muestres todo; para pruebas imprimimos
    header('Content-Type: application/json');
    echo json_encode(["status"=>"error","message"=>"Error de conexión a la BD: ".$e->getMessage()]);
    exit;
}
