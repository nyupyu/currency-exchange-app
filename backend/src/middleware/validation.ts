import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { dateSchema, currencyCodeSchema, dateRangeSchema } from '../utils/validators';
import { ApiResponse } from '../types';

export const validateDate = (req: Request, res: Response, next: NextFunction): void => {
	const { date } = req.params;

	const { error } = dateSchema.validate(date);

	if (error) {
		const response: ApiResponse<null> = {
			success: false,
			message: 'Invalid date',
			error: error.details[0].message,
		};

		res.status(400).json(response);
		return;
	}

	next();
};

export const validateCurrencyCode = (req: Request, res: Response, next: NextFunction): void => {
	const { code } = req.params;

	const { error } = currencyCodeSchema.validate(code);

	if (error) {
		const response: ApiResponse<null> = {
			success: false,
			message: 'Invalid currency code',
			error: error.details[0].message,
		};

		res.status(400).json(response);
		return;
	}

	next();
};

export const validateDateRange = (req: Request, res: Response, next: NextFunction): void => {
	const { code, startDate, endDate } = req.params;

	const { error } = dateRangeSchema.validate({
		currencyCode: code,
		startDate,
		endDate,
	});

	if (error) {
		const response: ApiResponse<null> = {
			success: false,
			message: 'Invalid date range',
			error: error.details[0].message,
		};

		res.status(400).json(response);
		return;
	}

	next();
};

export const validateCsvExport = (req: Request, res: Response, next: NextFunction): void => {
	const csvExportSchema = Joi.object({
		currencyCode: currencyCodeSchema.required(),
		startDate: dateSchema.required(),
		endDate: dateSchema.required(),
		filename: Joi.string()
			.optional()
			.pattern(/^[a-zA-Z0-9_-]+\.csv$/)
			.messages({
				'string.pattern.base': 'Filename must be a valid CSV filename',
			}),
	})
		.custom((value: any, helpers: Joi.CustomHelpers) => {
			const startDate = new Date(value.startDate);
			const endDate = new Date(value.endDate);

			if (startDate >= endDate) {
				return helpers.error('dateRange.invalid');
			}

			return value;
		})
		.messages({
			'dateRange.invalid': 'Start date must be before end date',
		});

	const { error } = csvExportSchema.validate(req.body);

	if (error) {
		const response: ApiResponse<null> = {
			success: false,
			message: 'Invalid CSV export parameters',
			error: error.details[0].message,
		};

		res.status(400).json(response);
		return;
	}

	next();
};
