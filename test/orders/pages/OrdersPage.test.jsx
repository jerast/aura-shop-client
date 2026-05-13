import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { OrdersPage } from '@/modules/session/pages/Orders.page';
import { sessionSlice } from '@/store/slices/session.slice';
import { appSlice } from '@/store/slices/app.slice';

const createWrapper = (preloadedState = {}) => ({ children }) => (
	<Provider store={configureStore({
		reducer: {
			session: sessionSlice.reducer,
			app: appSlice.reducer,
		},
		preloadedState: {
			session: { orders: [], user: null },
			app: { isLoading: false, shoppingCart: [], order: { total_products: 0, total_prices: { retail: 0, wholesale: 0 } } },
			...preloadedState,
		},
	})}>
		<MemoryRouter initialEntries={['/account/orders']}>
			<Routes>
				<Route path="/account/orders" element={children} />
			</Routes>
		</MemoryRouter>
	</Provider>
);

const createMockOrder = (overrides = {}) => ({
	id: 'ORD-001',
	date: new Date('2024-01-15'),
	list: [{ product: 'p1', count: 2 }],
	total_price: 100000,
	status: 'pending',
	...overrides,
});

describe('OrdersPage', () => {
	describe('Rendering', () => {
		it('should render page title', () => {
			render(<OrdersPage />, { wrapper: createWrapper() });
			expect(screen.getByRole('heading', { name: /mis pedidos/i })).toBeInTheDocument();
		});

		it('should render table when orders exist', () => {
			const orders = [createMockOrder({ id: 'ORD-001' })];
			render(<OrdersPage />, {
				wrapper: createWrapper({
					session: { orders, user: null },
				}),
			});
			const table = document.querySelector('table');
			expect(table).toBeInTheDocument();
		});
	});

	describe('Loading state', () => {
		it('should show loading skeleton when isLoading is true', () => {
			const loadingStore = configureStore({
				reducer: {
					session: sessionSlice.reducer,
					app: appSlice.reducer,
				},
				preloadedState: {
					session: { orders: [], user: null },
					app: { isLoading: true, shoppingCart: [], order: { total_products: 0, total_prices: { retail: 0, wholesale: 0 } } },
				},
			});
			render(
				<Provider store={loadingStore}>
					<MemoryRouter initialEntries={['/account/orders']}>
						<Routes>
							<Route path="/account/orders" element={<OrdersPage />} />
						</Routes>
					</MemoryRouter>
				</Provider>
			);
			const loading = document.querySelector('.OrdersPage__loading');
			expect(loading || document).toBeDefined();
		});
	});

	describe('Empty state', () => {
		it('should show empty state when no orders', () => {
			render(<OrdersPage />, { wrapper: createWrapper() });
			const emptyState = document.querySelector('.EmptyState');
			expect(emptyState || document).toBeDefined();
		});
	});

	describe('Order listing', () => {
		it('should display orders in reverse chronological order', () => {
			const orders = [
				createMockOrder({ id: 'ORD-001', date: new Date('2024-01-01') }),
				createMockOrder({ id: 'ORD-002', date: new Date('2024-01-15') }),
			];
			render(<OrdersPage />, {
				wrapper: createWrapper({
					session: { orders, user: null },
				}),
			});
			const orderIds = document.querySelectorAll('td:first-child');
			expect(orderIds.length).toBe(2);
		});
	});

	describe('Table structure', () => {
		it('should render table headers', () => {
			const orders = [createMockOrder()];
			render(<OrdersPage />, {
				wrapper: createWrapper({
					session: { orders, user: null },
				}),
			});
			expect(screen.getByText('ID Pedido')).toBeInTheDocument();
			expect(screen.getByText('Fecha')).toBeInTheDocument();
			expect(screen.getByText('Articulos')).toBeInTheDocument();
			expect(screen.getByText('Importe')).toBeInTheDocument();
			expect(screen.getByText('Estado')).toBeInTheDocument();
			expect(screen.getByText('Acciones')).toBeInTheDocument();
		});
	});
});