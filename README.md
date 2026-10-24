# FRAGANCE STOCK RD — PERFUMES 100% ORIGINALES & DECANTS
## Plataforma E-Commerce MVP de Alto Rendimiento

> **Dirección Visual:** Luxury Editorial Fragrance House (Contemporary Obsidian Noir & Rich Wine Accents)  
> **Comunidad & Canal Oficial:** [@fragancestockrd en Instagram](https://www.instagram.com/fragancestockrd/)  
> **Mercado Operativo Principal:** República Dominicana (Santo Domingo y cobertura nacional)  
> **Moneda:** Pesos Dominicanos (RD$ DOP) con formateo regional `es-DO` e integridad matemática.

---

## 1. VISIÓN DEL PRODUCTO & IDENTIDAD DE MARCA

Fragance Stock RD es una tienda especializada en perfumes 100% originales para hombres y mujeres, botellas selladas y decants fraccionados en atomizadores de cristal para República Dominicana.

### Principio Fundamental de Diseño
> *"La interfaz desaparece. La fragancia se convierte en la experiencia."*

La tienda no emplea plantillas genéricas ni sombras pesadas. Utiliza una estética editorial sofisticada con contrastes de alta gama: superficies en blanco porcelana (`#FAF9F6`), santuarios oscuros en espresso profundo (`#211A18`), toques sutiles de oro champán genuino (`#CCA727` derivado del logotipo oficial) y tipografía de proporciones clásicas (Cormorant Garamond) combinada con la precisión suiza de Inter.

---

## 2. ARQUITECTURA TECNOLÓGICA

| Capa | Tecnología Seleccionada | Justificación Técnica |
| :--- | :--- | :--- |
| **Framework Full-Stack** | Next.js 14 (App Router) | Renderizado híbrido SSR/SSG ultrarrápido, optimización SEO automática de metadatos y rutas de API seguras. |
| **Lenguaje** | TypeScript 5 (Strict Mode) | Tipado estricto para productos, variantes, snapshots inmutables de compra e inventario. |
| **Estilos & Diseño** | Tailwind CSS 3.4 | Tokens exactos de Cowboy Editorial: Porcelain, Charcoal, Hairline, Mist, Smoke, Ash. |
| **Iconografía** | Lucide React | Iconos geométricos ligeros y accesibles. |
| **Base de Datos & Auth** | Supabase (PostgreSQL 15) | Esquema relacional con llaves foráneas, índices de alto tráfico y políticas RLS. |
| **Data Access Layer Híbrido** | Local JSON File DB + Supabase Client | **Cero fricción de inicio:** funciona 100% de inmediato con persistencia local real sin requerir credenciales en desarrollo, y cambia automáticamente a Supabase PostgreSQL al configurar las variables de entorno. |
| **Gestión de Estado** | React Context (`CartContext`) | Carrito reactivo sincronizado con `localStorage`, validación de inventario en tiempo real y cálculo dinámico de barra de progreso para envío gratis. |

---

## 3. SISTEMA DE DISEÑO COWBOY EDITORIAL MINIMALISM

### Paleta de Color Oficial
- **Porcelain:** `#FFFFFF` (Superficie principal dominante)
- **Charcoal:** `#1D1D1D` (Tipografía display, botones principales y acentos de autoridad)
- **Hairline:** `#E5E7EB` (Bordes milimétricos de 1px en sustitución de sombras)
- **Smoke:** `#737373` (Textos secundarios y descripciones)
- **Ash:** `#A3A3A3` (Metadatos de producto, SKU y casas olfativas)
- **Mist:** `#F3F4F6` (Fondos de tarjetas, modales y barras de notificación)
- **Graphite:** `#5E5E5E` (Etiquetas de navegación y controles secundarios)
- **Bone:** `#CACACA` (Bordes secundarios y separadores)

---

## 4. FUNCIONALIDADES IMPLEMENTADAS EN EL MVP

### 1. Portada Editorial de Alto Impacto (`/`)
- **Cintillo de Anuncios:** Mensaje verificado de República Dominicana y enlace oficial a Instagram (@fragancestockrd).
- **Navegación Superior:** Wordmark con tracking editorial, enlaces de categoría, buscador predictivo integrado y bolsa de compras con contador en vivo.
- **Hero Editorial:** Fotografía de campaña de alta definición, titulares directos y llamadas a la acción en cápsula.
- **Colección Seleccionada (Bestsellers):** Tarjetas asimétricas minimalistas con notas, duración estimada, precio y acceso a formatos.
- **Buscador Olfativo Interactivo:** Filtro editorial en tiempo real por familia olfativa (Ámbar, Acuático, Gourmand, Amaderado), ocasión e intensidad.
- **Pie de Página Completo:** Navegación, políticas de servicio, canal directo y acceso administrativo.

### 2. Catálogo Interactivo de Fragancias (`/perfumes`)
- Búsqueda en vivo por nombre de fragancia, casa o notas olfativas.
- Filtrado simultáneo por categoría, casa olfativa y familia aromática.
- Conmutador de disponibilidad (oculta ítems sin existencias).
- Ordenamiento por recomendados, precio ascendente, precio descendente y más recientes.
- Sincronización bidireccional con parámetros de URL.

### 3. Ficha Técnica de Producto (`/perfumes/[id]`)
- Galería fotográfica con selector de miniaturas y modal de ampliación (zoom en alta resolución).
- Selector dinámico de variantes:
  - **Decant 5 ml:** Muestra portátil (~75 atomizaciones)
  - **Decant 10 ml:** Atomizador de viaje (~150 atomizaciones)
  - **Botella Sellada 100 ml:** Presentación completa sellada en caja original
- Actualización reactiva de precio y stock según el formato seleccionado.
- Medidores olfativos: Concentración, Longevidad en piel, Proyección (sillage) y Género.
- Pirámide olfativa interactiva en acordeón (Salida, Corazón y Fondo).

### 4. Bolsa de Compra Persistente & Cajón Lateral (`CartDrawer` & `/cart`)
- Apertura en drawer lateral elegante desde cualquier página.
- Selector de cantidad con límite de stock activo.
- Barra de progreso para meta de **Envío Gratis** configurable desde el panel admin.
- Persistencia reactiva en `localStorage`.

### 5. Proceso de Checkout Optimizado para República Dominicana (`/checkout`)
- Formulario de despacho adaptado a la división territorial de República Dominicana (Provincia, Municipio, Sector/Barrio, Calle/Número).
- Captura de teléfono WhatsApp para coordinación logística.
- Selección de método de pago:
  - **Pago Contra Entrega** (Efectivo al recibir en zona de cobertura).
  - **Transferencia Bancaria Directa** (Banreservas, BHD León, Banco Popular, Scotiabank, APAP).
  - **Tarjeta de Crédito** (Coordinación segura mediante enlace de pago por WhatsApp).
- Snapshot inmutable: los ítems, precios unitarios y totales se guardan como registro histórico inalterable.

### 6. Página de Confirmación & Recibo (`/order-confirmation/[id]`)
- Generación de código único de orden (ej. `AD-2026-5851`).
- Desglose detallado de productos, variantes, tarifas de envío e impuestos.
- **Confirmación con 1 Clic por WhatsApp:** Genera el mensaje formateado con la referencia y el desglose de productos listo para coordinar con A&D Parfum.

### 7. Panel de Administración Autónomo (`/admin`)
- Acceso protegido por autenticación segura (`ADMIN_PASSWORD`).
- **Métricas Reales:** Total de ventas recaudadas, pedidos totales, productos activos y alertas de bajo stock.
- **Gestión de Fragancias (CRUD):** Crear, editar, gestionar variantes y archivar fragancias.
- **Gestión de Pedidos:** Actualización de estados y seguimiento.
- **Configuración de Tienda:** Edición de número de WhatsApp oficial, tasas de envío, Instagram y anuncios.

---

## 5. GUÍA DE INSTALACIÓN Y DESARROLLO LOCAL

```bash
# 1. Instalar dependencias
npm install

# 2. Compilar para producción
npm run build

# 3. Iniciar en modo producción
npm start
# Disponible en http://localhost:3000
```
