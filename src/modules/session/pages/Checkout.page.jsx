import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { startLoadingCategories, startLoadingProducts, startSavingOrder } from '@/store';
import { CheckoutProductCard } from '@/modules/session';
import { currencyFormatter } from '@/helpers';

export const Checkout = () => {
   
   const { isLoading, isSaving, order, shoppingCart } = useSelector( state => state.app );
	const [habeasDataChecked, setHabeasDataChecked] = useState(false);
	const [personalDataChecked, setPersonalDataChecked] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			await dispatch( startLoadingProducts() );
			await dispatch( startLoadingCategories() );
		})()
	}, [])
	
	useEffect(() => {
		( !isLoading && !shoppingCart.length ) && navigate('/', { replace: true })
	}, [ isLoading ]);

	if ( isLoading ) return;
	
	const handleSavingOrder = () => {
		dispatch( startSavingOrder() );
		navigate( '/account/orders' );
	};

   return (
		<section className="Section ">
			<h1 className="Section__title">Resumen de Compra</h1>
			<article className="OrderConfirm OrderConfirm--checkout">
				<div className="OrderConfirm__list">
					{
						(!isLoading && !!shoppingCart.length) && 
							shoppingCart.map( item => <CheckoutProductCard key={ item.product } id={ item.product }/> ) 
					}
				</div>
				<div className="OrderConfirm__resume">
					<table>
						<thead>
							<tr>
								<th colSpan={ 2 }>Resumen</th>
							</tr>
						</thead>
						<tbody>
							<tr><td colSpan={2}><hr /></td></tr>
							<tr>
								<td>Subtotal</td>
								<td>{ order.total_products } { order.total_products > 1 ? 'productos' : 'producto' }</td>
							</tr>
							<tr className="OrderConfirm__discount">
								<td>Descuento</td>
								<td>
									{
										currencyFormatter( order.total_products >= 6 
											? (order.total_prices.retail - order.total_prices.wholesale) * (-1)
											: 0 ) 
									}
								</td>
							</tr>
							<tr><td colSpan={2}><hr /></td></tr>
							<tr className="OrderConfirm__total">
								<td>Total</td>
								<td>
									{ 
										currencyFormatter( order.total_products >= 6 
											? order.total_prices.wholesale 
											: order.total_prices.retail ) 
									}
								</td>
							</tr>
						</tbody>
					</table>
					
					<div className="OrderConfirm__checks">
						<label>
							<input type="checkbox" checked={habeasDataChecked} onChange={(e) => setHabeasDataChecked(e.target.checked)} />
							He leído y acepto los términos y condiciones
						</label>
						<label>
							<input type="checkbox" checked={personalDataChecked} onChange={(e) => setPersonalDataChecked(e.target.checked)} />
							He leído y acepto el tratamiento de datos personales
						</label>
					</div>
					
					<button 
						className="OrderConfirm__button" 
						onClick={ handleSavingOrder } 
						disabled={ !habeasDataChecked || !personalDataChecked || isLoading }
					>
						{ isSaving ? '...' : 'Finalizar Compra' }
					</button>
				</div>
			</article>
		</section>
   );
};