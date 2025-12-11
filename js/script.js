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
// Datos iniciales: 4 productos
// -------------------------------
const PRODUCTS = [
  { id: 1, name: "Honda CB650R", desc: "Una moto deportiva con gran potencia.", price: 8250, img: "img/prod1.jpg" },
  { id: 2, name: "Kawasaki Ninja", desc: "Alta velocidad y rendimiento.", price: 11200, img: "img/prod2.jpg" },
  { id: 3, name: "Yamaha R1", desc: "Diseño aerodinámico y potencia.", price: 17000, img: "img/prod3.jpg" },
  { id: 4, name: "KTM Duke 990", desc: "Diseño agresivo y comodidad.", price: 13999, img: "img/prod4.jpg" }
];

// URL base para llamadas al servidor (ajusta si tu carpeta está dentro de otro proyecto)
const BASE_API = "php/"; // llamadas a php/*

// -------------------------------
// Helper: seleccionar elementos
// -------------------------------
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// -------------------------------
// Carrusel simple
// -------------------------------
let slideIndex = 0;
let slideTimer = null;

function showSlide(index) {
  const slides = $("#slides");
  if (!slides) return;
  const total = slides.children.length;
  // normalizar
  if (index < 0) index = total - 1;
  if (index >= total) index = 0;
  slideIndex = index;
  // transform
  slides.style.transform = "translateX(" + (-100 * slideIndex) + "%)";
}

function nextSlide() { showSlide(slideIndex + 1); }
function prevSlide() { showSlide(slideIndex - 1); }

function startSlideAuto() {
  if (slideTimer) clearInterval(slideTimer);
  slideTimer = setInterval(() => nextSlide(), 5000);
}

// -------------------------------
// Renderizar productos (DOM)
// -------------------------------
function renderProducts() {
  const container = $("#productos");
  container.innerHTML = ""; // limpiar

  PRODUCTS.forEach(p => {
    // tarjeta bootstrap simple
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-3";

    const card = document.createElement("div");
    card.className = "card product-card shadow-sm";
    card.style.cursor = "pointer";

    // imagen
    const img = document.createElement("img");
    img.className = "card-img-top";
    img.src = p.img;
    img.alt = p.name;

    // body
    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = p.name;

    const desc = document.createElement("p");
    desc.className = "card-text small";
    desc.textContent = p.desc;

    const price = document.createElement("p");
    price.className = "fw-bold";
    price.textContent = "€ " + p.price.toLocaleString();

    // botones: ver / comprar
    const btnView = document.createElement("button");
    btnView.className = "btn btn-sm btn-outline-primary me-2";
    btnView.textContent = "Ver";
    btnView.addEventListener("click", () => openProductPopup(p.id));

    const btnBuy = document.createElement("button");
    btnBuy.className = "btn btn-sm btn-success";
    btnBuy.textContent = "Comprar";
    btnBuy.addEventListener("click", () => addToCart(p.id));

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(price);
    body.appendChild(btnView);
    body.appendChild(btnBuy);

    card.appendChild(img);
    card.appendChild(body);
    col.appendChild(card);
    container.appendChild(col);
  });
}

// -------------------------------
// Popups: producto
// -------------------------------
function openProductPopup(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;
  $("#popupImg").src = p.img;
  $("#popupTitle").textContent = p.name;
  $("#popupDesc").textContent = p.desc;
  $("#popupPrice").textContent = "Precio: € " + p.price.toLocaleString();
  // guardar id en botón
  $("#btnAddToCart").dataset.productId = p.id;
  $("#popupProduct").classList.remove("d-none");
}
function closeProductPopup() { $("#popupProduct").classList.add("d-none"); }

// -------------------------------
// Carrito simple (localStorage)
// -------------------------------
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (e) { return []; }
}
function setCart(cart) { localStorage.setItem("cart", JSON.stringify(cart)); updateCartCounter(); }
function addToCart(productId) {
  const cart = getCart();
  cart.push(productId);
  setCart(cart);
  // mostrar mensaje en popup (no alert)
  showTempMessage("Producto añadido al carrito", 2000);
}
function updateCartCounter() {
  const n = getCart().length;
  const el = $("#cartCounter");
  el.textContent = n;
  if (n === 0) el.classList.add("d-none"); else el.classList.remove("d-none");
}
function clearCart() { localStorage.removeItem("cart"); updateCartCounter(); }

// -------------------------------
// Mensajes temporales en DOM
// -------------------------------
let msgTimeout = null;
function showTempMessage(text, ms) {
  // crea zona de mensaje si no existe
  let div = document.getElementById("tempMsg");
  if (!div) {
    div = document.createElement("div");
    div.id = "tempMsg";
    div.style.position = "fixed";
    div.style.right = "20px";
    div.style.bottom = "20px";
    div.style.zIndex = "2000";
    document.body.appendChild(div);
  }
  div.textContent = text;
  div.className = "alert alert-info shadow";
  clearTimeout(msgTimeout);
  msgTimeout = setTimeout(() => { div.className = ""; div.textContent = ""; }, ms || 3000);
}

// -------------------------------
// Login / Register: validaciones simples
// -------------------------------
const REGEX = {
  nombre: /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]{2,30}$/,
  dni: /^[0-9]{7,8}[A-Za-z]$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  telefono: /^[0-9]{9}$/,
  pass: /^.{6,}$/ // simple: mínimo 6
};

// abrir / cerrar login/register
function openLogin() { $("#popupLogin").classList.remove("d-none"); }
function closeLogin() { $("#popupLogin").classList.add("d-none"); $("#loginMsg").textContent = ""; }
function openRegister() { $("#popupRegister").classList.remove("d-none"); }
function closeRegister() { $("#popupRegister").classList.add("d-none"); $("#regMsg").textContent = ""; }

// Enviar login -> POST a php/procesarLogin.php (recibe form-encoded)
async function submitLogin(ev) {
  ev.preventDefault();
  const email = $("#loginEmail").value.trim();
  const pass = $("#loginPass").value;
  // validación cliente
  if (!REGEX.email.test(email)) { $("#errorLoginEmail").classList.remove("d-none"); $("#errorLoginEmail").textContent = "Email no válido"; return; }
  else { $("#errorLoginEmail").classList.add("d-none"); }
  if (!REGEX.pass.test(pass)) { $("#errorLoginPass").classList.remove("d-none"); $("#errorLoginPass").textContent = "Contraseña demasiado corta"; return; }
  else { $("#errorLoginPass").classList.add("d-none"); }

  // preparar body
  const body = new FormData();
  body.append("correo_electronico", email);
  body.append("contrasena", pass);

  try {
    const res = await fetch(BASE_API + "procesarLogin.php", { method: "POST", body: body });
    const text = await res.text(); // el php imprime un mensaje
    // mostrarlo en DOM (no alert)
    $("#loginMsg").textContent = text;
    if (text.toLowerCase().includes("bienvenido") || text.toLowerCase().includes("ok") ) {
      // consideramos login correcto -> cerrar popup y guardar sesión simple en sessionStorage
      sessionStorage.setItem("loggedUser", email);
      showTempMessage("Login correcto", 2000);
      setTimeout(closeLogin, 1000);
    }
  } catch (err) {
    $("#loginMsg").textContent = "Error conectando con el servidor";
    console.error(err);
  }
}

// Enviar registro -> POST JSON a php/subirRegistro.php
async function submitRegister(ev) {
  ev.preventDefault();
  // recoger campos
  const nombre = $("#regNombre").value.trim();
  const dni = $("#regDNI").value.trim();
  const email = $("#regEmail").value.trim();
  const telefono = $("#regTelefono").value.trim();
  const pass = $("#regPass").value;

  // validaciones
  let ok = true;
  if (!REGEX.nombre.test(nombre)) { $("#errNombre").classList.remove("d-none"); $("#errNombre").textContent = "Nombre inválido"; ok = false; } else $("#errNombre").classList.add("d-none");
  if (!REGEX.dni.test(dni)) { $("#errDNI").classList.remove("d-none"); $("#errDNI").textContent = "DNI inválido"; ok = false; } else $("#errDNI").classList.add("d-none");
  if (!REGEX.email.test(email)) { $("#errEmail").classList.remove("d-none"); $("#errEmail").textContent = "Email inválido"; ok = false; } else $("#errEmail").classList.add("d-none");
  if (!REGEX.telefono.test(telefono)) { $("#errTelefono").classList.remove("d-none"); $("#errTelefono").textContent = "Teléfono inválido"; ok = false; } else $("#errTelefono").classList.add("d-none");
  if (!REGEX.pass.test(pass)) { $("#errPass").classList.remove("d-none"); $("#errPass").textContent = "Contraseña mínima 6"; ok = false; } else $("#errPass").classList.add("d-none");

  if (!ok) { $("#regMsg").textContent = "Corrige los campos en rojo"; return; }

  // construir JSON
  const payload = {
    nombre: nombre,
    dni: dni,
    correo: email,
    telefono: telefono,
    password: pass
  };

  try {
    const res = await fetch(BASE_API + "subirRegistro.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    // mostrar mensajes del servidor en DOM
    if (json.status === "success") {
      showTempMessage("Registro correcto", 2000);
      closeRegister();
    } else {
      $("#regMsg").textContent = json.message || "Error al registrar";
    }
  } catch (err) {
    $("#regMsg").textContent = "Error de red al registrar";
    console.error(err);
  }
}

// -------------------------------
// Obtener usuario por email -> ejemplo GET php/obtenerLogin.php?email=...
// muestra resultados en consola y en un pequeño modal (para demostrar GET)
// -------------------------------
async function fetchUserByEmail(email) {
  try {
    const res = await fetch(BASE_API + "obtenerLogin.php?email=" + encodeURIComponent(email));
    const json = await res.json();
    return json; // devuelve objeto con success/data/message
  } catch (err) {
    console.error("Error fetchUserByEmail", err);
    return { success: false, message: "Error de conexión" };
  }
}

// -------------------------------
// Eventos globales init
// -------------------------------
document.addEventListener("DOMContentLoaded", function() {
  // carrusel
  $("#nextSlide").addEventListener("click", () => { nextSlide(); startSlideAuto(); });
  $("#prevSlide").addEventListener("click", () => { prevSlide(); startSlideAuto(); });
  // clic sobre slides -> abrir popup al click sobre la imagen
  $$("#slides .slide").forEach((s, i) => s.addEventListener("click", () => openProductPopup(PRODUCTS[i].id)));
  startSlideAuto();

  // render productos
  renderProducts();
  updateCartCounter();

  // popup product actions
  $("#closePopupProduct").addEventListener("click", closeProductPopup);
  $("#btnAddToCart").addEventListener("click", function() {
    const pid = Number(this.dataset.productId);
    addToCart(pid);
    closeProductPopup();
  });

  // company info toggle
  $("#btnToggleCompany").addEventListener("click", () => {
    const el = $("#companyInfo");
    el.classList.toggle("d-none");
  });

  // login/register open/close
  $("#btnLogin").addEventListener("click", openLogin);
  $("#btnRegister").addEventListener("click", openRegister);
  $("#closePopupLogin").addEventListener("click", closeLogin);
  $("#closePopupRegister").addEventListener("click", closeRegister);
  $("#loginCancel").addEventListener("click", closeLogin);
  $("#regCancel").addEventListener("click", closeRegister);

  // submit forms
  $("#formLogin").addEventListener("submit", submitLogin);
  $("#formRegister").addEventListener("submit", submitRegister);

  // mostrar productos al pulsar boton Productos
  $("#btnProductos").addEventListener("click", function(e) { e.preventDefault(); window.scrollTo({ top: document.querySelector("#productos").offsetTop - 60, behavior: "smooth" }); });

  // ejemplo: si quieres probar obtener un usuario por email desde el servidor
  // document.querySelector("#someButton").addEventListener("click", async () => {
  //    const data = await fetchUserByEmail("ejemplo@correo.com");
  //    console.log(data);
  // });

  // click carrito para ver items (simple)
  $("#btnCart").addEventListener("click", () => {
    const cart = getCart();
    if (cart.length === 0) {
      showTempMessage("Carrito vacío", 2000);
    } else {
      // mostrar nombres
      const names = cart.map(id => PRODUCTS.find(p => p.id === id)?.name || id);
      showTempMessage(names.join(", "), 4000);
    }
  });

  // cerrar popups al pulsar fuera del contenido
  document.querySelectorAll(".popup").forEach(p => {
    p.addEventListener("click", (ev) => {
      if (ev.target === p) p.classList.add("d-none");
    });
  });

  // inicializamos traducciones si lang.js ya lo hizo.
});
