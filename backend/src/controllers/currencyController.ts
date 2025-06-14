import { Request, Response } from 'express';
import nbpService from '../services/nbpService';
import csvService from '../services/csvService';
import { ApiResponse, CurrencyRate, HistoricalRate } from '../types';

interface NBPHistoricalResponse {
	table: string;
	currency: string;
	code: string;
	rates: Array<{
		no: string;
		effectiveDate: string;
		mid: number;
	}>;
}

export class CurrencyController {
	/**
	 * GET /api/currency/current
	 * Get current exchange rates
	 */
	async getCurrentRates(req: Request, res: Response): Promise<void> {
		try {
			const rates = await nbpService.getCurrentRates();

			const response: ApiResponse<CurrencyRate[]> = {
				success: true,
				data: rates,
				message: 'Current exchange rates retrieved successfully',
			};

			res.json(response);
		} catch (error) {
			const response: ApiResponse<null> = {
				success: false,
				message: 'Failed to fetch current rates',
				error: error instanceof Error ? error.message : 'Unknown error',
			};

			res.status(500).json(response);
		}
	}

	/**
	 * GET /api/currency/historical/:code/:date
	 * Get historical rate for specific currency and date
	 */
	async getHistoricalRate(req: Request, res: Response): Promise<void> {
		try {
			const { code, date } = req.params;

			const rate = await nbpService.getHistoricalRate(code.toUpperCase(), date);

			const response: ApiResponse<HistoricalRate> = {
				success: true,
				data: rate,
				message: `Historical rate for ${code.toUpperCase()} on ${date} retrieved successfully`,
			};

			res.json(response);
		} catch (error) {
			const response: ApiResponse<null> = {
				success: false,
				message: 'Failed to fetch historical rate',
				error: error instanceof Error ? error.message : 'Unknown error',
			};

			res.status(error instanceof Error && error.message.includes('not found') ? 404 : 500).json(response);
		}
	}

	/**
	 * GET /api/currency/range/:code/:startDate/:endDate
	 * Get historical rates for date range
	 */
	getHistoricalRates = async (req: Request, res: Response): Promise<void> => {
		try {
			const { code, startDate, endDate } = req.params;

			console.log(`Fetching historical rates for ${code} from ${startDate} to ${endDate}`);

			const response = await fetch(`${process.env.NBP_API_URL}/exchangerates/rates/A/${code}/${startDate}/${endDate}/?format=json`);

			console.log(`NBP API Response status: ${response.status}`);

			if (!response.ok) {
				const errorText = await response.text();
				console.log(`NBP API Error response: ${errorText}`);

				res.status(400).json({
					success: false,
					message: `NBP API Error: ${response.status} - ${errorText}`,
				});
				return;
			}

			const data = (await response.json()) as NBPHistoricalResponse;
			console.log(`NBP API returned ${data.rates?.length || 0} rates`);

			res.json({
				success: true,
				data: data.rates,
			});
		} catch (error) {
			console.error('Error fetching historical rates:', error);
			res.status(500).json({
				success: false,
				message: 'Internal server error',
			});
		}
	};

	/**
	 * GET /api/currency/currencies
	 * Get available currencies
	 */
	async getAvailableCurrencies(req: Request, res: Response): Promise<void> {
		try {
			const currencies = await nbpService.getAvailableCurrencies();

			const response: ApiResponse<{ code: string; currency: string }[]> = {
				success: true,
				data: currencies,
				message: 'Available currencies retrieved successfully',
			};

			res.json(response);
		} catch (error) {
			const response: ApiResponse<null> = {
				success: false,
				message: 'Failed to fetch available currencies',
				error: error instanceof Error ? error.message : 'Unknown error',
			};

			res.status(500).json(response);
		}
	}

	/**
	 * POST /api/currency/export-csv
	 * Export historical rates to CSV
	 */
	async exportToCsv(req: Request, res: Response): Promise<void> {
		try {
			const { currencyCode, startDate, endDate, filename } = req.body;

			// Get historical rates
			const rates = await nbpService.getHistoricalRates(currencyCode.toUpperCase(), startDate, endDate);

			// Get currency name
			const currencies = await nbpService.getAvailableCurrencies();
			const currency = currencies.find(c => c.code === currencyCode.toUpperCase());
			const currencyName = currency?.currency || currencyCode.toUpperCase();

			// Export to CSV
			const result = await csvService.exportToCsv(rates, currencyCode.toUpperCase(), currencyName, startDate, endDate, filename);

			const response: ApiResponse<{
				filename: string;
				recordCount: number;
				downloadUrl: string;
			}> = {
				success: true,
				data: {
					filename: result.filename,
					recordCount: result.recordCount,
					downloadUrl: `/api/currency/download/${result.filename}`,
				},
				message: 'CSV export completed successfully',
			};

			res.json(response);
		} catch (error) {
			const response: ApiResponse<null> = {
				success: false,
				message: 'Failed to export CSV',
				error: error instanceof Error ? error.message : 'Unknown error',
			};

			res.status(500).json(response);
		}
	}

	/**
	 * GET /api/currency/download/:filename
	 * Download CSV file
	 */
	async downloadCsv(req: Request, res: Response): Promise<void> {
		try {
			const { filename } = req.params;

			const result = await csvService.getFileForDownload(filename);

			if (!result.exists) {
				const response: ApiResponse<null> = {
					success: false,
					message: 'File not found',
				};

				res.status(404).json(response);
				return;
			}

			// Set headers for file download
			res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
			res.setHeader('Content-Type', 'text/csv');

			// Send file
			res.sendFile(result.filePath);
		} catch (error) {
			const response: ApiResponse<null> = {
				success: false,
				message: 'Failed to download file',
				error: error instanceof Error ? error.message : 'Unknown error',
			};

			res.status(500).json(response);
		}
	}
}

export default new CurrencyController();
