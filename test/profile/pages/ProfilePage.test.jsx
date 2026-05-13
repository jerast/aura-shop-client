import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ProfilePage } from '@/modules/session/pages/Profile.page';
import { sessionSlice } from '@/store/slices/session.slice';

const createWrapper = (preloadedState = {}) => ({ children }) => (
	<Provider store={configureStore({
		reducer: { session: sessionSlice.reducer },
		preloadedState: {
			session: {
				user: null,
				...preloadedState,
			},
		},
	})}>
		<MemoryRouter initialEntries={['/account/profile']}>
			<Routes>
				<Route path="/account/profile" element={children} />
			</Routes>
		</MemoryRouter>
	</Provider>
);

describe('ProfilePage', () => {
	describe('Loading state', () => {
		it('should show loading message when no user', () => {
			render(<ProfilePage />, { wrapper: createWrapper({ user: null }) });
			expect(screen.getByText('Cargando información...')).toBeInTheDocument();
		});

		it('should show loading when user has no id', () => {
			render(<ProfilePage />, { wrapper: createWrapper({ user: {} }) });
			expect(screen.getByText('Cargando información...')).toBeInTheDocument();
		});
	});

	describe('Profile form', () => {
		const mockUser = {
			id: 'user-123',
			name: 'John',
			surname: 'Doe',
			email: 'john@example.com',
			phone: '1234567890',
			dniType: 'CC',
			dniNumber: '12345678',
			gender: 'M',
			birthday: '1990-01-15',
		};

		it('should render page title', () => {
			render(<ProfilePage />, { wrapper: createWrapper({ user: mockUser }) });
			expect(screen.getByRole('heading', { name: /mi perfil/i })).toBeInTheDocument();
		});

		it('should render subtitle', () => {
			render(<ProfilePage />, { wrapper: createWrapper({ user: mockUser }) });
			expect(screen.getByText('Gestiona tu información personal')).toBeInTheDocument();
		});

		it('should render form fields', () => {
			render(<ProfilePage />, { wrapper: createWrapper({ user: mockUser }) });
			expect(screen.getByText('Nombre')).toBeInTheDocument();
			expect(screen.getByText('Apellido')).toBeInTheDocument();
			expect(screen.getByText('Correo electrónico')).toBeInTheDocument();
			expect(screen.getByText('Teléfono')).toBeInTheDocument();
			expect(screen.getByText('Tipo de documento')).toBeInTheDocument();
			expect(screen.getByText('Número de documento')).toBeInTheDocument();
			expect(screen.getByText('Género')).toBeInTheDocument();
			expect(screen.getByText('Fecha de nacimiento')).toBeInTheDocument();
		});

		it('should pre-fill form with user data', () => {
			render(<ProfilePage />, { wrapper: createWrapper({ user: mockUser }) });
			const nameInput = document.querySelector('input[name="name"]');
			const surnameInput = document.querySelector('input[name="surname"]');
			expect(nameInput?.value).toBe('John');
			expect(surnameInput?.value).toBe('Doe');
		});

		it('should display email as read-only', () => {
			render(<ProfilePage />, { wrapper: createWrapper({ user: mockUser }) });
			const emailInput = document.querySelector('input[name="email"]');
			expect(emailInput?.value).toBe('john@example.com');
			expect(emailInput).toBeDisabled();
		});

		it('should render save button', () => {
			render(<ProfilePage />, { wrapper: createWrapper({ user: mockUser }) });
			expect(screen.getByRole('button', { name: /guardar cambios/i })).toBeInTheDocument();
		});
	});

	describe('Save button state', () => {
		const mockUser = {
			id: 'user-123',
			name: 'John',
			surname: 'Doe',
			email: 'john@example.com',
		};

		it('should render save button', () => {
			render(<ProfilePage />, { wrapper: createWrapper({ user: mockUser }) });
			const submitButton = screen.getByRole('button', { name: /guardar cambios/i });
			expect(submitButton).toBeInTheDocument();
		});
	});

	describe('Form interaction', () => {
		const mockUser = {
			id: 'user-123',
			name: '',
			surname: '',
			email: 'test@example.com',
		};

		it('should update name field', async () => {
			render(<ProfilePage />, { wrapper: createWrapper({ user: mockUser }) });
			const nameInput = document.querySelector('input[name="name"]');
			await userEvent.type(nameInput, 'Jane');
			expect(nameInput?.value).toBe('Jane');
		});

		it('should update surname field', async () => {
			render(<ProfilePage />, { wrapper: createWrapper({ user: mockUser }) });
			const surnameInput = document.querySelector('input[name="surname"]');
			await userEvent.type(surnameInput, 'Smith');
			expect(surnameInput?.value).toBe('Smith');
		});
	});
});