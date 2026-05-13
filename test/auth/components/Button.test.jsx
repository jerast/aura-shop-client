import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Button } from '@/modules/auth/components/Button';
import { sessionSlice } from '@/store/slices/session.slice';

const createWrapper = (preloadedState = {}) => ({ children }) => (
	<Provider store={configureStore({
		reducer: { session: sessionSlice.reducer },
		preloadedState: {
			session: { isChecking: false, ...preloadedState },
		},
	})}>
		{children}
	</Provider>
);

describe('Button', () => {
	describe('Rendering', () => {
		it('should render button element', () => {
			const { container } = render(<Button value="Submit" />, {
				wrapper: createWrapper(),
			});
			expect(container.querySelector('button')).toBeInTheDocument();
		});

		it('should display value text', () => {
			const { getByRole } = render(<Button value="Continuar" />, {
				wrapper: createWrapper(),
			});
			expect(getByRole('button')).toHaveTextContent('Continuar');
		});

		it('should have fluid class', () => {
			const { container } = render(<Button value="Test" />, {
				wrapper: createWrapper(),
			});
			expect(container.querySelector('button')).toHaveClass('fluid');
		});
	});

	describe('Loading state', () => {
		it('should show dots when isChecking is true', () => {
			const { getByRole } = render(<Button value="Submit" />, {
				wrapper: createWrapper({ isChecking: true }),
			});
			expect(getByRole('button')).toHaveTextContent('...');
		});

		it('should show value when isChecking is false', () => {
			const { getByRole } = render(<Button value="Submit" />, {
				wrapper: createWrapper({ isChecking: false }),
			});
			expect(getByRole('button')).toHaveTextContent('Submit');
		});
	});

	describe('Disabled state', () => {
		it('should be disabled when disabled prop is true', () => {
			const { container } = render(<Button value="Submit" disabled={true} />, {
				wrapper: createWrapper(),
			});
			expect(container.querySelector('button')).toBeDisabled();
		});

		it('should be disabled when isChecking is true', () => {
			const { container } = render(<Button value="Submit" />, {
				wrapper: createWrapper({ isChecking: true }),
			});
			expect(container.querySelector('button')).toBeDisabled();
		});

		it('should be enabled when both isChecking and disabled are false', () => {
			const { container } = render(<Button value="Submit" disabled={false} />, {
				wrapper: createWrapper({ isChecking: false }),
			});
			expect(container.querySelector('button')).not.toBeDisabled();
		});
	});
});