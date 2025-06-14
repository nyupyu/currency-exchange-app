export interface CurrencyRate {
	currency: string;
	code: string;
	mid: number;
}

export interface HistoricalRate {
	no: string;
	effectiveDate: string;
	mid: number;
}

export interface CurrencyData {
	table: string;
	currency: string;
	code: string;
	rates: HistoricalRate[];
}

export interface CurrencyTableResponse {
	table: string;
	no: string;
	effectiveDate: string;
	rates: CurrencyRate[];
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
}

export interface DateRangeRequest {
	currencyCode: string;
	startDate: string;
	endDate: string;
}
