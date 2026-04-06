/* ============================================================
   app.js — Catálogo de Servicios Mejorado
   ACTIVIDAD AUTÓNOMA

   BASE: tomado directamente del app.js de la Actividad Práctica.
   Se conserva la misma estructura de funciones:
     - arreglo servicios
     - crearTarjeta()
     - mostrarTarjetas()
     - abrirModal() / cerrarModal()
     - filtrarServicios()
     - mostrarToast()
     - DOMContentLoaded

   MEJORAS añadidas sobre esa base:
     1. Campo "calificacion" y "destacado" en cada objeto del arreglo
     2. Ordenamiento de datos (precio asc/desc, nombre asc/desc)
     3. Filtro por precio máximo mediante slider
     4. Estrellas renderizadas en tarjeta y en modal
     5. Botón "Limpiar filtros" que resetea todos los controles
   ============================================================ */

// ==============================================================
// PASO 4 (BASE): Arreglo de servicios
// Se parte del mismo arreglo de la Actividad Práctica.
// MEJORA 1: se añadieron los campos "calificacion" y "destacado"
// a cada objeto para poder renderizar estrellas y filtrar.
// ==============================================================
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

// ==============================================================
// MEJORA 4: Función auxiliar — genera estrellas ★ / ☆
// según la calificación numérica del servicio (1 a 5).
// ==============================================================
function generarEstrellas(calificacion) {
  const llenas  = "★".repeat(calificacion);
  const vacias  = "☆".repeat(5 - calificacion);
  return llenas + vacias;
}

// Convierte el nombre de categoría en un slug CSS seguro
// Ej: "Diseño" → "diseno" | "Desarrollo" → "desarrollo"
function slugCategoria(categoria) {
  return categoria
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // quita tildes
    .replace(/\s+/g, "-");            // espacios → guión
}

// ==============================================================
// PASO 5 (BASE): Función crearTarjeta — Manipulación del DOM
// Se parte exactamente de la misma función de la Práctica.
// MEJORA 4: se agrega el div de estrellas en el innerHTML.
// ==============================================================
function crearTarjeta(servicio) {
  // 1. Crear el elemento contenedor de la tarjeta
  const tarjeta = document.createElement("article");
  tarjeta.classList.add("tarjeta");
  tarjeta.setAttribute("data-id", servicio.id);
  tarjeta.style.setProperty("--color-linea", servicio.colorLinea);

  // 2. Construir el HTML interno de la tarjeta
  //    (igual que en la Práctica + línea de estrellas)
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

  // 3. PASO 6 (BASE): Agregar evento de clic a la tarjeta completa
  tarjeta.addEventListener("click", function () {
    abrirModal(servicio);
  });

  return tarjeta;
}

// ==============================================================
// PASO 5 (BASE): mostrarTarjetas
// Igual que en la Práctica — limpia el contenedor y lo repobla.
// ==============================================================
function mostrarTarjetas(lista) {
  const galeria           = document.getElementById("galeriaServicios");
  const sinResultados     = document.getElementById("sinResultados");
  const contadorResultados = document.getElementById("contadorResultados");

  // Limpiar el contenido previo
  galeria.innerHTML = "";

  // Actualizar contador
  contadorResultados.textContent =
    lista.length === 0
      ? "No se encontraron resultados."
      : `Mostrando ${lista.length} servicio${lista.length !== 1 ? "s" : ""}`;

  // Si no hay resultados, mostrar mensaje
  if (lista.length === 0) {
    sinResultados.classList.remove("oculto");
    return;
  }

  sinResultados.classList.add("oculto");

  // Recorrer el arreglo e insertar cada tarjeta en el DOM
  lista.forEach(function (servicio) {
    const tarjeta = crearTarjeta(servicio);
    galeria.appendChild(tarjeta);
  });
}

// ==============================================================
// PASO 6 (BASE): abrirModal
// Igual que en la Práctica.
// MEJORA 4: se agrega la línea de estrellas en el modal.
// ==============================================================
function abrirModal(servicio) {
  const overlay        = document.getElementById("overlayModal");
  const modalIcono     = document.getElementById("modalIcono");
  const modalTitulo    = document.getElementById("modalTitulo");
  const modalCategoria = document.getElementById("modalCategoria");
  const modalEstrellas = document.getElementById("modalEstrellas");
  const modalDesc      = document.getElementById("modalDescripcion");
  const modalPrecio    = document.getElementById("modalPrecio");

  // Rellenar el modal con los datos del servicio clicado
  modalIcono.hidden = true;   // sin imagen ni emoji
  modalTitulo.textContent    = servicio.nombre;
  modalCategoria.textContent = servicio.categoria;
  modalEstrellas.textContent = generarEstrellas(servicio.calificacion);
  modalDesc.textContent      = servicio.descripcion;
  modalPrecio.textContent    = "S/ " + servicio.precio.toLocaleString("es-PE");

  // Mostrar el modal
  overlay.classList.remove("oculto");
  document.body.style.overflow = "hidden";
}

// ==============================================================
// PASO 6 (BASE): cerrarModal
// Igual que en la Práctica.
// ==============================================================
function cerrarModal() {
  const overlay = document.getElementById("overlayModal");
  overlay.classList.add("oculto");
  document.body.style.overflow = "";
}

// ==============================================================
// PASO 6 (BASE): filtrarServicios
// BASE: misma lógica de texto + categoría de la Práctica.
// MEJORA 2: se agrega el filtro de precio máximo (slider).
// MEJORA 3: se agrega el ordenamiento de datos.
// ==============================================================
function filtrarServicios() {
  const textoBusqueda   = document.getElementById("inputBusqueda").value.toLowerCase();
  const categoriaFiltro = document.getElementById("selectCategoria").value;
  const precioMaximo    = Number(document.getElementById("rangoPrecio").value); // MEJORA 2
  const criterioOrden   = document.getElementById("selectOrden").value;         // MEJORA 3

  // --- Filtrar (igual que en la Práctica + precio) ---
  let resultados = servicios.filter(function (servicio) {
    const coincideTexto =
      servicio.nombre.toLowerCase().includes(textoBusqueda) ||
      servicio.descripcion.toLowerCase().includes(textoBusqueda);

    const coincideCategoria =
      categoriaFiltro === "todas" || servicio.categoria === categoriaFiltro;

    // MEJORA 2: condición de precio máximo
    const coincidePrecio = servicio.precio <= precioMaximo;

    return coincideTexto && coincideCategoria && coincidePrecio;
  });

  // --- MEJORA 3: Ordenamiento de datos ---
  // Se aplica después del filtrado para ordenar solo los resultados visibles.
  if (criterioOrden === "precio-asc") {
    resultados.sort(function (a, b) { return a.precio - b.precio; });
  } else if (criterioOrden === "precio-desc") {
    resultados.sort(function (a, b) { return b.precio - a.precio; });
  } else if (criterioOrden === "nombre-asc") {
    resultados.sort(function (a, b) { return a.nombre.localeCompare(b.nombre, "es"); });
  } else if (criterioOrden === "nombre-desc") {
    resultados.sort(function (a, b) { return b.nombre.localeCompare(a.nombre, "es"); });
  }
  // Si criterioOrden === "defecto", no se aplica ningún .sort()

  // Re-renderizar con los resultados filtrados y ordenados
  mostrarTarjetas(resultados);
}

// ==============================================================
// PASO 6 (BASE): mostrarToast
// Igual que en la Práctica.
// ==============================================================
function mostrarToast() {
  const toast = document.getElementById("toastNotificacion");
  toast.classList.remove("oculto");
  toast.classList.add("visible");

  // Ocultar después de 2.5 segundos
  setTimeout(function () {
    toast.classList.remove("visible");
    setTimeout(function () {
      toast.classList.add("oculto");
    }, 400);
  }, 2500);
}

// ==============================================================
// MEJORA 5: limpiarFiltros
// Resetea todos los controles a su estado inicial
// y vuelve a renderizar todas las tarjetas.
// ==============================================================
function limpiarFiltros() {
  document.getElementById("inputBusqueda").value   = "";
  document.getElementById("selectCategoria").value = "todas";
  document.getElementById("selectOrden").value     = "defecto";
  document.getElementById("rangoPrecio").value     = 3000;
  document.getElementById("valorPrecio").textContent = "S/ 3000";

  // Renderizar todas las tarjetas sin filtro
  mostrarTarjetas(servicios);
}

// ==============================================================
// INICIALIZACIÓN — igual que en la Práctica + nuevos eventos
// ==============================================================
document.addEventListener("DOMContentLoaded", function () {

  // Renderizar todas las tarjetas al inicio
  mostrarTarjetas(servicios);

  // Búsqueda en tiempo real (igual que en la Práctica)
  document.getElementById("inputBusqueda")
    .addEventListener("input", filtrarServicios);

  // Filtro por categoría (igual que en la Práctica)
  document.getElementById("selectCategoria")
    .addEventListener("change", filtrarServicios);

  // MEJORA 3: Ordenamiento
  document.getElementById("selectOrden")
    .addEventListener("change", filtrarServicios);

  // MEJORA 2: Slider de precio — actualiza el label y filtra
  document.getElementById("rangoPrecio")
    .addEventListener("input", function () {
      document.getElementById("valorPrecio").textContent =
        "S/ " + Number(this.value).toLocaleString("es-PE");
      filtrarServicios();
    });

  // MEJORA 5: Botón limpiar filtros
  document.getElementById("btnLimpiar")
    .addEventListener("click", limpiarFiltros);

  // Cerrar modal — botón ✕ (igual que en la Práctica)
  document.getElementById("btnCerrarModal")
    .addEventListener("click", cerrarModal);

  // Cerrar modal — clic fuera (igual que en la Práctica)
  document.getElementById("overlayModal")
    .addEventListener("click", function (evento) {
      if (evento.target === this) {
        cerrarModal();
      }
    });

  // Botón contratar (igual que en la Práctica)
  document.getElementById("btnContratar")
    .addEventListener("click", function () {
      cerrarModal();
      mostrarToast();
    });

  // Cerrar modal con Escape (igual que en la Práctica)
  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      cerrarModal();
    }
  });

});
