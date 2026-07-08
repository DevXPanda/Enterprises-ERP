// Manufacturing microservice  (your MERN service: Node + Express + MongoDB)
// Independent process, own port. The gateway maps  /api/manufacturing/*  -> here.
//
//   GET /health   GET /lines   GET /summary

const http = require('http');
const { lines, summary } = require('./data');

const PORT = process.env.MFG_PORT || 4002;
const STACK = 'MERN (Node + Express + MongoDB)  [You]';

function send(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'X-Service': 'manufacturing',
    'X-Stack': STACK,
  });
  res.end(JSON.stringify(payload, null, 2));
}

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === 'GET' && url === '/health')
    return send(res, 200, { status: 'ok', service: 'manufacturing', stack: STACK });

  if (method === 'GET' && url === '/lines')
    return send(res, 200, { service: 'manufacturing', stack: STACK, data: lines });

  if (method === 'GET' && url === '/summary')
    return send(res, 200, { service: 'manufacturing', stack: STACK, data: summary });

  send(res, 404, { error: 'Not found in manufacturing service', path: url });
});

server.listen(PORT, () => {
  console.log(`Manufacturing service [${STACK}] -> http://localhost:${PORT}`);
});
