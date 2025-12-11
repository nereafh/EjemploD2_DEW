// localStorage.clear(); // Descomenta para limpiar el carrito al iniciar

// SELECTOR RÁPIDO POR ID O CLASE
const select = selector => document.querySelector(selector);

// INICIALIZACIÓN DE EVENTOS AL CARGAR LA PÁGINA
document.addEventListener("DOMContentLoaded", () => {
  // Scroll suave hacia la sección de productos
  select("#navProductos").onclick = () => {
    const contenedorProductos = select("#productos");
    contenedorProductos.scrollIntoView({ behavior: "smooth" });
  };

  // Abrir ventana "Acerca de"
  select("#navAcerca").onclick = () => {
    select("#ventanaAcerca").classList.remove("d-none");
  };

  // Cerrar ventana "Acerca de"
  select("#closeVentanaAcerca").onclick = () => {
    select("#ventanaAcerca").classList.add("d-none");
  };
});

// CONFIGURACIÓN DE DATOS Y API
const API_BASE = "php/";

// Lista de productos disponibles
const LISTA_PRODUCTOS = [
  { id: 1, nombre: "Honda CB650R", descripcion: "Moto deportiva potente.", precio: 8250, imagen: "img/prod1.jpg" },
  { id: 2, nombre: "Kawasaki Ninja", descripcion: "Rápida y agresiva.", precio: 11200, imagen: "img/prod2.jpg" },
  { id: 3, nombre: "Yamaha R1", descripcion: "Alta gama y aerodinámica.", precio: 17000, imagen: "img/prod3.jpg" },
  { id: 4, nombre: "KTM Duke 990", descripcion: "Agresiva y cómoda.", precio: 13999, imagen: "img/prod4.jpg" }
];

// Alias rápido de selector
const $ = selector => document.querySelector(selector);

// FUNCIONES PARA RENDERIZAR PRODUCTOS
function mostrarProductos() {
  const contenedor = $("#productos");
  contenedor.innerHTML = ""; // Limpiar contenedor

  LISTA_PRODUCTOS.forEach(producto => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "col-12 col-md-6 col-lg-3";

    tarjeta.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${producto.imagen}" class="card-img-top" style="height:160px; object-fit:cover;">
        <div class="card-body">
          <h5>${producto.nombre}</h5>
          <p class="small">${producto.descripcion}</p>
          <p class="fw-bold">€ ${producto.precio.toLocaleString()}</p>
          <button class="btn btn-primary btn-sm me-2" onclick="abrirVentanaProducto(${producto.id})">Ver</button>
          <button class="btn btn-success btn-sm" onclick="agregarProductoCarrito(${producto.id})">Comprar</button>
        </div>
      </div>
    `;

    contenedor.appendChild(tarjeta);
  });
}

// FUNCIONES DE VENTANA DE DETALLE DE PRODUCTO
function abrirVentanaProducto(idProducto) {
  const producto = LISTA_PRODUCTOS.find(p => p.id === idProducto);

  $("#imagenVentanaProducto").src = producto.imagen;
  $("#tituloVentanaProducto").textContent = producto.nombre;
  $("#descripcionVentanaProducto").textContent = producto.descripcion;
  $("#precioVentanaProducto").textContent = "€ " + producto.precio.toLocaleString();
  $("#btnAgregarCarrito").dataset.id = idProducto;

  $("#ventanaProducto").classList.remove("d-none");
}

$("#closeVentanaProducto").onclick = () => $("#ventanaProducto").classList.add("d-none");

$("#btnAgregarCarrito").onclick = function () {
  agregarProductoCarrito(Number(this.dataset.id));
  $("#ventanaProducto").classList.add("d-none");
};

// FUNCIONES DEL CARRITO
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function agregarProductoCarrito(idProducto) {
  const carrito = obtenerCarrito();
  carrito.push(idProducto);
  guardarCarrito(carrito);
}

function eliminarProductoCarrito(indice) {
  const carrito = obtenerCarrito();
  carrito.splice(indice, 1);
  guardarCarrito(carrito);
  renderizarVentanaCarrito();
}

function actualizarContadorCarrito() {
  $("#contadorCarrito").textContent = obtenerCarrito().length;
}

function abrirVentanaCarrito() {
  renderizarVentanaCarrito();
  $("#ventanaCarrito").classList.remove("d-none");
}

function renderizarVentanaCarrito() {
  const carrito = obtenerCarrito();
  const lista = $("#listaCarrito");
  lista.innerHTML = "";

  if (carrito.length === 0) {
    lista.innerHTML = `<li class="list-group-item text-center">Carrito vacío</li>`;
    return;
  }

  carrito.forEach((idProducto, indice) => {
    const producto = LISTA_PRODUCTOS.find(p => p.id === idProducto);
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";

    li.innerHTML = `
      ${producto.nombre} - €${producto.precio}
      <button class="btn btn-sm btn-danger" onclick="eliminarProductoCarrito(${indice})">X</button>
    `;

    lista.appendChild(li);
  });
}

// Botones del carrito
$("#closeVentanaCarrito").onclick = () => $("#ventanaCarrito").classList.add("d-none");
$("#btnVaciarCarrito").onclick = () => { localStorage.removeItem("carrito"); renderizarVentanaCarrito(); actualizarContadorCarrito(); };
$("#btnCarrito").onclick = abrirVentanaCarrito;

// FUNCIONES LOGIN
$("#formLogin").onsubmit = async e => {
  e.preventDefault();

  const data = new FormData();
  data.append("correo_electronico", $("#emailLogin").value);
  data.append("contrasena", $("#passwordLogin").value);

  const response = await fetch(API_BASE + "procesarLogin.php", { method: "POST", body: data });
  const texto = await response.text();

  $("#mensajeLogin").textContent = texto;

  if (texto.includes("Bienvenido") || texto.includes("correcto")) {
    $("#ventanaLogin").classList.add("d-none");
  }
};

$("#btnLogin").onclick = () => $("#ventanaLogin").classList.remove("d-none");
$("#closeVentanaLogin").onclick = () => $("#ventanaLogin").classList.add("d-none");

// FUNCIONES REGISTRO
$("#formRegister").onsubmit = async e => {
  e.preventDefault();

  const payload = {
    nombre: $("#registroNombre").value,
    dni: $("#registroDNI").value,
    correo: $("#registroEmail").value,
    telefono: $("#registroTelefono").value,
    password: $("#registroPass").value
  };

  const response = await fetch(API_BASE + "subirRegistro.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const json = await response.json();
  $("#mensajeRegistro").textContent = json.message;

  if (json.status === "success") {
    $("#ventanaRegistro").classList.add("d-none");
  }
};

$("#btnRegistro").onclick = () => $("#ventanaRegistro").classList.remove("d-none");
$("#closeVentanaRegistro").onclick = () => $("#ventanaRegistro").classList.add("d-none");

// INICIALIZACIÓN DE LA PÁGINA
document.addEventListener("DOMContentLoaded", () => {
  mostrarProductos();
  actualizarContadorCarrito();
});
