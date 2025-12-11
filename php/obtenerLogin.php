<?php
// obtenerLogin.php
// GET ?email=... -> devuelve JSON con usuario (sin contrasena) o error
header("Content-Type: application/json; charset=UTF-8");
require_once('db.php');

$email = isset($_GET['email']) ? trim($_GET['email']) : '';
if ($email === '') {
    echo json_encode(["success"=>false,"message"=>"Falta parámetro email"]);
    exit;
}

$stmt = $pdo->prepare("SELECT id, nombre, dni, correo_electronico, telefono FROM usuarios WHERE correo_electronico = :email LIMIT 1");
$stmt->execute([":email"=>$email]);
$u = $stmt->fetch(PDO::FETCH_ASSOC);

if ($u) echo json_encode(["success"=>true,"data"=>$u]);
else echo json_encode(["success"=>false,"message"=>"Usuario no encontrado"]);
