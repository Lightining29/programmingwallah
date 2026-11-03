// ==============================================================================
// Hostinger Node.js Universal Entry Point (CommonJS + ES Module Bridge)
// Compatible with:
//  - Phusion Passenger (CloudLinux / cPanel / LiteSpeed)
//  - Direct node server.js / node app.js
//  - Hostinger hPanel Node.js Application Manager
// ==============================================================================

let appInstance = null;
let initError = null;
let isImporting = false;

async function loadBackend() {
  if (appInstance || isImporting) return;
  isImporting = true;
  try {
    const backend = await import('./backend/server.js');
    appInstance = backend.default || backend;
    initError = null;
    console.log('[Server Startup]: Backend initialized successfully.');
  } catch (err) {
    initError = err;
    console.error('[Hostinger Startup Error]:', err.message || err);
  } finally {
    isImporting = false;
  }
}

// Start loading backend immediately
loadBackend();

const sendFallbackResponse = (req, res, statusCode, htmlMsg, jsonMsg) => {
  if (res.headersSent) return;
  const isApi = req.url && (req.url.startsWith('/api') || (req.headers.accept && req.headers.accept.includes('application/json')));
  if (isApi) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: false, message: jsonMsg }));
  } else {
    res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<h1>${statusCode} Service Unavailable</h1><p>${htmlMsg}</p>`);
  }
};

const handler = (req, res) => {
  if (appInstance) {
    return appInstance(req, res);
  }

  // If there was an error previously, retry loading backend
  if (initError && !isImporting) {
    loadBackend();
  }

  let attempts = 0;
  const maxAttempts = 300; // 15 seconds max (300 * 50ms)
  const timer = setInterval(() => {
    attempts++;
    if (appInstance) {
      clearInterval(timer);
      return appInstance(req, res);
    }
    if (attempts >= maxAttempts) {
      clearInterval(timer);
      sendFallbackResponse(
        req,
        res,
        503,
        'Server initialization in progress. Please refresh in a few moments.',
        'Server is starting up. Please try again shortly.'
      );
    }
  }, 50);
};

module.exports = handler;
