// js/pdf.js

window.downloadMineralPDF = function(mineral) {
    if (!mineral) return;

    // Crear un contenedor temporal para el PDF
    const pdfContainer = document.createElement('div');
    pdfContainer.id = 'pdf-container';
    
    // Obtener la fecha actual
    const today = new Date();
    const dateStr = today.toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' });

    // Fallback de imagen
    const getPlaceholderImage = (id) => {
        const map = {
            'arena-rio': '1584852934524-81fe4a014a0f',
            'arena-cernida': '1580982367175-9e67db754394',
            'grava': '1522016254070-077553f10129',
            'piedra-caliza': '1580227181559-05eb9234ddbf',
            'cuarzo': '1557431599-4ce3a5ba0c68',
            'caolin': '1612711696048-c8dc7d6f541e',
            'carbonato-calcio': '1604085429184-a90ac835fbcc',
            'arcilla': '1605333161352-7cd28de41e0d'
        };
        const photoId = map[id] || '1578310006240-da233ec7c244';
        return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=600&h=400`;
    };

    const imgSrc = mineral.imagen || getPlaceholderImage(mineral.id);

    // Listas
    const benefitsList = (mineral.beneficios || []).map(b => `<li><span style="color: #27ae60;">✓</span> ${b}</li>`).join('');
    const appsList = (mineral.aplicaciones || []).map(a => `<li><span style="color: #C4922A;">➔</span> ${a}</li>`).join('');

    // Estilos del documento, forzando modo claro y tipografía corporativa
    // Utilizamos estilos en línea estrictos o un bloque style protegido
    pdfContainer.innerHTML = `
        <style>
            #pdf-container {
                width: 100%;
                background-color: #FFFFFF !important;
                color: #1A202C !important;
                font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif !important;
                padding: 40px;
                box-sizing: border-box;
                display: block; /* Solo se muestra para renderizar html2pdf, luego se destruye */
            }
            .pdf-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid #0D2137;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .pdf-logo {
                height: 60px;
            }
            .pdf-header-info {
                text-align: right;
                font-size: 11px;
                color: #4A5568 !important;
                line-height: 1.4;
            }
            .pdf-title-zone {
                margin-bottom: 25px;
            }
            .pdf-title {
                font-size: 28px;
                color: #0D2137 !important;
                margin: 0 0 5px 0;
                font-weight: 800;
            }
            .pdf-category {
                font-size: 14px;
                color: #C4922A !important;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .pdf-content-row {
                display: flex;
                gap: 30px;
                margin-bottom: 30px;
            }
            .pdf-desc-col {
                flex: 1;
            }
            .pdf-desc {
                font-size: 13px;
                line-height: 1.6;
                color: #4A5568 !important;
                margin: 0;
                text-align: justify;
            }
            .pdf-image {
                width: 300px;
                height: 200px;
                object-fit: cover;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .pdf-grid {
                display: flex;
                gap: 30px;
                margin-bottom: 30px;
            }
            .pdf-col {
                flex: 1;
            }
            .pdf-col h4 {
                color: #0D2137 !important;
                font-size: 14px;
                border-bottom: 2px solid #C4922A;
                padding-bottom: 8px;
                margin-bottom: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .pdf-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .pdf-list li {
                font-size: 12px;
                margin-bottom: 8px;
                color: #1A202C !important;
                display: flex;
                align-items: flex-start;
                gap: 8px;
            }
            .pdf-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
            }
            .pdf-table th, .pdf-table td {
                padding: 10px 15px;
                border: 1px solid #E2E8F0;
                font-size: 12px;
                text-align: left;
            }
            .pdf-table th {
                background-color: #F8F9FA !important;
                color: #0D2137 !important;
                font-weight: 700;
                width: 25%;
            }
            .pdf-table td {
                color: #4A5568 !important;
                width: 25%;
            }
            .pdf-footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #E2E8F0;
                font-size: 10px;
                color: #718096 !important;
                text-align: center;
                line-height: 1.5;
            }
        </style>
        
        <div class="pdf-header">
            <img src="img/logos/logo.png" alt="Minas Lara Logo" class="pdf-logo">
            <div class="pdf-header-info">
                <strong>Minas Lara C.A.</strong><br>
                Zona Industrial I, Barquisimeto, Edo. Lara<br>
                +58 251 1234567 | contacto@minaslara.com<br>
                <em>Ficha Técnica Generada el ${dateStr}</em>
            </div>
        </div>

        <div class="pdf-title-zone">
            <h1 class="pdf-title">${mineral.nombre}</h1>
            <div class="pdf-category">${mineral.categoria}</div>
        </div>

        <div class="pdf-content-row">
            <div class="pdf-desc-col">
                <p class="pdf-desc">${mineral.descripcion}</p>
            </div>
            <img src="${imgSrc}" class="pdf-image" alt="${mineral.nombre}">
        </div>

        <div class="pdf-grid">
            <div class="pdf-col">
                <h4>Beneficios para el Cliente</h4>
                <ul class="pdf-list">
                    ${benefitsList}
                </ul>
            </div>
            <div class="pdf-col">
                <h4>Aplicaciones Industriales</h4>
                <ul class="pdf-list">
                    ${appsList}
                </ul>
            </div>
        </div>

        <table class="pdf-table">
            <tr>
                <th>Granulometría</th>
                <td>Variable (según pedido)</td>
                <th>Humedad</th>
                <td>&lt; 5%</td>
            </tr>
            <tr>
                <th>Pureza/Calidad</th>
                <td>Certificada ISO 9001</td>
                <th>Disponibilidad</th>
                <td>Inmediata / Gran volumen</td>
            </tr>
        </table>
        
        <!-- You can expand the table dynamically here dynamically if mineralsData included technical exact specs -->

        <div class="pdf-footer">
            <p><strong>Aviso Legal:</strong> La información contenida en esta ficha técnica es orientativa y está basada en promedios de análisis de laboratorio. Los valores exactos pueden variar según el lote de extracción. Comuníquese con nuestro departamento de calidad para especificaciones certificadas para su pedido final.</p>
            <p>© ${today.getFullYear()} Empresa de Minerales No Metálicos Jacinto Lara C.A.</p>
        </div>
    `;

    // Lo agregamos al body en un contenedor wrapper oculto
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '-9999px';
    wrapper.appendChild(pdfContainer);
    document.body.appendChild(wrapper);

    // Opciones para la generación del PDF
    const opt = {
        margin:       [0, 0, 0, 0],
        filename:     `Ficha_Tecnica_${mineral.nombre.replace(/\s+/g, '_')}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // Cambiar estado del botón original (opcional, para UI)
    const btnPdf = document.querySelector('.btn-cta-pdf');
    const originalText = btnPdf ? btnPdf.innerHTML : '';
    if(btnPdf) {
        btnPdf.innerHTML = '<i class="lucide-loader"></i> Generando...';
        btnPdf.disabled = true;
    }

    // Generar PDF
    html2pdf().set(opt).from(pdfContainer).save().then(() => {
        // Limpieza
        document.body.removeChild(wrapper);
        if(btnPdf) {
            btnPdf.innerHTML = originalText;
            btnPdf.disabled = false;
        }
    }).catch(err => {
        console.error("Error generating PDF:", err);
        document.body.removeChild(wrapper);
        if(btnPdf) {
            btnPdf.innerHTML = originalText;
            btnPdf.disabled = false;
        }
        alert("Ocurrió un error al generar el PDF. Asegúrate de tener conexión a Internet para descargar los recursos.");
    });
};
