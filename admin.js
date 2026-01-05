// ============================================
// ADMIN - Sistema de gestión de productos
// ============================================
// Este módulo maneja:
// - Autenticación admin (contraseña)
// - Panel admin visual
// - Upload de imágenes a GitHub
// - Commit automático a GitHub
// ============================================

const ADMIN_PASSWORD = 'admin2024'; // CAMBIAR EN PRODUCCIÓN
const GITHUB_API = 'https://api.github.com';
const REPO_OWNER = 'JosePluz';
const REPO_NAME = 'amigurumis';

// ============ LOGIN ADMIN ============
function showLoginModal() {
  const html = `
    <div class="modal modal--login" id="loginModal">
      <div class="modal__content">
        <h2>Acceso Admin</h2>
        <p>Ingresa la contraseña para administrar productos</p>
        <input type="password" id="loginPass" placeholder="Contraseña" />
        <div class="modal__actions">
          <button id="loginBtn">Entrar</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
  
  document.getElementById('loginBtn').onclick = () => {
    const pass = document.getElementById('loginPass').value;
    if (pass === ADMIN_PASSWORD) {
      document.getElementById('loginModal').remove();
      showAdminPanel();
    } else {
      alert('❌ Contraseña incorrecta');
    }
  };
  
  document.getElementById('loginPass').onkeypress = (e) => {
    if (e.key === 'Enter') document.getElementById('loginBtn').click();
  };
}

// ============ PANEL ADMIN ============
function showAdminPanel() {
  const html = `
    <div class="admin" id="adminPanel">
      <div class="admin__header">
        <h2>Panel Admin - Amigurumis</h2>
        <button class="admin__close" id="adminClose">×</button>
      </div>

      <div class="admin__body">
        <!-- FORMULARIO -->
        <div class="admin__section">
          <h3>Nuevo/Editar Producto</h3>
          <form id="adminForm" class="admin-form">
            <input type="hidden" id="editId" />
            
            <label>
              Nombre *
              <input id="prodName" type="text" required />
            </label>

            <label>
              Descripción
              <textarea id="prodDesc" rows="2"></textarea>
            </label>

            <label>
              Precio ($) *
              <input id="prodPrice" type="number" step="0.01" min="0" required />
            </label>

            <label>
              Ancho (cm)
              <input id="prodWidth" type="number" min="0" />
            </label>

            <label>
              Alto (cm)
              <input id="prodHeight" type="number" min="0" />
            </label>

            <label>
              Imagen (JPG, PNG, WEBP)
              <input id="prodImage" type="file" accept="image/*" />
              <small>O selecciona una existente</small>
              <select id="prodImageSelect">
                <option value="">-- Imágenes existentes --</option>
              </select>
            </label>

            <div class="admin-form__actions">
              <button type="button" id="formSave">Guardar producto</button>
              <button type="button" id="formClear">Limpiar</button>
            </div>
          </form>
        </div>

        <!-- LISTA DE PRODUCTOS -->
        <div class="admin__section">
          <h3>Productos (${document.querySelectorAll('.card').length} activos)</h3>
          <ul id="adminProductList" class="admin-list"></ul>
        </div>

        <!-- PUBLICAR -->
        <div class="admin__footer">
          <button id="publishBtn" class="btn-primary">📤 Publicar cambios</button>
          <small>Los cambios se sincronizarán a todos los dispositivos</small>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', html);
  
  // Eventos
  document.getElementById('adminClose').onclick = () => {
    if (confirm('¿Cerrar panel admin?')) {
      document.getElementById('adminPanel').remove();
    }
  };
  
  document.getElementById('formSave').onclick = () => saveProduct();
  document.getElementById('formClear').onclick = () => clearForm();
  document.getElementById('publishBtn').onclick = () => publishToGitHub();
  
  // Cargar productos y imágenes existentes
  loadAdminData();
}

// ============ GESTIÓN DE DATOS ============
function loadAdminData() {
  const products = window.productsData || [];
  const list = document.getElementById('adminProductList');
  
  list.innerHTML = products.map(p => `
    <li>
      <div>
        <strong>${p.name}</strong> — $${p.price.toFixed(2)}
        <small>${p.desc}</small>
      </div>
      <div>
        <button onclick="editProduct(${p.id})">✏️ Editar</button>
        <button onclick="deleteProduct(${p.id})">🗑️ Borrar</button>
      </div>
    </li>
  `).join('');
  
  // Cargar imágenes existentes
  const imgSelect = document.getElementById('prodImageSelect');
  const images = ['lolo.jpg', 'lala.webp', 'paco.webp'];
  images.forEach(img => {
    const opt = document.createElement('option');
    opt.value = `img/${img}`;
    opt.textContent = img;
    imgSelect.appendChild(opt);
  });
  
  imgSelect.onchange = (e) => {
    if (e.target.value) {
      document.getElementById('prodImage').value = '';
    }
  };
}

function saveProduct() {
  const id = document.getElementById('editId').value;
  const name = document.getElementById('prodName').value.trim();
  const desc = document.getElementById('prodDesc').value.trim();
  const price = parseFloat(document.getElementById('prodPrice').value);
  const width = parseInt(document.getElementById('prodWidth').value) || 10;
  const height = parseInt(document.getElementById('prodHeight').value) || 10;
  const imageFile = document.getElementById('prodImage').files[0];
  const imageSelect = document.getElementById('prodImageSelect').value;
  
  if (!name || !price) {
    alert('❌ Nombre y precio son obligatorios');
    return;
  }
  
  if (!imageFile && !imageSelect) {
    alert('❌ Selecciona una imagen');
    return;
  }
  
  // Crear producto
  const product = {
    id: id ? parseInt(id) : Date.now(),
    name,
    desc,
    price,
    size: { width, height },
    imgs: imageSelect ? [imageSelect] : [`img/${imageFile.name}`]
  };
  
  // Guardar en localStorage primero (preview)
  let products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
  const idx = products.findIndex(p => p.id === product.id);
  if (idx >= 0) {
    products[idx] = product;
  } else {
    products.push(product);
  }
  localStorage.setItem('adminProducts', JSON.stringify(products));
  window.productsData = products;
  
  // Actualizar UI
  loadAdminData();
  reloadCatalog();
  clearForm();
  alert('✅ Producto guardado (preview local)');
}

function editProduct(id) {
  const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
  const product = products.find(p => p.id === id);
  if (!product) return;
  
  document.getElementById('editId').value = product.id;
  document.getElementById('prodName').value = product.name;
  document.getElementById('prodDesc').value = product.desc;
  document.getElementById('prodPrice').value = product.price;
  document.getElementById('prodWidth').value = product.size.width;
  document.getElementById('prodHeight').value = product.size.height;
  
  window.scrollTo(0, 0);
}

function deleteProduct(id) {
  if (!confirm('¿Borrar este producto?')) return;
  
  let products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
  products = products.filter(p => p.id !== id);
  localStorage.setItem('adminProducts', JSON.stringify(products));
  window.productsData = products;
  
  loadAdminData();
  reloadCatalog();
}

function clearForm() {
  document.getElementById('editId').value = '';
  document.getElementById('adminForm').reset();
}

function reloadCatalog() {
  window.productsData = JSON.parse(localStorage.getItem('adminProducts') || '[]');
  if (window.renderCatalog) window.renderCatalog();
}

// ============ PUBLICAR A GITHUB ============
async function publishToGitHub() {
  const token = prompt('🔐 Token GitHub (con permisos repo):\n\n(Genera uno en: github.com/settings/tokens → repo scope)');
  if (!token) return;
  
  const btn = document.getElementById('publishBtn');
  btn.disabled = true;
  btn.textContent = '⏳ Publicando...';
  
  try {
    const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    const content = `// EDITAR: solo cambiar este archivo para agregar/borrar productos.
// Estructura: id, name, imgs (array de rutas), desc, size, price
export const products = ${JSON.stringify(products, null, 2)};`;
    
    // Obtener SHA del archivo actual
    const getResp = await fetch(
      `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/products.js`,
      { headers: { 'Authorization': `token ${token}` } }
    );
    
    if (!getResp.ok) throw new Error('No se pudo acceder al repo. Verifica el token.');
    
    const fileData = await getResp.json();
    const sha = fileData.sha;
    
    // Hacer commit
    const updateResp = await fetch(
      `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/products.js`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `📦 Admin: ${new Date().toLocaleString()}`,
          content: btoa(content),
          sha
        })
      }
    );
    
    if (updateResp.ok) {
      alert('✅ ¡Publicado en GitHub! Render se actualizará en 30 segundos.');
      localStorage.removeItem('adminProducts');
      setTimeout(() => location.reload(), 2000);
    } else {
      throw new Error(await updateResp.text());
    }
  } catch (err) {
    alert('❌ Error: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = '📤 Publicar cambios';
  }
}

// ============ INICIALIZAR ============
window.openAdminPanel = function() {
  showLoginModal();
};
