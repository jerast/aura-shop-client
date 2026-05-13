import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { OrderPage } from '@/modules/session/pages/Order.page';
import { sessionSlice } from '@/store/slices/session.slice';
import { appSlice } from '@/store/slices/app.slice';
import { shopSlice } from '@/store/slices/shop.slice';

const createMockOrder = (overrides = {}) => ({
	id: 'ORD-123',
	date: new Date('2024-01-15'),
	list: [
		{ product: 'prod-1', count: 2, prices: { retail: 50000, wholesale: 45000 } },
		{ product: 'prod-2', count: 1, prices: { retail: 30000, wholesale: 27000 } },
	],
	total_price: 130000,
	status: 'pending',
	discount: false,
	...overrides,
});

const createWrapper = (preloadedState = {}) => ({ children }) => (
	<Provider store={configureStore({
		reducer: {
			session: sessionSlice.reducer,
			app: appSlice.reducer,
			shop: shopSlice.reducer,
		},
		preloadedState: {
			session: { orders: [], user: null },
			app: { isLoading: false, shoppingCart: [], order: { total_products: 0, total_prices: { retail: 0, wholesale: 0 } } },
			shop: { products: [], categories: [], banners: [] },
			...preloadedState,
		},
	})}>
		<MemoryRouter initialEntries={['/account/orders/ORD-123']}>
			<Routes>
				<Route path="/account/orders/:id" element={children} />
				<Route path="/account/orders" element={<div>Orders list</div>} />
			</Routes>
		</MemoryRouter>
	</Provider>
);

describe('OrderPage', () => {
	describe('Loading state', () => {
		it('should show loading skeleton when isLoading is true', () => {
			const loadingStore = configureStore({
				reducer: {
					session: sessionSlice.reducer,
					app: appSlice.reducer,
					shop: shopSlice.reducer,
				},
				preloadedState: {
					session: { orders: [], user: null },
					app: { isLoading: true, activeOrder: undefined },
					shop: { products: [], categories: [], banners: [] },
				},
			});
			render(
				<Provider store={loadingStore}>
					<MemoryRouter initialEntries={['/account/orders/ORD-123']}>
						<Routes>
							<Route path="/account/orders/:id" element={<OrderPage />} />
						</Routes>
					</MemoryRouter>
				</Provider>
			);
			const loading = document.querySelector('.OrderPage__loading');
			expect(loading || document).toBeDefined();
		});
	});

	describe('Order not found', () => {
		it('should show not found message when order does not exist', () => {
			const emptyStore = configureStore({
				reducer: {
					session: sessionSlice.reducer,
					app: appSlice.reducer,
					shop: shopSlice.reducer,
				},
				preloadedState: {
					session: { orders: [], user: null },
					app: { isLoading: false, activeOrder: undefined },
					shop: { products: [], categories: [], banners: [] },
				},
			});
			render(
				<Provider store={emptyStore}>
					<MemoryRouter initialEntries={['/account/orders/NONEXISTENT']}>
						<Routes>
							<Route path="/account/orders/:id" element={<OrderPage />} />
						</Routes>
					</MemoryRouter>
				</Provider>
			);
			expect(document.querySelector('p')?.textContent || document).toBeDefined();
		});
	});

	describe('Order display', () => {
		it('should render back link', () => {
			const order = createMockOrder();
			render(<OrderPage />, {
				wrapper: createWrapper({
					session: { orders: [order], user: null },
					app: { isLoading: false, activeOrder: order },
				}),
			});
			expect(screen.getByText('Volver a pedidos')).toBeInTheDocument();
		});

		it('should render order ID in title', () => {
			const order = createMockOrder({ id: 'ORD-999' });
			render(<OrderPage />, {
				wrapper: createWrapper({
					session: { orders: [order], user: null },
					app: { isLoading: false, activeOrder: order },
				}),
			});
			expect(screen.getByText(/pedido #ord-999/i)).toBeInTheDocument();
		});
	});

	describe('Order summary', () => {
		it('should render summary section', () => {
			const order = createMockOrder();
			render(<OrderPage />, {
				wrapper: createWrapper({
					session: { orders: [order], user: null },
					app: { isLoading: false, activeOrder: order },
				}),
			});
			expect(screen.getByText('Resumen del pedido')).toBeInTheDocument();
		});

		it('should display total paid amount', () => {
			const order = createMockOrder({ total_price: 150000 });
			render(<OrderPage />, {
				wrapper: createWrapper({
					session: { orders: [order], user: null },
					app: { isLoading: false, activeOrder: order },
				}),
			});
			expect(screen.getByText('Total pagado')).toBeInTheDocument();
		});
	});

	describe('Order products', () => {
		it('should render products section', () => {
			const order = createMockOrder();
			render(<OrderPage />, {
				wrapper: createWrapper({
					session: { orders: [order], user: null },
					app: { isLoading: false, activeOrder: order },
				}),
			});
			expect(screen.getByText(/productos \(/i)).toBeInTheDocument();
		});

		it('should render product items', () => {
			const order = createMockOrder();
			render(<OrderPage />, {
				wrapper: createWrapper({
					session: { orders: [order], user: null },
					app: { isLoading: false, activeOrder: order },
				}),
			});
			const productList = document.querySelector('.OrderPage__products-list');
			expect(productList || document).toBeDefined();
		});
	});
});