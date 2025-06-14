import React, { useEffect, useState } from 'react';
import { currencyApi } from '../services/api';
import { CurrencyRate } from '../types';
import { RefreshCw } from 'lucide-react';

const CurrentRates: React.FC = () => {
	const [rates, setRates] = useState<CurrencyRate[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchRates = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await currencyApi.getCurrentRates();
			setRates(data);
		} catch (err) {
			setError('Error fetching exchange rates');
			console.error('Error fetching rates:', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRates();
	}, []);

	if (loading) {
		return (
			<div className='flex items-center justify-center p-8'>
				<RefreshCw className='w-6 h-6 animate-spin text-blue-600' />
				<span className='ml-2 text-gray-600'>Loading exchange rates...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className='bg-red-50 border border-red-200 rounded-lg p-4'>
				<p className='text-red-800'>{error}</p>
				<button onClick={fetchRates} className='mt-2 text-red-600 hover:text-red-800 font-medium'>
					Try again
				</button>
			</div>
		);
	}

	return (
		<div className='bg-white rounded-lg shadow'>
			<div className='px-6 py-4 border-b border-gray-200'>
				<div className='flex items-center justify-between'>
					<h2 className='text-lg font-semibold text-gray-900'>Current Exchange Rates</h2>
					<button onClick={fetchRates} className='flex items-center space-x-2 text-blue-600 hover:text-blue-800'>
						<RefreshCw className='w-4 h-4' />
						<span>Refresh</span>
					</button>
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='w-full'>
					<thead className='bg-gray-50'>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Currency</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Code</th>
							<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>Rate (PLN)</th>
						</tr>
					</thead>
					<tbody className='bg-white divide-y divide-gray-200'>
						{rates.map(rate => (
							<tr key={rate.code} className='hover:bg-gray-50'>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{rate.currency}</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>{rate.code}</span>
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-right font-mono'>{rate.mid.toFixed(4)} PLN</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default CurrentRates;
