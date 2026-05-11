import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { filters, queryParams, sorters, toCapitalize } from '@/helpers';
import { applyFilters, getPriceRanges } from '@/helpers/productFilters';
import { useProductFilters } from '@/hooks';

export const useFilteredProducts = () => {
   const { isLoading } = useSelector( state => state.app );
   const { products, categories } = useSelector( state => state.shop );
   
   const { 
      search: searchQuery, 
      category, 
      priceType, 
      priceRange 
   } = useProductFilters();

   const priceRanges = useMemo(() => getPriceRanges(products), [products]);

   const filteredProducts = useMemo(() => {
      if (!products.length) return [];

      let result = products;

      if ( searchQuery ) {
         result = result.filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
         );
      }

      if ( category ) {
         result = filters( result, { category } );
      }

      const filtersState = {
         category,
         priceRange,
         priceType,
      };

      result = applyFilters(result, filtersState);

      return sorters( result, 'normal', false );
   }, [products, category, searchQuery, priceRange, priceType]);

   const title = useMemo(() => {
      return category ? toCapitalize(category) : 'Productos';
   }, [category]);

   return {
      isLoading,
      products,
      categories,
      priceRanges,
      filteredProducts,
      title,
   };
};

export default useFilteredProducts;