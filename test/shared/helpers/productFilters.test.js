import { describe, it, expect } from 'vitest';
import { createMockProduct } from '../../setup.js';
import { 
	filterByPriceRange, 
	filterByCategory, 
	applyFilters, 
	getPriceRange, 
	getPriceRanges 
} from '@/helpers/productFilters';

describe('filterByPriceRange', () => {
	const products = [
		createMockProduct({ id: '1', prices: { retail: 30000, wholesale: 25000 } }),
		createMockProduct({ id: '2', prices: { retail: 50000, wholesale: 45000 } }),
		createMockProduct({ id: '3', prices: { retail: 80000, wholesale: 70000 } }),
	];

	it('should filter products within price range', () => {
		const result = filterByPriceRange(products, 40000, 60000, 'retail');
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe('2');
	});

	it('should use retail price by default', () => {
		const result = filterByPriceRange(products, 25000, 30000, 'retail');
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe('1');
	});

	it('should filter by wholesale price when specified', () => {
		const result = filterByPriceRange(products, 24000, 26000, 'wholesale');
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe('1');
	});

	it('should return all products when range is full', () => {
		const result = filterByPriceRange(products, 0, 100000);
		expect(result).toHaveLength(3);
	});

	it('should return empty array when no products match', () => {
		const result = filterByPriceRange(products, 100000, 200000);
		expect(result).toHaveLength(0);
	});

	it('should include boundary values', () => {
		const result = filterByPriceRange(products, 30000, 50000, 'retail');
		expect(result).toHaveLength(2);
	});
});

describe('filterByCategory', () => {
	const products = [
		createMockProduct({ id: '1', category: 'cuidado facial' }),
		createMockProduct({ id: '2', category: 'cuidado corporal' }),
		createMockProduct({ id: '3', category: 'proteccion solar' }),
	];

	it('should return all products when no category specified', () => {
		const result = filterByCategory(products, '');
		expect(result).toHaveLength(3);
	});

	it('should filter by category case-insensitively', () => {
		const result = filterByCategory(products, 'CUIDADO FACIAL');
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe('1');
	});

	it('should return empty array when no match', () => {
		const result = filterByCategory(products, 'no existe');
		expect(result).toHaveLength(0);
	});
});

describe('applyFilters', () => {
	const products = [
		createMockProduct({ id: '1', category: 'facial', prices: { retail: 30000, wholesale: 25000 } }),
		createMockProduct({ id: '2', category: 'facial', prices: { retail: 50000, wholesale: 45000 } }),
		createMockProduct({ id: '3', category: 'corporal', prices: { retail: 80000, wholesale: 70000 } }),
	];

	it('should apply category and price filters together', () => {
		const result = applyFilters(products, {
			category: 'facial',
			priceRange: { min: 40000, max: 60000 },
			priceType: 'retail',
		});
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe('2');
	});

	it('should apply only price filter when no category', () => {
		const result = applyFilters(products, {
			category: '',
			priceRange: { min: 20000, max: 40000 },
			priceType: 'retail',
		});
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe('1');
	});

	it('should return all products when no filters applied', () => {
		const result = applyFilters(products, {
			category: '',
			priceRange: { min: 0, max: 0 },
			priceType: 'retail',
		});
		expect(result).toHaveLength(3);
	});

	it('should handle zero price range as no filter', () => {
		const result = applyFilters(products, {
			category: '',
			priceRange: { min: 0, max: 0 },
			priceType: 'retail',
		});
		expect(result).toHaveLength(3);
	});
});

describe('getPriceRange', () => {
	it('should return min and max from product prices', () => {
		const products = [
			createMockProduct({ prices: { retail: 30000 } }),
			createMockProduct({ prices: { retail: 80000 } }),
			createMockProduct({ prices: { retail: 50000 } }),
		];
		const result = getPriceRange(products);
		expect(result.min).toBe(30000);
		expect(result.max).toBe(80000);
	});

	it('should return zeros for empty array', () => {
		const result = getPriceRange([]);
		expect(result.min).toBe(0);
		expect(result.max).toBe(0);
	});

	it('should return zeros for null/undefined', () => {
		expect(getPriceRange(null).min).toBe(0);
		expect(getPriceRange(undefined).max).toBe(0);
	});
});

describe('getPriceRanges', () => {
	it('should return separate ranges for retail and wholesale', () => {
		const products = [
			createMockProduct({ prices: { retail: 30000, wholesale: 25000 } }),
			createMockProduct({ prices: { retail: 80000, wholesale: 70000 } }),
		];
		const result = getPriceRanges(products);
		expect(result.retail.min).toBe(30000);
		expect(result.retail.max).toBe(80000);
		expect(result.wholesale.min).toBe(25000);
		expect(result.wholesale.max).toBe(70000);
	});

	it('should return zeros for empty array', () => {
		const result = getPriceRanges([]);
		expect(result.retail.min).toBe(0);
		expect(result.retail.max).toBe(0);
		expect(result.wholesale.min).toBe(0);
		expect(result.wholesale.max).toBe(0);
	});
});