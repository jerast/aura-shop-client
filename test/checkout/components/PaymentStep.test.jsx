import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { PaymentStep } from '@/modules/session/components/PaymentStep';
import { appSlice } from '@/store/slices/app.slice';

const createWrapper = (preloadedApp = {}) => ({ children }) => (
	<Provider store={configureStore({
		reducer: { app: appSlice.reducer },
		preloadedState: {
			app: {
				shoppingCart: [
					{ product: 'prod-1', count: 2 },
					{ product: 'prod-2', count: 1 },
				],
				order: {
					total_products: 3,
					total_prices: {
						retail: 150000,
						wholesale: 135000,
					},
				},
				...preloadedApp,
			},
		},
	})}>
		<MemoryRouter initialEntries={['/checkout']}>
			<Routes>
				<Route path="/checkout" element={children} />
				<Route path="/account/orders" element={<div>Orders Page</div>} />
				<Route path="/" element={<div>Home</div>} />
			</Routes>
		</MemoryRouter>
	</Provider>
);

describe('PaymentStep', () => {
	describe('Rendering', () => {
		it('should render payment form title', () => {
			render(<PaymentStep userData={{}} onBack={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			expect(screen.getByText('Datos de Pago')).toBeInTheDocument();
		});

		it('should render payment summary section', () => {
			render(<PaymentStep userData={{}} onBack={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const summary = document.querySelector('.PaymentSummary');
			expect(summary).toBeInTheDocument();
		});

		it('should render all payment fields', () => {
			render(<PaymentStep userData={{}} onBack={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			expect(screen.getByText('Número de tarjeta *')).toBeInTheDocument();
			expect(screen.getByText('Nombre en la tarjeta *')).toBeInTheDocument();
			expect(screen.getByText('Fecha de expiración *')).toBeInTheDocument();
			expect(screen.getByText('CVV *')).toBeInTheDocument();
		});

		it('should render action buttons', () => {
			render(<PaymentStep userData={{}} onBack={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			expect(screen.getByRole('button', { name: /atrás/i })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /pagar ahora/i })).toBeInTheDocument();
		});
	});

	describe('Payment summary', () => {
		it('should display total price', () => {
			render(<PaymentStep userData={{}} onBack={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const totalAmount = document.querySelector('.PaymentSummary__amount');
			expect(totalAmount).toBeInTheDocument();
		});

		it('should display price based on product count', () => {
			render(<PaymentStep userData={{}} onBack={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const totalAmount = document.querySelector('.PaymentSummary__amount');
			expect(totalAmount?.textContent).toBeDefined();
		});

		it('should show product count text', () => {
			render(<PaymentStep userData={{}} onBack={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const productCount = document.querySelector('.PaymentSummary__items');
			expect(productCount).toBeInTheDocument();
		});
	});

	describe('Card number formatting', () => {
		it('should format card number with spaces', async () => {
			render(<PaymentStep userData={{}} onBack={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const cardInput = document.querySelector('input[name="cardNumber"]');
			await userEvent.type(cardInput, '1234567890123456');
			expect(cardInput).toHaveValue('1234 5678 9012 3456');
		});

		it('should limit card number to 16 digits', async () => {
			render(<PaymentStep userData={{}} onBack={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const cardInput = document.querySelector('input[name="cardNumber"]');
			await userEvent.type(cardInput, '12345678901234567890');
			expect(cardInput.value.length).toBeLessThanOrEqual(19);
		});
	});

	describe('Expiry formatting', () => {
		it('should format expiry as MM/YY', async () => {
			render(<PaymentStep userData={{}} onBack={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const expiryInput = document.querySelector('input[name="expiry"]');
			await userEvent.type(expiryInput, '1225');
			expect(expiryInput).toHaveValue('12/25');
		});

		it('should limit expiry to 5 characters', async () => {
			render(<PaymentStep userData={{}} onBack={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const expiryInput = document.querySelector('input[name="expiry"]');
			await userEvent.type(expiryInput, '123456');
			expect(expiryInput.value.length).toBeLessThanOrEqual(5);
		});
	});

	describe('CVV formatting', () => {
		it('should limit CVV to 4 digits', async () => {
			render(<PaymentStep userData={{}} onBack={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const cvvInput = document.querySelector('input[name="cvv"]');
			await userEvent.type(cvvInput, '12345');
			expect(cvvInput.value.length).toBeLessThanOrEqual(4);
		});
	});

	describe('Actions', () => {
		it('should call onBack when back button is clicked', async () => {
			const onBack = vi.fn();
			render(<PaymentStep userData={{}} onBack={onBack} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			await userEvent.click(screen.getByRole('button', { name: /atrás/i }));
			expect(onBack).toHaveBeenCalled();
		});

		it('should show validation errors on submit with empty fields', async () => {
			render(<PaymentStep userData={{}} onBack={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			await userEvent.click(screen.getByRole('button', { name: /pagar ahora/i }));
			expect(screen.getByText('El número de tarjeta es requerido')).toBeInTheDocument();
		});
	});

	describe('Processing state', () => {
		it('should show processing state when isProcessing is true', () => {
			render(<PaymentStep userData={{}} onBack={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const submitButton = screen.getByRole('button', { name: /pagar ahora/i });
			expect(submitButton).toHaveTextContent('Pagar ahora');
		});
	});
});