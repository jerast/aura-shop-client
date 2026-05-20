import { ProductCard, FilterPanel } from '@/modules/shop';
import { EmptyState } from '@/interface';
import { useDocumentTitle, useFilteredProducts } from '@/hooks';

export const ProductsPage = () => {
   const { isLoading, products, categories, priceRanges, filteredProducts } = useFilteredProducts();

   useDocumentTitle('Productos');

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
            <h1 className="Section__title">Productos</h1>
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
            <h1 className="Section__title">Productos</h1>
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

export default ProductsPage;
