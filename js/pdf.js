// js/pdf.js

window.downloadMineralPDF = function(mineral) {
    if (!mineral) return;

    // === CONFIGURACIÓN IMPORTANTE ===
    // Pega aquí la URL Web App generada por Google Apps Script "Implementar como Aplicación Web"
    const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbydB_0oBlLWUr_J4u45qVgrPnm8-yQmamklBszs4S5RjVZV_pjm-RCGc5uc80H8cml-/exec';

    if (GAS_WEB_APP_URL === 'https://script.google.com/macros/s/AKfycbydB_0oBlLWUr_J4u45qVgrPnm8-yQmamklBszs4S5RjVZV_pjm-RCGc5uc80H8cml-/exec' || !GAS_WEB_APP_URL.includes('script.google.com')) {
        alert("Configuración Pendiente: Todavía falta pegar la URL de tu Google Apps Script en el archivo js/pdf.js para habilitar las descargas.");
        return;
    }

    const btnPdf = document.querySelector('.btn-cta-pdf');
    const originalText = btnPdf ? btnPdf.innerHTML : '';
    if(btnPdf) {
        btnPdf.innerHTML = '<i class="lucide-loader"></i> Generando PDF en Google...';
        btnPdf.disabled = true;
    }

    // Adaptar las listas de strings en strings concatenadas con saltos de línea para el documento
    const dataToSend = {
        nombre: mineral.nombre,
        categoria: mineral.categoria,
        descripcion: mineral.descripcion,
        beneficios: mineral.beneficios ? mineral.beneficios.join('\n') : '',
        aplicaciones: mineral.aplicaciones ? mineral.aplicaciones.join('\n') : ''
    };

    // Hacer petición al backend gratuito de Google
    fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8' // Se usa text/plain para evadir bloqueo CORS del navegador
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.status === 'success' && data.pdfUrl) {
            // Abrir el PDF generado por Google
            window.open(data.pdfUrl, '_blank');
        } else {
            console.error(data);
            alert('Error en Google Apps Script: ' + (data.error || 'Respuesta desconocida.'));
        }
    })
    .catch(err => {
        console.error('Fetch error:', err);
        alert('Ocurrió un error al contactar al servidor de Google. Verifica la consola para más detalles.');
    })
    .finally(() => {
        if(btnPdf) {
            btnPdf.innerHTML = originalText;
            btnPdf.disabled = false;
        }
    });
};
