import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/modules/auth/components/Input';

describe('Input', () => {
	describe('Rendering', () => {
		it('should render input element', () => {
			const { container } = render(
				<Input type="text" name="test" placeholder="Test placeholder" />
			);
			const input = container.querySelector('input');
			expect(input).toBeInTheDocument();
		});

		it('should display placeholder as label', () => {
			render(<Input type="text" name="test" placeholder="Correo electrónico" />);
			expect(screen.getByText('Correo electrónico')).toBeInTheDocument();
		});

		it('should render with correct type attribute', () => {
			const { container } = render(<Input type="email" name="email" />);
			const input = container.querySelector('input');
			expect(input).toHaveAttribute('type', 'email');
		});

		it('should render password input', () => {
			const { container } = render(<Input type="password" name="password" />);
			const input = container.querySelector('input');
			expect(input).toHaveAttribute('type', 'password');
		});
	});

	describe('Interaction', () => {
		it('should call onChange when typing', async () => {
			const onChange = vi.fn();
			render(
				<Input type="text" name="test" value="" onChange={onChange} />
			);
			const input = screen.getByRole('textbox');
			await userEvent.type(input, 'hello');
			expect(onChange).toHaveBeenCalled();
		});

		it('should display value', () => {
			render(<Input type="text" name="test" value="test value" />);
			const input = screen.getByRole('textbox');
			expect(input).toHaveValue('test value');
		});

		it('should be disabled when disabled prop is true', () => {
			const { container } = render(
				<Input type="text" name="test" disabled={true} />
			);
			const input = container.querySelector('input');
			expect(input).toBeDisabled();
		});

		it('should have required attribute', () => {
			const { container } = render(
				<Input type="text" name="test" required={true} />
			);
			const input = container.querySelector('input');
			expect(input).toHaveAttribute('required');
		});
	});

	describe('Password toggle', () => {
		it('should show toggle icon for password type', () => {
			const { container } = render(<Input type="password" name="password" />);
			const icon = container.querySelector('.form__input-icon');
			expect(icon).toBeInTheDocument();
		});

		it('should not show toggle icon for non-password types', () => {
			const { container } = render(<Input type="email" name="email" />);
			const icon = container.querySelector('.form__input-icon');
			expect(icon).not.toBeInTheDocument();
		});

		it('should toggle password visibility on icon click', async () => {
			render(<Input type="password" name="password" />);
			const icon = document.querySelector('.form__input-icon');
			await userEvent.click(icon);
			const input = screen.getByRole('textbox');
			expect(input).toHaveAttribute('type', 'text');
		});

		it('should hide password again on second click', async () => {
			render(<Input type="password" name="password" />);
			const icon = document.querySelector('.form__input-icon');
			await userEvent.click(icon);
			await userEvent.click(icon);
			const input = document.querySelector('input[name="password"]');
			expect(input).toHaveAttribute('type', 'password');
		});
	});

	describe('Label behavior', () => {
		it('should have active label when value is present', () => {
			const { container } = render(
				<Input type="text" name="test" value="something" placeholder="Test" />
			);
			const label = container.querySelector('.form__input-label');
			expect(label).toHaveClass('form__input-label--active');
		});

		it('should not have active label when value is empty', () => {
			const { container } = render(
				<Input type="text" name="test" value="" placeholder="Test" />
			);
			const label = container.querySelector('.form__input-label');
			expect(label).not.toHaveClass('form__input-label--active');
		});
	});
});