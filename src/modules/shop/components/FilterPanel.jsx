import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RiSearchLine } from 'react-icons/ri';
import { currencyFormatter } from '@/helpers';
import { VscChromeClose } from 'react-icons/vsc';
import { FiFilter } from 'react-icons/fi';
import { RangeSlider } from '@/modules/shop';

export const FilterPanel = ({ categories, priceRanges = {} }) => {
   const [searchParams, setSearchParams] = useSearchParams();
   const [isOpen, setIsOpen] = useState(false);
   const [searchValue, setSearchValue] = useState('');

   const selectedCategory = searchParams.get('category') || '';
   const selectedPriceType = searchParams.get('priceType') || 'retail';
   const priceMin = Number(0);
   const priceMax = Number(searchParams.get('max') || 0);

   const priceRange = { min: priceMin, max: priceMax };

   useEffect(() => {
      const q = searchParams.get('q') || '';
      setSearchValue(q);
   }, [searchParams]);

   useEffect(() => {
      const timeoutId = setTimeout(() => {
         setSearchParams(prev => {
            if (searchValue) {
               prev.set('q', searchValue);
            } else {
               prev.delete('q');
            }
            return prev;
         }, { replace: true });
      }, 300);
      return () => clearTimeout(timeoutId);
   }, [searchValue, setSearchParams]);

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

   const setPriceRange = useCallback((range) => {
      setSearchParams(prev => {
         if (range.min > 0) {
            prev.set('min', String(range.min));
         } else {
            prev.delete('min');
         }
         if (range.max > 0) {
            prev.set('max', String(range.max));
         } else {
            prev.delete('max');
         }
         return prev;
      }, { replace: true });
   }, [setSearchParams]);

   const handleCategoryChange = (e) => {
      setCategory(e.target.value);
   };

   const handlePriceChange = (values) => {
      setPriceRange({ min: values[0], max: values[1] });
   };

   const handlePriceInputChange = (type, value) => {
      const numValue = Number(value);
      if (isNaN(numValue)) return;
      setPriceRange({ ...priceRange, [type]: numValue });
   };

   const handlePriceTypeChange = (type) => {
      setPriceType(type);
   };

   const handleReset = () => {
      setCategory('');
      setSearchValue('');
      const defaultRange = priceRanges.retail || { min: 0, max: 0 };
      setPriceRange(defaultRange);
      setPriceType('retail');
   };

   const hasActiveFilters = selectedCategory || 
      selectedPriceType !== 'retail' || 
      searchValue ||
      priceRange.min > (priceRanges.retail?.min || 0) || 
      priceRange.max > (priceRanges.retail?.max || 0);

   return (
      <>
         <button 
            className="FilterPanel__toggle"
            onClick={() => setIsOpen(!isOpen)}
         >
            <FiFilter />
            <span>Filtros</span>
         </button>

         {isOpen && (
            <div className="FilterPanel__overlay" onClick={() => setIsOpen(false)} />
         )}

         <div className={`FilterPanel ${isOpen ? 'FilterPanel--open' : ''}`}>
            <div className="FilterPanel__header">
               <h3>Filtros</h3>
               <button onClick={() => setIsOpen(false)}>
                  <VscChromeClose />
               </button>
            </div>

            <div className="FilterPanel__content">
               <div className="FilterPanel__section">
                  <label className="FilterPanel__label">Buscar</label>
                  <div className="FilterPanel__search">
                     <RiSearchLine className="FilterPanel__search-icon" />
                     <input
                        type="text"
                        placeholder="Escribe para buscar..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="FilterPanel__search-input"
                     />
                  </div>
               </div>

               <div className="FilterPanel__section">
                  <label className="FilterPanel__label">Categoría</label>
                  <select 
                     className="FilterPanel__select"
                     value={selectedCategory}
                     onChange={handleCategoryChange}
                  >
                     <option value="">Todas las categorías</option>
                     {categories.map(cat => (
                        <option key={cat.id} value={cat.name.toLowerCase()}>
                           {cat.name}
                        </option>
                     ))}
                  </select>
               </div>

               <div className="FilterPanel__section">
                  <label className="FilterPanel__label">
                     Rango de precio
                  </label>
                  <div className="FilterPanel__price-type">
                     <button
                        className={`FilterPanel__price-type-btn ${selectedPriceType === 'retail' ? 'active' : ''}`}
                        onClick={() => handlePriceTypeChange('retail')}
                     >
                        Normal
                     </button>
                     <button
                        className={`FilterPanel__price-type-btn ${selectedPriceType === 'wholesale' ? 'active' : ''}`}
                        onClick={() => handlePriceTypeChange('wholesale')}
                     >
                        Descuento
                     </button>
                  </div>
                  <div className="FilterPanel__price-inputs">
                     <div className="FilterPanel__price-input">
                        <span>Min</span>
                        <input 
                           type="number" 
                           value={priceRange.min}
                           onChange={(e) => handlePriceInputChange('min', e.target.value)}
                           min={0}
                        />
                     </div>
                     <span className="FilterPanel__price-separator">-</span>
                     <div className="FilterPanel__price-input">
                        <span>Max</span>
                        <input 
                           type="number" 
                           value={priceRange.max}
                           onChange={(e) => handlePriceInputChange('max', e.target.value)}
                        />
                     </div>
                  </div>
                  <RangeSlider
                     min={priceRange.min}
                     max={priceRange.max}
                     values={[priceRange.min, priceRange.max]}
                     onChange={handlePriceChange}
                  />
                  <p className="FilterPanel__price-hint">
                     Rango total: {currencyFormatter(priceRange.min)} - {currencyFormatter(priceRange.max)}
                  </p>
               </div>

               {hasActiveFilters && (
                  <button 
                     className="FilterPanel__reset-btn"
                     onClick={handleReset}
                  >
                     Limpiar filtros
                  </button>
               )}
            </div>
         </div>
      </>
   );
};