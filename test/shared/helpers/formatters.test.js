import { describe, it, expect } from 'vitest';
import { currencyFormatter, formatDateForInput } from '@/helpers/formatters';

describe('currencyFormatter', () => {
	it('should format number as Colombian COP currency', () => {
		const result = currencyFormatter(50000);
		expect(result).toContain('50.000');
	});

	it('should format large numbers with proper separators', () => {
		const result = currencyFormatter(1500000);
		expect(result).toContain('1.500.000');
	});

	it('should format small numbers', () => {
		const result = currencyFormatter(1500);
		expect(result).toContain('1.500');
	});

	it('should format zero value', () => {
		const result = currencyFormatter(0);
		expect(result).toContain('0');
	});
});

describe('formatDateForInput', () => {
	it('should convert valid Date to YYYY-MM-DD format', () => {
		const date = new Date('2024-06-15');
		const result = formatDateForInput(date);
		expect(result).toBe('2024-06-15');
	});

	it('should handle ISO string input', () => {
		const result = formatDateForInput('2024-12-25T10:30:00.000Z');
		expect(result).toBe('2024-12-25');
	});

	it('should return empty string for null', () => {
		const result = formatDateForInput(null);
		expect(result).toBe('');
	});

	it('should return empty string for undefined', () => {
		const result = formatDateForInput(undefined);
		expect(result).toBe('');
	});

	it('should return empty string for invalid date', () => {
		const result = formatDateForInput('not-a-date');
		expect(result).toBe('');
	});

	it('should return empty string for empty string', () => {
		const result = formatDateForInput('');
		expect(result).toBe('');
	});
});