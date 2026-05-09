export const filterByPriceRange = (products, min, max, priceType = 'retail') => {
   return products.filter(product => {
      const price = product.prices[priceType] || product.prices.retail;
      return price >= min && price <= max;
   });
};

export const filterByCategory = (products, category) => {
   if (!category) return products;
   return products.filter(product => 
      product.category?.toLowerCase() === category.toLowerCase()
   );
};

export const applyFilters = (products, { category, priceRange, priceType = 'retail' }) => {
   let result = products;
   
   if (category) {
      result = filterByCategory(result, category);
   }
   
   if (priceRange && (priceRange.min > 0 || priceRange.max > 0)) {
      result = filterByPriceRange(result, priceRange.min, priceRange.max, priceType);
   }
   
   return result;
};

export const getPriceRange = (products) => {
   if (!products || products.length === 0) return { min: 0, max: 0 };
   
   const prices = products.map(p => p.prices.retail);
   return {
      min: Math.min(...prices),
      max: Math.max(...prices),
   };
};

export const getPriceRanges = (products) => {
   if (!products || products.length === 0) {
      return { retail: { min: 0, max: 0 }, wholesale: { min: 0, max: 0 } };
   }
   
   const retailPrices = products.map(p => p.prices.retail);
   const wholesalePrices = products.map(p => p.prices.wholesale);
   
   return {
      retail: {
         min: Math.min(...retailPrices),
         max: Math.max(...retailPrices),
      },
      wholesale: {
         min: Math.min(...wholesalePrices),
         max: Math.max(...wholesalePrices),
      },
   };
};