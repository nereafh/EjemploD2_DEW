
//localStorage.clear();

// -------------------------------
// NAVBAR FUNCIONALIDAD ACERCA / PRODUCTOS
// -------------------------------
const $i = sel => document.querySelector(sel);

document.addEventListener("DOMContentLoaded", () => {
  // Scroll a productos
  $i("#navProductos").onclick = () => {
    const productos = $i("#productos");
    productos.scrollIntoView({ behavior: "smooth" });
  };

  // Abrir popup Acerca de
  $i("#navAcerca").onclick = () => {
    $i("#popupAcerca").classList.remove("d-none");
  };
  $i("#closePopupAcerca").onclick = () => $i("#popupAcerca").classList.add("d-none");
});


/* script.js
   Lógica principal del proyecto (sin jQuery).
   - Manejo carrusel
   - Renderizado productos
   - Popups (producto, login, registro)
   - Carrito simple (localStorage)
   - Login/register con fetch a endpoints PHP
   - Validación simple con regex (ejemplos)
   Comentarios abundantes para el examen.
*/

// -------------------------------
// CONFIGURACIÓN
// -------------------------------
const BASE_API = "php/";

const PRODUCTS = [
  { id: 1, name: "Honda CB650R", desc: "Moto deportiva potente.", price: 8250, img: "img/prod1.jpg" },
  { id: 2, name: "Kawasaki Ninja", desc: "Rápida y agresiva.", price: 11200, img: "img/prod2.jpg" },
  { id: 3, name: "Yamaha R1", desc: "Alta gama y aerodinámica.", price: 17000, img: "img/prod3.jpg" },
  { id: 4, name: "KTM Duke 990", desc: "Agresiva y cómoda.", price: 13999, img: "img/prod4.jpg" }
];


// -------------------------------
// HELPERS
// -------------------------------
const $ = sel => document.querySelector(sel);


// -------------------------------
// RENDER PRODUCTOS
// -------------------------------
function renderProducts() {
  const cont = $("#productos");
  cont.innerHTML = "";

  PRODUCTS.forEach(p => {
    const card = document.createElement("div");
    card.className = "col-12 col-md-6 col-lg-3";

    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${p.img}" class="card-img-top" style="height:160px; object-fit:cover;">
        <div class="card-body">
          <h5>${p.name}</h5>
          <p class="small">${p.desc}</p>
          <p class="fw-bold">€ ${p.price.toLocaleString()}</p>
          <button class="btn btn-primary btn-sm me-2" onclick="openProduct(${p.id})">Ver</button>
          <button class="btn btn-success btn-sm" onclick="addToCart(${p.id})">Comprar</button>
        </div>
      </div>
    `;

    cont.appendChild(card);
  });
}


// -------------------------------
// POPUP PRODUCTO
// -------------------------------
function openProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  $("#popupImg").src = p.img;
  $("#popupTitle").textContent = p.name;
  $("#popupDesc").textContent = p.desc;
  $("#popupPrice").textContent = "€ " + p.price.toLocaleString();
  $("#btnAddToCart").dataset.id = id;

  $("#popupProduct").classList.remove("d-none");
}

$("#closePopupProduct").onclick = () => $("#popupProduct").classList.add("d-none");

$("#btnAddToCart").onclick = function () {
  addToCart(Number(this.dataset.id));
  $("#popupProduct").classList.add("d-none");
};


// -------------------------------
// CARRITO
// -------------------------------
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function setCart(c) {
  localStorage.setItem("cart", JSON.stringify(c));
  updateCartCounter();
}

function addToCart(id) {
  const cart = getCart();
  cart.push(id);
  setCart(cart);
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  setCart(cart);
  renderCartPopup();
}

function updateCartCounter() {
  $("#cartCounter").textContent = getCart().length;
}

function openCart() {
  renderCartPopup();
  $("#popupCart").classList.remove("d-none");
}

function renderCartPopup() {
  const cart = getCart();
  const list = $("#cartList");
  list.innerHTML = "";

  if (cart.length === 0) {
    list.innerHTML = `<li class="list-group-item text-center">Carrito vacío</li>`;
    return;
  }

  cart.forEach((id, i) => {
    const p = PRODUCTS.find(x => x.id === id);
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";

    li.innerHTML = `
      ${p.name} - €${p.price}
      <button class="btn btn-sm btn-danger" onclick="removeFromCart(${i})">X</button>
    `;

    list.appendChild(li);
  });
}

$("#closePopupCart").onclick = () => $("#popupCart").classList.add("d-none");
$("#btnClearCart").onclick = () => { localStorage.removeItem("cart"); renderCartPopup(); updateCartCounter(); };

$("#btnCart").onclick = openCart;


// -------------------------------
// LOGIN
// -------------------------------
$("#formLogin").onsubmit = async e => {
  e.preventDefault();

  const data = new FormData();
  data.append("correo_electronico", $("#loginEmail").value);
  data.append("contrasena", $("#loginPass").value);

  const r = await fetch(BASE_API + "procesarLogin.php", { method: "POST", body: data });
  const t = await r.text();

  $("#loginMsg").textContent = t;

  if (t.includes("Bienvenido") || t.includes("correcto")) {
    $("#popupLogin").classList.add("d-none");
  }
};

$("#btnLogin").onclick = () => $("#popupLogin").classList.remove("d-none");
$("#closePopupLogin").onclick = () => $("#popupLogin").classList.add("d-none");


// -------------------------------
// REGISTRO
// -------------------------------
$("#formRegister").onsubmit = async e => {
  e.preventDefault();

  const payload = {
    nombre: $("#regNombre").value,
    dni: $("#regDNI").value,
    correo: $("#regEmail").value,
    telefono: $("#regTelefono").value,
    password: $("#regPass").value
  };

  const r = await fetch(BASE_API + "subirRegistro.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const json = await r.json();
  $("#regMsg").textContent = json.message;

  if (json.status === "success") {
    $("#popupRegister").classList.add("d-none");
  }
};

$("#btnRegister").onclick = () => $("#popupRegister").classList.remove("d-none");
$("#closePopupRegister").onclick = () => $("#popupRegister").classList.add("d-none");


// -------------------------------
// INIT
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartCounter();
});



/*
para descargar cambios: 
git branch
git pull origin main



para subir cambios cuando es la primera vez
git branch
git push -u origin main
*/