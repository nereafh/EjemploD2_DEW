// Datos de ejemplo para el carrusel
const motos = [
    {nombre:"Honda CB650R", img:"images/Honda1.webp"},
    {nombre:"Kawasaki Ninja", img:"images/Kawasaki.webp"},
    {nombre:"Yamaha R1", img:"images/Yamaha.webp"}
];

const carruselInner = document.getElementById("carrusel-inner");
motos.forEach((moto,i)=>{
    const div = document.createElement("div");
    div.className = "carousel-item" + (i===0?" active":"");
    div.innerHTML = `<img src="${moto.img}" class="d-block w-100" alt="${moto.nombre}">`;
    carruselInner.appendChild(div);
});

// Validaciones simples
const patterns = {
    nombre: /^[A-Z][a-z]{2,}$/,
    correo_electronico: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
    contrasena: /^.{8,}$/
};

document.querySelectorAll("#formulario input").forEach(input=>{
    input.addEventListener("keyup", e=>{
        const regex = patterns[e.target.name];
        if(regex){
            if(regex.test(e.target.value)){
                e.target.classList.add("valido");
                e.target.classList.remove("invalido");
                document.getElementById("error-"+e.target.name).style.display="none";
            }else{
                e.target.classList.add("invalido");
                e.target.classList.remove("valido");
                document.getElementById("error-"+e.target.name).style.display="block";
            }
        }
    });
});

function todoValido(){
    let ok = true;
    document.querySelectorAll("#formulario input").forEach(input=>{
        const regex = patterns[input.name];
        if(regex && !regex.test(input.value)){
            ok = false;
            document.getElementById("error-"+input.name).style.display="block";
        }
    });
    return ok;
}

// Guardar y recuperar localStorage
document.getElementById("btnGuardar").onclick = ()=>{
    if(!todoValido()){ mostrarResultado("Campos inválidos."); return; }
    const datos = {};
    document.querySelectorAll("#formulario input").forEach(i=>datos[i.name]=i.value);
    localStorage.setItem("usuario", JSON.stringify(datos));
    mostrarResultado("Datos guardados localmente.");
};

document.getElementById("btnRecuperar").onclick = ()=>{
    const datos = JSON.parse(localStorage.getItem("usuario"));
    if(datos){
        Object.keys(datos).forEach(k=>document.querySelector(`[name="${k}"]`).value=datos[k]);
        mostrarResultado("Datos recuperados desde local.");
    }else mostrarResultado("No hay datos guardados.");
};

function mostrarResultado(texto){
    document.getElementById("resultado").innerText = texto;
}

// Insertar en BD
document.getElementById("btnDbPost").onclick = ()=>{
    if(!todoValido()){ mostrarResultado("Campos inválidos."); return; }
    const formData = new FormData();
    document.querySelectorAll("#formulario input").forEach(i=>formData.append(i.name,i.value));
    fetch("insertUser.php",{method:"POST",body:formData})
        .then(r=>r.text()).then(t=>mostrarResultado(t));
};

// Obtener usuario
document.getElementById("btnDbGet").onclick = ()=>{
    const correo = prompt("Introduce el correo del usuario:");
    if(!correo) return;
    fetch("getUser.php?correo="+correo)
        .then(r=>r.json())
        .then(data=>{
            if(data.error){ mostrarResultado(data.error); return; }
            Object.keys(data).forEach(k=>document.querySelector(`[name="${k}"]`).value=data[k]);
            mostrarResultado("Usuario cargado desde BD.");
        });
};
