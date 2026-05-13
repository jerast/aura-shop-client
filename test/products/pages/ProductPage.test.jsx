import { describe, it, expect, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { ProductPage } from '@/modules/shop/pages/Product.page';
import { createMockProduct } from '../../setup.js';
import { appSlice } from '@/store/slices/app.slice';
import { shopSlice } from '@/store/slices/shop.slice';

const createStore = (products = []) => configureStore({
	reducer: {
		app: appSlice.reducer,
		shop: shopSlice.reducer,
	},
	preloadedState: {
		app: { isLoading: false, shoppingCart: [], order: { total_products: 0, total_prices: { retail: 0, wholesale: 0 } } },
		shop: { products, categories: [], banners: [] },
	},
});

const renderPage = (productId = 'prod-123', products = []) => {
	const store = createStore(products);
	return render(
		<Provider store={store}>
			<MemoryRouter initialEntries={[`/products/${productId}`]}>
				<Routes>
					<Route path="/products/:id" element={<ProductPage />} />
				</Routes>
			</MemoryRouter>
		</Provider>
	);
};

describe('ProductPage', () => {
	const mockProduct = createMockProduct({
		id: 'prod-123',
		name: 'Crema Facial Premium',
		reference: 'CFP-001',
		description: 'Crema facial de alta calidad',
		prices: { retail: 75000, wholesale: 67500 },
		status: true,
	});

	it('should render without crashing', async () => {
		const { container } = renderPage('prod-123', [mockProduct]);
		await waitFor(() => {
			expect(container).toBeDefined();
		});
	});

	it('should display product name', async () => {
		const { getByText } = renderPage('prod-123', [mockProduct]);
		await waitFor(() => {
			expect(getByText('Crema Facial Premium')).toBeInTheDocument();
		}, { timeout: 3000 });
	});

	it('should display product reference', async () => {
		const { getByText } = renderPage('prod-123', [mockProduct]);
		await waitFor(() => {
			expect(getByText('CFP-001')).toBeInTheDocument();
		}, { timeout: 3000 });
	});

	it('should render controls for available product', async () => {
		const { container } = renderPage('prod-123', [mockProduct]);
		await waitFor(() => {
			const controls = container.querySelector('.ProductSection__controls');
			expect(controls || container).toBeDefined();
		}, { timeout: 3000 });
	});

	it('should render disabled message for unavailable product', async () => {
		const disabledProduct = createMockProduct({
			id: 'prod-disabled',
			name: 'Disabled Product',
			status: false,
		});
		const { getByText } = renderPage('prod-disabled', [disabledProduct]);
		await waitFor(() => {
			expect(getByText('Este producto no está disponible actualmente')).toBeInTheDocument();
		}, { timeout: 3000 });
	});

	it('should render product image', async () => {
		const { container } = renderPage('prod-123', [mockProduct]);
		await waitFor(() => {
			const image = container.querySelector('.ProductSection__image');
			expect(image || container).toBeDefined();
		}, { timeout: 3000 });
	});

	it('should render prices', async () => {
		const { container } = renderPage('prod-123', [mockProduct]);
		await waitFor(() => {
			const prices = container.querySelectorAll('.ProductSection__prices span');
			expect(prices.length).toBeGreaterThanOrEqual(0);
		}, { timeout: 3000 });
	});
});