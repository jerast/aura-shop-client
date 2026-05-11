import { useLocation } from 'react-router-dom';
import { ProductCard, FilterPanel } from '@/modules/shop';
import { EmptyState } from '@/interface';
import { useDocumentTitle, useFilteredProducts } from '@/hooks';
import { toCapitalize } from '@/helpers';

export const ProductsPage = () => {
   const { pathname } = useLocation();
   const { isLoading, products, categories, priceRanges, filteredProducts, title: hookTitle } = useFilteredProducts();

   const pageCategory = pathname.slice(1).split('/').at(-1);
   const isCategoryPage = pageCategory && categories.some(c => c.name.toLowerCase() === pageCategory);
   const title = isCategoryPage ? toCapitalize(pageCategory) : hookTitle;

   useDocumentTitle(title);

   if ( isLoading ) return (
      <section className="Section">
         <div className="ProductsPage__header">
            <h1 className="Section__title">Productos</h1>
            <FilterPanel 
               categories={categories}
               priceRanges={priceRanges}
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
               priceRanges={priceRanges}
            />
         </div>
         <EmptyState type="products" />
      </section>
   );

   return (
      <section className="Section">
         <div className="ProductsPage__header">
            <h1 className="Section__title">{title}</h1>
            <FilterPanel 
               categories={categories}
               priceRanges={priceRanges}
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