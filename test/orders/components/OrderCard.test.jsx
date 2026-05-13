import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { OrderCard } from '@/modules/session/components/OrderCard';
import { sessionSlice } from '@/store/slices/session.slice';

const createWrapper = () => ({ children }) => (
	<Provider store={configureStore({
		reducer: { session: sessionSlice.reducer },
		preloadedState: {
			session: { orders: [], user: null },
		},
	})}>
		<MemoryRouter initialEntries={['/account/orders']}>
			<Routes>
				<Route path="/account/orders" element={<table><tbody>{children}</tbody></table>} />
				<Route path="/account/orders/:id" element={<div>Order Detail</div>} />
			</Routes>
		</MemoryRouter>
	</Provider>
);

const createMockOrder = (overrides = {}) => ({
	id: 'ORD-001',
	date: new Date('2024-01-15'),
	list: [{ product: 'prod-1', count: 2 }],
	total_price: 100000,
	status: 'pending',
	...overrides,
});

describe('OrderCard', () => {
	describe('Rendering', () => {
		it('should render order ID', () => {
			const order = createMockOrder({ id: 'ORD-123' });
			render(<OrderCard order={order} />, { wrapper: createWrapper() });
			expect(screen.getByText('ORD-123')).toBeInTheDocument();
		});

		it('should render formatted date', () => {
			const order = createMockOrder({ date: new Date('2024-06-15') });
			render(<OrderCard order={order} />, { wrapper: createWrapper() });
			const dateCell = document.querySelector('td:nth-child(2)');
			expect(dateCell).toBeInTheDocument();
		});

		it('should render total items count', () => {
			const order = createMockOrder({ 
				list: [
					{ product: 'p1', count: 2 },
					{ product: 'p2', count: 3 },
				],
			});
			render(<OrderCard order={order} />, { wrapper: createWrapper() });
			const itemsCell = document.querySelector('td:nth-child(3)');
			expect(itemsCell?.textContent).toBe('5');
		});

		it('should render formatted price', () => {
			const order = createMockOrder({ total_price: 150000 });
			render(<OrderCard order={order} />, { wrapper: createWrapper() });
			const priceCell = document.querySelector('td:nth-child(4)');
			expect(priceCell).toBeInTheDocument();
		});
	});

	describe('Status badges', () => {
		it('should render pending status', () => {
			const order = createMockOrder({ status: 'pending' });
			render(<OrderCard order={order} />, { wrapper: createWrapper() });
			expect(screen.getByText('Pendiente')).toBeInTheDocument();
		});

		it('should render ready status', () => {
			const order = createMockOrder({ status: 'ready' });
			render(<OrderCard order={order} />, { wrapper: createWrapper() });
			expect(screen.getByText('Listo')).toBeInTheDocument();
		});

		it('should render delivered status', () => {
			const order = createMockOrder({ status: 'delivered' });
			render(<OrderCard order={order} />, { wrapper: createWrapper() });
			expect(screen.getByText('Entregado')).toBeInTheDocument();
		});

		it('should render canceled status', () => {
			const order = createMockOrder({ status: 'canceled' });
			render(<OrderCard order={order} />, { wrapper: createWrapper() });
			expect(screen.getByText('Cancelado')).toBeInTheDocument();
		});
	});

	describe('Actions', () => {
		it('should render view button', () => {
			const order = createMockOrder({ id: 'ORD-001' });
			render(<OrderCard order={order} />, { wrapper: createWrapper() });
			const viewButton = document.querySelector(`a[href="/account/orders/ORD-001"]`);
			expect(viewButton).toBeInTheDocument();
		});

		it('should not render menu button for canceled orders', () => {
			const order = createMockOrder({ status: 'canceled' });
			render(<OrderCard order={order} />, { wrapper: createWrapper() });
			const menuButton = document.querySelector('button[aria-label*="Cambiar estado"]');
			expect(menuButton).not.toBeInTheDocument();
		});

		it('should render menu button for non-canceled orders', () => {
			const order = createMockOrder({ status: 'pending' });
			render(<OrderCard order={order} />, { wrapper: createWrapper() });
			const menuButton = document.querySelector('button[aria-label*="Cambiar estado"]');
			expect(menuButton).toBeInTheDocument();
		});
	});
});