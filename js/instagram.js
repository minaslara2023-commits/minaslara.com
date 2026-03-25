// js/instagram.js
document.addEventListener('DOMContentLoaded', () => {
    const feed = document.getElementById('instagram-feed');
    if (!feed) return;

    // Mock data for Instagram posts
    // In a real scenario, this would come from an API or a static JSON
    const posts = [
        {
            id: 1,
            image: 'img/instagram/foto-1.jpg',
            caption: 'Nuestras operaciones en la cantera principal. Seguros y eficientes.',
            likes: 124
        },
        {
            id: 2,
            image: 'img/instagram/foto-2.jpg',
            caption: 'Procesamiento de agregados para la industria de la construcción.',
            likes: 89
        },
        {
            id: 3,
            image: 'img/instagram/foto-3.jpg',
            caption: 'Control de calidad riguroso en cada lote extraído.',
            likes: 156
        },
        {
            id: 4,
            image: 'img/instagram/foto-4.jpg',
            caption: 'Impacto social: Jornada de salud en comunidades aledañas.',
            likes: 210
        },
        {
            id: 5,
            image: 'img/instagram/foto-5.jpg',
            caption: 'Maquinaria pesada lista para el despacho nacional.',
            likes: 75
        },
        {
            id: 6,
            image: 'img/instagram/foto-6.jpg',
            caption: 'Nuestra flota aliada garantizando logística oportuna.',
            likes: 112
        }
    ];

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('instagram-post');
        postElement.innerHTML = `
            <div class="insta-img-wrapper">
                <img src="${post.image}" alt="Post de Instagram" loading="lazy">
                <div class="insta-overlay">
                    <div class="insta-stats">
                        <span><i data-lucide="heart"></i> ${post.likes}</span>
                        <i data-lucide="instagram"></i>
                    </div>
                </div>
            </div>
        `;
        feed.appendChild(postElement);
    });

    // Re-initialize Lucide icons for the new elements
    if (window.lucide) {
        window.lucide.createIcons();
    }
});
