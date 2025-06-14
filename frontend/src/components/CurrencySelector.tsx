import React from 'react';
import { Currency } from '../types';
import { Coins } from 'lucide-react';

interface CurrencySelectorProps {
	currencies: Currency[];
	selectedCurrency: string;
	onCurrencyChange: (currency: string) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ currencies, selectedCurrency, onCurrencyChange }) => {
	return (
		<div>
			<label className='block text-sm font-medium text-gray-700 mb-2'>
				<Coins className='w-4 h-4 inline mr-1' />
				Select Currency
			</label>
			<select
				value={selectedCurrency}
				onChange={e => onCurrencyChange(e.target.value)}
				className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
			>
				{currencies.map(currency => (
					<option key={currency.code} value={currency.code}>
						{currency.code} - {currency.currency}
					</option>
				))}
			</select>
		</div>
	);
};

export default CurrencySelector;
