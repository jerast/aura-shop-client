import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ProductCard } from '@/modules/shop';
import { EmptyState } from '@/interface';
import { useDocumentTitle } from '@/hooks';
import { toCapitalize, sorters } from '@/helpers';

export const CategoryProductsPage = () => {
   const { category: categoryParam } = useParams();
   const { isLoading } = useSelector( state => state.app );
   const { products, categories } = useSelector( state => state.shop );

   const category = categoryParam?.toLowerCase() || '';
   const title = categories.find(c => c.name.toLowerCase() === category)?.name || toCapitalize(category);

   useDocumentTitle(title);

   const filteredProducts = useMemo(() => {
      if (!products.length) return [];

      let result = products.filter(product =>
         product.status !== false && product.hidden !== true
      );

      if (category) {
         result = result.filter(product =>
            product.category?.toLowerCase() === category
         );
      }

      return sorters(result, 'normal', false);
   }, [products, category]);

   if ( isLoading ) return (
      <section className="Section">
         <div className="ProductsPage__header">
            <h1 className="Section__title">{title}</h1>
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

   if ( !products.length || !category ) return (
      <section className="Section">
         <div className="ProductsPage__header">
            <h1 className="Section__title">{title}</h1>
         </div>
         <EmptyState type="products" />
      </section>
   );

   return (
      <section className="Section">
         <div className="ProductsPage__header">
            <h1 className="Section__title">{title}</h1>
         </div>
         {filteredProducts.length === 0 ? (
            <EmptyState
               type="products"
               title="Sin resultados"
               description="No hay productos en esta categoría."
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

export default CategoryProductsPage;
