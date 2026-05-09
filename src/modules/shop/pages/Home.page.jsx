import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { startLoadingBanners } from '@/store';
import { resize } from '@/helpers';
import { ProductCard } from '@/modules/shop';

export const HomePage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isLoading } = useSelector( state => state.app );
	const { categories, products, banners } = useSelector( state => state.shop );

	useEffect(() => {
		dispatch( startLoadingBanners() );
	}, []);

	if ( isLoading || !banners.length ) return (
		<>
			<figure className="Banner">
				<figcaption className="Banner__caption loading">
					<h1 />
					<h1 />
					<button />
				</figcaption>
			</figure>

			<section className="Section Section--main">
				<h1 className="Section__title loading" />
				<article className="Section__content loading">
					<a><span /></a> 
					<a><span /></a> 
					<a><span /></a> 
					<a><span /></a> 
				</article>
			</section>
		</>
	);

	const activeBanner = banners[0];

	return (
		<>
			<figure className="Banner">
				<img 
					className="Banner__image" 
					src={ resize( activeBanner.image, 1600, 'posts' ) }
					alt="Banner"
				/>
				<figcaption className="Banner__caption">
					{ activeBanner.text && <h1>{ activeBanner.text }</h1> }
					{ activeBanner.link ? (
						<Link to={ activeBanner.link }>Ver más</Link>
					) : (
						<button onClick={() => navigate('/products')}>Comprar</button>
					)}
				</figcaption>
			</figure>

			<section className="Section Section--main">
				<h1 className="Section__title">Categorías más vendidas</h1>
				<article className="Section__content Section__content--categories">
					{
						categories.map( category => 
							<Link 
								key={ category.id }
								className="Category fluid" 
								to={`/categories/${ category.name.toLowerCase() }`}
							>
								<img 
									className="Category__image fluid"
									src={ resize( category.image, 350, 'categories' ) } 
									alt={ category.name } 
								/>
								<span className="Category__caption">{ category.name }</span>
							</Link> 
						)
					}
				</article>
			</section>

			<section className="Section Section--main">
				<h1 className="Section__title">Nuevos productos</h1>
				<article className="Section__content Section__content--products">
					{
						(products.slice(1, 7)).map( product => 
							<ProductCard key={ product.id } product={ product } />
						)
					}
				</article>
			</section>
		</>
	);
};