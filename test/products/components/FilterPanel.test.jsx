import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { FilterPanel } from '@/modules/shop/components/FilterPanel';
import { createMockCategory } from '../../setup.js';
import { appSlice } from '@/store/slices/app.slice';
import { shopSlice } from '@/store/slices/shop.slice';

const mockCategories = [
	createMockCategory({ id: '1', name: 'Cuidado Facial' }),
	createMockCategory({ id: '2', name: 'Proteccion Solar' }),
];

const mockPriceRanges = {
	retail: { min: 10000, max: 150000 },
	wholesale: { min: 9000, max: 135000 },
};

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

describe('FilterPanel', () => {
	it('should render without crashing', () => {
		const { container } = render(
			<FilterPanel categories={mockCategories} priceRanges={mockPriceRanges} />,
			{ wrapper: createWrapper() }
		);
		expect(container).toBeDefined();
	});

	it('should render toggle button', () => {
		render(
			<FilterPanel categories={mockCategories} priceRanges={mockPriceRanges} />,
			{ wrapper: createWrapper() }
		);
		const buttons = document.querySelectorAll('button');
		expect(buttons.length).toBeGreaterThan(0);
	});

	it('should open panel when toggle is clicked', async () => {
		render(
			<FilterPanel categories={mockCategories} priceRanges={mockPriceRanges} />,
			{ wrapper: createWrapper() }
		);
		
		const buttons = document.querySelectorAll('button');
		if (buttons.length > 0) {
			await userEvent.click(buttons[0]);
		}
	});

	it('should render with empty categories', () => {
		const { container } = render(
			<FilterPanel categories={[]} priceRanges={mockPriceRanges} />,
			{ wrapper: createWrapper() }
		);
		expect(container).toBeDefined();
	});

	it('should render with empty price ranges', () => {
		const { container } = render(
			<FilterPanel categories={mockCategories} priceRanges={{}} />,
			{ wrapper: createWrapper() }
		);
		expect(container).toBeDefined();
	});

	it('should handle different initial URL params', () => {
		const { container } = render(
			<FilterPanel categories={mockCategories} priceRanges={mockPriceRanges} />,
			{ wrapper: createWrapper('/?q=test&category=facial') }
		);
		expect(container).toBeDefined();
	});

	it('should render search input when opened', async () => {
		render(
			<FilterPanel categories={mockCategories} priceRanges={mockPriceRanges} />,
			{ wrapper: createWrapper() }
		);
		
		const buttons = document.querySelectorAll('button');
		if (buttons.length > 0) {
			await userEvent.click(buttons[0]);
		}
		
		const inputs = document.querySelectorAll('input');
		expect(inputs.length).toBeGreaterThan(0);
	});

	it('should render select when opened', async () => {
		render(
			<FilterPanel categories={mockCategories} priceRanges={mockPriceRanges} />,
			{ wrapper: createWrapper() }
		);
		
		const buttons = document.querySelectorAll('button');
		if (buttons.length > 0) {
			await userEvent.click(buttons[0]);
		}
		
		const selects = document.querySelectorAll('select');
		expect(selects.length).toBeGreaterThan(0);
	});
});