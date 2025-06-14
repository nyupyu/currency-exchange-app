import * as csvWriter from 'csv-writer';
import * as path from 'path';
import * as fs from 'fs';
import { HistoricalRate } from '../types';

export interface CsvExportData {
	date: string;
	currency: string;
	currencyCode: string;
	exchangeRate: number;
	tableNumber: string;
}

class CsvService {
	private uploadsDir: string;

	constructor() {
		this.uploadsDir = path.join(process.cwd(), 'uploads');
		this.ensureUploadsDir();
	}

	private ensureUploadsDir(): void {
		if (!fs.existsSync(this.uploadsDir)) {
			fs.mkdirSync(this.uploadsDir, { recursive: true });
			console.log('Created uploads directory');
		}
	}

	/**
	 * Generate CSV filename
	 */
	private generateFilename(currencyCode: string, startDate: string, endDate: string): string {
		const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
		return `${currencyCode}_${startDate}_${endDate}_${timestamp}.csv`;
	}

	/**
	 * Convert historical rates to CSV export format
	 */
	private formatDataForCsv(rates: HistoricalRate[], currencyCode: string, currencyName: string): CsvExportData[] {
		return rates.map(rate => ({
			date: rate.effectiveDate,
			currency: currencyName,
			currencyCode: currencyCode,
			exchangeRate: rate.mid,
			tableNumber: rate.no,
		}));
	}

	/**
	 * Export historical rates to CSV file
	 */
	async exportToCsv(
		rates: HistoricalRate[],
		currencyCode: string,
		currencyName: string,
		startDate: string,
		endDate: string,
		customFilename?: string,
	): Promise<{ filename: string; filePath: string; recordCount: number }> {
		try {
			const filename = customFilename || this.generateFilename(currencyCode, startDate, endDate);
			const filePath = path.join(this.uploadsDir, filename);

			// Prepare data
			const csvData = this.formatDataForCsv(rates, currencyCode, currencyName);

			// Create CSV writer
			const writer = csvWriter.createObjectCsvWriter({
				path: filePath,
				header: [
					{ id: 'date', title: 'Date' },
					{ id: 'currency', title: 'Currency' },
					{ id: 'currencyCode', title: 'Currency Code' },
					{ id: 'exchangeRate', title: 'Exchange Rate (PLN)' },
					{ id: 'tableNumber', title: 'Table Number' },
				],
				encoding: 'utf8',
			});

			// Write CSV file
			await writer.writeRecords(csvData);

			console.log(`CSV exported: ${filename} (${csvData.length} records)`);

			return {
				filename,
				filePath,
				recordCount: csvData.length,
			};
		} catch (error) {
			console.error('Error exporting to CSV:', error);
			throw new Error('Failed to export data to CSV');
		}
	}

	/**
	 * Get file for download
	 */
	async getFileForDownload(filename: string): Promise<{ filePath: string; exists: boolean }> {
		const filePath = path.join(this.uploadsDir, filename);
		const exists = fs.existsSync(filePath);

		return { filePath, exists };
	}

	/**
	 * Clean up old CSV files (older than 24 hours)
	 */
	async cleanupOldFiles(): Promise<void> {
		try {
			const files = fs.readdirSync(this.uploadsDir);
			const now = Date.now();
			const maxAge = 24 * 60 * 60 * 1000; // 24 hours

			for (const file of files) {
				if (file.endsWith('.csv')) {
					const filePath = path.join(this.uploadsDir, file);
					const stats = fs.statSync(filePath);

					if (now - stats.mtime.getTime() > maxAge) {
						fs.unlinkSync(filePath);
						console.log(`Deleted old CSV file: ${file}`);
					}
				}
			}
		} catch (error) {
			console.error('Error cleaning up old files:', error);
		}
	}
}

export default new CsvService();
