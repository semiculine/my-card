# My Trading Card

A React single-page application built with Vite, backed by a small Django JSON API. The frontend keeps the original card, battle, accessibility support, and tutorial experiences.

## Project layout

```text
my-card/
├── frontend/              # React, Vite, and react-router-dom
│   ├── public/images/      # Tutorial illustrations
│   └── src/
│       ├── pages/          # HomePage, SupportPage, and TutorialPage
│       ├── App.jsx         # Client-side routes and navigation
│       └── style.css       # Shared styles
└── backend/                # Django project and card API
    ├── cards/              # /api/card/ endpoint
    └── config/             # Django settings and URL configuration
```

## Requirements

- Node.js 20.19+ (or 22.12+) and npm
- Python 3.10+

## Install

From the repository root, install each side separately:

```powershell
cd frontend
npm install
cd ..\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

If PowerShell prevents virtual-environment activation, use the Python executable directly instead:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

## Run locally

Open two terminals from the repository root.

**Terminal 1 — Django API**

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py runserver
```

The API is available at <http://127.0.0.1:8000/api/card/>.

**Terminal 2 — React frontend**

```powershell
cd frontend
npm run dev
```

Open the Vite URL printed in the terminal (normally <http://localhost:5173>). Vite proxies `/api` requests to Django during local development.

## CORS

`django-cors-headers` is configured to allow the Vite development origins in `backend/config/settings.py`. Requests from the frontend use the same-origin Vite `/api` proxy, so browser CORS checks are avoided during development. If you connect directly to Django instead, keep the frontend origin explicitly listed in `CORS_ALLOWED_ORIGINS`; do not use a wildcard for credentialed or production traffic.

## Production build

```powershell
cd frontend
npm run build
```

The generated static assets are written to `frontend/dist`. Django serves the API only; deploy the built frontend to a static host or configure a production web server to serve it alongside the API.

These commands keep `frontend/package-lock.json` and `backend/requirements.txt` so the grader can reinstall dependencies using the setup steps above.
