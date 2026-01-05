// EDITAR: solo cambiar este archivo para agregar/borrar productos.
export const products = [
  {
    id: 1,
    name: "Osito Sonriente",
    img: "img/amigurumi-1.svg",
    desc: "Oso tierno en tonos cálidos, perfecto para abrazar. Relleno 100% algodón.",
    size: { width: 15, height: 20 },
    price: 28.50
  },
  {
    id: 2,
    name: "Gato Pastel",
    img: "img/amigurumi-2.svg",
    desc: "Gatito adorable en colores pastel. Ideal para decoración o regalo especial.",
    size: { width: 12, height: 18 },
    price: 24.00
  },
  {
    id: 3,
    name: "Conejo Rosa",
    img: "img/amigurumi-3.svg",
    desc: "Conejo con orejas largas en rosa intenso. Super kawaii y suave.",
    size: { width: 10, height: 22 },
    price: 26.00
  },
  {
    id: 4,
    name: "Oveja Nube",
    img: "img/amigurumi-1.svg",
    desc: "Oveja esponjosa y acogedora. Perfecta para animar cualquier rincón.",
    size: { width: 16, height: 14 },
    price: 32.00
  },
  {
    id: 5,
    name: "Pulpito Bebé",
    img: "img/amigurumi-2.svg",
    desc: "Pulpo diminuto con tentáculos regordetes. Hecho a mano con amor.",
    size: { width: 9, height: 12 },
    price: 22.00
  },
  {
    id: 6,
    name: "Mariquita Feliz",
    img: "img/amigurumi-3.svg",
    desc: "Mariquita roja brillante. Colorida y llena de energía positiva.",
    size: { width: 8, height: 10 },
    price: 18.50
  }
];

// Renderizar catálogo
function renderCatalog() {
  const catalog = document.getElementById('catalog');
  const storedProducts = localStorage.getItem('products');
  const itemsToRender = storedProducts ? JSON.parse(storedProducts) : products;
  
  // Ordenar por precio ascendente
  itemsToRender.sort((a, b) => a.price - b.price);

  catalog.innerHTML = itemsToRender.map(product => `
    <article class="card" aria-label="Producto: ${product.name}, $${product.price.toFixed(2)}">
      <img 
        src="${product.img}" 
        alt="${product.name} - Amigurumi hecho a mano"
        class="card__img"
        loading="lazy"
        width="500"
        height="500"
      />
      <h3 class="card__name">${product.name}</h3>
      <p class="card__desc">${product.desc}</p>
      <p class="card__size">
        <span class="card__label">Medidas:</span> 
        ${product.size.width} × ${product.size.height} cm
      </p>
      <p class="card__price">$${product.price.toFixed(2)}</p>
    </article>
  `).join('');

  // Lightbox: ver imagen en grande al presionar (mínimo JS, sin dependencias)
  const catalogEl = document.getElementById('catalog');
  const lightbox = document.getElementById('lightbox');
  if (catalogEl && lightbox) {
    // Delegación de eventos: abrir
    catalogEl.onclick = (e) => {
      const img = e.target.closest && e.target.closest('.card__img');
      if (!img) return;
      lightbox.innerHTML = `
        <div class="lightbox__backdrop" tabindex="0">
          <img src="${img.src}" alt="${img.alt}" class="lightbox__img" />
        </div>`;
      lightbox.hidden = false;
      lightbox.querySelector('.lightbox__backdrop').focus();
    };

    // Cerrar con ESC o click en backdrop
    window.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') lightbox.hidden = true; });
    lightbox.onclick = (ev) => { if (ev.target.classList.contains('lightbox__backdrop')) lightbox.hidden = true; };
  }
}

window.addEventListener('load', renderCatalog);
