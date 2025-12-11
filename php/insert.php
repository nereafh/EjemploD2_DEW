<?php
// insert.php - ejemplo POST form-data para insertar (compat con proyecto nerea)
// Requiere db.php
header("Content-Type: text/plain; charset=UTF-8");
require_once('db.php');

// lista de campos aceptados (ejemplo)
$campos = ["nombre","apellidos","dni","fnacimiento","cpostal","correo","telefonofijo","telefonomovil","iban","tarjetacredito","contrasena","edad","mensaje"];

// construir array con valores recibidos por POST
$vals = [];
foreach ($campos as $c) {
    $vals[$c] = isset($_POST[$c]) ? $_POST[$c] : null;
}

// Validación mínima
if (empty($vals['nombre']) || empty($vals['dni'])) {
    echo "Faltan campos obligatorios";
    exit;
}

// Insertar (ajusta el SQL a tu tabla real)
try {
    $sql = "INSERT INTO usuarios (nombre, apellidos, dni, fnacimiento, cpostal, correo_electronico, telefonofijo, telefonomovil, iban, tarjetacredito, contrasena, edad, mensaje)
            VALUES (:nombre, :apellidos, :dni, :fnacimiento, :cpostal, :correo, :telefonofijo, :telefonomovil, :iban, :tarjetacredito, :contrasena, :edad, :mensaje)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":nombre"=>$vals['nombre'], ":apellidos"=>$vals['apellidos'], ":dni"=>$vals['dni'],
        ":fnacimiento"=>$vals['fnacimiento'], ":cpostal"=>$vals['cpostal'], ":correo"=>$vals['correo'],
        ":telefonofijo"=>$vals['telefonofijo'], ":telefonomovil"=>$vals['telefonomovil'], ":iban"=>$vals['iban'],
        ":tarjetacredito"=>$vals['tarjetacredito'], ":contrasena"=>$vals['contrasena'], ":edad"=>$vals['edad'], ":mensaje"=>$vals['mensaje']
    ]);
    echo "Datos insertados correctamente.";
} catch (Exception $e) {
    echo "Error al insertar: " . $e->getMessage();
}
