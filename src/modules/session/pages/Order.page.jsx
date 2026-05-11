import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearActiveOrder, onLoadEnds, onLoadStarts, startLoadingSelectedOrder } from '@/store';
import { MdArrowBack, MdReceipt, MdCalendarToday, MdShoppingBag, MdLocalOffer, MdReceiptLong } from 'react-icons/md';
import { currencyFormatter, dateFormatter, resize } from '@/helpers';
import { useDocumentTitle } from '@/hooks';

const statusConfig = {
   pending: { label: 'Pendiente', bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
   ready: { label: 'Listo', bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200' },
   delivered: { label: 'Entregado', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
   canceled: { label: 'Cancelado', bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
};

export const OrderPage = () => {
   const { id } = useParams();
   const { orders } = useSelector( state => state.session );
   const { isLoading, activeOrder } = useSelector( state => state.app );
   const { products } = useSelector( state => state.shop );
   const dispatch = useDispatch();

   useDocumentTitle(`Pedido #${id}`);

   useEffect(() => { 
      if (!isLoading) {
         dispatch( onLoadStarts() );
         dispatch( startLoadingSelectedOrder(id) );
         dispatch( onLoadEnds() );
      }
   }, [orders, isLoading]);

   useEffect(() => () => dispatch( clearActiveOrder() ), []);

   if ( isLoading ) return (
      <section className="Section">
         <h1 className="Section__title">Detalles del pedido</h1>
         <div className="OrderPage__loading">
            <div className="OrderPage__loading-card">
               <div className="OrderPage__loading-header">
                  <span style={{ width: '50%' }} />
                  <span style={{ width: '30%' }} />
               </div>
               {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="OrderPage__loading-row">
                     <span style={{ width: '40%' }} />
                     <span style={{ width: '60%' }} />
                  </div>
               ))}
            </div>
            <div className="OrderPage__loading-products">
               {[1, 2].map((i) => (
                  <div key={i} className="OrderPage__loading-product">
                     <span style={{ width: '60px', height: '60px', borderRadius: '8px' }} />
                     <div className="OrderPage__loading-product-info">
                        <span style={{ width: '70%', height: '20px' }} />
                        <span style={{ width: '40%', height: '16px' }} />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );

   if ( !activeOrder ) return (
      <section className="Section">
         <h1 className="Section__title">Detalles del pedido</h1>
         <p className="text-gray-500 mt-4">Pedido no encontrado</p>
      </section>
   );

   const status = statusConfig[activeOrder.status] || statusConfig.pending;
   const totalItems = activeOrder.list.reduce((acc, item) => acc + item.count, 0);
   const discountAmount = activeOrder.discount 
      ? activeOrder.list.reduce((acc, item) => {
         const product = products.find(p => p.id === item.product);
         return acc + (product?.prices.retail - product?.prices.wholesale) * item.count;
      }, 0)
      : 0;

   return (
      <section className="Section">
         <div className="OrderPage__header">
            <Link to="/account/orders" className="OrderPage__back">
               <MdArrowBack />
               <span>Volver a pedidos</span>
            </Link>
            <h1 className="OrderPage__title">Pedido #{ activeOrder.id }</h1>
         </div>

         <div className="OrderPage__content">
            <div className="OrderPage__resume">
               <div className="OrderPage__resume-header">
                  <MdReceiptLong className="text-2xl text-violet-700" />
                  <h2>Resumen del pedido</h2>
               </div>

               <div className="OrderPage__info-grid">
                  <div className="OrderPage__info-item">
                     <div className="OrderPage__info-icon">
                        <MdReceipt />
                     </div>
                     <div className="OrderPage__info-content">
                        <span className="OrderPage__info-label">ID Pedido</span>
                        <span className="OrderPage__info-value">{ activeOrder.id }</span>
                     </div>
                  </div>

                  <div className="OrderPage__info-item">
                     <div className="OrderPage__info-icon">
                        <MdCalendarToday />
                     </div>
                     <div className="OrderPage__info-content">
                        <span className="OrderPage__info-label">Fecha</span>
                        <span className="OrderPage__info-value">{ dateFormatter(activeOrder.date) }</span>
                     </div>
                  </div>

                  <div className="OrderPage__info-item">
                     <div className="OrderPage__info-icon">
                        <MdShoppingBag />
                     </div>
                     <div className="OrderPage__info-content">
                        <span className="OrderPage__info-label">Productos</span>
                        <span className="OrderPage__info-value">{ totalItems } {totalItems > 1 ? 'unidades' : 'unidad'}</span>
                     </div>
                  </div>

                  {activeOrder.discount && (
                     <div className="OrderPage__info-item OrderPage__info-item--discount">
                        <div className="OrderPage__info-icon">
                           <MdLocalOffer />
                        </div>
                        <div className="OrderPage__info-content">
                           <span className="OrderPage__info-label">Descuento aplicado</span>
                           <span className="OrderPage__info-value OrderPage__info-value--discount">
                              -{ currencyFormatter(discountAmount) }
                           </span>
                        </div>
                     </div>
                  )}
               </div>

               <div className="OrderPage__divider" />

               <div className="OrderPage__total">
                  <span className="OrderPage__total-label">Total pagado</span>
                  <span className="OrderPage__total-value">{ currencyFormatter(activeOrder.total_price) }</span>
               </div>

               <div className="OrderPage__status">
                  <span className="OrderPage__status-label">Estado del pedido</span>
                  <span className={`OrderPage__status-badge ${status.bg} ${status.text} ${status.border}`}>
                     {status.label}
                  </span>
               </div>
            </div>

            <div className="OrderPage__products">
               <div className="OrderPage__products-header">
                  <MdShoppingBag className="text-2xl text-violet-700" />
                  <h2>Productos ({ activeOrder.list.length })</h2>
               </div>

               <div className="OrderPage__products-list">
                  {activeOrder.list.map((item) => {
                     const product = products.find(p => p.id === item.product);
                     if (!product) return null;

                     const unitPrice = activeOrder.discount ? product.prices.wholesale : product.prices.retail;
                     const subtotal = unitPrice * item.count;

                     return (
                        <div key={ item.product } className="OrderPage__product">
<img 
                               className="OrderPage__product-image"
                               src={ resize( product.image, 100, 'products' ) }
                               alt={ product.name }
                               onError={(e) => e.target.style.display = 'none'}
                            />
                           <div className="OrderPage__product-info">
                              <Link to={`/products/${ product.id }`} className="OrderPage__product-name">
                                 { product.name }
                              </Link>
                              <span className="OrderPage__product-quantity">
                                 { item.count } {item.count > 1 ? 'unidades' : 'unidad'}
                              </span>
                           </div>
                           <div className="OrderPage__product-price">
                              { currencyFormatter(subtotal) }
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