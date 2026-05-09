import { useState, useEffect } from 'react';
import { currencyFormatter } from '@/helpers';
import { VscChromeClose } from 'react-icons/vsc';
import { FiFilter } from 'react-icons/fi';
import { RangeSlider } from '@/modules/shop';

export const FilterPanel = ({ categories, onFilterChange, priceRanges = {}, selectedPriceType = 'retail', onPriceTypeChange }) => {
   const [isOpen, setIsOpen] = useState(false);
   const [selectedCategory, setSelectedCategory] = useState('');
   const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });

   useEffect(() => {
      const range = priceRanges[selectedPriceType] || { min: 0, max: 0 };
      setPriceRange(range);
   }, [priceRanges, selectedPriceType]);

   const handleCategoryChange = (e) => {
      const category = e.target.value;
      setSelectedCategory(category);
      onFilterChange({ category, priceRange, priceType: selectedPriceType });
   };

   const handlePriceChange = (values) => {
      const newPriceRange = { min: values[0], max: values[1] };
      setPriceRange(newPriceRange);
      onFilterChange({ category: selectedCategory, priceRange: newPriceRange, priceType: selectedPriceType });
   };

   const handlePriceInputChange = (type, value) => {
      const numValue = Number(value);
      if (isNaN(numValue)) return;
      
      const newRange = { ...priceRange, [type]: numValue };
      setPriceRange(newRange);
      onFilterChange({ category: selectedCategory, priceRange: newRange, priceType: selectedPriceType });
   };

   const handlePriceTypeChange = (type) => {
      onPriceTypeChange(type);
      const range = priceRanges[type] || { min: 0, max: 0 };
      setPriceRange(range);
   };

   const handleReset = () => {
      setSelectedCategory('');
      const defaultRange = priceRanges.retail || { min: 0, max: 0 };
      setPriceRange(defaultRange);
      onPriceTypeChange('retail');
      onFilterChange({ category: '', priceRange: defaultRange, priceType: 'retail' });
   };

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

               {(selectedCategory || selectedPriceType !== 'retail' || priceRange.min !== (priceRanges.retail?.min || 0) || priceRange.max !== (priceRanges.retail?.max || 0)) && (
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