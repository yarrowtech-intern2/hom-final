const CACHE_VERSION = "v1";
const ASSET_CACHE = `hom-asset-cache-${CACHE_VERSION}`;
const SHELL_CACHE = `hom-shell-cache-${CACHE_VERSION}`;

const SHELL_ASSETS = ["/", "/index.html"];

const ASSET_PATH_PREFIXES = [
  "/models/",
  "/hdr/",
  "/draco/",
  "/logo/",
  "/icon/",
  "/gallery/",
  "/video/",
];

const ASSET_EXTENSIONS = [
  ".glb",
  ".gltf",
  ".bin",
  ".hdr",
  ".exr",
  ".ktx2",
  ".wasm",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".svg",
  ".avif",
  ".gif",
  ".mp4",
  ".webm",
  ".mp3",
];

function isAssetRequest(url, request) {
  const pathname = url.pathname;
  const byPrefix = ASSET_PATH_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const byExtension = ASSET_EXTENSIONS.some((ext) =>
    pathname.toLowerCase().endsWith(ext)
  );

  return byPrefix || byExtension || request.destination === "image";
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw new Error("Network unavailable and no cached response.");
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== ASSET_CACHE && key !== SHELL_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Cache same-origin 3D/static assets for repeat visits and reloads.
  if (url.origin === self.location.origin && isAssetRequest(url, request)) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }

  // Keep HTML navigations resilient.
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, SHELL_CACHE));
  }
});
