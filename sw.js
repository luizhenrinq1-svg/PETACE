const CACHE_NAME = 'pet-ace-quiz-v1';

// Lista de ficheiros a serem guardados no telemóvel para funcionar offline
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap'
];

// Instalação: O navegador baixa e guarda os ficheiros
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Ativação: Limpeza de caches antigos caso atualize o jogo no futuro
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Interceptação: Responde com o ficheiro guardado se estiver sem internet (Offline-first)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});
