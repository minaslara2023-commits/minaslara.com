// js/charts.js

// =========================================================================
// CONFIGURACIÓN DE DATOS DEL GRÁFICO (CRECIMIENTO SOSTENIDO)
// ¡Puedes editar estos valores cuando lo necesites!
// =========================================================================
const IMPACT_CHART_CONFIG = {
    // 1. LOS AÑOS (Eje Horizontal) - 7 años
    labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    
    // 2. LOS DATOS REALES
    datasets: [
        {
            label: 'Producción Total (m³)', 
            data: [23600, 37170, 80104, 123072, 248300, 269163, 391639, 417877],
            backgroundColor: '#C4922A', // Color de las barras (Dorado)
            borderRadius: 4
        }
    ]
};
// =========================================================================

let impactChart = null;

document.addEventListener('DOMContentLoaded', () => {
    const chartElement = document.getElementById('impact-chart');
    
    if (chartElement) {
        const ctx = chartElement.getContext('2d');
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        const isDark = theme === 'dark';
        const textColor = isDark ? '#CBD5E0' : '#4A5568';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const barColor = isDark ? '#FAD02C' : '#C4922A';
        
        impactChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: IMPACT_CHART_CONFIG.labels,
                datasets: [{
                    ...IMPACT_CHART_CONFIG.datasets[0],
                    backgroundColor: barColor
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: textColor,
                            font: {
                                family: "'Source Sans 3', sans-serif"
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: textColor },
                        grid: { color: gridColor }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: textColor },
                        grid: { color: gridColor }
                    }
                }
            }
        });
    }
});

window.updateChartsTheme = (theme) => {
    const isDark = theme === 'dark';
    const textColor = isDark ? '#CBD5E0' : '#4A5568';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const barColor = isDark ? '#FAD02C' : '#C4922A';

    if (impactChart) {
        impactChart.options.plugins.legend.labels.color = textColor;
        impactChart.options.scales.x.ticks.color = textColor;
        impactChart.options.scales.x.grid.color = gridColor;
        impactChart.options.scales.y.ticks.color = textColor;
        impactChart.options.scales.y.grid.color = gridColor;
        impactChart.data.datasets[0].backgroundColor = barColor;
        impactChart.update();
    }
    
    // Also notify explorer if it exists
    if (typeof updateExplorerChartTheme === 'function') {
        updateExplorerChartTheme(theme);
    }
};
