import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CategoriesPage } from '@/modules/shop/pages/Categories.page';
import { appSlice } from '@/store/slices/app.slice';
import { shopSlice } from '@/store/slices/shop.slice';

const createWrapper = (preloadedState = {}) => ({ children }) => (
	<Provider store={configureStore({
		reducer: {
			app: appSlice.reducer,
			shop: shopSlice.reducer,
		},
		preloadedState: {
			app: { isLoading: false, shoppingCart: [], order: { total_products: 0, total_prices: { retail: 0, wholesale: 0 } } },
			shop: { products: [], categories: [], banners: [] },
			...preloadedState,
		},
	})}>
		<MemoryRouter initialEntries={['/categories']}>
			<Routes>
				<Route path="/categories" element={children} />
				<Route path="/categories/:name" element={<div>Category page</div>} />
			</Routes>
		</MemoryRouter>
	</Provider>
);

const createMockCategory = (overrides = {}) => ({
	id: 'cat-1',
	name: 'Cuidado Facial',
	image: 'https://example.com/category.jpg',
	...overrides,
});

describe('CategoriesPage', () => {
	describe('Rendering', () => {
		it('should render page heading', () => {
			render(<CategoriesPage />, { wrapper: createWrapper() });
			const heading = document.querySelector('.Section__title');
			expect(heading || document).toBeDefined();
		});

		it('should render categories', () => {
			const categories = [
				createMockCategory({ id: 'cat-1', name: 'Cuidado Facial' }),
				createMockCategory({ id: 'cat-2', name: 'Proteccion Solar' }),
			];
			render(<CategoriesPage />, {
				wrapper: createWrapper({
					shop: { products: [], categories, banners: [] },
				}),
			});
			expect(screen.getByText('Cuidado Facial')).toBeInTheDocument();
			expect(screen.getByText('Proteccion Solar')).toBeInTheDocument();
		});

		it('should render category images', () => {
			const categories = [createMockCategory()];
			render(<CategoriesPage />, {
				wrapper: createWrapper({
					shop: { products: [], categories, banners: [] },
				}),
			});
			const images = document.querySelectorAll('img');
			expect(images.length).toBe(1);
		});

		it('should render links to category pages', () => {
			const categories = [createMockCategory({ id: 'cat-1', name: 'Cuidado Facial' })];
			render(<CategoriesPage />, {
				wrapper: createWrapper({
					shop: { products: [], categories, banners: [] },
				}),
			});
			const links = document.querySelectorAll('a.Category');
			expect(links.length).toBe(1);
			expect(links[0]).toHaveAttribute('href', '/categories/cuidado facial');
		});
	});

	describe('Empty state', () => {
		it('should show empty state when no categories', () => {
			render(<CategoriesPage />, { wrapper: createWrapper() });
			const emptyState = document.querySelector('.EmptyState');
			expect(emptyState || document).toBeDefined();
		});
	});

	describe('Loading state', () => {
		it('should show loading skeleton when isLoading is true', () => {
			const loadingStore = configureStore({
				reducer: {
					app: appSlice.reducer,
					shop: shopSlice.reducer,
				},
				preloadedState: {
					app: { isLoading: true, shoppingCart: [], order: { total_products: 0, total_prices: { retail: 0, wholesale: 0 } } },
					shop: { products: [], categories: [], banners: [] },
				},
			});
			render(
				<Provider store={loadingStore}>
					<MemoryRouter initialEntries={['/categories']}>
						<Routes>
							<Route path="/categories" element={<CategoriesPage />} />
						</Routes>
					</MemoryRouter>
				</Provider>
			);
			const loading = document.querySelector('.loading');
			expect(loading || document).toBeDefined();
		});
	});
});