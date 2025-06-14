import Joi from 'joi';
import { isValid, parseISO, isFuture, isWeekend } from 'date-fns';

// Date validation schema
export const dateSchema = Joi.string()
	.pattern(/^\d{4}-\d{2}-\d{2}$/)
	.custom((value: string, helpers: Joi.CustomHelpers) => {
		// Check if date is valid
		const date = parseISO(value);

		console.log('Validating date:', value);
		console.log('Parsed date:', date);
		console.log('Is weekend:', isWeekend(date));
		console.log('Is future:', isFuture(date));

		if (!isValid(date)) {
			return helpers.error('date.invalid');
		}

		// Check if date is not in the future
		if (isFuture(date)) {
			return helpers.error('date.future');
		}

		// Check if it's not weekend (NBP doesn't publish rates on weekends)
		if (isWeekend(date)) {
			console.log('Weekend date detected but allowing for historical data:', value);
			// return helpers.error('date.weekend');
		}

		return value;
	})
	.messages({
		'string.pattern.base': 'Date must be in YYYY-MM-DD format',
		'date.invalid': 'Invalid date',
		'date.future': 'Date cannot be in the future',
		'date.weekend': 'NBP does not publish rates on weekends',
	});

// Currency code validation
export const currencyCodeSchema = Joi.string()
	.length(3)
	.uppercase()
	.pattern(/^[A-Z]{3}$/)
	.messages({
		'string.length': 'Currency code must be exactly 3 characters',
		'string.pattern.base': 'Currency code must contain only uppercase letters',
	});

// Date range validation
export const dateRangeSchema = Joi.object({
	currencyCode: currencyCodeSchema.required(),
	startDate: dateSchema.required(),
	endDate: dateSchema.required(),
})
	.custom((value: any, helpers: Joi.CustomHelpers) => {
		const startDate = parseISO(value.startDate);
		const endDate = parseISO(value.endDate);

		if (startDate >= endDate) {
			return helpers.error('dateRange.invalid');
		}

		return value;
	})
	.messages({
		'dateRange.invalid': 'Start date must be before end date',
	});
