// js/materials.js
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('materials-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('mineral-search');
    const modal = document.getElementById('mineral-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close-modal');
    
    let allMinerals = [];

    // Cargar directamente del objeto global (data.js) para evitar problemas si se abre con doble clic localmente
    allMinerals = window.mineralsData || [];
    renderGrid(allMinerals);

    function getPlaceholderImage(id) {
        // Asignamos una imagen diferente de unsplash según el id
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
        return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=400&h=300`;
    }

    function renderGrid(minerals) {
        if(!grid) return;
        grid.innerHTML = '';
        if(minerals.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No se encontraron minerales.</p>';
            return;
        }

        minerals.forEach((mineral, index) => {
            const card = document.createElement('div');
            card.className = 'material-card fade-in';
            card.style.animationDelay = `${index * 50}ms`;
            card.innerHTML = `
                <div class="mc-img">
                    <span class="mc-badge">${mineral.categoria}</span>
                    <img src="${mineral.imagen || getPlaceholderImage(mineral.id)}" onerror="this.onerror=null;this.src='${getPlaceholderImage(mineral.id)}'" alt="${mineral.nombre}" loading="lazy">
                </div>
                <div class="mc-content">
                    <h3>${mineral.nombre}</h3>
                    <p>${mineral.descripcion}</p>
                    <div class="mc-actions">
                        <button class="btn btn-sm btn-outline btn-view">Ver detalles</button>
                        <button class="btn btn-sm btn-primary btn-quote">Cotizar</button>
                    </div>
                </div>
            `;
            
            card.querySelector('.btn-view').addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(mineral);
            });
            card.querySelector('.btn-quote').addEventListener('click', (e) => {
                e.stopPropagation();
                window.location.href = '#contacto';
            });
            card.addEventListener('click', () => openModal(mineral));
            grid.appendChild(card);
        });
    }

    // Filtros
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-filter');
            filterMinerals(category, searchInput ? searchInput.value : '');
        });
    });

    // Búsqueda
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            filterMinerals(activeCategory, searchTerm);
        });
    }

    function filterMinerals(category, searchTerm) {
        let filtered = allMinerals;
        
        if (category !== 'all') {
            filtered = filtered.filter(m => m.categoria === category);
        }
        
        if (searchTerm) {
            filtered = filtered.filter(m => 
                m.nombre.toLowerCase().includes(searchTerm) || 
                m.descripcion.toLowerCase().includes(searchTerm)
            );
        }
        
        renderGrid(filtered);
    }

    // Modal
    function openModal(mineral) {
        if(!modal) return;
        
        const industriesTags = mineral.industrias.map(ind => `<span class="modal-tag">${ind}</span>`).join('');
        const benefitsList = (mineral.beneficios || []).map(b => `<li><i data-lucide="check-circle-2"></i> ${b}</li>`).join('');
        const appsList = (mineral.aplicaciones || []).map(a => `<li><i data-lucide="arrow-right-circle"></i> ${a}</li>`).join('');
        
        modalBody.innerHTML = `
            <div class="modal-body-content">
                <div class="modal-img">
                    <img src="${mineral.imagen || getPlaceholderImage(mineral.id).replace('w=400&h=300', 'w=600')}" onerror="this.onerror=null;this.src='${getPlaceholderImage(mineral.id).replace('w=400&h=300', 'w=600')}'" alt="${mineral.nombre}">
                </div>
                <div class="modal-info">
                    <div class="modal-header-info">
                        <h2>${mineral.nombre}</h2>
                        <span class="modal-category">${mineral.categoria}</span>
                    </div>
                    <p class="modal-desc">${mineral.descripcion}</p>
                    
                    <div class="modal-grid">
                        <div class="modal-column">
                            <h4><i data-lucide="award"></i> Beneficios para el Cliente</h4>
                            <ul class="modal-list benefits-list">
                                ${benefitsList}
                            </ul>
                        </div>
                        <div class="modal-column">
                            <h4><i data-lucide="settings"></i> Aplicaciones Industriales</h4>
                            <ul class="modal-list apps-list">
                                ${appsList}
                            </ul>
                        </div>
                    </div>
                    
                    <table class="modal-table">
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
                    
                    <div class="modal-cta-group">
                        <button class="btn btn-primary btn-cta-quote" onclick="location.href='#contacto'; document.getElementById('mineral-modal').classList.remove('active'); document.body.style.overflow = '';">
                            <i data-lucide="shopping-cart"></i> Solicitar Cotización Inmediata
                        </button>
                        <button class="btn btn-outline btn-cta-pdf">
                            <i data-lucide="download"></i> Descargar Ficha Técnica PDF
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Reinicializar iconos dentro del modal
        if(window.lucide) {
            lucide.createIcons({
                root: modalBody
            });
        }
        
        // Listener para generar PDF
        const btnPdf = modalBody.querySelector('.btn-cta-pdf');
        if(btnPdf) {
            btnPdf.addEventListener('click', () => {
                if(window.downloadMineralPDF) {
                    window.downloadMineralPDF(mineral);
                } else {
                    alert("La funcionalidad de PDF aún está cargando o no está disponible en este momento.");
                }
            });
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
    }

    if(closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Cerrar al hacer click fuera
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Cerrar con Escape
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});
