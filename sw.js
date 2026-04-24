// ── Service Worker — Cola Digital Push Notifications ──────────────
// Este archivo debe estar en la RAÍZ del repositorio GitHub Pages
// (mismo nivel que index.html, no dentro de /cola/)

self.addEventListener('push', function(event) {
  if (!event.data) return;

  var data  = {};
  try { data = event.data.json(); } catch(e) { data = { title: 'Cola Digital', body: event.data.text() }; }

  var title   = data.title || 'La Taberna del Sur';
  var options = {
    body:    data.body    || 'Es tu turno.',
    icon:    data.icon    || '/democarta/cola/icon-192.png',
    badge:   data.badge   || '/democarta/cola/icon-192.png',
    tag:     'cola-turno',
    renotify: true,
    requireInteraction: true,
    vibrate: [400, 200, 400, 200, 400],
    data:    { url: data.url || '/democarta/cola/Cliente.html' },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.includes('Cliente') && 'focus' in list[i]) {
          return list[i].focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});

self.addEventListener('install',  function() { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(clients.claim()); });