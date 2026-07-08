// ============================================================================
//  NEP API GATEWAY
//  One entry point. Routes requests to the right microservice and serves the
//  single frontend. The frontend only ever talks to this gateway, so it does
//  not know (or care) that wages is Laravel and manufacturing is MERN.
//
//    /                          -> frontend/index.html   (the one UI)
//    /api/wages/*               -> wages service          (Sachin / Laravel)
//    /api/manufacturing/*       -> manufacturing service  (You / MERN)
//    /api/health                -> aggregated health of all services
// ============================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.GATEWAY_PORT || 8080;

// Change these URLs to point at the real services (e.g. Sachin's Laravel host).
const SERVICES = {
  '/api/wages': process.env.WAGES_URL || 'http://localhost:4001',
  '/api/manufacturing': process.env.MFG_URL || 'http://localhost:4002',
};

const FRONTEND = path.join(__dirname, '..', 'frontend', 'index.html');

async function proxy(req, res, prefix, target) {
  const downstreamPath = req.url.slice(prefix.length) || '/';
  try {
    const upstream = await fetch(target + downstreamPath, { method: req.method });
    const body = await upstream.text();
    res.writeHead(upstream.status, {
      'Content-Type': upstream.headers.get('content-type') || 'application/json',
      'X-Gateway-Route': `${prefix} -> ${target}`,
    });
    res.end(body);
  } catch (err) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Downstream service unavailable', service: target, detail: err.message }));
  }
}

const server = http.createServer(async (req, res) => {
  const url = req.url;

  // Gateway aggregates health from every service in one call.
  if (url === '/api/health') {
    const services = {};
    for (const [prefix, target] of Object.entries(SERVICES)) {
      try {
        const r = await fetch(target + '/health');
        services[prefix] = await r.json();
      } catch (err) {
        services[prefix] = { status: 'down', target, error: err.message };
      }
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ gateway: 'ok', services }, null, 2));
  }

  // Route /api/* to the matching microservice.
  for (const [prefix, target] of Object.entries(SERVICES)) {
    if (url.startsWith(prefix)) return proxy(req, res, prefix, target);
  }

  // Everything else = serve the single frontend.
  if (url === '/' || url === '/index.html') {
    return fs.readFile(FRONTEND, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('frontend/index.html not found');
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Unknown route', path: url }));
});

server.listen(PORT, () => {
  console.log(`\nAPI Gateway -> http://localhost:${PORT}`);
  console.log(`   /                       -> frontend/index.html (one UI)`);
  console.log(`   /api/wages/*            -> ${SERVICES['/api/wages']}   (Sachin / Laravel)`);
  console.log(`   /api/manufacturing/*    -> ${SERVICES['/api/manufacturing']}   (You / MERN)`);
  console.log(`\n   Open http://localhost:${PORT} in your browser.\n`);
});
