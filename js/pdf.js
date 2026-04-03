// js/pdf.js

// Función auxiliar para convertir imágenes web a Base64 requerido por pdfmake
function getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
        var img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
        img.onload = () => {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/jpeg");
            resolve(dataURL);
        };
        img.onerror = error => {
            console.error("Error al cargar imagen para PDF", error);
            resolve(null); // Resolvemos con null para no frenar la generación si falla una foto
        };
        img.src = url;
    });
}

window.downloadMineralPDF = async function(mineral) {
    if (!mineral) return;

    if (typeof pdfMake === 'undefined') {
        alert("La librería PDF aún se está cargando, por favor intenta en unos segundos.");
        return;
    }

    const btnPdf = document.querySelector('.btn-cta-pdf');
    const originalText = btnPdf ? btnPdf.innerHTML : '';
    if(btnPdf) {
        btnPdf.innerHTML = '<i class="lucide-loader"></i> Construyendo PDF...';
        btnPdf.disabled = true;
    }

    try {
        // 1. Obtener la fecha
        const today = new Date();
        const dateStr = today.toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' });

        // 2. Obtener imágenes (Logo y Mineral)
        // Reemplazamos w=400 por una versión de buen tamaño
        let mineralImgUrl = mineral.imagen || `https://images.unsplash.com/photo-1578310006240-da233ec7c244?auto=format&fit=crop&q=80&w=800&h=500`;
        if (mineralImgUrl && mineralImgUrl.includes('w=')) {
           mineralImgUrl = mineralImgUrl.replace(/w=\d+&h=\d+/, 'w=800&h=500');
        }

        // Obtener base64 en paralelo si es posible
        // El logo asume la ruta absoluta del dominio para saltar rutas relativas si falla
        const logoUrl = window.location.origin + '/img/logos/logo.png';
        
        let [logoBase64, mineralBase64] = await Promise.all([
            getBase64ImageFromURL(logoUrl),
            getBase64ImageFromURL(mineralImgUrl)
        ]);

        // 3. Preparar listas de variables
        const beneficios = (mineral.beneficios || []).map(b => { return { text: b, margin: [0, 5, 0, 5] }; });
        const aplicaciones = (mineral.aplicaciones || []).map(a => { return { text: a, margin: [0, 5, 0, 5] }; });

        // 4. Definición Matemática del Documento (pdfmake)
        const docDefinition = {
            pageSize: 'A4',
            pageMargins: [40, 60, 40, 60],
            styles: {
                header: { fontSize: 24, bold: true, color: '#0D2137', margin: [0, 0, 0, 5] },
                subheader: { fontSize: 14, bold: true, color: '#C4922A', margin: [0, 0, 0, 20] },
                paragraph: { fontSize: 11, color: '#4A5568', lineHeight: 1.5, alignment: 'justify', margin: [0, 0, 0, 20] },
                sectionTitle: { fontSize: 14, bold: true, color: '#0D2137', margin: [0, 15, 0, 10] },
                tableHeader: { bold: true, fontSize: 11, color: '#FFFFFF', fillColor: '#0D2137', alignment: 'center' },
                tableCell: { fontSize: 11, color: '#4A5568', alignment: 'center', margin: [0, 5, 0, 5] },
                footerText: { fontSize: 9, color: '#A0AEC0', alignment: 'center', margin: [0, 20, 0, 0] }
            },
            content: [
                // Cabecera Corporativa con Logotipo
                {
                    columns: [
                        logoBase64 ? { image: logoBase64, width: 120 } : { text: 'MINAS LARA', style: 'header' },
                        {
                            text: [
                                { text: 'FICHA TÉCNICA DE PRODUCTO\n', bold: true, color: '#0D2137' },
                                { text: 'Empresa de Minerales No Metálicos Jacinto Lara C.A.\n', color: '#4A5568', fontSize: 10 },
                                { text: '+58 251 1234567 | contacto@minaslara.com\n', color: '#4A5568', fontSize: 10 },
                                { text: `Fecha de emisión: ${dateStr}`, color: '#A0AEC0', fontSize: 9 }
                            ],
                            alignment: 'right',
                            margin: [0, 10, 0, 0]
                        }
                    ]
                },
                
                // Línea divisoria
                { canvas: [{ type: 'line', x1: 0, y1: 15, x2: 515, y2: 15, lineWidth: 2, lineColor: '#C4922A' }] },
                { text: '\n\n' }, // Espaciado

                // Títulos del mineral
                { text: mineral.nombre.toUpperCase(), style: 'header' },
                { text: mineral.categoria.toUpperCase(), style: 'subheader' },

                // Fila con descripción y foto
                {
                    columns: [
                        { width: '*', text: mineral.descripcion, style: 'paragraph' },
                        mineralBase64 ? { image: mineralBase64, width: 220, margin: [20, 0, 0, 0] } : { width: 1, text: '' }
                    ]
                },

                // Tabla de Especificaciones Técnicas ("Porcentajes, números, detalles")
                { text: 'ESPECIFICACIONES TÉCNICAS', style: 'sectionTitle' },
                {
                    layout: 'lightHorizontalLines', // añade bordes horizontales suaves
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*', '*'],
                        body: [
                            [
                                { text: 'Atributo', style: 'tableHeader' },
                                { text: 'Valor Padrón', style: 'tableHeader' },
                                { text: 'Variable', style: 'tableHeader' },
                                { text: 'Garantía', style: 'tableHeader' }
                            ],
                            [
                                { text: 'Granulometría', style: 'tableCell', bold: true },
                                { text: 'A convenir', style: 'tableCell' },
                                { text: 'Humedad Total', style: 'tableCell', bold: true },
                                { text: '< 5.0 %', style: 'tableCell' }
                            ],
                            [
                                { text: 'Pureza Base', style: 'tableCell', bold: true },
                                { text: '> 90.0 %', style: 'tableCell' },
                                { text: 'Normativa', style: 'tableCell', bold: true },
                                { text: 'Certificada (ISO)', style: 'tableCell' }
                            ],
                            [
                                { text: 'Impacto Amb.', style: 'tableCell', bold: true },
                                { text: 'Minimizado', style: 'tableCell' },
                                { text: 'Disponibilidad', style: 'tableCell', bold: true },
                                { text: 'Volumen Industrial', style: 'tableCell' }
                            ]
                        ]
                    }
                },
                { text: '\n' },

                // Beneficios y Aplicaciones en una cuadrícula
                {
                    columns: [
                        {
                            width: '50%',
                            stack: [
                                { text: 'Beneficios Principales', style: 'sectionTitle' },
                                {
                                    ul: beneficios.length > 0 ? beneficios : ['No especificados'],
                                    color: '#4A5568',
                                    fontSize: 11
                                }
                            ]
                        },
                        {
                            width: '50%',
                            stack: [
                                { text: 'Aplicaciones Industriales', style: 'sectionTitle' },
                                {
                                    ul: aplicaciones.length > 0 ? aplicaciones : ['No especificadas'],
                                    color: '#4A5568',
                                    fontSize: 11
                                }
                            ]
                        }
                    ]
                },

                // Pie de página aclaratorio
                { text: '\n\n' },
                { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#E2E8F0' }] },
                { 
                    text: 'Aviso Legal: La información contenida en esta ficha técnica es de carácter orientativo y representa promedios analíticos. Los valores exactos "Porcentuales" varían de acuerdo a la capa de extracción en cantera. Solicite un certificado de lote específico con su compra.', 
                    style: 'footerText' 
                }
            ],
            // Definición que corre en todas las páginas (Footer con paginación)
            footer: function(currentPage, pageCount) {
                return {
                    text: currentPage.toString() + ' de ' + pageCount,
                    alignment: 'center',
                    margin: [0, 10, 0, 0],
                    fontSize: 8,
                    color: '#A0AEC0'
                };
            }
        };

        // Generar y descargar el PDF
        const pdfFilename = `Ficha_Tecnica_${mineral.nombre.replace(/\s+/g, '_')}.pdf`;
        pdfMake.createPdf(docDefinition).download(pdfFilename);

    } catch (err) {
        console.error("Error construyendo PDF avanzado:", err);
        alert("Ocurrió un error al ensamblar el documento técnico. Es posible que el navegador haya bloqueado la obtención de la imagen.");
    } finally {
        if(btnPdf) {
            btnPdf.innerHTML = originalText;
            btnPdf.disabled = false;
        }
    }
};
