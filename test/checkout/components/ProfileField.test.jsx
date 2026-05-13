import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileField } from '@/modules/session/components/ProfileField';

describe('ProfileField', () => {
	describe('Rendering', () => {
		it('should render label', () => {
			render(<ProfileField label="Nombre *" name="name" />);
			expect(screen.getByText('Nombre *')).toBeInTheDocument();
		});

		it('should render input by default', () => {
			const { container } = render(<ProfileField label="Test" name="test" />);
			expect(container.querySelector('input')).toBeInTheDocument();
		});
	});

	describe('Input types', () => {
		it('should render text input', () => {
			const { container } = render(
				<ProfileField type="text" name="name" label="Nombre" />
			);
			const input = container.querySelector('input[type="text"]');
			expect(input).toBeInTheDocument();
		});

		it('should render email input', () => {
			const { container } = render(
				<ProfileField type="email" name="email" label="Email" />
			);
			const input = container.querySelector('input[type="email"]');
			expect(input).toBeInTheDocument();
		});

		it('should render date input', () => {
			const { container } = render(
				<ProfileField type="date" name="birthday" label="Fecha" />
			);
			const input = container.querySelector('input[type="date"]');
			expect(input).toBeInTheDocument();
		});

		it('should render tel input', () => {
			const { container } = render(
				<ProfileField type="tel" name="phone" label="Teléfono" />
			);
			const input = container.querySelector('input[type="tel"]');
			expect(input).toBeInTheDocument();
		});
	});

	describe('Select type', () => {
		it('should render select when type is select', () => {
			const options = [
				{ value: 'CC', label: 'Cédula' },
				{ value: 'CE', label: 'Cédula Extranjería' },
			];
			const { container } = render(
				<ProfileField type="select" name="dniType" label="Tipo" options={options} />
			);
			expect(container.querySelector('select')).toBeInTheDocument();
		});

		it('should render option elements', () => {
			const options = [
				{ value: 'CC', label: 'Cédula' },
				{ value: 'CE', label: 'Cédula Extranjería' },
			];
			const { container } = render(
				<ProfileField type="select" name="dniType" label="Tipo" options={options} />
			);
			const select = container.querySelector('select');
			const optionElements = select.querySelectorAll('option');
			expect(optionElements.length).toBe(3);
		});

		it('should have default "Seleccionar..." option', () => {
			const options = [
				{ value: 'CC', label: 'Cédula' },
			];
			render(<ProfileField type="select" name="dniType" label="Tipo" options={options} />);
			expect(screen.getByText('Seleccionar...')).toBeInTheDocument();
		});
	});

	describe('Value handling', () => {
		it('should display value', () => {
			render(<ProfileField name="name" label="Nombre" value="John" />);
			const input = document.querySelector('input[name="name"]');
			expect(input).toHaveValue('John');
		});

		it('should call onChange when value changes', async () => {
			const onChange = vi.fn();
			render(<ProfileField name="name" label="Nombre" onChange={onChange} />);
			const input = document.querySelector('input[name="name"]');
			await userEvent.type(input, 'Doe');
			expect(onChange).toHaveBeenCalled();
		});
	});

	describe('Error state', () => {
		it('should display error message', () => {
			render(<ProfileField name="name" label="Nombre" error="El nombre es requerido" />);
			expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
		});

		it('should have error class on input', () => {
			const { container } = render(
				<ProfileField name="name" label="Nombre" error="Error" />
			);
			const input = container.querySelector('.ProfileField__input--error');
			expect(input).toBeInTheDocument();
		});

		it('should have error class on select', () => {
			const options = [{ value: 'CC', label: 'Cédula' }];
			const { container } = render(
				<ProfileField type="select" name="dniType" label="Tipo" options={options} error="Required" />
			);
			const select = container.querySelector('.ProfileField__select--error');
			expect(select).toBeInTheDocument();
		});
	});

	describe('Disabled state', () => {
		it('should disable input when disabled prop is true', () => {
			const { container } = render(
				<ProfileField name="email" label="Email" disabled={true} />
			);
			const input = container.querySelector('input');
			expect(input).toBeDisabled();
		});

		it('should have disabled class on input', () => {
			const { container } = render(
				<ProfileField name="email" label="Email" disabled={true} />
			);
			const disabledInput = container.querySelector('.ProfileField__input--disabled');
			expect(disabledInput).toBeInTheDocument();
		});
	});
});