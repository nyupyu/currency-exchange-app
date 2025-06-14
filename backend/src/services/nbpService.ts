import axios, { AxiosResponse } from 'axios';
import { CurrencyRate, CurrencyTableResponse, CurrencyData, HistoricalRate } from '../types';

const NBP_BASE_URL = process.env.NBP_API_URL || 'https://api.nbp.pl/api';

class NBPService {
	private axiosInstance;

	constructor() {
		this.axiosInstance = axios.create({
			baseURL: NBP_BASE_URL,
			timeout: 10000,
			headers: {
				'Accept': 'application/json',
				'User-Agent': 'CurrencyExchangeApp/1.0',
			},
		});

		// Request interceptor for logging
		this.axiosInstance.interceptors.request.use(
			config => {
				console.log(`NBP API Request: ${config.method?.toUpperCase()} ${config.url}`);
				return config;
			},
			error => Promise.reject(error),
		);

		// Response interceptor for error handling
		this.axiosInstance.interceptors.response.use(
			response => response,
			error => {
				console.error('NBP API Error:', error.response?.status, error.response?.data || error.message);
				throw new Error(`NBP API Error: ${error.response?.status || 'Connection failed'}`);
			},
		);
	}

	/**
	 * Get current exchange rates for all currencies
	 */
	async getCurrentRates(): Promise<CurrencyRate[]> {
		try {
			const response: AxiosResponse<CurrencyTableResponse[]> = await this.axiosInstance.get('/exchangerates/tables/A');

			if (!response.data || response.data.length === 0) {
				throw new Error('No current rates available');
			}

			return response.data[0].rates;
		} catch (error) {
			console.error('Error fetching current rates:', error);
			throw error;
		}
	}

	/**
	 * Get historical rate for specific currency and date
	 */
	async getHistoricalRate(currencyCode: string, date: string): Promise<HistoricalRate> {
		try {
			const response: AxiosResponse<CurrencyData> = await this.axiosInstance.get(`/exchangerates/rates/A/${currencyCode}/${date}`);

			if (!response.data?.rates || response.data.rates.length === 0) {
				throw new Error(`No rate available for ${currencyCode} on ${date}`);
			}

			return response.data.rates[0];
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.status === 404) {
				throw new Error(`Currency ${currencyCode} not found or no data available for ${date}`);
			}
			console.error('Error fetching historical rate:', error);
			throw error;
		}
	}

	/**
	 * Get historical rates for date range
	 */
	async getHistoricalRates(currencyCode: string, startDate: string, endDate: string): Promise<HistoricalRate[]> {
		try {
			const response: AxiosResponse<CurrencyData> = await this.axiosInstance.get(`/exchangerates/rates/A/${currencyCode}/${startDate}/${endDate}`);

			if (!response.data?.rates || response.data.rates.length === 0) {
				throw new Error(`No rates available for ${currencyCode} between ${startDate} and ${endDate}`);
			}

			return response.data.rates;
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.status === 404) {
				throw new Error(`Currency ${currencyCode} not found or no data available for specified date range`);
			}
			console.error('Error fetching historical rates:', error);
			throw error;
		}
	}

	/**
	 * Get available currencies
	 */
	async getAvailableCurrencies(): Promise<{ code: string; currency: string }[]> {
		try {
			const response: AxiosResponse<CurrencyTableResponse[]> = await this.axiosInstance.get('/exchangerates/tables/A');

			if (!response.data || response.data.length === 0) {
				throw new Error('No currencies available');
			}

			return response.data[0].rates.map(rate => ({
				code: rate.code,
				currency: rate.currency,
			}));
		} catch (error) {
			console.error('Error fetching available currencies:', error);
			throw error;
		}
	}
}

export default new NBPService();
