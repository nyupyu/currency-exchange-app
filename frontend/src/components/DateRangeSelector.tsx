import React from 'react';
import { Calendar, Info } from 'lucide-react';

interface DateRangeSelectorProps {
	startDate: string;
	endDate: string;
	onStartDateChange: (date: string) => void;
	onEndDateChange: (date: string) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
	return (
		<div>
			<label className='block text-sm font-medium text-gray-700 mb-2'>
				<Calendar className='w-4 h-4 inline mr-1' />
				Custom Date Range
			</label>
			<div className='grid grid-cols-2 gap-2'>
				<div>
					<label className='block text-xs text-gray-500 mb-1'>From</label>
					<input
						type='date'
						value={startDate}
						onChange={e => onStartDateChange(e.target.value)}
						className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
					/>
				</div>
				<div>
					<label className='block text-xs text-gray-500 mb-1'>To</label>
					<input
						type='date'
						value={endDate}
						onChange={e => onEndDateChange(e.target.value)}
						className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
					/>
				</div>
			</div>
			<div className='mt-2 flex items-start space-x-1 text-xs text-amber-600 bg-amber-50 p-2 rounded-md'>
				<Info className='w-3 h-3 mt-0.5 flex-shrink-0' />
				<span>Maximum date range is 367 days due to NBP API limitations</span>
			</div>
		</div>
	);
};

export default DateRangeSelector;
