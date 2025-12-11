<?php
$conexion = new mysqli("localhost","zonzamas","Csas1234!","tienda");
if($conexion->connect_error) die("Error conexión: ".$conexion->connect_error);

$nombre = $_POST['nombre'];
$correo = $_POST['correo_electronico'];
$contrasena = password_hash($_POST['contrasena'], PASSWORD_DEFAULT);

$sql = "INSERT INTO usuarios (nombre, correo_electronico, contrasena) VALUES ('$nombre','$correo','$contrasena')";
if($conexion->query($sql)) echo "Usuario registrado correctamente.";
else echo "Error: ".$conexion->error;

$conexion->close();
?>
