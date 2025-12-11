// lang.js - traducción simple basada en data-translate.
// Comentarios abundantes para el examen.

// Definimos el objeto de traducciones.
const translations = {
  es: {
    inicio: "Inicio",
    productos: "Productos",
    acercaDe: "Acerca de",
    derechos: "© 2025 Tienda de Motos. Todos los derechos reservados.",
    anadirAlCarrito: "Añadir al carrito"
  },
  en: {
    inicio: "Home",
    productos: "Products",
    acercaDe: "About",
    derechos: "© 2025 Motorcycle Shop. All rights reserved.",
    anadirAlCarrito: "Add to cart"
  },
  fr: {
    inicio: "Accueil",
    productos: "Produits",
    acercaDe: "À propos",
    derechos: "© 2025 Boutique Moto. Tous droits réservés.",
    anadirAlCarrito: "Ajouter au panier"
  },
  de: {
    inicio: "Startseite",
    productos: "Produkte",
    acercaDe: "Über uns",
    derechos: "© 2025 Motorradladen. Alle Rechte vorbehalten.",
    anadirAlCarrito: "In den Warenkorb"
  }
};

// Función para cambiar idioma: actualiza todos los nodos con data-translate.
function applyTranslations(lang) {
  document.querySelectorAll("[data-translate]").forEach(el => {
    const key = el.getAttribute("data-translate");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  // footer también
  const footer = document.querySelector(".footer-text");
  if (footer) {
    footer.textContent = translations[lang] ? translations[lang].derechos : footer.textContent;
  }
}

// Al cargar el DOM (defer ya hace que se cargue después pero guardamos seguridad)
document.addEventListener("DOMContentLoaded", function() {
  const sel = document.querySelector("#idioma-select");
  if (!sel) return;
  // aplicar idioma inicial
  applyTranslations(sel.value || "es");
  // evento cambio
  sel.addEventListener("change", function() {
    applyTranslations(this.value);
  });
});

// Exponer función por si otro script la quiere llamar
window.applyTranslations = applyTranslations;
