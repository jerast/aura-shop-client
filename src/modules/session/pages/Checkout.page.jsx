import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { startLoadingCategories, startLoadingProducts, startSavingOrder } from '@/store';
import { MdArrowBack, MdReceipt, MdShoppingBag, MdLocalOffer } from 'react-icons/md';
import { TbDiscountCheckFilled } from 'react-icons/tb';
import { currencyFormatter, resize } from '@/helpers';

export const Checkout = () => {
    
   const { isLoading, isSaving, order, shoppingCart } = useSelector( state => state.app );
   const { products } = useSelector( state => state.shop );
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const [habeasDataChecked, setHabeasDataChecked] = useState(false);
   const [personalDataChecked, setPersonalDataChecked] = useState(false);

   useEffect(() => {
      (async () => {
         await dispatch( startLoadingProducts() );
         await dispatch( startLoadingCategories() );
      })()
   }, []);
   
   useEffect(() => {
      ( !isLoading && !shoppingCart.length ) && navigate('/', { replace: true })
   }, [ isLoading ]);

   if ( isLoading ) return (
      <section className="Section">
         <h1 className="CheckoutPage__title">Resumen de Compra</h1>
         <div className="CheckoutPage__loading">
            <div className="CheckoutPage__loading-card">
               <div className="CheckoutPage__loading-header">
                  <span style={{ width: '50%' }} />
                  <span style={{ width: '30%' }} />
               </div>
               {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="CheckoutPage__loading-row">
                     <span style={{ width: '40%' }} />
                     <span style={{ width: '60%' }} />
                  </div>
               ))}
            </div>
            <div className="CheckoutPage__loading-products">
               {[1, 2, 3].map((i) => (
                  <div key={i} className="CheckoutPage__loading-product">
                     <span style={{ width: '60px', height: '60px', borderRadius: '8px' }} />
                     <div className="CheckoutPage__loading-product-info">
                        <span style={{ width: '70%', height: '20px' }} />
                        <span style={{ width: '40%', height: '16px' }} />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );

   const totalItems = shoppingCart.reduce((acc, item) => acc + item.count, 0);
   const hasDiscount = order.total_products >= 6;
   const discountAmount = hasDiscount 
      ? (order.total_prices.retail - order.total_prices.wholesale)
      : 0;
   const totalPrice = hasDiscount ? order.total_prices.wholesale : order.total_prices.retail;

   const handleSavingOrder = () => {
      dispatch( startSavingOrder() );
      navigate( '/account/orders' );
   };

   return (
      <section className="Section">
         <div className="CheckoutPage__header">
            <Link to="/" className="CheckoutPage__back">
               <MdArrowBack />
               <span>Seguir comprando</span>
            </Link>
            <h1 className="CheckoutPage__title">Resumen de Compra</h1>
         </div>

         <div className="CheckoutPage__content">
            <div className="CheckoutPage__resume">
               <div className="CheckoutPage__resume-header">
                  <MdReceipt className="text-2xl text-violet-700" />
                  <h2>Resumen del pedido</h2>
               </div>

               <div className="CheckoutPage__info-grid">
                  <div className="CheckoutPage__info-item">
                     <div className="CheckoutPage__info-icon">
                        <MdShoppingBag />
                     </div>
                     <div className="CheckoutPage__info-content">
                        <span className="CheckoutPage__info-label">Productos</span>
                        <span className="CheckoutPage__info-value">{ totalItems } {totalItems > 1 ? 'unidades' : 'unidad'}</span>
                     </div>
                  </div>

                  {hasDiscount && (
                     <div className="CheckoutPage__info-item CheckoutPage__info-item--discount">
                        <div className="CheckoutPage__info-icon">
                           <MdLocalOffer />
                        </div>
                        <div className="CheckoutPage__info-content">
                           <span className="CheckoutPage__info-label">Descuento aplicado</span>
                           <span className="CheckoutPage__info-value CheckoutPage__info-value--discount">
                              -{ currencyFormatter(discountAmount) }
                           </span>
                        </div>
                     </div>
                  )}
               </div>

               <div className="CheckoutPage__divider" />

               <div className="CheckoutPage__total">
                  <span className="CheckoutPage__total-label">Total</span>
                  <span className="CheckoutPage__total-value">{ currencyFormatter(totalPrice) }</span>
               </div>

               <div className="CheckoutPage__checks">
                  <label>
                     <input 
                        type="checkbox" 
                        checked={habeasDataChecked} 
                        onChange={(e) => setHabeasDataChecked(e.target.checked)} 
                     />
                     He leído y acepto los términos y condiciones
                  </label>
                  <label>
                     <input 
                        type="checkbox" 
                        checked={personalDataChecked} 
                        onChange={(e) => setPersonalDataChecked(e.target.checked)} 
                     />
                     He leído y acepto el tratamiento de datos personales
                  </label>
               </div>

               <button 
                  className="CheckoutPage__button" 
                  onClick={ handleSavingOrder } 
                  disabled={ !habeasDataChecked || !personalDataChecked || isLoading }
               >
                  { isSaving ? '...' : 'Finalizar Compra' }
               </button>
            </div>

            <div className="CheckoutPage__products">
               <div className="CheckoutPage__products-header">
                  <MdShoppingBag className="text-2xl text-violet-700" />
                  <h2>Productos ({ shoppingCart.length })</h2>
               </div>

               <div className="CheckoutPage__products-list">
                  {shoppingCart.map((item) => {
                     const product = products.find(p => p.id === item.product);
                     if (!product) return null;

                     const unitPrice = hasDiscount ? product.prices.wholesale : product.prices.retail;
                     const subtotal = unitPrice * item.count;

                     return (
                        <div key={ item.product } className="CheckoutPage__product">
                           <img 
                              className="CheckoutPage__product-image"
                              src={ resize( product.image, 100, 'products' ) }
                              alt={ product.name }
                              onError={(e) => e.target.style.display = 'none'}
                           />
                           <div className="CheckoutPage__product-info">
                              <Link to={`/products/${ product.id }`} className="CheckoutPage__product-name">
                                 { product.name }
                              </Link>
                              <span className="CheckoutPage__product-quantity">
                                 { item.count } {item.count > 1 ? 'unidades' : 'unidad'}
                              </span>
                           </div>
                           <div className={ hasDiscount ? 'CheckoutPage__product-price--discount' : 'CheckoutPage__product-price' }>
                              <span>{ currencyFormatter(subtotal) }</span>
                              { hasDiscount && <TbDiscountCheckFilled /> }
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         </div>
      </section>
   );
};