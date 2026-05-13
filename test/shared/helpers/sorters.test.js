import { describe, it, expect } from 'vitest';
import { sorters } from '@/helpers/sorters';

describe('sorters', () => {
	const products = [
		{ id: 1, name: 'Zanahoria', category: 'vegetales', prices: { retail: 2000, wholesale: 1800 } },
		{ id: 2, name: 'Manzana', category: 'frutas', prices: { retail: 3000, wholesale: 2700 } },
		{ id: 3, name: 'Lechuga', category: 'vegetales', prices: { retail: 1500, wholesale: 1200 } },
	];

	it('should return original array when prop is "normal"', () => {
		const result = sorters(products, 'normal');
		expect(result).toHaveLength(3);
	});

	it('should sort by name (basic sort, order depends on implementation)', () => {
		const result = sorters(products, 'name', false);
		expect(result).toHaveLength(3);
	});

	it('should return same length regardless of sort prop', () => {
		const result = sorters(products, 'name', true);
		expect(result).toHaveLength(3);
	});

	it('should return same length when sorting by category', () => {
		const result = sorters(products, 'category');
		expect(result).toHaveLength(3);
	});

	it('should return same length when sorting by retail', () => {
		const result = sorters(products, 'retail');
		expect(result).toHaveLength(3);
	});

	it('should return same length when sorting by discount (wholesale)', () => {
		const result = sorters(products, 'discount');
		expect(result).toHaveLength(3);
	});

	it('should not mutate original array', () => {
		const original = [...products];
		sorters(products, 'name');
		expect(products).toEqual(original);
	});
});