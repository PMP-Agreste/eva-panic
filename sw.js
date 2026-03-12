const CACHE = 'eva-panico-v3';
const ASSETS = ['/', '/index.html'];

// Domínios que NUNCA devem ser interceptados (Firebase, APIs externas)
const BYPASS = [
  'firestore.googleapis.com',
  'firebase.googleapis.com',
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
  'gstatic.com',
  'googleapis.com',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  // Deixa Firebase e APIs externas passarem direto — sem cache
  const url = new URL(e.request.url);
  if (BYPASS.some(d => url.hostname.includes(d))) return;

  // Para os assets locais: tenta rede primeiro, fallback para cache
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
