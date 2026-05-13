import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { RangeSlider } from '@/modules/shop/components/RangeSlider';

describe('RangeSlider', () => {
	it('should render without crashing', () => {
		const { container } = render(
			<RangeSlider min={0} max={100000} values={[10000, 50000]} onChange={vi.fn()} />
		);
		expect(container).toBeDefined();
	});

	it('should render track element', () => {
		const { container } = render(
			<RangeSlider min={0} max={100000} values={[10000, 50000]} onChange={vi.fn()} />
		);
		const track = container.querySelector('.RangeSlider__track');
		expect(track).toBeInTheDocument();
	});

	it('should render range element', () => {
		const { container } = render(
			<RangeSlider min={0} max={100000} values={[10000, 50000]} onChange={vi.fn()} />
		);
		const range = container.querySelector('.RangeSlider__range');
		expect(range).toBeInTheDocument();
	});

	it('should render two slider inputs', () => {
		const { container } = render(
			<RangeSlider min={0} max={100000} values={[10000, 50000]} onChange={vi.fn()} />
		);
		const thumbs = container.querySelectorAll('.RangeSlider__thumb');
		expect(thumbs.length).toBe(2);
	});

	it('should update on change callback', () => {
		const onChange = vi.fn();
		const { container } = render(
			<RangeSlider min={0} max={100000} values={[10000, 50000]} onChange={onChange} />
		);
		expect(onChange).not.toHaveBeenCalled();
	});
});