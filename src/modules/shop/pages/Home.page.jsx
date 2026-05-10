import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Banner } from '@/modules/shop';
import { resize } from '@/helpers';
import { ProductCard } from '@/modules/shop';

export const HomePage = () => {
	const { categories, products } = useSelector( state => state.shop );

	return (
		<>
			<Banner />

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