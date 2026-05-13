import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { ProductCard } from '@/modules/shop/components/ProductCard';
import { createMockProduct } from '../../setup.js';
import { appSlice } from '@/store/slices/app.slice';
import { shopSlice } from '@/store/slices/shop.slice';

const createWrapper = () => ({ children }) => (
	<Provider store={configureStore({ 
		reducer: { 
			app: appSlice.reducer, 
			shop: shopSlice.reducer 
		} 
	})}>
		<MemoryRouter>{children}</MemoryRouter>
	</Provider>
);

describe('ProductCard', () => {
	const mockProduct = createMockProduct({
		id: 'prod-123',
		name: 'Crema Facial',
		prices: { retail: 50000, wholesale: 45000 },
	});

	it('should render without crashing', () => {
		const { container } = render(<ProductCard product={mockProduct} />, { wrapper: createWrapper() });
		expect(container).toBeDefined();
	});

	it('should render product name', () => {
		const { getByText } = render(<ProductCard product={mockProduct} />, { wrapper: createWrapper() });
		expect(getByText('Crema Facial')).toBeInTheDocument();
	});

	it('should render price elements', () => {
		const { container } = render(<ProductCard product={mockProduct} />, { wrapper: createWrapper() });
		const prices = container.querySelectorAll('.ProductCard__prices span');
		expect(prices.length).toBe(2);
	});

	it('should render different products', () => {
		const product = createMockProduct({ id: 'prod-2', name: 'Sérum', prices: { retail: 80000, wholesale: 72000 } });
		const { getByText } = render(<ProductCard product={product} />, { wrapper: createWrapper() });
		expect(getByText('Sérum')).toBeInTheDocument();
	});

	it('should handle product with status false', () => {
		const product = createMockProduct({ id: 'prod-3', name: 'Disabled', status: false });
		const { getByText } = render(<ProductCard product={product} />, { wrapper: createWrapper() });
		expect(getByText('Disabled')).toBeInTheDocument();
	});

	it('should render image', () => {
		const { container } = render(<ProductCard product={mockProduct} />, { wrapper: createWrapper() });
		const images = container.querySelectorAll('img');
		expect(images.length).toBeGreaterThan(0);
	});
});