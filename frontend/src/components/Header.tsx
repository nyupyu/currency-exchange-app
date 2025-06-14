import React from 'react';
import { TrendingUp } from 'lucide-react';

const Header: React.FC = () => {
	return (
		<header className='bg-white shadow-sm border-b'>
			<div className='container mx-auto px-4 py-6'>
				<div className='flex items-center space-x-3'>
					<div className='flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg'>
						<TrendingUp className='w-6 h-6 text-white' />
					</div>
					<div>
						<h1 className='text-2xl font-bold text-gray-900'>NBP Currency Exchange</h1>
						<p className='text-sm text-gray-600'>Current and historical exchange rates from National Bank of Poland</p>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
