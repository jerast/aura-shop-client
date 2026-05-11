import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect, useMemo } from 'react';
import { ProductCard, FilterPanel } from '@/modules/shop';
import { EmptyState } from '@/interface';
import { filters, queryParams, sorters, toCapitalize } from '@/helpers';
import { applyFilters, getPriceRanges } from '@/helpers/productFilters';
import { useDocumentTitle } from '@/hooks';

export const ProductsPage = () => {
	const { isLoading } = useSelector( state => state.app );
	const { products, categories } = useSelector( state => state.shop );
	const { search, pathname } = useLocation();
	const [title, setTitle] = useState('Productos');

	useDocumentTitle(title);
	const [selectedPriceType, setSelectedPriceType] = useState('retail');
	const [filtersState, setFiltersState] = useState({
		category: '',
		priceRange: { min: 0, max: 0 },
		priceType: 'retail',
	});

	const priceRanges = useMemo(() => getPriceRanges(products), [products]);

	useEffect(() => {
		const range = priceRanges.retail || { min: 0, max: 0 };
		setFiltersState(prev => ({
			...prev,
			priceRange: range,
			priceType: selectedPriceType,
		}));
	}, [priceRanges]);

	useEffect(() => {
		const pathLastItem = pathname.slice(1).split('/').at(-1);
		if (pathLastItem) {
			setTitle(toCapitalize(pathLastItem));
		}
	}, [pathname]);

	const handleFilterChange = (newFilters) => {
		setFiltersState(prev => ({
			...prev,
			category: newFilters.category,
			priceRange: newFilters.priceRange,
		}));
	};

	const handlePriceTypeChange = (type) => {
		setSelectedPriceType(type);
		const range = priceRanges[type] || { min: 0, max: 0 };
		setFiltersState(prev => ({
			...prev,
			priceRange: range,
			priceType: type,
		}));
	};

	const handleFilterProducts = () => {
		const pathLastItem = pathname.slice(1).split('/').at(-1);
		
		let result = products;

		if ( categories.some( category => category.name.toLowerCase() === pathLastItem ) ) {
			result = filters( result, { ...queryParams(search), category: pathLastItem } );
		} else if ( search ) {
			result = filters( result, queryParams(search) );
		}

		result = applyFilters(result, filtersState);

		return sorters( result, 'normal', false );
	};

	if ( isLoading ) return (
		<section className="Section">
			<div className="ProductsPage__header">
				<h1 className="Section__title">Productos</h1>
				<FilterPanel 
					categories={categories}
					onFilterChange={handleFilterChange}
					priceRanges={priceRanges}
					selectedPriceType={selectedPriceType}
					onPriceTypeChange={handlePriceTypeChange}
				/>
			</div>
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
			<div className="ProductsPage__header">
				<h1 className="Section__title">{title}</h1>
				<FilterPanel 
					categories={categories}
					onFilterChange={handleFilterChange}
					priceRanges={priceRanges}
					selectedPriceType={selectedPriceType}
					onPriceTypeChange={handlePriceTypeChange}
				/>
			</div>
			<EmptyState type="products" />
		</section>
	);

	const filteredProducts = handleFilterProducts();

	return (
		<section className="Section">
			<div className="ProductsPage__header">
				<h1 className="Section__title">{title}</h1>
				<FilterPanel 
					categories={categories}
					onFilterChange={handleFilterChange}
					priceRanges={priceRanges}
					selectedPriceType={selectedPriceType}
					onPriceTypeChange={handlePriceTypeChange}
				/>
			</div>
			{filteredProducts.length === 0 ? (
				<EmptyState 
					type="products"
					title="Sin resultados"
					description="No hay productos que coincidan con los filtros aplicados."
				/>
			) : (
				<article className="ProductList">
				{
					filteredProducts.map( product => (
						<ProductCard key={ product.id } product={ product } />
					))
				}
				</article>
			)}
		</section>
	);
};