import React from 'react';
import Header from './components/Header';
import CurrencyDashboard from './components/CurrencyDashboard';
import { Toaster } from './components/ui/Toaster';

function App() {
	return (
		<div className='min-h-screen bg-gray-50'>
			<Header />

			<main className='container mx-auto px-4 py-8'>
				<div className='max-w-7xl mx-auto'>
					<CurrencyDashboard />
				</div>
			</main>

			<Toaster />
		</div>
	);
}

export default App;
