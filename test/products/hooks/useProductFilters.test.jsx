import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route, useSearchParams } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { useProductFilters } from '@/hooks/useProductFilters';
import { appSlice } from '@/store/slices/app.slice';
import { shopSlice } from '@/store/slices/shop.slice';

const createTestStore = (preloadedState = {}) => configureStore({
	reducer: {
		app: appSlice.reducer,
		shop: shopSlice.reducer,
	},
	preloadedState: {
		app: { isLoading: false, shoppingCart: [], order: { total_products: 0, total_prices: { retail: 0, wholesale: 0 } } },
		shop: { categories: [], products: [], banners: [] },
		...preloadedState,
	},
});

const Wrapper = ({ children, initialEntries = '/' }) => {
	const store = createTestStore();
	return (
		<Provider store={store}>
			<MemoryRouter initialEntries={[initialEntries]}>
				{children}
			</MemoryRouter>
		</Provider>
	);
};

const renderUseProductFilters = (initialEntries = '/') => {
	const store = createTestStore();
	const { result } = renderHook(() => useProductFilters(), {
		wrapper: ({ children }) => (
			<Provider store={store}>
				<MemoryRouter initialEntries={[initialEntries]}>
					{children}
				</MemoryRouter>
			</Provider>
		),
	});
	return { result, store };
};

describe('useProductFilters', () => {
	describe('getters', () => {
		it('should return empty search by default', () => {
			const { result } = renderUseProductFilters();
			expect(result.current.search).toBe('');
		});

		it('should return empty category by default', () => {
			const { result } = renderUseProductFilters();
			expect(result.current.category).toBe('');
		});

		it('should return retail as default priceType', () => {
			const { result } = renderUseProductFilters();
			expect(result.current.priceType).toBe('retail');
		});

		it('should return default priceRange', () => {
			const { result } = renderUseProductFilters();
			expect(result.current.priceRange).toEqual({ min: 0, max: 0 });
		});

		it('should read search from URL params', () => {
			const { result } = renderUseProductFilters('/?q=crema');
			expect(result.current.search).toBe('crema');
		});

		it('should read category from URL params', () => {
			const { result } = renderUseProductFilters('/?category=facial');
			expect(result.current.category).toBe('facial');
		});

		it('should read priceType from URL params', () => {
			const { result } = renderUseProductFilters('/?priceType=wholesale');
			expect(result.current.priceType).toBe('wholesale');
		});

		it('should read priceRange from URL params', () => {
			const { result } = renderUseProductFilters('/?min=10000&max=50000');
			expect(result.current.priceRange).toEqual({ min: 10000, max: 50000 });
		});
	});

	describe('setSearch', () => {
		it('should set search query in URL', async () => {
			const { result } = renderUseProductFilters();
			await act(async () => {
				result.current.setSearch('nuevo producto');
			});
			expect(result.current.search).toBe('nuevo producto');
		});

		it('should remove q param when setting empty search', async () => {
			const { result } = renderUseProductFilters('/?q=test');
			await act(async () => {
				result.current.setSearch('');
			});
			expect(result.current.search).toBe('');
		});
	});

	describe('setCategory', () => {
		it('should set category in URL (lowercase)', async () => {
			const { result } = renderUseProductFilters();
			await act(async () => {
				result.current.setCategory('Cuidado Facial');
			});
			expect(result.current.category).toBe('cuidado facial');
		});

		it('should remove category param when setting empty', async () => {
			const { result } = renderUseProductFilters('/?category=facial');
			await act(async () => {
				result.current.setCategory('');
			});
			expect(result.current.category).toBe('');
		});
	});

	describe('setPriceType', () => {
		it('should set priceType to wholesale', async () => {
			const { result } = renderUseProductFilters();
			await act(async () => {
				result.current.setPriceType('wholesale');
			});
			expect(result.current.priceType).toBe('wholesale');
		});

		it('should remove priceType param when setting to retail', async () => {
			const { result } = renderUseProductFilters('/?priceType=wholesale');
			await act(async () => {
				result.current.setPriceType('retail');
			});
			expect(result.current.priceType).toBe('retail');
		});
	});

	describe('setPriceRange', () => {
		it('should set min and max in URL', async () => {
			const { result } = renderUseProductFilters();
			await act(async () => {
				result.current.setPriceRange({ min: 10000, max: 50000 });
			});
			expect(result.current.priceRange).toEqual({ min: 10000, max: 50000 });
		});

		it('should remove min param when min is 0', async () => {
			const { result } = renderUseProductFilters('/?min=10000');
			await act(async () => {
				result.current.setPriceRange({ min: 0, max: 50000 });
			});
			expect(result.current.priceRange.min).toBe(0);
		});

		it('should remove max param when max is 0', async () => {
			const { result } = renderUseProductFilters('/?max=50000');
			await act(async () => {
				result.current.setPriceRange({ min: 10000, max: 0 });
			});
			expect(result.current.priceRange.max).toBe(0);
		});
	});

	describe('clearAll', () => {
		it('should clear all URL params', async () => {
			const { result } = renderUseProductFilters('/?q=test&category=facial&min=10000');
			await act(async () => {
				result.current.clearAll();
			});
			expect(result.current.search).toBe('');
			expect(result.current.category).toBe('');
			expect(result.current.priceRange).toEqual({ min: 0, max: 0 });
		});
	});

	describe('resetFilters', () => {
		it('should reset to default values with custom price range', async () => {
			const { result } = renderUseProductFilters('/?q=test&min=50000&max=100000');
			await act(async () => {
				result.current.resetFilters({ min: 10000, max: 50000 });
			});
			expect(result.current.search).toBe('');
			expect(result.current.priceRange).toEqual({ min: 10000, max: 50000 });
			expect(result.current.priceType).toBe('retail');
		});
	});
});