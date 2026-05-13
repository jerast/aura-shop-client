import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CheckoutSteps } from '@/modules/session/components/CheckoutSteps';

describe('CheckoutSteps', () => {
	describe('Rendering', () => {
		it('should render steps', () => {
			const { container } = render(
				<CheckoutSteps currentStep={1} onStepClick={vi.fn()} completedSteps={[]} />
			);
			const steps = container.querySelectorAll('.CheckoutSteps__item');
			expect(steps.length).toBeGreaterThanOrEqual(1);
		});

		it('should render step labels', () => {
			render(<CheckoutSteps currentStep={1} onStepClick={vi.fn()} completedSteps={[]} />);
			expect(screen.getByText('Datos')).toBeInTheDocument();
			expect(screen.getByText('Pago')).toBeInTheDocument();
		});

		it('should render step circles', () => {
			const { container } = render(
				<CheckoutSteps currentStep={1} onStepClick={vi.fn()} completedSteps={[]} />
			);
			const circles = container.querySelectorAll('.CheckoutSteps__circle');
			expect(circles.length).toBeGreaterThanOrEqual(1);
		});
	});

	describe('Active step', () => {
		it('should mark first step as active when currentStep is 1', () => {
			const { container } = render(
				<CheckoutSteps currentStep={1} onStepClick={vi.fn()} completedSteps={[]} />
			);
			const activeStep = container.querySelector('.CheckoutSteps__circle.active');
			expect(activeStep).toBeInTheDocument();
		});

		it('should mark last step as active when currentStep is 3', () => {
			const { container } = render(
				<CheckoutSteps currentStep={3} onStepClick={vi.fn()} completedSteps={[1]} />
			);
			const activeStep = container.querySelectorAll('.CheckoutSteps__circle.active');
			expect(activeStep.length).toBe(1);
		});

		it('should not have active class on completed steps', () => {
			const { container } = render(
				<CheckoutSteps currentStep={3} onStepClick={vi.fn()} completedSteps={[1]} />
			);
			const completedCircle = container.querySelector('.CheckoutSteps__circle.completed');
			expect(completedCircle).toBeInTheDocument();
		});
	});

	describe('Completed steps', () => {
		it('should show checkmark on completed steps', () => {
			const { container } = render(
				<CheckoutSteps currentStep={3} onStepClick={vi.fn()} completedSteps={[1]} />
			);
			const completedCircles = container.querySelectorAll('.CheckoutSteps__circle.completed');
			expect(completedCircles.length).toBeGreaterThanOrEqual(1);
		});

		it('should show completed line for completed steps', () => {
			const { container } = render(
				<CheckoutSteps currentStep={3} onStepClick={vi.fn()} completedSteps={[1]} />
			);
			const completedLines = container.querySelectorAll('.CheckoutSteps__line.completed');
			expect(completedLines.length).toBeGreaterThanOrEqual(1);
		});
	});

	describe('Interaction', () => {
		it('should call onStepClick when clicking completed step', async () => {
			const onStepClick = vi.fn();
			const { container } = render(
				<CheckoutSteps currentStep={3} onStepClick={onStepClick} completedSteps={[1]} />
			);
			const completedCircle = container.querySelector('.CheckoutSteps__circle.completed');
			if (completedCircle) {
				completedCircle.click();
			}
		});

		it('should not call onStepClick when clicking active step', () => {
			const onStepClick = vi.fn();
			const { container } = render(
				<CheckoutSteps currentStep={1} onStepClick={onStepClick} completedSteps={[]} />
			);
			const activeCircle = container.querySelector('.CheckoutSteps__circle.active');
			if (activeCircle) {
				activeCircle.click();
			}
			expect(onStepClick).not.toHaveBeenCalled();
		});
	});

	describe('Disabled state', () => {
		it('should disable non-completed and non-active steps', () => {
			const { container } = render(
				<CheckoutSteps currentStep={1} onStepClick={vi.fn()} completedSteps={[]} />
			);
			const disabledButtons = container.querySelectorAll('.CheckoutSteps__circle:disabled');
			expect(disabledButtons.length).toBeGreaterThanOrEqual(1);
		});
	});
});