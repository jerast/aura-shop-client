import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useProductFilters = () => {
   const [searchParams, setSearchParams] = useSearchParams();

   const getSearch = useCallback(() => {
      return searchParams.get('q') || '';
   }, [searchParams]);

   const getCategory = useCallback(() => {
      return searchParams.get('category') || '';
   }, [searchParams]);

   const getPriceType = useCallback(() => {
      return searchParams.get('priceType') || 'retail';
   }, [searchParams]);

   const getPriceRange = useCallback(() => {
      const min = searchParams.get('min');
      const max = searchParams.get('max');
      return {
         min: min ? Number(min) : 0,
         max: max ? Number(max) : 0,
      };
   }, [searchParams]);

   const setSearch = useCallback((search) => {
      setSearchParams(prev => {
         if (search) {
            prev.set('q', search);
         } else {
            prev.delete('q');
         }
         return prev;
      }, { replace: true });
   }, [setSearchParams]);

   const setCategory = useCallback((category) => {
      setSearchParams(prev => {
         if (category) {
            prev.set('category', category.toLowerCase());
         } else {
            prev.delete('category');
         }
         return prev;
      }, { replace: true });
   }, [setSearchParams]);

   const setPriceType = useCallback((priceType) => {
      setSearchParams(prev => {
         if (priceType && priceType !== 'retail') {
            prev.set('priceType', priceType);
         } else {
            prev.delete('priceType');
         }
         return prev;
      }, { replace: true });
   }, [setSearchParams]);

   const setPriceRange = useCallback((priceRange) => {
      setSearchParams(prev => {
         if (priceRange.min > 0) {
            prev.set('min', String(priceRange.min));
         } else {
            prev.delete('min');
         }
         if (priceRange.max > 0) {
            prev.set('max', String(priceRange.max));
         } else {
            prev.delete('max');
         }
         return prev;
      }, { replace: true });
   }, [setSearchParams]);

   const resetFilters = useCallback((defaultPriceRange = { min: 0, max: 0 }) => {
      setSearchParams({
         priceType: 'retail',
         min: String(defaultPriceRange.min),
         max: String(defaultPriceRange.max),
      }, { replace: true });
   }, [setSearchParams]);

   const clearAll = useCallback(() => {
      setSearchParams({}, { replace: true });
   }, [setSearchParams]);

   return {
      search: getSearch(),
      category: getCategory(),
      priceType: getPriceType(),
      priceRange: getPriceRange(),
      setSearch,
      setCategory,
      setPriceType,
      setPriceRange,
      resetFilters,
      clearAll,
   };
};

export default useProductFilters;