import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForm } from '@/hooks/useForm';

describe('useForm', () => {
	describe('Initialization', () => {
		it('should initialize with empty form state', () => {
			const { result } = renderHook(() => useForm({}));
			expect(result.current.formState).toEqual({});
		});

		it('should initialize with provided initial values', () => {
			const initialForm = { name: '', email: '' };
			const { result } = renderHook(() => useForm(initialForm));
			expect(result.current.formState).toEqual({ name: '', email: '' });
		});

		it('should initialize with default empty formValid', () => {
			const { result } = renderHook(() => useForm({}));
			expect(result.current.formValid).toEqual({});
		});
	});

	describe('onFormChange', () => {
		it('should update form state on field change', () => {
			const { result } = renderHook(() => useForm({ name: '', email: '' }));

			act(() => {
				result.current.onFormChange({ target: { name: 'name', value: 'John' } });
			});

			expect(result.current.formState.name).toBe('John');
		});

		it('should update multiple fields', () => {
			const { result } = renderHook(() => useForm({ name: '', email: '' }));

			act(() => {
				result.current.onFormChange({ target: { name: 'name', value: 'John' } });
			});
			act(() => {
				result.current.onFormChange({ target: { name: 'email', value: 'john@example.com' } });
			});

			expect(result.current.formState.name).toBe('John');
			expect(result.current.formState.email).toBe('john@example.com');
		});
	});

	describe('onFormReset', () => {
		it('should reset form state to initial values', () => {
			const initialForm = { name: '', email: '' };
			const { result } = renderHook(() => useForm(initialForm));

			act(() => {
				result.current.onFormChange({ target: { name: 'name', value: 'John' } });
			});

			act(() => {
				result.current.onFormReset();
			});

			expect(result.current.formState).toEqual({ name: '', email: '' });
		});
	});

	describe('setFormState', () => {
		it('should allow direct state update', () => {
			const { result } = renderHook(() => useForm({ name: '', email: '' }));

			act(() => {
				result.current.setFormState({ name: 'Jane', email: 'jane@example.com' });
			});

			expect(result.current.formState).toEqual({ name: 'Jane', email: 'jane@example.com' });
		});
	});

	describe('With validators', () => {
		it('should set form valid state based on validators', () => {
			const validators = {
				email: [(value) => value.includes('@'), 'Invalid email'],
			};
			const { result } = renderHook(() => useForm({ email: '' }, validators));

			act(() => {
				result.current.onFormChange({ target: { name: 'email', value: 'invalid' } });
			});

			expect(result.current.formValid.emailValid).toBe('Invalid email');
		});

		it('should set valid state when validator passes', () => {
			const validators = {
				email: [(value) => value.includes('@'), 'Invalid email'],
			};
			const { result } = renderHook(() => useForm({ email: '' }, validators));

			act(() => {
				result.current.onFormChange({ target: { name: 'email', value: 'valid@example.com' } });
			});

			expect(result.current.formValid.emailValid).toBeNull();
		});
	});

	describe('isFormValid', () => {
		it('should return true when all fields are valid', () => {
			const validators = {
				name: [(value) => value.length > 0, 'Name required'],
				email: [(value) => value.includes('@'), 'Invalid email'],
			};
			const { result } = renderHook(() => useForm({ name: 'John', email: 'john@example.com' }, validators));

			expect(result.current.isFormValid).toBe(true);
		});

		it('should return false when any field is invalid', () => {
			const validators = {
				name: [(value) => value.length > 0, 'Name required'],
				email: [(value) => value.includes('@'), 'Invalid email'],
			};
			const { result } = renderHook(() => useForm({ name: '', email: 'invalid' }, validators));

			expect(result.current.isFormValid).toBe(false);
		});
	});
});