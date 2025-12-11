<?php


$DB_HOST = "127.0.0.1";
$DB_NAME = "prueba";   
$DB_USER = "zonzamas";
$DB_PASS = "Csas1234!";

try {
    $pdo = new PDO(
        "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
        $DB_USER,
        $DB_PASS
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode([
        "status"=>"error",
        "message"=>"Error de conexión: ".$e->getMessage()
    ]);
    exit;
}
