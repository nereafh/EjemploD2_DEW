<?php
// getuser.php?dni=xxxx -> devuelve JSON con usuario
header("Content-Type: application/json; charset=UTF-8");
require_once('db.php');

$dni = isset($_GET['dni']) ? trim($_GET['dni']) : '';
if ($dni === '') {
  echo json_encode(["error"=>"DNI no proporcionado"]);
  exit;
}

$stmt = $pdo->prepare("SELECT * FROM usuarios WHERE dni = :dni LIMIT 1");
$stmt->execute([":dni"=>$dni]);
$u = $stmt->fetch(PDO::FETCH_ASSOC);

if ($u) echo json_encode($u);
else echo json_encode(["error"=>"Usuario no encontrado"]);
