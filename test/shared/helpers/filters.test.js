import { describe, it, expect } from 'vitest';
import { filters } from '@/helpers/filters';

describe('filters', () => {
	const products = [
		{ id: 1, name: 'Crema Hidratante', category: 'cuidado facial' },
		{ id: 2, name: 'Sérum Antiedad', category: 'cuidado facial' },
		{ id: 3, name: 'Protector Solar', category: 'proteccion solar' },
		{ id: 4, name: 'Kit Facial', category: 'kits' },
	];

	it('should return all products when no params provided', () => {
		const result = filters(products, {});
		expect(result).toHaveLength(4);
	});

	it('should filter by single category', () => {
		const result = filters(products, { category: 'cuidado facial' });
		expect(result).toHaveLength(2);
		expect(result[0].name).toBe('Crema Hidratante');
	});

	it('should filter by single name', () => {
		const result = filters(products, { name: 'sérum' });
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe('Sérum Antiedad');
	});

	it('should be case insensitive', () => {
		const result = filters(products, { name: 'CREMA' });
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe('Crema Hidratante');
	});

	it('should return empty array when no matches found', () => {
		const result = filters(products, { category: 'no existe' });
		expect(result).toHaveLength(0);
	});

	it('should not throw when product has null property', () => {
		const mixedProducts = [
			{ id: 1, name: 'Valid Product' },
			{ id: 2, name: null },
		];
		const result = filters(mixedProducts, { name: 'test' });
		expect(result).toBeDefined();
	});
});