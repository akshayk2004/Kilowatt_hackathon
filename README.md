# Mobile CRM AI App

A modern, AI-powered CRM dashboard for fashion e-commerce brands built with React Native (Expo) and Node.js.

## Features
- **Dashboard**: High-level KPI tracking (revenue, customers, risk).
- **Customers**: List view, search, and intelligent filtering of WooCommerce-style data.
- **AI Insights**: Churn risk prediction and proactive business recommendations.
- **AI Assistant**: Conversational UI to query business data (e.g., "Show risky customers").
- **Dark Mode UI**: Clean, minimalistic, sleek SaaS design.

## Project Structure
- `/backend`: Node.js + Express API providing mock data and static rule-based AI recommendations.
- `/mobile`: React Native (Expo) app handling all UI/UX.

## How to Run

### 1. Start Backend
```bash
cd backend
npm install
node server.js
```
The backend will run on `http://localhost:3000`.

### 2. Start Mobile App
```bash
cd mobile
npm install
npx expo start
```
Press `w` to run on web, or use the Expo app on your phone to scan the QR code.

Note: By default `services/api.js` connects to `10.0.2.2:3000` (Android emulator) or `localhost:3000` (Web/iOS). Adjust if testing on physical devices.
