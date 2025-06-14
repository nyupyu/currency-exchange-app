export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	message: string;
	error?: string;
}

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

export interface Currency {
	code: string;
	currency: string;
}

export interface CsvExportRequest {
	currencyCode: string;
	startDate: string;
	endDate: string;
	filename?: string;
}

export interface CsvExportResponse {
	filename: string;
	recordCount: number;
	downloadUrl: string;
}
