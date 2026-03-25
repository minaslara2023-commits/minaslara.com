// js/map.js
document.addEventListener('DOMContentLoaded', () => {
    const mapElement = document.getElementById('impact-map');
    
    if (mapElement) {
        // Coordenadas Estado Lara, Venezuela (Aproximadas para visualización)
        const laraCoords = [10.0645, -69.6738];
        
        const map = L.map('impact-map', {
            scrollWheelZoom: false // Para no interrumpir el scroll de la página
        }).setView(laraCoords, 4);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Marcador sede
        const minaIcon = L.divIcon({
            className: 'custom-div-icon',
            html: "<div style='background-color:#C4922A;width:15px;height:15px;border-radius:50%;border:2px solid white;box-shadow:0 0 5px rgba(0,0,0,0.5);'></div>",
            iconSize: [15, 15],
            iconAnchor: [7, 7]
        });

        L.marker(laraCoords, {icon: minaIcon})
            .addTo(map)
            .bindPopup('<b>Minas Lara</b><br>Operaciones principales en Venezuela.')
            .openPopup();
            
        // Marcadores simulando exportaciones
        const exportPoints = [
            {coords: [4.6097, -74.0817], name: "Colombia"},
            {coords: [18.4861, -69.9312], name: "Rep. Dominicana"},
            {coords: [9.9281, -84.0907], name: "Costa Rica"}
        ];

        exportPoints.forEach(point => {
            const expIcon = L.divIcon({
                className: 'custom-div-icon',
                html: "<div style='background-color:#0D2137;width:10px;height:10px;border-radius:50%;border:1px solid white;'></div>",
                iconSize: [10, 10],
                iconAnchor: [5, 5]
            });
            L.marker(point.coords, {icon: expIcon})
                .addTo(map)
                .bindPopup(`<b>Mercado:</b> ${point.name}`);
        });
    }
});
