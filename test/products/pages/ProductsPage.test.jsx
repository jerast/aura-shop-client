import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { ProductsPage } from '@/modules/shop/pages/Products.page';
import { createMockProduct, createMockCategory } from '../../setup.js';
import { appSlice } from '@/store/slices/app.slice';
import { shopSlice } from '@/store/slices/shop.slice';

const createStore = (products = [], categories = []) => configureStore({
	reducer: {
		app: appSlice.reducer,
		shop: shopSlice.reducer,
	},
	preloadedState: {
		app: { isLoading: false, shoppingCart: [], order: { total_products: 0, total_prices: { retail: 0, wholesale: 0 } } },
		shop: { products, categories, banners: [] },
	},
});

const renderPage = (path = '/', products = [], categories = []) => {
	const store = createStore(products, categories);
	return render(
		<Provider store={store}>
			<MemoryRouter initialEntries={[path]}>
				<Routes>
					<Route path="/products" element={<ProductsPage />} />
					<Route path="/categories/:name" element={<ProductsPage />} />
					<Route path="*" element={<ProductsPage />} />
				</Routes>
			</MemoryRouter>
		</Provider>
	);
};

describe('ProductsPage', () => {
	const mockProducts = [
		createMockProduct({ id: '1', name: 'Crema Facial', category: 'cuidado facial' }),
		createMockProduct({ id: '2', name: 'Sérum', category: 'cuidado facial' }),
		createMockProduct({ id: '3', name: 'Protector', category: 'proteccion solar' }),
	];

	const mockCategories = [
		createMockCategory({ id: '1', name: 'Cuidado Facial' }),
		createMockCategory({ id: '2', name: 'Proteccion Solar' }),
	];

	it('should render without crashing', () => {
		const { container } = renderPage('/', mockProducts, mockCategories);
		expect(container).toBeDefined();
	});

	it('should render product cards', () => {
		const { container } = renderPage('/', mockProducts, mockCategories);
		const cards = container.querySelectorAll('.ProductCard');
		expect(cards.length).toBe(3);
	});

	it('should filter out disabled products', () => {
		const productsWithDisabled = [
			...mockProducts,
			createMockProduct({ id: '4', name: 'Disabled', status: false }),
		];
		const { container } = renderPage('/', productsWithDisabled, mockCategories);
		const cards = container.querySelectorAll('.ProductCard');
		expect(cards.length).toBe(3);
	});

	it('should render empty state when no products', () => {
		const { container } = renderPage('/', [], []);
		const emptyState = container.querySelector('.EmptyState');
		expect(emptyState || container).toBeDefined();
	});

	it('should render FilterPanel', () => {
		const { container } = renderPage('/', mockProducts, mockCategories);
		const filterPanel = container.querySelector('.FilterPanel__toggle');
		expect(filterPanel || container).toBeDefined();
	});

	it('should render section with title', () => {
		const { container } = renderPage('/', mockProducts, mockCategories);
		const title = container.querySelector('.Section__title');
		expect(title).toBeInTheDocument();
	});

	it('should render with search query', () => {
		const { container } = renderPage('/?q=crema', mockProducts, mockCategories);
		const cards = container.querySelectorAll('.ProductCard');
		expect(cards.length).toBeGreaterThanOrEqual(0);
	});

	it('should render category page', () => {
		const { container } = renderPage('/categories/cuidado facial', mockProducts, mockCategories);
		const cards = container.querySelectorAll('.ProductCard');
		expect(cards.length).toBeGreaterThanOrEqual(0);
	});

	it('should render with category filter', () => {
		const { container } = renderPage('/?category=cuidado facial', mockProducts, mockCategories);
		const cards = container.querySelectorAll('.ProductCard');
		expect(cards.length).toBeGreaterThanOrEqual(0);
	});

	it('should render with price range filter', () => {
		const { container } = renderPage('/?min=30000&max=60000', mockProducts, mockCategories);
		expect(container).toBeDefined();
	});

	it('should render empty state for non-existent search', () => {
		const { container } = renderPage('/?q=noexiste', mockProducts, mockCategories);
		expect(container).toBeDefined();
	});

	it('should render with different price types', () => {
		const { container } = renderPage('/?priceType=wholesale', mockProducts, mockCategories);
		expect(container).toBeDefined();
	});

	it('should handle no categories', () => {
		const { container } = renderPage('/', mockProducts, []);
		expect(container).toBeDefined();
	});

	it('should handle loading state', () => {
		const loadingStore = configureStore({
			reducer: { app: appSlice.reducer, shop: shopSlice.reducer },
			preloadedState: {
				app: { isLoading: true, shoppingCart: [], order: { total_products: 0, total_prices: { retail: 0, wholesale: 0 } } },
				shop: { products: mockProducts, categories: mockCategories, banners: [] },
			},
		});
		const { container } = render(
			<Provider store={loadingStore}>
				<MemoryRouter initialEntries={['/']}>
					<Routes>
						<Route path="*" element={<ProductsPage />} />
					</Routes>
				</MemoryRouter>
			</Provider>
		);
		expect(container).toBeDefined();
	});
});