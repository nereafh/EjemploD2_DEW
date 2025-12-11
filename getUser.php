<?php
header("Content-Type: application/json");

$conexion = new mysqli("localhost","zonzamas","Csas1234!","tienda");
if($conexion->connect_error) die(json_encode(["error"=>$conexion->connect_error]));

$correo = isset($_GET['correo']) ? $conexion->real_escape_string($_GET['correo']) : '';
if(empty($correo)) die(json_encode(["error"=>"Correo no proporcionado"]));

$sql = "SELECT nombre, correo_electronico FROM usuarios WHERE correo_electronico='$correo'";
$result = $conexion->query($sql);

if(!$result) die(json_encode(["error"=>$conexion->error]));
if($result->num_rows>0) echo json_encode($result->fetch_assoc());
else echo json_encode(["error"=>"Usuario no encontrado"]);

$conexion->close();
?>
