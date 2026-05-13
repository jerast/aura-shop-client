import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { LoginForm } from '@/modules/auth/components/LoginForm.component';
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
		<MemoryRouter initialEntries={['/login']}>
			<Routes>
				<Route path="/login" element={children} />
				<Route path="/signup" element={<div>Signup page</div>} />
				<Route path="/" element={<div>Home</div>} />
			</Routes>
		</MemoryRouter>
	</Provider>
);

describe('LoginForm', () => {
	describe('Rendering', () => {
		it('should render login form', () => {
			render(<LoginForm disabled={false} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
		});

		it('should render email input', () => {
			render(<LoginForm disabled={false} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const inputs = screen.getAllByRole('textbox');
			expect(inputs.length).toBeGreaterThanOrEqual(1);
		});

		it('should render password input', () => {
			render(<LoginForm disabled={false} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const inputs = document.querySelectorAll('input[type="password"]');
			expect(inputs.length).toBeGreaterThanOrEqual(1);
		});

		it('should render submit button', () => {
			render(<LoginForm disabled={false} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument();
		});

		it('should render switch to signup link', () => {
			render(<LoginForm disabled={false} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			expect(screen.getByText('¿No tienes cuenta?')).toBeInTheDocument();
			expect(screen.getByText('Regístrate')).toBeInTheDocument();
		});
	});

	describe('Form fields', () => {
		it('should have empty email field by default', () => {
			render(<LoginForm disabled={false} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const emailInput = document.querySelector('input[name="loginEmail"]');
			expect(emailInput).toHaveValue('');
		});

		it('should have empty password field by default', () => {
			render(<LoginForm disabled={false} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const passwordInput = document.querySelector('input[name="loginPassword"]');
			expect(passwordInput).toHaveValue('');
		});
	});

	describe('Interaction', () => {
		it('should update email field on change', async () => {
			render(<LoginForm disabled={false} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const emailInput = document.querySelector('input[name="loginEmail"]');
			await userEvent.type(emailInput, 'test@example.com');
			expect(emailInput).toHaveValue('test@example.com');
		});

		it('should update password field on change', async () => {
			render(<LoginForm disabled={false} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const passwordInput = document.querySelector('input[name="loginPassword"]');
			await userEvent.type(passwordInput, 'password123');
			expect(passwordInput).toHaveValue('password123');
		});

		it('should call onSwitchForm when clicking register link', async () => {
			const onSwitchForm = vi.fn();
			render(<LoginForm disabled={false} onSwitchForm={onSwitchForm} />, {
				wrapper: createWrapper(),
			});
			await userEvent.click(screen.getByText('Regístrate'));
			expect(onSwitchForm).toHaveBeenCalled();
		});
	});

	describe('Error handling', () => {
		it('should display error message from state', () => {
			render(<LoginForm disabled={false} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper({ errorMessage: 'Credenciales incorrectas' }),
			});
			expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument();
		});

		it('should not display error when none exists', () => {
			render(<LoginForm disabled={false} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper({ errorMessage: null }),
			});
			const errorElement = document.querySelector('.Auth__error-message');
			expect(errorElement?.textContent).toBe('');
		});
	});

	describe('Disabled state', () => {
		it('should disable inputs when disabled prop is true', () => {
			render(<LoginForm disabled={true} onSwitchForm={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const inputs = document.querySelectorAll('input');
			inputs.forEach(input => {
				expect(input).toBeDisabled();
			});
		});
	});
});