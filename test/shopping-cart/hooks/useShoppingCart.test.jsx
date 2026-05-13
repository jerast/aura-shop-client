import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useShoppingCart } from '@/hooks/useShoppingCart';

const createStore = (products = [], shoppingCart = []) => configureStore({
	reducer: {
		app: () => ({
			isLoading: false,
			shoppingCart,
			order: { total_products: 0, total_prices: { retail: 0, wholesale: 0 } },
		}),
		shop: () => ({ products, categories: [], banners: [] }),
	},
});

describe('useShoppingCart', () => {
	const mockProduct = {
		id: 'prod-123',
		name: 'Test Product',
		prices: { retail: 50000, wholesale: 45000 },
	};

	describe('Initialization', () => {
		it('should return product from products array', () => {
			const store = createStore([mockProduct], []);
			const { result } = renderHook(() => useShoppingCart('prod-123'), {
				wrapper: ({ children }) => (
					<Provider store={store}>{children}</Provider>
				),
			});
			expect(result.current.product).toEqual(mockProduct);
		});

		it('should return undefined for non-existent product', () => {
			const store = createStore([], []);
			const { result } = renderHook(() => useShoppingCart('nonexistent'), {
				wrapper: ({ children }) => (
					<Provider store={store}>{children}</Provider>
				),
			});
			expect(result.current.product).toBeUndefined();
		});

		it('should initialize counter to 0', () => {
			const store = createStore([mockProduct], []);
			const { result } = renderHook(() => useShoppingCart('prod-123'), {
				wrapper: ({ children }) => (
					<Provider store={store}>{children}</Provider>
				),
			});
			expect(result.current.productCounter).toBe(0);
		});
	});

	describe('Product counter', () => {
		it('should return product counter from shopping cart', () => {
			const store = createStore([mockProduct], [{ product: 'prod-123', count: 3 }]);
			const { result } = renderHook(() => useShoppingCart('prod-123'), {
				wrapper: ({ children }) => (
					<Provider store={store}>{children}</Provider>
				),
			});
			expect(result.current.productCounter).toBe(3);
		});

		it('should return 0 when product not in cart', () => {
			const store = createStore([mockProduct], [{ product: 'other-prod', count: 1 }]);
			const { result } = renderHook(() => useShoppingCart('prod-123'), {
				wrapper: ({ children }) => (
					<Provider store={store}>{children}</Provider>
				),
			});
			expect(result.current.productCounter).toBe(0);
		});
	});

	describe('Callbacks', () => {
		it('should return onAddToShoppingCart function', () => {
			const store = createStore([mockProduct], []);
			const { result } = renderHook(() => useShoppingCart('prod-123'), {
				wrapper: ({ children }) => (
					<Provider store={store}>{children}</Provider>
				),
			});
			expect(result.current.onAddToShoppingCart).toBeDefined();
			expect(typeof result.current.onAddToShoppingCart).toBe('function');
		});

		it('should return onReduceToShoppingCart function', () => {
			const store = createStore([mockProduct], []);
			const { result } = renderHook(() => useShoppingCart('prod-123'), {
				wrapper: ({ children }) => (
					<Provider store={store}>{children}</Provider>
				),
			});
			expect(result.current.onReduceToShoppingCart).toBeDefined();
			expect(typeof result.current.onReduceToShoppingCart).toBe('function');
		});

		it('should return onRemoveToShoppingCart function', () => {
			const store = createStore([mockProduct], []);
			const { result } = renderHook(() => useShoppingCart('prod-123'), {
				wrapper: ({ children }) => (
					<Provider store={store}>{children}</Provider>
				),
			});
			expect(result.current.onRemoveToShoppingCart).toBeDefined();
			expect(typeof result.current.onRemoveToShoppingCart).toBe('function');
		});
	});
});