import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ProductCard } from '@/modules/shop';
import { filters, queryParams, sorters, toCapitalize } from '@/helpers';
import { useEffect, useState } from 'react';

export const ProductsPage = () => {
	const { isLoading } = useSelector( state => state.app );
	const { products, categories } = useSelector( state => state.shop );
	const { search, pathname } = useLocation();
	const [title, setTitle] = useState('Productos');

	useEffect(() => {
		const pathLastItem = pathname.slice(1).split('/').at(-1)
		pathLastItem && setTitle(toCapitalize(pathLastItem));
	}, [])

	const handleFilterProducts = () => {
		const pathLastItem = pathname.slice(1).split('/').at(-1)
		if ( categories.some( category => category.name.toLowerCase() === pathLastItem ) ) {
			return filters( products, { ...queryParams(search), category: pathLastItem } );
		}

		if ( search ) 
			return filters( products, queryParams(search) );

		return sorters( products, 'normal', false );
	};

	if ( isLoading ) return (
		<section className="Section">
			<h1 className="Section__title">Productos</h1>
			<article className="Section__content loading">
				<a><span /></a> 
				<a><span /></a> 	
				<a><span /></a> 
				<a><span /></a> 
				<a><span /></a> 
				<a><span /></a> 
				<a><span /></a> 
				<a><span /></a> 
			</article>
		</section>
	);

	if ( !products.length ) return (
		<section className="Section">
			<h1 className="Section__title">{title}</h1>
			<h3>No se econtraron productos</h3>
		</section>
	);

	return (
		<section className="Section">
			<h1 className="Section__title">{title}</h1>
			<article className="ProductList">
			{
				handleFilterProducts().map( product => (
					<ProductCard key={ product.id } product={ product } />
				))
			}
			</article>
		</section>
	);
};
