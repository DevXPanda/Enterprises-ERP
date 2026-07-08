// Wages microservice  (represents Sachin's Laravel + MySQL service)
// Runs as an independent process on its own port. The API Gateway talks to it
// over HTTP, so the language/stack behind it does not matter.
//
// Real endpoints Sachin would expose in Laravel:
//   GET /health   GET /workers   GET /summary
// The gateway maps  /api/wages/*  ->  this service.

const http = require('http');
const { workers, summary } = require('./data');

const PORT = process.env.WAGES_PORT || 4001;
const STACK = 'Laravel (PHP) + MySQL  [Sachin]';

function send(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'X-Service': 'wages',
    'X-Stack': STACK,
  });
  res.end(JSON.stringify(payload, null, 2));
}

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === 'GET' && url === '/health')
    return send(res, 200, { status: 'ok', service: 'wages', stack: STACK });

  if (method === 'GET' && url === '/workers')
    return send(res, 200, { service: 'wages', stack: STACK, data: workers });

  if (method === 'GET' && url === '/summary')
    return send(res, 200, { service: 'wages', stack: STACK, data: summary });

  send(res, 404, { error: 'Not found in wages service', path: url });
});

server.listen(PORT, () => {
  console.log(`Wages service [${STACK}] -> http://localhost:${PORT}`);
});
