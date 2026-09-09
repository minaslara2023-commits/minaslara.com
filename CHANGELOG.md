# Bitácora de Cambios (Changelog) - Minas Lara

Este archivo sirve como **log de respaldo interno** para el seguimiento y control de versiones del sitio web institucional de la **Empresa de Minerales No Metálicos Jacinto Lara C.A. (Minas Lara)**. No se muestra públicamente en las páginas del sitio web.

---

## [v1.3.0] - 2026-09-09

### Añadido
- **Sección Concurso de Contrataciones Abiertas**: Implementación de una nueva sección y formulario enfocado en la captación de proveedores y contratistas de bienes/servicios.
- **Campo RIF de la Empresa Obligatorio**: Incorporado en el formulario de contrataciones y en el formulario de contacto principal ("Comunícate con Nosotros").
- **Aviso de Envío Digital por Correo**: Creada una tarjeta interactiva (`.email-notice-card`) solicitando el envío digital de RIF, RNC, Registro Mercantil e Información Empresarial a `sncminaslara@gmail.com`.
- **Actualización Automática de Fecha en Footer**: Script en `js/main.js` que detecta y formatea dinámicamente la fecha de modificación del documento (`document.lastModified`) en español al cargar el sitio.

### Modificado
- **Canal de Recepción de Contrataciones**: Configurado el correo institucional `sncminaslara@gmail.com`.
- **Sustitución de Carga Directa de Archivos**: Retirado el input file y zona dropzone en favor del canal de envío digital por correo directo.
- **Correcciones de Contraste y Tipografía**:
  - Ajustados estilos de fuentes en tarjetas de información (`.contrataciones-info` y `.contact-info`), títulos de sección y campos de entrada para Modo Claro y Modo Oscuro.
- **Optimizaciones de Rendimiento (Vercel Speed Insights / Core Web Vitals)**:
  - Agregadas preconexiones CDN (`unpkg.com`, `cdn.jsdelivr.net`, `cdnjs.cloudflare.com`).
  - Atributos `fetchpriority="high"`, `decoding="async"`, y dimensiones `width`/`height` asignadas en el Hero e imagen de logo.
  - Atributo `defer` incorporado en scripts JS no críticos.

---

## [v1.2.0] - 2026-04-06

### Modificado
- Actualización de la estructura de datos y fichas técnicas de minerales en `data/minerals.json`.
- Mejoras de estilo y diseño adaptable en la navegación responsiva y pie de página.

---

## [v1.1.0] - 2026-02-15

### Añadido
- Integración del mapa interactivo de presencia con Leaflet.js.
- Gráficos interactivos de crecimiento y uso industrial con Chart.js.
- Conmutador de tema claro y oscuro (`data-theme="dark"`).

---

## [v1.0.0] - 2026-01-10

### Añadido
- Lanzamiento inicial del sitio web estático para Minas Lara.
- Estructura principal: Inicio, Quiénes Somos, Minerales, Proceso, Impacto y Contacto vía Formspree.
