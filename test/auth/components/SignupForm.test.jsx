import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { SignupForm } from '@/modules/auth/components/SignupForm.component';
import { sessionSlice } from '@/store/slices/session.slice';

const createWrapper = (preloadedState = {}) => ({ children }) => (
	<Provider store={configureStore({
		reducer: { session: sessionSlice.reducer },
		preloadedState: {
			session: {
				isChecking: false,
				isAuthenticated: false,
				user: null,
				errorMessage: null,
				...preloadedState,
			},
		},
	})}>
		<MemoryRouter initialEntries={['/signup']}>
			<Routes>
				<Route path="/signup" element={children} />
				<Route path="/login" element={<div>Login page</div>} />
				<Route path="/" element={<div>Home</div>} />
			</Routes>
		</MemoryRouter>
	</Provider>
);

describe('SignupForm', () => {
	describe('Rendering', () => {
		it('should render signup form', () => {
			render(<SignupForm disabled={false} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			expect(screen.getByText('Crear Usuario')).toBeInTheDocument();
		});

		it('should render three inputs', () => {
			render(<SignupForm disabled={false} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const inputs = screen.getAllByRole('textbox');
			expect(inputs.length).toBe(1);
			const passwordInputs = document.querySelectorAll('input[type="password"]');
			expect(passwordInputs.length).toBe(2);
		});

		it('should render submit button', () => {
			render(<SignupForm disabled={false} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument();
		});

		it('should render switch to login link', () => {
			render(<SignupForm disabled={false} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			expect(screen.getByText('¿Ya tienes una cuenta?')).toBeInTheDocument();
			expect(screen.getByText('Inicia sesión')).toBeInTheDocument();
		});
	});

	describe('Form fields', () => {
		it('should have empty email field by default', () => {
			render(<SignupForm disabled={false} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const emailInput = document.querySelector('input[name="signEmail"]');
			expect(emailInput).toHaveValue('');
		});

		it('should have empty password fields by default', () => {
			render(<SignupForm disabled={false} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const passwordInput = document.querySelector('input[name="signPassword"]');
			const confirmInput = document.querySelector('input[name="signConfirmPassword"]');
			expect(passwordInput).toHaveValue('');
			expect(confirmInput).toHaveValue('');
		});
	});

	describe('Interaction', () => {
		it('should update email field on change', async () => {
			render(<SignupForm disabled={false} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const emailInput = document.querySelector('input[name="signEmail"]');
			await userEvent.type(emailInput, 'new@example.com');
			expect(emailInput).toHaveValue('new@example.com');
		});

		it('should update password field on change', async () => {
			render(<SignupForm disabled={false} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const passwordInput = document.querySelector('input[name="signPassword"]');
			await userEvent.type(passwordInput, 'password123');
			expect(passwordInput).toHaveValue('password123');
		});

		it('should update confirm password field on change', async () => {
			render(<SignupForm disabled={false} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const confirmInput = document.querySelector('input[name="signConfirmPassword"]');
			await userEvent.type(confirmInput, 'password123');
			expect(confirmInput).toHaveValue('password123');
		});

		it('should call onSwitchForm when clicking login link', async () => {
			const onSwitchForm = vi.fn();
			render(<SignupForm disabled={false} onSwitchForm={onSwitchForm} />, {
				wrapper: createWrapper(),
			});
			await userEvent.click(screen.getByText('Inicia sesión'));
			expect(onSwitchForm).toHaveBeenCalled();
		});
	});

	describe('Error handling', () => {
		it('should display error message from state', () => {
			render(<SignupForm disabled={false} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper({ errorMessage: 'Este email ya existe' }),
			});
			expect(screen.getByText('Este email ya existe')).toBeInTheDocument();
		});
	});

	describe('Disabled state', () => {
		it('should disable inputs when disabled prop is true', () => {
			render(<SignupForm disabled={true} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const inputs = document.querySelectorAll('input');
			inputs.forEach(input => {
				expect(input).toBeDisabled();
			});
		});
	});
});