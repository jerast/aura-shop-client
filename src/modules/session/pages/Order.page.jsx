import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearActiveOrder, onLoadEnds, onLoadStarts, startLoadingSelectedOrder } from '@/store';
import { OrderProductCard } from '@/modules/session';
import { currencyFormatter, dateFormatter } from '@/helpers';

export const OrderPage = () => {
	const { id } = useParams();
	const { orders } = useSelector( state => state.session );
	const { isLoading, activeOrder } = useSelector( state => state.app );
	const dispatch = useDispatch();

	useEffect(() => { 
		if (!isLoading) {
			dispatch( onLoadStarts() )
			dispatch( startLoadingSelectedOrder(id) )
			dispatch( onLoadEnds() )
		}
	}, [orders, isLoading]);

	useEffect(() => () => dispatch( clearActiveOrder() ), []);
	

	if ( isLoading ) return (
		<section className="Section">
			<h1 className="Section__title">Detalles del pedido</h1>
			<h4>Cargando...</h4>
		</section>
	);

	if ( !activeOrder ) return (
		<section className="Section">
			<h1 className="Section__title">Detalles del pedido</h1>
			<h4>Pedido no encontrado</h4>
		</section>
	);

	const handleOrderStateClass = () => {
      switch (activeOrder.state) {
         case 'Pendiente':
            return 'OrderCard__state--pending';
         case 'Listo':
            return 'OrderCard__state--active';
         case 'Entregado':
            return 'OrderCard__state--delivered';
         case 'Cancelado':
            return 'OrderCard__state--cancelled';
      
         default:
            return 'OrderCard__state';
      };
   };

	return (
		<section className="Section ">
			<h1 className="Section__title">Pedido no. { activeOrder.id }</h1>
			<article className="OrderConfirm OrderConfirm--order">
				<div className="OrderConfirm__resume">
					<table>
						
						<tbody>
							<tr>
								<td>ID Pedido</td>
								<td>{ activeOrder.id }</td>
							</tr>
							<tr>
								<td>Fecha</td>
								<td>{ dateFormatter(activeOrder.date) }</td>
							</tr>
							<tr>
								<td>Cantidad de productos</td>
								<td>{ activeOrder.list.reduce( (accum, item) => accum + item.count, 0 ) } products</td>
							</tr>
							<tr className="OrderConfirm__discount">
								<td>Descuento</td>
								<td>
									{ 
										currencyFormatter( activeOrder.discount 
											? activeOrder.list.reduce( (accum, item) => accum + (item.prices.retail - item.prices.wholesale) * item.count, 0 ) * (-1)
								 			: 0 
										)
									}
								</td>
							</tr>
							<tr><td><hr /></td><td><hr /></td></tr>
							<tr className="OrderConfirm__total">
								<td>Total</td>
								<td>{ currencyFormatter( activeOrder.total_price ) }</td>
							</tr>
							<tr className="OrderConfirm__state">
								<td>State</td>
								<td className="flex justify-end"><span className={`OrderCard__state ${ handleOrderStateClass() }`}>{ activeOrder.state }</span></td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="OrderConfirm__list">
					{
						activeOrder.list.map( item => <OrderProductCard key={ item.product } item={ item } discount={ activeOrder.discount }/> ) 
					}
				</div>
			</article>
		</section>
   );
};
