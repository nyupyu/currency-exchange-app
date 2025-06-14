import React from 'react';
import { Clock } from 'lucide-react';
import { TimePeriod } from './CurrencyDashboard';

interface TimePeriodSelectorProps {
	selectedPeriod: TimePeriod;
	onPeriodChange: (period: TimePeriod) => void;
}

const periods: { value: TimePeriod; label: string }[] = [
	{ value: '1D', label: '1 Day' },
	{ value: '1W', label: '1 Week' },
	{ value: '1M', label: '1 Month' },
	{ value: '1Y', label: '1 Year' },
	{ value: 'Custom', label: 'Custom Range' },
];

const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({ selectedPeriod, onPeriodChange }) => {
	return (
		<div>
			<label className='block text-sm font-medium text-gray-700 mb-2'>
				<Clock className='w-4 h-4 inline mr-1' />
				Time Period
			</label>
			<div className='grid grid-cols-3 gap-2'>
				{periods.map(period => (
					<button
						key={period.value}
						onClick={() => onPeriodChange(period.value)}
						className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
							selectedPeriod === period.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						{period.label}
					</button>
				))}
			</div>
		</div>
	);
};

export default TimePeriodSelector;
