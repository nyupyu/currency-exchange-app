import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../utils/cn';

interface TabsContextType {
	value: string;
	onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
	defaultValue: string;
	className?: string;
	children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, className, children }) => {
	const [value, setValue] = useState(defaultValue);

	return (
		<TabsContext.Provider value={{ value, onValueChange: setValue }}>
			<div className={cn('w-full', className)}>{children}</div>
		</TabsContext.Provider>
	);
};

export const TabsList: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => {
	return <div className={cn('inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500', className)}>{children}</div>;
};

export const TabsTrigger: React.FC<{
	value: string;
	className?: string;
	children: React.ReactNode;
}> = ({ value, className, children }) => {
	const context = useContext(TabsContext);
	if (!context) throw new Error('TabsTrigger must be used within Tabs');

	const isActive = context.value === value;

	return (
		<button
			className={cn(
				'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
				isActive ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-600 hover:text-gray-900',
				className,
			)}
			onClick={() => context.onValueChange(value)}
		>
			{children}
		</button>
	);
};

export const TabsContent: React.FC<{
	value: string;
	className?: string;
	children: React.ReactNode;
}> = ({ value, className, children }) => {
	const context = useContext(TabsContext);
	if (!context) throw new Error('TabsContent must be used within Tabs');

	if (context.value !== value) return null;

	return (
		<div className={cn('mt-6 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2', className)}>
			{children}
		</div>
	);
};
