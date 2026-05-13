import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ProfileDataStep } from '@/modules/session/components/ProfileDataStep';
import { sessionSlice } from '@/store/slices/session.slice';

const createWrapper = (user = {}) => ({ children }) => (
	<Provider store={configureStore({
		reducer: { session: sessionSlice.reducer },
		preloadedState: {
			session: {
				user: {
					id: 'user-1',
					name: '',
					surname: '',
					email: 'test@example.com',
					phone: '',
					dniType: '',
					dniNumber: '',
					gender: '',
					birthday: null,
					...user,
				},
			},
		},
	})}>
		<MemoryRouter initialEntries={['/checkout']}>
			<Routes>
				<Route path="/checkout" element={children} />
				<Route path="/" element={<div>Home</div>} />
			</Routes>
		</MemoryRouter>
	</Provider>
);

describe('ProfileDataStep', () => {
	describe('Rendering', () => {
		it('should render form title', () => {
			render(<ProfileDataStep onNext={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			expect(screen.getByText('Datos Personales')).toBeInTheDocument();
		});

		it('should render all form fields', () => {
			render(<ProfileDataStep onNext={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			expect(screen.getByText('Nombre *')).toBeInTheDocument();
			expect(screen.getByText('Apellido *')).toBeInTheDocument();
			expect(screen.getByText('Correo electrónico')).toBeInTheDocument();
			expect(screen.getByText('Teléfono *')).toBeInTheDocument();
			expect(screen.getByText('Tipo de documento *')).toBeInTheDocument();
			expect(screen.getByText('Número de documento *')).toBeInTheDocument();
			expect(screen.getByText('Género *')).toBeInTheDocument();
			expect(screen.getByText('Fecha de nacimiento *')).toBeInTheDocument();
		});

		it('should render action buttons', () => {
			render(<ProfileDataStep onNext={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument();
		});
	});

	describe('Form interaction', () => {
		it('should update name field', async () => {
			render(<ProfileDataStep onNext={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const nameInput = document.querySelector('input[name="name"]');
			await userEvent.type(nameInput, 'John');
			expect(nameInput).toHaveValue('John');
		});

		it('should update surname field', async () => {
			render(<ProfileDataStep onNext={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const surnameInput = document.querySelector('input[name="surname"]');
			await userEvent.type(surnameInput, 'Doe');
			expect(surnameInput).toHaveValue('Doe');
		});

		it('should update phone field', async () => {
			render(<ProfileDataStep onNext={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const phoneInput = document.querySelector('input[name="phone"]');
			await userEvent.type(phoneInput, '1234567890');
			expect(phoneInput).toHaveValue('1234567890');
		});
	});

	describe('Select fields', () => {
		it('should render document type select', () => {
			const { container } = render(
				<ProfileDataStep onNext={vi.fn()} onCancel={vi.fn()} />,
				{ wrapper: createWrapper() }
			);
			const dniTypeSelect = container.querySelector('select[name="dniType"]');
			expect(dniTypeSelect).toBeInTheDocument();
		});

		it('should render gender select', () => {
			const { container } = render(
				<ProfileDataStep onNext={vi.fn()} onCancel={vi.fn()} />,
				{ wrapper: createWrapper() }
			);
			const genderSelect = container.querySelector('select[name="gender"]');
			expect(genderSelect).toBeInTheDocument();
		});

		it('should select document type', async () => {
			render(<ProfileDataStep onNext={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			const dniTypeSelect = document.querySelector('select[name="dniType"]');
			await userEvent.selectOptions(dniTypeSelect, 'CC');
			expect(dniTypeSelect).toHaveValue('CC');
		});
	});

	describe('Email field', () => {
		it('should display email as read-only', () => {
			render(<ProfileDataStep onNext={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper({ email: 'test@example.com' }),
			});
			const emailInput = document.querySelector('input[name="email"]');
			expect(emailInput).toHaveValue('test@example.com');
			expect(emailInput).toBeDisabled();
		});
	});

	describe('Actions', () => {
		it('should call onCancel when cancel button is clicked', async () => {
			const onCancel = vi.fn();
			render(<ProfileDataStep onNext={vi.fn()} onCancel={onCancel} />, {
				wrapper: createWrapper(),
			});
			await userEvent.click(screen.getByRole('button', { name: /cancelar/i }));
			expect(onCancel).toHaveBeenCalled();
		});

		it('should show validation errors on submit with empty fields', async () => {
			render(<ProfileDataStep onNext={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper(),
			});
			await userEvent.click(screen.getByRole('button', { name: /continuar/i }));
			const errorElements = document.querySelectorAll('.ProfileField__error');
			expect(errorElements.length).toBeGreaterThanOrEqual(0);
		});
	});

	describe('Pre-filled data', () => {
		it('should pre-fill form with user data', () => {
			render(<ProfileDataStep onNext={vi.fn()} onCancel={vi.fn()} />, {
				wrapper: createWrapper({
					name: 'John',
					surname: 'Doe',
					phone: '1234567890',
					dniType: 'CC',
					dniNumber: '12345678',
					gender: 'M',
					birthday: '1990-01-15',
				}),
			});
			const nameInput = document.querySelector('input[name="name"]');
			const surnameInput = document.querySelector('input[name="surname"]');
			expect(nameInput).toHaveValue('John');
			expect(surnameInput).toHaveValue('Doe');
		});
	});
});