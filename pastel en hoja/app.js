const TELEFONO_WHATSAPP = "18492143712";

const productos = [
  {
    id: 1,
    producto: "Pastel en hoja de pollo",
    precio: 150,
    imagen: "./imagen/pastel1.jpg"
  },
  {
    id: 2,
    producto: "Pastel en hoja de res",
    precio: 150,
    imagen: "./imagen/pastel8.jpg"
  },

  {
    id: 3,
    producto: "Pastel en hoja de cerdo",
    precio: 175,
    imagen: "./imagen/pastel3.jpg"
  }
];

let cantidades = {};
let carrito = [];

const grid = document.getElementById("grid");
const panel = document.getElementById("panel");
const items = document.getElementById("items");
const totalEl = document.getElementById("total");
const badge = document.getElementById("badge");

/* FORMATO */
const formatoRD = n =>
  `RD$ ${n.toLocaleString("es-DO", { minimumFractionDigits: 2 })}`;

/* RENDER PRODUCTOS */
productos.forEach(p => {
  cantidades[p.id] = 1;

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${p.imagen}">
    <h4>${p.producto}</h4>
    <p class="precio">${formatoRD(p.precio)}</p>

    <div class="selector">
      <button onclick="cambiarCantidad(${p.id}, -1)">−</button>
      <span id="cant-${p.id}">1</span>
      <button onclick="cambiarCantidad(${p.id}, 1)">+</button>
    </div>

    <button class="btnAgregar" onclick="agregar(${p.id})">
      ➕ Agregar
    </button>
  `;

  grid.appendChild(card);
});

/* CANTIDAD */
window.cambiarCantidad = (id, v) => {
  cantidades[id] = Math.max(1, cantidades[id] + v);
  document.getElementById(`cant-${id}`).innerText = cantidades[id];
};

/* AGREGAR */
window.agregar = id => {
  const p = productos.find(x => x.id === id);
  const existe = carrito.find(i => i.id === id);

  if (existe) {
    existe.cantidad += cantidades[id];
  } else {
    carrito.push({ ...p, cantidad: cantidades[id] });
  }

  actualizarCarrito();
};

/* ACTUALIZAR CARRITO */
function actualizarCarrito() {
  items.innerHTML = "";
  let total = 0;
  let count = 0;

  carrito.forEach(p => {
    total += p.precio * p.cantidad;
    count += p.cantidad;

    items.innerHTML += `
      <div class="item">
        <span>${p.producto}</span>
        <span>${p.cantidad} × ${formatoRD(p.precio)}</span>
        <b>${formatoRD(p.precio * p.cantidad)}</b>
      </div>
    `;
  });

  totalEl.innerText = `Total: ${formatoRD(total)}`;
  badge.innerText = count;
  badge.style.display = count > 0 ? "block" : "none";
}

/* MOSTRAR / OCULTAR */
document.getElementById("btnCarrito").onclick = () =>
  panel.classList.remove("hidden");

document.getElementById("cerrar").onclick = () =>
  panel.classList.add("hidden");

/* WHATSAPP */
document.getElementById("confirmar").onclick = () => {
  if (carrito.length === 0) return;

  let mensaje = "*NUEVO PEDIDO*%0A%0A";

  carrito.forEach(p => {
    mensaje += `• ${p.producto}%0A`;
    mensaje += `Cantidad: ${p.cantidad}%0A`;
    mensaje += `Precio: ${formatoRD(p.precio)}%0A%0A`;
  });

  mensaje += `*TOTAL: ${formatoRD(
    carrito.reduce((s, p) => s + p.precio * p.cantidad, 0)
  )}*%0A`;

  window.open(
    `https://wa.me/${TELEFONO_WHATSAPP}?text=${mensaje}`,
    "_blank"
  );

  carrito = [];
  actualizarCarrito();
  panel.classList.add("hidden");
};
