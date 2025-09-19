# WebVital Monitor Frontend Setup

This React app provides the WebVital Monitor frontend UI. It uses Tailwind CSS, Headless UI, React Router, and Chart.js (with react-chartjs-2) for dashboards.

## Getting Started

1. Copy `.env.example` to `.env` and set values:

- REACT_APP_API_BASE_URL: Backend API base URL (e.g., http://localhost:8080)
- REACT_APP_SITE_URL: Site base URL

2. Install dependencies:

- npm install

3. Run the app:

- npm start

4. Build for production:

- npm run build

## Authentication

- Email/password via POST /api/v1/auth/login and /api/v1/auth/register.
- Access token is stored in localStorage and attached as Bearer token for API calls.
- Token refresh handled via POST /api/v1/auth/refresh interceptor.

## Routes

- /login, /register
- /onboarding
- / (Dashboard)
- /websites
- /preferences
- /agencies
- /notes/:websiteId
- /reports
- /account
- /billing

## Styling

- Tailwind CSS + Headless UI.
- Global styles configured in `tailwind.config.js` and `postcss.config.js`.

## Charts

- react-chartjs-2 over Chart.js for LCP/CLS/Uptime visualization.

## Reporting

- Server-side PDF download via GET /api/v1/websites/:id/report.pdf
- Client-side fallback export using jsPDF and jspdf-autotable.
