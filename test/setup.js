import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

afterEach(() => {
	cleanup();
});

export const createMockProduct = (overrides = {}) => ({
	id: 'prod-1',
	name: 'Producto de prueba',
	reference: 'REF-001',
	description: 'Descripción del producto de prueba',
	image: 'https://example.com/image.jpg',
	category: 'cuidado facial',
	status: true,
	prices: {
		retail: 50000,
		wholesale: 45000,
	},
	stock: 10,
	...overrides,
});

export const createMockCategory = (overrides = {}) => ({
	id: 'cat-1',
	name: 'Cuidado Facial',
	image: 'https://example.com/category.jpg',
	...overrides,
});

export const createMockProducts = (count = 5) =>
	Array.from({ length: count }, (_, i) =>
		createMockProduct({
			id: `prod-${i + 1}`,
			name: `Producto ${i + 1}`,
			prices: {
				retail: 50000 + i * 10000,
				wholesale: 45000 + i * 9000,
			},
		})
	);

export const createMockCategories = (count = 4) =>
	Array.from({ length: count }, (_, i) =>
		createMockCategory({
			id: `cat-${i + 1}`,
			name: `Categoría ${i + 1}`,
		})
	);