# 🧶 Amigurumis · Micro-site Estático

Catálogo ultra-minimalista de amigurumis hechos a mano, desplegado en **Render** sin back-end, sin formularios, sin dependencias externas.

---

## 📋 Estructura del Proyecto

```
yadi/
├── index.html          # Página principal (semántica HTML5)
├── style.css           # Estilos sin frameworks (CSS3 puro)
├── products.js         # Array de productos + lógica de renderizado
├── README.md           # Este archivo
└── img/
    ├── amigurumi-1.svg
    ├── amigurumi-2.svg
    └── amigurumi-3.svg
```

**Peso total:** ~8 kB (excluidas imágenes).

---

## 🎨 Características

✅ **Responsive** → 1 columna (móvil), 2 columnas (tablet), 3 columnas (desktop)  
✅ **Accesible** → Contraste WCAG AA (≥4.5:1), focus outlines visibles, aria-labels  
✅ **SEO-friendly** → HTML semántico, meta tags, alt text en imágenes  
✅ **Rápido** → Imágenes lazy-loading, shadow DOM mínimo, sin JavaScript innecesario  
✅ **Editable** → Sin CMS, editá con VS Code y GitHub → Render auto-deploy  

---

## 📝 Cómo Editar Productos

### Paso 1: Abre `products.js`

Encontrarás un array con los productos actuales:

```javascript
export const products = [
  {
    id: 1,
    name: "Osito Sonriente",
    img: "img/amigurumi-1.svg",
    desc: "Oso tierno en tonos cálidos, perfecto para abrazar.",
    size: { width: 15, height: 20 },
    price: 28.50
  },
  // ... más productos
];
```

### Paso 2: Duplica un Producto

Copia un objeto completo (incluido el `{` y `}`), pégalo abajo, y cambia:

- **`id`** → Número único (ej: `7`, `8`)
- **`name`** → Nombre del producto (ej: "Estrella Brillante")
- **`img`** → Ruta a la imagen (ej: `"img/mi-imagen.svg"`)
- **`desc`** → Descripción corta (una línea)
- **`size`** → Ancho × alto en cm (ej: `{ width: 12, height: 18 }`)
- **`price`** → Precio en EUR (ej: `25.00`)

**Ejemplo completo para agregar:**

```javascript
{
  id: 7,
  name: "Estrella Brillante",
  img: "img/amigurumi-nuevo.svg",
  desc: "Estrella dorada tejida a mano, perfecta para noches mágicas.",
  size: { width: 14, height: 14 },
  price: 30.00
},
```

⚠️ **Importante:** Asegúrate de que:
- Los decimales usen punto: `28.50`, no `28,50`
- Todas las comas estén en su lugar (coma después de cada `}` excepto el último)
- La ruta de la imagen exista (dentro de `img/`)

### Paso 3: Guarda y Sube

```bash
# En tu terminal (en la carpeta del proyecto):
git add products.js
git commit -m "Agregué nuevo producto: Estrella Brillante"
git push origin main
```

**Render desplegará automáticamente en 30 segundos.**

---

## 🖼️ Agregar Nuevas Imágenes

1. **Crea tu imagen** (500 × 500 px, < 50 kB)
2. **Guárdala en `img/`** (ej: `img/mi-amigurumi.svg` o `.jpg`)
3. **Actualiza `products.js`** con la ruta exacta:
   ```javascript
   img: "img/mi-amigurumi.svg",
   ```
4. Commit & push (como arriba)

**Formatos recomendados:**
- **SVG** → Ideal, sin pérdida de calidad, muy ligero
- **JPG** → Bueno para fotos, máx 50 kB
- **PNG** → Para fondo transparente, máx 50 kB

---

## 🚀 Preview Local

### Con VS Code Live Server (más fácil)

1. Instala la extensión **"Live Server"** (Ritwick Dey)
2. Click derecho en `index.html` → "Open with Live Server"
3. Se abre en `http://localhost:5500`

### Con terminal (npx)

```bash
cd ruta/a/tu/proyecto
npx serve .
# Abre http://localhost:3000
```

---

## 🌐 Deploy en Render

### Primera Vez (Configuración)

1. **Sube el código a GitHub**
   - Crea un repo nuevo llamado `amigurumis` (o el nombre que prefieras)
   - Push la carpeta `yadi/` a `main`

2. **Conecta Render**
   - Ve a https://render.com
   - Login (crea cuenta si no tienes)
   - New → Static Site
   - Conecta tu repo GitHub
   - Rama: `main`
   - Build Command: (dejá vacío)
   - Publish Directory: `.` (punto)
   - Crea el sitio

3. **Listo** → Tendrás una URL tipo:  
   `https://amigurumis.onrender.com`

### Actualizaciones Futuras

Solo necesitás hacer commit & push:

```bash
git add .
git commit -m "Actualicé catálogo"
git push origin main
```

Render detecta el cambio automáticamente y redeploy en 30 segundos.

---

## ✅ Validaciones de Calidad

Para verificar que todo está correcto:

### 1️⃣ Valida HTML (W3C)

- Ve a https://validator.w3.org/
- Sube `index.html`
- Debe pasar sin errores ❌ → Aviísame si hay alguno

### 2️⃣ Analiza Performance (Lighthouse)

- Abre tu sitio en Chrome
- `F12` → Lighthouse tab → Analizar
- Debe alcanzar **95+ en móvil**

### 3️⃣ Verifica Accesibilidad

- `F12` → DevTools
- Tab → Navega por todas las tarjetas (debe haber focus outline rosado)
- Screen reader (opcional): Todos los amigurumis deben ser identificables

---

## 📱 Responsive Breakpoints

| Viewport | Columnas | Comportamiento |
|----------|----------|---|
| ≤ 480px | 1 | Mobile first |
| 481–768px | 2 | Tablet |
| ≥ 769px | 3 | Desktop |

---

## 🎨 Paleta de Colores

```
Fondo:   #FFF8F5  (Rosa muy claro, "cream")
Acento:  #FF7AA2  (Rosa "kawaii")
Texto:   #333     (Gris oscuro)
Gris:    #666, #999  (Subtítulos, labels)
```

---

## 🔄 Escalabilidad Futura

Este proyecto está diseñado para **migrar a Eleventy, Astro o Hugo** sin cambios mayores:

- ✅ `products.js` es un array JSON reutilizable
- ✅ HTML es semántico y sin JSX
- ✅ CSS es vanilla (sin Tailwind/Bootstrap)
- ✅ Estructura de carpetas estándar

Cuando crezca, podrés pasar a:
```bash
npx create-eleventy@latest
# y reutilizar products.json directamente
```

---

## 🐛 Troubleshooting

### Las imágenes no cargan
→ Verifica la ruta en `products.js` (debe ser exacta: `img/archivo.svg`)

### El catálogo está vacío
→ Abre la consola (`F12` → Console), verifica que no haya errores rojo

### El sitio se ve horrible en móvil
→ Abre `F12` → Toggle device toolbar, recarga la página

### Render no actualiza después de push
→ Espera 2 minutos, recarga la página, limpia caché (Ctrl+Shift+Supr)

---

## 📄 Licencia

Código: MIT (usá libremente)  
Imágenes: Derechos reservados (reemplazá con tus propias fotos)

---

## 🤝 Soporte

- **Documentación completa:** Ver archivos `.html`, `.css`, `.js` (bien comentados)
- **Cambios recientes:** Revisa `git log` para historial de modificaciones

---

**Hecho con ♡ para artesanas creativas que no quieren tocar código** ✨
