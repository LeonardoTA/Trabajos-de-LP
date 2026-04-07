const usuario = { nombre: "James Tequen", saldo: 2000 };

const operaciones = [
    { id: "consulta", nombre: "Consultar saldo", desc: "Ver tu saldo actual" },
    { id: "retiro", nombre: "Retirar dinero", desc: "Extrae efectivo" },
    { id: "deposito", nombre: "Depositar dinero", desc: "Agrega fondos" },
    { id: "historial", nombre: "Historial", desc: "Ultimas operaciones" },
];

const historial = [];
let opActual = null;

const pantallas = { menu: document.getElementById("pantalla-menu"), op: document.getElementById("pantalla-op") };
const saldoEl = document.getElementById("saldo");
const gridEl = document.getElementById("grid-operaciones");
const busquedaEl = document.getElementById("busqueda");
const sinRes = document.getElementById("sin-resultados");
const opTitulo = document.getElementById("op-titulo");
const zonaForm = document.getElementById("zona-form");
const zonaRes = document.getElementById("zona-resultado");
const montoEl = document.getElementById("monto");
const errorMonto = document.getElementById("error-monto");
const textoRes = document.getElementById("texto-resultado");
const saldoRes = document.getElementById("saldo-resultado");

const formatear = (n) => `S/ ${n.toFixed(2)}`;

const mostrar = (nombre) => {
    Object.values(pantallas).forEach(p => p.classList.remove("activa"));
    pantallas[nombre].classList.add("activa");
};

function renderizarOperaciones(lista) {
    gridEl.innerHTML = "";
    sinRes.classList.toggle("oculto", lista.length > 0);

    lista.forEach(op => {
        const card = document.createElement("div");
        card.className = "card-op";
        card.innerHTML = `<span class="nombre">${op.nombre}</span><span class="desc">${op.desc}</span>`;
        card.addEventListener("click", () => abrirOperacion(op));
        gridEl.appendChild(card);
    });
}

busquedaEl.addEventListener("input", () => {
    const termino = busquedaEl.value.trim().toLowerCase();
    const filtradas = termino
        ? operaciones.filter(op => op.nombre.toLowerCase().includes(termino))
        : operaciones;
    renderizarOperaciones(filtradas);
});

function abrirOperacion(op) {
    opActual = op;
    opTitulo.textContent = op.nombre;
    montoEl.value = "";
    errorMonto.classList.add("oculto");
    zonaRes.classList.add("oculto");

    if (op.id === "consulta") {
        zonaForm.classList.add("oculto");
        textoRes.textContent = `Saldo actual: ${formatear(usuario.saldo)}`;
        saldoRes.textContent = usuario.nombre;
        zonaRes.classList.remove("oculto");
    } else if (op.id === "historial") {
        zonaForm.classList.add("oculto");
        textoRes.textContent = historial.length ? "Movimientos de esta sesion:" : "Sin movimientos aun.";
        saldoRes.textContent = historial.map(m => `${m.tipo}: ${formatear(m.monto)}`).join("  |  ");
        zonaRes.classList.remove("oculto");
    } else {
        zonaForm.classList.remove("oculto");
    }

    mostrar("op");
}

document.getElementById("btn-confirmar").addEventListener("click", () => {
    const monto = parseFloat(montoEl.value);

    if (!monto || monto <= 0) return mostrarError("Ingresa un monto valido.");
    if (opActual.id === "retiro" && monto > usuario.saldo) return mostrarError("Saldo insuficiente.");

    opActual.id === "deposito" ? (usuario.saldo += monto) : (usuario.saldo -= monto);
    historial.push({ tipo: opActual.nombre, monto });
    saldoEl.textContent = formatear(usuario.saldo);

    textoRes.textContent = `Operacion realizada: ${formatear(monto)}`;
    saldoRes.textContent = `Nuevo saldo: ${formatear(usuario.saldo)}`;
    zonaForm.classList.add("oculto");
    zonaRes.classList.remove("oculto");
    errorMonto.classList.add("oculto");
});

function mostrarError(msg) {
    errorMonto.textContent = msg;
    errorMonto.classList.remove("oculto");
}

document.getElementById("btn-volver").addEventListener("click", () => mostrar("menu"));
document.getElementById("btn-otra").addEventListener("click", () => mostrar("menu"));

saldoEl.textContent = formatear(usuario.saldo);
renderizarOperaciones(operaciones);
