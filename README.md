# AI Fashion CRM Dashboard

A premium, AI-powered CRM dashboard built for fashion e-commerce brands. This application features dynamic data analytics, localized currency formatting (₹), customer tracking, inventory data visualization, and an interactive AI prescriptive assistant.

## Tech Stack

- **Frontend**: React.js (Vite), React Router DOM, Recharts, Lucide Icons, Pure CSS (Glassmorphism UI)
- **Backend**: Node.js, Express, RESTful APIs

---

## Getting Started

To run the application locally, you'll need to run both the **backend** and the **frontend** servers simultaneously in two separate terminal windows.

### Prerequisites
- Node.js installed on your machine.

### 1. Start the Backend API Server
The backend provides the mock mock-data and REST endpoints for the dashboard, customers, and product catalogs.

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the server
node server.js
```
*The backend server will run on `http://localhost:3000`.*

### 2. Start the Frontend Application
Open a **new terminal window** and run the following commands to start the React web UI.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
*The frontend application will run on `http://localhost:5173` (or the port specified in your terminal output).*

---

## Features

- **Store Dashboard**: High-level KPIs, Revenue Analytics matching, Traffic Sources tracking, and automated AI insight generation.
- **Customer Directory**: Track Churn Risk, overall LTV (Lifetime Value), and add new customer entries directly to the directory. Includes a dedicated customer profile page.
- **Product Operations**: Interactive time-series performance charts tracking units sold against total revenue. Instantly add new products or search active inventory.
- **AI Integration**: A sleek AI Chat panel integrated directly into the navbar providing automated win-back campaign strategies.
- **Data Exporting**: Export structured Data URI JSON and CSV reports out of any data table on the platform.
