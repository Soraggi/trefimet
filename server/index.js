const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, '..');
const PUBLIC = ROOT;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

function serveStatic(filePath, res) {
  const ext = path.extname(filePath);
  const type = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 — Arquivo não encontrado');
      return;
    }
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
}

function handleContato(req, res) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
    if (body.length > 1e4) {
      req.destroy();
    }
  });

  req.on('end', () => {
    try {
      const { nome, email, mensagem } = JSON.parse(body);

      if (!nome || !email || !mensagem) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Campos obrigatórios ausentes.' }));
        return;
      }

      const entry = {
        timestamp: new Date().toISOString(),
        nome,
        email,
        mensagem,
      };

      const logDir = path.join(ROOT, 'data');
      const logFile = path.join(logDir, 'contatos.jsonl');

      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');

      console.log(`[contato] ${nome} <${email}>`);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Mensagem recebida! Entraremos em contato em breve.' }));
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'JSON inválido.' }));
    }
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === 'POST' && url.pathname === '/api/contato') {
    handleContato(req, res);
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405);
    res.end();
    return;
  }

  let filePath = path.join(PUBLIC, url.pathname === '/' ? 'index.html' : url.pathname);

  if (!filePath.startsWith(PUBLIC)) {
    res.writeHead(403);
    res.end();
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    serveStatic(filePath, res);
  });
});

server.listen(PORT, () => {
  console.log(`Trefimet rodando em http://localhost:${PORT}`);
});
