import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { startLoadingBanners } from '@/store';
import { resize } from '@/helpers';

export const Banner = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { banners } = useSelector( state => state.shop );
	const [currentSlide, setCurrentSlide] = useState(0);

	const nextSlide = useCallback(() => {
		setCurrentSlide((prev) => (prev + 1) % banners.length);
	}, [banners.length]);

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
	};

	const goToSlide = (index) => {
		setCurrentSlide(index);
	};

	useEffect(() => {
		dispatch( startLoadingBanners() );
	}, []);

	useEffect(() => {
		if (banners.length <= 1) return;
		const interval = setInterval(nextSlide, 10000);
		return () => clearInterval(interval);
	}, [banners.length, nextSlide]);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'ArrowRight') nextSlide();
			if (e.key === 'ArrowLeft') prevSlide();
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [nextSlide]);

	if ( !banners.length ) return (
		<figure className="Banner">
			<figcaption className="Banner__caption loading">
				<h1 />
				<h1 />
				<button />
			</figcaption>
		</figure>
	);

	return (
		<figure className="Banner">
			<div 
				className="Banner__wrapper" 
				style={{ transform: `translateX(-${currentSlide * 100}vw)` }}
			>
				{banners.map((banner, index) => (
					<div key={banner.id || index} className="Banner__slide">
						<img 
							className="Banner__image" 
							src={ resize( banner.image, 1600, 'posts' ) }
							alt={`Banner ${index + 1}`}
						/>
						<figcaption className="Banner__caption">
							{ banner.text && <h1>{ banner.text }</h1> }
							{ banner.link ? (
								<Link to={ banner.link }>Ver más</Link>
							) : (
								<button onClick={() => navigate('/products')}>Comprar</button>
							)}
						</figcaption>
					</div>
				))}
			</div>

			{banners.length > 1 && (
				<>
					<div className="Banner__arrows">
						<button className="Banner__arrow" onClick={prevSlide}>
							<FaChevronLeft />
						</button>
						<button className="Banner__arrow" onClick={nextSlide}>
							<FaChevronRight />
						</button>
					</div>
					<div className="Banner__controls">
						{banners.map((_, index) => (
							<button
								key={index}
								className={`Banner__dot ${index === currentSlide ? 'Banner__dot--active' : ''}`}
								onClick={() => goToSlide(index)}
								aria-label={`Ir a slide ${index + 1}`}
							/>
						))}
					</div>
				</>
			)}
		</figure>
	);
};