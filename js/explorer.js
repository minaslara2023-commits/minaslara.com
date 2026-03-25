// js/explorer.js
document.addEventListener('DOMContentLoaded', () => {
    const explorerMenu = document.getElementById('explorer-menu');
    const expTitle = document.getElementById('exp-title');
    const expCategory = document.getElementById('exp-category');
    const expDesc = document.getElementById('exp-desc');
    const expIndustries = document.getElementById('exp-industries');
    const chartCanvas = document.getElementById('usage-chart');
    
    let explorerMinerals = [];
    let usageChart = null;

    if(explorerMenu && chartCanvas) {
        // Cargar directamente del objeto global (data.js) para evitar problemas si se abre con doble clic localmente
        explorerMinerals = window.mineralsData || [];
        initExplorer();
    }

    function initExplorer() {
        explorerMinerals.forEach((mineral, index) => {
            const btn = document.createElement('button');
            btn.className = 'exp-menu-btn';
            btn.textContent = mineral.nombre;
            btn.onclick = () => selectMineral(mineral, btn);
            explorerMenu.appendChild(btn);

            if(index === 0) {
                // Seleccionar el primero por defecto
                selectMineral(mineral, btn);
            }
        });
    }

    function getIconForIndustry(ind) {
        const icons = {
            'Construcción': 'building',
            'Industria': 'factory',
            'Agricultura': 'leaf',
            'Metalurgia': 'anvil',
            'Vidrio': 'glass-water',
            'Electrónica': 'cpu',
            'Papel': 'scroll-text',
            'Cerámica': 'coffee',
            'Pinturas': 'paint-bucket',
            'Plásticos': 'box',
            'Alimentos': 'utensils'
        };
        return icons[ind] || 'check-circle';
    }

    function selectMineral(mineral, btnElement) {
        // Actualizar UI botones
        document.querySelectorAll('.exp-menu-btn').forEach(b => b.classList.remove('active'));
        if(btnElement) btnElement.classList.add('active');

        // Textos
        expTitle.textContent = mineral.nombre;
        expCategory.textContent = mineral.categoria;
        expDesc.textContent = mineral.descripcion;

        // Industrias
        expIndustries.innerHTML = mineral.industrias.map(ind => `
            <div class="industry-badge">
                <i data-lucide="${getIconForIndustry(ind)}"></i> ${ind}
            </div>
        `).join('');
        
        if(window.lucide) {
            lucide.createIcons({root: expIndustries});
        }

        updateChart(mineral);
    }

    function updateChart(mineral) {
        const ctx = chartCanvas.getContext('2d');
        
        // Simular datos de distribución según el mineral
        let labels = mineral.industrias;
        let data = [];
        
        // Distribuir 100% aleatoriamente
        let remaining = 100;
        for(let i=0; i<labels.length - 1; i++) {
            let val = Math.floor(Math.random() * (remaining - 10)) + 10; // entre 10 y lo que quede
            data.push(val);
            remaining -= val;
        }
        data.push(remaining);

        if(usageChart) {
            usageChart.destroy();
        }

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const darkColors = ['#FAD02C', '#F39C12', '#3498DB', '#9B59B6', '#1ABC9C'];
        const lightColors = ['#0D2137', '#C4922A', '#4A5568', '#718096', '#A0AEC0'];

        usageChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: isDark ? darkColors : lightColors,
                    borderWidth: 2,
                    borderColor: isDark ? '#0D1B2A' : '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#CBD5E0' : '#4A5568',
                            font: { family: "'Source Sans 3', sans-serif" }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    window.updateExplorerChartTheme = (theme) => {
        if (usageChart) {
            const isDark = theme === 'dark';
            const textColor = isDark ? '#CBD5E0' : '#4A5568';
            const borderColor = isDark ? '#0D1B2A' : '#ffffff';
            const darkColors = ['#FAD02C', '#F39C12', '#3498DB', '#9B59B6', '#1ABC9C'];
            const lightColors = ['#0D2137', '#C4922A', '#4A5568', '#718096', '#A0AEC0'];
            
            usageChart.options.plugins.legend.labels.color = textColor;
            usageChart.data.datasets[0].borderColor = borderColor;
            usageChart.data.datasets[0].backgroundColor = isDark ? darkColors : lightColors;
            usageChart.update();
        }
    };
});
