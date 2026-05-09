import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ProductCard } from '@/modules/shop';
import { resize } from '@/helpers';

export const HomePage = () => {
	const { isLoading } = useSelector( state => state.app );
	const { categories, products } = useSelector( state => state.shop );
	const navigate = useNavigate();

	if ( isLoading ) return (
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

	return (
		<>
			<figure className="Banner">
				<img 
					className="Banner__image" 
					src="https://res.cloudinary.com/jerastcloud/image/upload/Aura-B/Posts/hszzuaie5bf8lekxmzdl.avif"
				/>
				<figcaption className="Banner__caption">
					<h1>Lleva tu belleza a otro nivel con nuestra colección</h1>
					<button onClick={() => navigate('/products')}>Comprar</button>
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
