# Minas Lara - Sitio Web Empresarial

Sitio web estático para la Empresa de Minerales No Metálicos Jacinto Lara C.A.

## Tecnologías
- HTML5
- CSS3 (Vanilla + Variables)
- Vanilla JavaScript
- AOS.js (Animaciones al scroll)
- Leaflet.js (Mapas)
- Chart.js (Gráficos)
- Formspree (Formularios)

## Desarrollo Local
No se requiere un proceso de build (como webpack o vite). 
Simplemente abre `index.html` en tu navegador o usa una extensión como "Live Server" en VS Code.

Para correr el proyecto con Python:
```bash
python -m http.server 8000
```
Y luego navega a `http://localhost:8000`.

## Despliegue en Vercel (Recomendado y Gratuito)
1. Conecta este repositorio con tu cuenta de Vercel.
2. Vercel detectará el proyecto estático automáticamente.
3. Haz clic en "Deploy".
4. El archivo `vercel.json` ya incluye configuraciones básicas de caché para archivos estáticos.

## Mantenimiento
- **Minerales**: Los datos de minerales se encuentran en `data/minerals.json`. Se cargan dinámicamente mediante JS.
- **Formulario**: El formulario usa Formspree. Reemplaza `TU_URL_DE_FORMSPREE` en el código HTML de contacto por el endpoint generado en tu cuenta de formspree.io.
