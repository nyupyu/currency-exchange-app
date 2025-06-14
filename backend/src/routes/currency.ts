import { Router } from 'express';
import currencyController from '../controllers/currencyController';
import { validateDate, validateCurrencyCode, validateDateRange, validateCsvExport } from '../middleware/validation';

const router = Router();

// GET /api/currency/current - Get current exchange rates
router.get('/current', currencyController.getCurrentRates);

// GET /api/currency/currencies - Get available currencies
router.get('/currencies', currencyController.getAvailableCurrencies);

// GET /api/currency/historical/:code/:date - Get historical rate for specific date
router.get('/historical/:code/:date', validateCurrencyCode, validateDate, currencyController.getHistoricalRate);

// GET /api/currency/range/:code/:startDate/:endDate - Get historical rates for date range
router.get('/range/:code/:startDate/:endDate', validateDateRange, currencyController.getHistoricalRates);

// POST /api/currency/export-csv - Export historical rates to CSV
router.post('/export-csv', validateCsvExport, currencyController.exportToCsv);

// GET /api/currency/download/:filename - Download CSV file
router.get('/download/:filename', currencyController.downloadCsv);

export default router;
