# URL Shortener (Frontend + Backend)

## Requirements Coverage
- React app on **http://localhost:3000** (Vite server port configured).
- Uses **Material UI** for styling.
- **Logging Middleware** used on backend and custom logger used in frontend utilities.
- Short link **uniqueness** ensured; **default validity = 30 minutes** when not provided.
- **Custom shortcodes** supported with validation.
- **Redirection** handled on client route `/:code` calling backend `/api/resolve/:code` and navigating.
- **Statistics page** listing short links, expiry, and click analytics (timestamp + user-agent recorded).

## Run
### Backend
```bash
cd backend
npm install
npm run dev
```
Runs at http://localhost:5000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:3000

## API Endpoints
- POST `/api/shorten` { longUrl, shortcode?, validity?Minutes }
- GET  `/api/resolve/:code` → { longUrl } (increments click + log)
- GET  `/api/stats` → list of all
- GET  `/api/stats/:code` → single
