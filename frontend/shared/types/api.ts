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

export interface DateRangeRequest {
	currencyCode: string;
	startDate: string;
	endDate: string;
}

export interface DateRequest {
	currencyCode: string;
	date: string;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	message?: string;
}

export interface ValidationError {
	field: string;
	message: string;
}

export interface CsvExportRequest {
	currencyCode: string;
	startDate: string;
	endDate: string;
	filename?: string;
}
