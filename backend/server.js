import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';
import requestLogger from './middleware/logger.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// In-memory store
const store = new Map(); // code -> { longUrl, createdAt, expiry, clicks, clickLog: [] }

function isValidUrl(url) {
  try { new URL(url); return true; } catch { return false; }
}
function isAlphanumeric(str){ return /^[a-zA-Z0-9]+$/.test(str); }

// Create short URL
app.post('/api/shorten', (req, res) => {
  const { longUrl, shortcode, validity } = req.body || {};
  if(!longUrl || !isValidUrl(longUrl)) {
    return res.status(400).json({ error: 'Invalid or missing longUrl' });
  }
  let code = (shortcode || '').trim();
  if(code) {
    if(!isAlphanumeric(code) || code.length < 3 || code.length > 15) {
      return res.status(400).json({ error: 'Invalid shortcode (alphanumeric, 3-15 chars)' });
    }
    if(store.has(code)) {
      return res.status(409).json({ error: 'Shortcode already exists' });
    }
  } else {
    // generate unique
    do { code = nanoid(6); } while(store.has(code));
  }
  const minutes = Number.isFinite(Number(validity)) && Number(validity) > 0 ? Number(validity) : 30;
  const createdAt = Date.now();
  const expiry = createdAt + minutes * 60 * 1000;

  store.set(code, { longUrl, createdAt, expiry, clicks: 0, clickLog: [] });
  return res.json({
    code,
    shortUrl: `http://localhost:3000/${code}`,
    longUrl,
    createdAt,
    expiry
  });
});

// Resolve for client-side redirect
app.get('/api/resolve/:code', (req, res) => {
  const code = req.params.code;
  const entry = store.get(code);
  if(!entry) return res.status(404).json({ error: 'Not found' });
  if(Date.now() > entry.expiry) return res.status(410).json({ error: 'Expired' });
  entry.clicks += 1;
  entry.clickLog.push({
    ts: Date.now(),
    referrer: req.get('referer') || null,
    source: req.get('user-agent') || 'unknown',
    ip: req.ip
  });
  return res.json({ longUrl: entry.longUrl });
});

// Stats all
app.get('/api/stats', (req, res) => {
  const all = Array.from(store.entries()).map(([code, e]) => ({
    code, ...e
  })).sort((a,b)=> b.createdAt - a.createdAt);
  res.json(all);
});

// Stats for single
app.get('/api/stats/:code', (req, res) => {
  const entry = store.get(req.params.code);
  if(!entry) return res.status(404).json({ error: 'Not found' });
  res.json({ code: req.params.code, ...entry });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
