const servicios = [
  {
    id: 1,
    nombre: "Diseño de Logotipo",
    categoria: "Diseño",
    descripcion: "Creación de logotipo profesional con hasta 3 propuestas, entrega en formatos PNG, SVG y PDF.",
    precio: 250,
    icono: "🎨",
    colorLinea: "#f59e0b",
    calificacion: 5,
    destacado: true
  },
  {
    id: 2,
    nombre: "Desarrollo Web",
    categoria: "Desarrollo",
    descripcion: "Sitio web responsive de hasta 5 páginas, con HTML, CSS y JavaScript. Incluye hosting por 1 año.",
    precio: 1200,
    icono: "💻",
    colorLinea: "#7c3aed",
    calificacion: 5,
    destacado: true
  },
  {
    id: 3,
    nombre: "Gestión de Redes Sociales",
    categoria: "Marketing",
    descripcion: "Manejo mensual de Instagram y Facebook: 12 publicaciones, diseño y análisis de métricas.",
    precio: 400,
    icono: "📱",
    colorLinea: "#06b6d4",
    calificacion: 4,
    destacado: false
  },
  {
    id: 4,
    nombre: "Soporte Técnico PC",
    categoria: "Soporte",
    descripcion: "Diagnóstico, limpieza de virus, optimización y mantenimiento preventivo de tu equipo.",
    precio: 80,
    icono: "🛠️",
    colorLinea: "#10b981",
    calificacion: 4,
    destacado: false
  },
  {
    id: 5,
    nombre: "Edición de Video",
    categoria: "Diseño",
    descripcion: "Edición profesional de video para YouTube o Reels, con subtítulos, música y transiciones.",
    precio: 180,
    icono: "🎬",
    colorLinea: "#f59e0b",
    calificacion: 4,
    destacado: false
  },
  {
    id: 6,
    nombre: "App Móvil Básica",
    categoria: "Desarrollo",
    descripcion: "Desarrollo de aplicación Android o iOS con hasta 4 pantallas, con React Native.",
    precio: 2500,
    icono: "📲",
    colorLinea: "#7c3aed",
    calificacion: 5,
    destacado: true
  },
  {
    id: 7,
    nombre: "Campaña de Email Marketing",
    categoria: "Marketing",
    descripcion: "Diseño y envío de campaña de correos a tu base de clientes con reporte de resultados.",
    precio: 350,
    icono: "✉️",
    colorLinea: "#06b6d4",
    calificacion: 3,
    destacado: false
  },
  {
    id: 8,
    nombre: "Configuración de Redes",
    categoria: "Soporte",
    descripcion: "Instalación y configuración de router, switch y red doméstica o de oficina segura.",
    precio: 120,
    icono: "🌐",
    colorLinea: "#10b981",
    calificacion: 4,
    destacado: false
  }
];

function generarEstrellas(calificacion) {
  const llenas = "★".repeat(calificacion);
  const vacias = "☆".repeat(5 - calificacion);
  return llenas + vacias;
}
function slugCategoria(categoria) {
  return categoria
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}


function crearTarjeta(servicio) {
  const tarjeta = document.createElement("article");
  tarjeta.classList.add("tarjeta");
  tarjeta.setAttribute("data-id", servicio.id);
  tarjeta.style.setProperty("--color-linea", servicio.colorLinea);

  tarjeta.innerHTML = `
    <h2 class="tarjeta-titulo">${servicio.nombre}</h2>
    <span class="tarjeta-categoria">${servicio.categoria}</span>
    <p class="tarjeta-descripcion">${servicio.descripcion}</p>
    <p class="tarjeta-precio">S/ ${servicio.precio.toLocaleString("es-PE")}</p>
    <div class="tarjeta-estrellas" aria-label="${servicio.calificacion} de 5 estrellas">
      ${generarEstrellas(servicio.calificacion)}
    </div>
    <button class="tarjeta-btn" aria-label="Ver detalle de ${servicio.nombre}">
      Ver detalle →
    </button>
  `;

  tarjeta.addEventListener("click", function () {
    abrirModal(servicio);
  });

  return tarjeta;
}

function mostrarTarjetas(lista) {
  const galeria = document.getElementById("galeriaServicios");
  const sinResultados = document.getElementById("sinResultados");
  const contadorResultados = document.getElementById("contadorResultados");

  galeria.innerHTML = "";

  contadorResultados.textContent =
    lista.length === 0
      ? "No se encontraron resultados."
      : `Mostrando ${lista.length} servicio${lista.length !== 1 ? "s" : ""}`;

  if (lista.length === 0) {
    sinResultados.classList.remove("oculto");
    return;
  }

  sinResultados.classList.add("oculto");

  lista.forEach(function (servicio) {
    const tarjeta = crearTarjeta(servicio);
    galeria.appendChild(tarjeta);
  });
}

function abrirModal(servicio) {
  const overlay = document.getElementById("overlayModal");
  const modalIcono = document.getElementById("modalIcono");
  const modalTitulo = document.getElementById("modalTitulo");
  const modalCategoria = document.getElementById("modalCategoria");
  const modalEstrellas = document.getElementById("modalEstrellas");
  const modalDesc = document.getElementById("modalDescripcion");
  const modalPrecio = document.getElementById("modalPrecio");

  modalIcono.hidden = true;
  modalTitulo.textContent = servicio.nombre;
  modalCategoria.textContent = servicio.categoria;
  modalEstrellas.textContent = generarEstrellas(servicio.calificacion);
  modalDesc.textContent = servicio.descripcion;
  modalPrecio.textContent = "S/ " + servicio.precio.toLocaleString("es-PE");

  overlay.classList.remove("oculto");
  document.body.style.overflow = "hidden";
}

function cerrarModal() {
  const overlay = document.getElementById("overlayModal");
  overlay.classList.add("oculto");
  document.body.style.overflow = "";
}

function filtrarServicios() {
  const textoBusqueda = document.getElementById("inputBusqueda").value.toLowerCase();
  const categoriaFiltro = document.getElementById("selectCategoria").value;
  const precioMaximo = Number(document.getElementById("rangoPrecio").value);
  const criterioOrden = document.getElementById("selectOrden").value;

  let resultados = servicios.filter(function (servicio) {
    const coincideTexto =
      servicio.nombre.toLowerCase().includes(textoBusqueda) ||
      servicio.descripcion.toLowerCase().includes(textoBusqueda);

    const coincideCategoria =
      categoriaFiltro === "todas" || servicio.categoria === categoriaFiltro;

    const coincidePrecio = servicio.precio <= precioMaximo;

    return coincideTexto && coincideCategoria && coincidePrecio;
  });

  if (criterioOrden === "precio-asc") {
    resultados.sort(function (a, b) { return a.precio - b.precio; });
  } else if (criterioOrden === "precio-desc") {
    resultados.sort(function (a, b) { return b.precio - a.precio; });
  } else if (criterioOrden === "nombre-asc") {
    resultados.sort(function (a, b) { return a.nombre.localeCompare(b.nombre, "es"); });
  } else if (criterioOrden === "nombre-desc") {
    resultados.sort(function (a, b) { return b.nombre.localeCompare(a.nombre, "es"); });
  }
  mostrarTarjetas(resultados);
}

function mostrarToast() {
  const toast = document.getElementById("toastNotificacion");
  toast.classList.remove("oculto");
  toast.classList.add("visible");

  setTimeout(function () {
    toast.classList.remove("visible");
    setTimeout(function () {
      toast.classList.add("oculto");
    }, 400);
  }, 2500);
}

function limpiarFiltros() {
  document.getElementById("inputBusqueda").value = "";
  document.getElementById("selectCategoria").value = "todas";
  document.getElementById("selectOrden").value = "defecto";
  document.getElementById("rangoPrecio").value = 3000;
  document.getElementById("valorPrecio").textContent = "S/ 3000";

  mostrarTarjetas(servicios);
}

document.addEventListener("DOMContentLoaded", function () {

  mostrarTarjetas(servicios);

  document.getElementById("inputBusqueda")
    .addEventListener("input", filtrarServicios);
  document.getElementById("selectCategoria")
    .addEventListener("change", filtrarServicios);
  document.getElementById("selectOrden")
    .addEventListener("change", filtrarServicios);
  document.getElementById("rangoPrecio")
    .addEventListener("input", function () {
      document.getElementById("valorPrecio").textContent =
        "S/ " + Number(this.value).toLocaleString("es-PE");
      filtrarServicios();
    });

  document.getElementById("btnLimpiar")
    .addEventListener("click", limpiarFiltros);

  document.getElementById("btnCerrarModal")
    .addEventListener("click", cerrarModal);

  document.getElementById("overlayModal")
    .addEventListener("click", function (evento) {
      if (evento.target === this) {
        cerrarModal();
      }
    });

  document.getElementById("btnContratar")
    .addEventListener("click", function () {
      cerrarModal();
      mostrarToast();
    });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      cerrarModal();
    }
  });

});
