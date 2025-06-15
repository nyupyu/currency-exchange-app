# 📊 Currency Exchange App

Full-stack currency exchange application with real-time Polish National Bank (NBP) API integration, featuring interactive charts and historical data analysis.

## 🌐 Live Demo

**🚀 [Try the application here](https://oki.dev/app/currency-exchange-app)**

## 🚀 Features

- 📈 **Real-time Exchange Rates** - Live currency data from NBP API
- 📊 **Interactive Charts** - Historical rate visualization with Recharts
- 📅 **Flexible Date Ranges** - 1D, 1W, 1M, 1Y, and custom date ranges
- 💱 **Multiple Currencies** - Support for major world currencies
- 📱 **Responsive Design** - Mobile-first approach with TailwindCSS
- ⚡ **Fast Performance** - Vite bundler with React Query caching
- 🛡️ **Production Ready** - Rate limiting, CORS, compression, security headers

## 🔮 Planned Features

- 📤 **CSV Export** - Export historical data for custom date ranges to CSV format

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **React Query** - Server state management & caching
- **React Router** - Client-side routing
- **Recharts** - Interactive chart library
- **Lucide React** - Beautiful icon set
- **React Hook Form** - Form validation
- **Date-fns** - Date manipulation utilities

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **Joi** - Data validation
- **Axios** - HTTP client for NBP API
- **CSV Writer** - Data export functionality
- **Morgan** - HTTP request logger
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

### Development Tools

- **Concurrently** - Run multiple scripts simultaneously
- **ESLint** - Code linting
- **Nodemon** - Development server auto-restart
- **Jest** - Testing framework
- **Workspaces** - Monorepo management


## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### 1. Download & Install

Download the project:
```bash
git clone https://github.com/nyupyu/currency-exchange-app.git
cd currency-exchange-app
npm install
```
### 2. Environment Setup

Create environment files:

Frontend (.env.local):
VITE_API_URL=http://localhost:5000/api/currency
VITE_BASE_PATH=/

Backend (.env):
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

### 3. Run Development Server

npm run dev

This will start:
- Backend API server on http://localhost:5000
- Frontend development server on http://localhost:5173

### 4. Open Application

Open your browser: http://localhost:5173

## 🔧 Available Scripts

### Root Level
npm install          # Install all dependencies
npm run dev          # Start development servers
npm run build        # Build both frontend and backend

### Frontend
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build

### Backend  
npm run dev          # Start with nodemon
npm run build        # Compile TypeScript
npm start            # Start production server

### Production  
- Frontend: Static files served by OpenLiteSpeed
- Backend: Node.js process managed by PM2


