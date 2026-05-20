import { describe, it, expect } from 'vitest';
import { renderHook as rtlRenderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { useFilteredProducts } from '@/hooks/useFilteredProducts';
import { createMockProduct, createMockCategory } from '../../setup.js';

const createStore = (products = [], categories = []) => configureStore({
	reducer: {
		app: () => ({ isLoading: false, shoppingCart: [], order: { total_products: 0, total_prices: { retail: 0, wholesale: 0 } } }),
		shop: () => ({ products, categories, banners: [] }),
	},
});

const renderHook = (initialEntries = '/', products = [], categories = []) => {
	const store = createStore(products, categories);
	return {
		result: rtlRenderHook(() => useFilteredProducts(), {
			wrapper: ({ children }) => (
				<Provider store={store}>
					<MemoryRouter initialEntries={[initialEntries]}>
						{children}
					</MemoryRouter>
				</Provider>
			),
		}).result,
		store,
	};
};

describe('useFilteredProducts', () => {
	const mockProducts = [
		createMockProduct({ id: '1', name: 'Crema Facial', prices: { retail: 50000, wholesale: 45000 } }),
		createMockProduct({ id: '2', name: 'Sérum Antiedad', prices: { retail: 80000, wholesale: 72000 } }),
		createMockProduct({ id: '3', name: 'Protector Solar', prices: { retail: 35000, wholesale: 30000 } }),
	];

	const mockCategories = [
		createMockCategory({ id: '1', name: 'Cuidado Facial' }),
		createMockCategory({ id: '2', name: 'Proteccion Solar' }),
	];

	it('should return empty filtered products when no products', () => {
		const { result } = renderHook('/', [], []);
		expect(result.current.filteredProducts).toEqual([]);
	});

	it('should filter out products with status false', () => {
		const productsWithDisabled = [
			...mockProducts,
			createMockProduct({ id: '4', name: 'Disabled', status: false }),
		];
		const { result } = renderHook('/', productsWithDisabled, mockCategories);
		const disabledProducts = result.current.filteredProducts.filter(p => p.status === false);
		expect(disabledProducts).toHaveLength(0);
	});

	it('should filter out products with hidden true', () => {
		const productsWithHidden = [
			...mockProducts,
			createMockProduct({ id: '5', name: 'Hidden Product', hidden: true }),
		];
		const { result } = renderHook('/', productsWithHidden, mockCategories);
		const hiddenProducts = result.current.filteredProducts.filter(p => p.hidden === true);
		expect(hiddenProducts).toHaveLength(0);
	});

	it('should filter by search query', () => {
		const { result } = renderHook('/?q=crema', mockProducts, mockCategories);
		expect(result.current.filteredProducts.some(p => p.name === 'Crema Facial')).toBe(true);
	});

	it('should filter by category', () => {
		const { result } = renderHook('/?category=cuidado facial', mockProducts, mockCategories);
		expect(result.current.filteredProducts.length).toBeGreaterThan(0);
	});

	it('should filter by price range', () => {
		const { result } = renderHook('/?min=40000&max=60000', mockProducts, mockCategories);
		expect(result.current.filteredProducts.length).toBeGreaterThanOrEqual(0);
	});

	it('should filter by wholesale price', () => {
		const { result } = renderHook('/?priceType=wholesale', mockProducts, mockCategories);
		expect(result.current.filteredProducts.length).toBeGreaterThanOrEqual(0);
	});

	it('should return empty array when no matches', () => {
		const { result } = renderHook('/?q=noexiste', mockProducts, mockCategories);
		expect(result.current.filteredProducts).toHaveLength(0);
	});

	it('should return all products when no filters applied', () => {
		const { result } = renderHook('/', mockProducts, mockCategories);
		expect(result.current.filteredProducts.length).toBe(3);
	});

	it('should return price ranges', () => {
		const { result } = renderHook('/', mockProducts, mockCategories);
		expect(result.current.priceRanges).toBeDefined();
		expect(result.current.priceRanges.retail).toBeDefined();
		expect(result.current.priceRanges.wholesale).toBeDefined();
	});

	it('should return isLoading from app state', () => {
		const { result } = renderHook('/', mockProducts, mockCategories);
		expect(result.current.isLoading).toBe(false);
	});

	it('should return products from state', () => {
		const { result } = renderHook('/', mockProducts, mockCategories);
		expect(result.current.products).toHaveLength(3);
	});

	it('should return "Productos" as default title', () => {
		const { result } = renderHook('/', mockProducts, mockCategories);
		expect(result.current.title).toBe('Productos');
	});

	it('should return title based on category', () => {
		const { result } = renderHook('/?category=cuidado facial', mockProducts, mockCategories);
		expect(result.current.title).toBe('Cuidado facial');
	});
});