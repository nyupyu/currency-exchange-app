import axios from 'axios';
import { ApiResponse, CurrencyRate, HistoricalRate, Currency, CsvExportRequest, CsvExportResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
});

// Request interceptor for logging
api.interceptors.request.use(config => {
	console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
	return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
	response => response,
	error => {
		console.error('🚨 API Error:', error);
		return Promise.reject(error);
	},
);

export const currencyApi = {
	// Get current exchange rates
	getCurrentRates: async (): Promise<CurrencyRate[]> => {
		const response = await api.get<ApiResponse<CurrencyRate[]>>('/currency/current');
		return response.data.data || [];
	},

	// Get available currencies
	getCurrencies: async (): Promise<Currency[]> => {
		const response = await api.get<ApiResponse<Currency[]>>('/currency/currencies');
		return response.data.data || [];
	},

	// Get historical rate for specific date
	getHistoricalRate: async (code: string, date: string): Promise<HistoricalRate> => {
		const response = await api.get<ApiResponse<HistoricalRate>>(`/currency/historical/${code}/${date}`);
		if (!response.data.data) {
			throw new Error(response.data.message || 'No data found');
		}
		return response.data.data;
	},

	// Get historical rates for date range
	getHistoricalRates: async (code: string, startDate: string, endDate: string): Promise<HistoricalRate[]> => {
		const response = await api.get<ApiResponse<HistoricalRate[]>>(`/currency/range/${code}/${startDate}/${endDate}`);
		return response.data.data || [];
	},

	// Export to CSV
	exportCsv: async (request: CsvExportRequest): Promise<CsvExportResponse> => {
		const response = await api.post<ApiResponse<CsvExportResponse>>('/currency/export-csv', request);
		if (!response.data.data) {
			throw new Error(response.data.message || 'Export failed');
		}
		return response.data.data;
	},

	// Download CSV file
	downloadCsv: async (filename: string): Promise<void> => {
		const response = await api.get(`/currency/download/${filename}`, {
			responseType: 'blob',
		});

		// Create download link
		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', filename);
		document.body.appendChild(link);
		link.click();
		link.remove();
		window.URL.revokeObjectURL(url);
	},
};

export default api;
