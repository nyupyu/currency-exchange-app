import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HistoricalRate } from '../types';
import { RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface CurrencyChartProps {
	data: HistoricalRate[];
	currency: string;
	loading: boolean;
	error: string | null;
	onRetry: () => void;
}

const CurrencyChart: React.FC<CurrencyChartProps> = ({ data, currency, loading, error, onRetry }) => {
	// Transform data for chart
	const chartData = data.map(item => ({
		date: item.effectiveDate,
		rate: item.mid,
		formattedDate: format(new Date(item.effectiveDate), 'MMM dd'),
		fullDate: format(new Date(item.effectiveDate), 'yyyy-MM-dd'),
	}));

	// Calculate stats
	const currentRate = data.length > 0 ? data[data.length - 1]?.mid : 0;
	const previousRate = data.length > 1 ? data[data.length - 2]?.mid : 0;
	const change = currentRate - previousRate;
	const changePercent = previousRate !== 0 ? (change / previousRate) * 100 : 0;

	const minRate = Math.min(...data.map(d => d.mid));
	const maxRate = Math.max(...data.map(d => d.mid));

	const formatTooltip = (value: any, name: any) => {
		if (name === 'rate') {
			return [`${value.toFixed(4)} PLN`, `${currency} Rate`];
		}
		return [value, name];
	};

	const formatLabel = (label: any) => {
		return `Date: ${label}`;
	};

	if (loading) {
		return (
			<div className='p-8'>
				<div className='flex items-center justify-center h-96'>
					<div className='text-center'>
						<RefreshCw className='w-8 h-8 animate-spin text-blue-600 mx-auto mb-4' />
						<p className='text-gray-600'>Loading chart data...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='p-8'>
				<div className='flex items-center justify-center h-96'>
					<div className='text-center'>
						<AlertCircle className='w-8 h-8 text-red-500 mx-auto mb-4' />
						<p className='text-red-600 mb-4'>{error}</p>
						<button onClick={onRetry} className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'>
							Try Again
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (data.length === 0) {
		return (
			<div className='p-8'>
				<div className='flex items-center justify-center h-96'>
					<div className='text-center'>
						<TrendingUp className='w-8 h-8 text-gray-400 mx-auto mb-4' />
						<p className='text-gray-600'>No data available for the selected period</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='p-6'>
			{/* Header with current rate and stats */}
			<div className='mb-6'>
				<div className='flex items-center justify-between mb-4'>
					<h2 className='text-2xl font-bold text-gray-900'>{currency}/PLN Exchange Rate</h2>
					<div className='text-right'>
						<div className='text-3xl font-bold text-gray-900'>{currentRate.toFixed(4)} PLN</div>
						<div className={`flex items-center text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
							{change >= 0 ? '↗' : '↘'}
							<span className='ml-1'>
								{change >= 0 ? '+' : ''}
								{change.toFixed(4)} ({changePercent.toFixed(2)}%)
							</span>
						</div>
					</div>
				</div>

				{/* Stats */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
					<div className='bg-gray-50 rounded-lg p-4'>
						<div className='text-sm text-gray-600'>Current Rate</div>
						<div className='text-xl font-semibold'>{currentRate.toFixed(4)} PLN</div>
					</div>
					<div className='bg-gray-50 rounded-lg p-4'>
						<div className='text-sm text-gray-600'>Minimum</div>
						<div className='text-xl font-semibold'>{minRate.toFixed(4)} PLN</div>
					</div>
					<div className='bg-gray-50 rounded-lg p-4'>
						<div className='text-sm text-gray-600'>Maximum</div>
						<div className='text-xl font-semibold'>{maxRate.toFixed(4)} PLN</div>
					</div>
				</div>
			</div>

			{/* Chart */}
			<div className='h-96'>
				<ResponsiveContainer width='100%' height='100%'>
					<LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
						<CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
						<XAxis dataKey='formattedDate' stroke='#666' fontSize={12} tickLine={false} />
						<YAxis stroke='#666' fontSize={12} tickLine={false} domain={['dataMin - 0.01', 'dataMax + 0.01']} tickFormatter={value => value.toFixed(3)} />
						<Tooltip
							formatter={formatTooltip}
							labelFormatter={formatLabel}
							contentStyle={{
								backgroundColor: 'white',
								border: '1px solid #e5e7eb',
								borderRadius: '8px',
								boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
							}}
						/>
						<Line type='monotone' dataKey='rate' stroke='#2563eb' strokeWidth={2} dot={false} activeDot={{ r: 4, stroke: '#2563eb', strokeWidth: 2, fill: 'white' }} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default CurrencyChart;
