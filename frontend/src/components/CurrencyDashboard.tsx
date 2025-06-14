import React, { useState, useEffect } from 'react';
import { currencyApi } from '../services/api';
import { Currency, HistoricalRate } from '../types';
import CurrencyChart from './CurrencyChart';
import CurrencySelector from './CurrencySelector';
import TimePeriodSelector from './TimePeriodSelector';
import DateRangeSelector from './DateRangeSelector';
import { isWeekend } from 'date-fns';

export type TimePeriod = '1D' | '1W' | '1M' | '1Y' | 'Custom';

const CurrencyDashboard: React.FC = () => {
	const [currencies, setCurrencies] = useState<Currency[]>([]);
	const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
	const [timePeriod, setTimePeriod] = useState<TimePeriod>('1M');

	const [customStartDate, setCustomStartDate] = useState(() => {
		const date = new Date();
		date.setMonth(date.getMonth() - 1);
		return date.toISOString().split('T')[0];
	});
	const [customEndDate, setCustomEndDate] = useState(() => {
		const date = new Date();
		return date.toISOString().split('T')[0];
	});
	const [chartData, setChartData] = useState<HistoricalRate[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadCurrencies = async () => {
			try {
				const data = await currencyApi.getCurrencies();
				setCurrencies(data);
			} catch (err) {
				console.error('Error loading currencies:', err);
			}
		};
		loadCurrencies();
	}, []);

	useEffect(() => {
		if (selectedCurrency) {
			loadChartData();
		}
	}, [selectedCurrency, timePeriod, customStartDate, customEndDate]);

	const getLastWorkingDay = (date: Date): Date => {
		const workingDay = new Date(date);
		while (isWeekend(workingDay)) {
			workingDay.setDate(workingDay.getDate() - 1);
		}
		return workingDay;
	};

	const getDateRange = (period: TimePeriod): { startDate: string; endDate: string } => {
		const now = new Date();
		const lastWorkingDay = getLastWorkingDay(now);
		const endDate = lastWorkingDay.toISOString().split('T')[0];

		let startDate: string;

		switch (period) {
			case '1D':
				const prevDay = new Date(lastWorkingDay);
				prevDay.setDate(prevDay.getDate() - 1);
				const prevWorkingDay = getLastWorkingDay(prevDay);
				startDate = prevWorkingDay.toISOString().split('T')[0];
				break;
			case '1W':
				const weekAgo = new Date(lastWorkingDay);
				weekAgo.setDate(weekAgo.getDate() - 7);
				startDate = weekAgo.toISOString().split('T')[0];
				break;
			case '1M':
				const monthAgo = new Date(lastWorkingDay);
				monthAgo.setMonth(monthAgo.getMonth() - 1);
				startDate = monthAgo.toISOString().split('T')[0];
				break;
			case '1Y':
				const yearAgo = new Date(lastWorkingDay);
				yearAgo.setFullYear(yearAgo.getFullYear() - 1);
				startDate = yearAgo.toISOString().split('T')[0];
				break;
			case 'Custom':
				return { startDate: customStartDate, endDate: customEndDate };
			default:
				const defaultStart = new Date(lastWorkingDay);
				defaultStart.setMonth(defaultStart.getMonth() - 1);
				startDate = defaultStart.toISOString().split('T')[0];
		}

		return { startDate, endDate };
	};

	const loadChartData = async () => {
		try {
			setLoading(true);
			setError(null);
			const { startDate, endDate } = getDateRange(timePeriod);
			const data = await currencyApi.getHistoricalRates(selectedCurrency, startDate, endDate);
			setChartData(data);
		} catch (err) {
			setError('Error loading chart data');
			console.error('Error loading chart data:', err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='space-y-6'>
			<div className='bg-white rounded-lg shadow p-6'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					<CurrencySelector currencies={currencies} selectedCurrency={selectedCurrency} onCurrencyChange={setSelectedCurrency} />

					<TimePeriodSelector selectedPeriod={timePeriod} onPeriodChange={setTimePeriod} />

					{timePeriod === 'Custom' && (
						<DateRangeSelector startDate={customStartDate} endDate={customEndDate} onStartDateChange={setCustomStartDate} onEndDateChange={setCustomEndDate} />
					)}
				</div>
			</div>

			<div className='bg-white rounded-lg shadow'>
				<CurrencyChart data={chartData} currency={selectedCurrency} loading={loading} error={error} onRetry={loadChartData} />
			</div>
		</div>
	);
};

export default CurrencyDashboard;
