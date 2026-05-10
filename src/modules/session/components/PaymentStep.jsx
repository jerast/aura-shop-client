import { useState } from 'react';
import { FaCreditCard } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { startSavingOrder } from '@/store';
import { useNavigate } from 'react-router-dom';
import { currencyFormatter } from '@/helpers';

export const PaymentStep = ({ userData, onBack, onCancel }) => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { order, shoppingCart } = useSelector(state => state.app);
   const [isProcessing, setIsProcessing] = useState(false);
   const [errors, setErrors] = useState({});

   const [formState, setFormState] = useState({
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvv: '',
   });

   const hasDiscount = order.total_products >= 6;
   const totalPrice = hasDiscount ? order.total_prices.wholesale : order.total_prices.retail;

   const handleChange = (e) => {
      const { name, value } = e.target;
      let formattedValue = value;

      if (name === 'cardNumber') {
         formattedValue = value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
      } else if (name === 'expiry') {
         formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
      } else if (name === 'cvv') {
         formattedValue = value.replace(/\D/g, '').slice(0, 4);
      }

      setFormState(prev => ({ ...prev, [name]: formattedValue }));
      if (errors[name]) {
         setErrors(prev => ({ ...prev, [name]: '' }));
      }
   };

   const validate = () => {
      const newErrors = {};
      const cleanCardNumber = formState.cardNumber.replace(/\s/g, '');
      
      if (!cleanCardNumber) newErrors.cardNumber = 'El número de tarjeta es requerido';
      else if (cleanCardNumber.length < 16) newErrors.cardNumber = 'Número de tarjeta inválido';
      
      if (!formState.cardName.trim()) newErrors.cardName = 'El nombre en la tarjeta es requerido';
      
      if (!formState.expiry) newErrors.expiry = 'La fecha de expiración es requerida';
      else if (!/^\d{2}\/\d{2}$/.test(formState.expiry)) newErrors.expiry = 'Formato inválido (MM/YY)';
      
      if (!formState.cvv) newErrors.cvv = 'El CVV es requerido';
      else if (formState.cvv.length < 3) newErrors.cvv = 'CVV inválido';

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validate()) return;

      setIsProcessing(true);

      setTimeout(() => {
         dispatch(startSavingOrder());
         navigate('/account/orders');
      }, 2000);
   };

   return (
      <div className="CheckoutStep">
         <div className="CheckoutStep__header">
            <FaCreditCard className="text-2xl text-violet-700" />
            <h2>Datos de Pago</h2>
         </div>

         <form className="CheckoutStep__form" onSubmit={handleSubmit}>
            <div className="PaymentSummary">
               <div className="PaymentSummary__total">
                  <span>Total a pagar</span>
                  <span className="PaymentSummary__amount">{currencyFormatter(totalPrice)}</span>
               </div>
               <div className="PaymentSummary__items">
                  {shoppingCart.length} {shoppingCart.length > 1 ? 'productos' : 'producto'}
               </div>
            </div>

            <div className="CheckoutStep__row">
               <div className="CheckoutStep__row--full">
                  <label className="Field__label">Número de tarjeta *</label>
                  <input
                     type="text"
                     name="cardNumber"
                     value={formState.cardNumber}
                     onChange={handleChange}
                     placeholder="1234 5678 9012 3456"
                     className={`Field__input ${errors.cardNumber ? 'Field__input--error' : ''}`}
                     maxLength={19}
                  />
                  {errors.cardNumber && <span className="Field__error">{errors.cardNumber}</span>}
               </div>
            </div>

            <div className="CheckoutStep__row">
               <div className="CheckoutStep__row--full">
                  <label className="Field__label">Nombre en la tarjeta *</label>
                  <input
                     type="text"
                     name="cardName"
                     value={formState.cardName}
                     onChange={handleChange}
                     placeholder="JUAN PEREZ"
                     className={`Field__input ${errors.cardName ? 'Field__input--error' : ''}`}
                  />
                  {errors.cardName && <span className="Field__error">{errors.cardName}</span>}
               </div>
            </div>

            <div className="CheckoutStep__row">
               <div>
                  <label className="Field__label">Fecha de expiración *</label>
                  <input
                     type="text"
                     name="expiry"
                     value={formState.expiry}
                     onChange={handleChange}
                     placeholder="MM/YY"
                     className={`Field__input ${errors.expiry ? 'Field__input--error' : ''}`}
                     maxLength={5}
                  />
                  {errors.expiry && <span className="Field__error">{errors.expiry}</span>}
               </div>
               <div>
                  <label className="Field__label">CVV *</label>
                  <input
                     type="text"
                     name="cvv"
                     value={formState.cvv}
                     onChange={handleChange}
                     placeholder="123"
                     className={`Field__input ${errors.cvv ? 'Field__input--error' : ''}`}
                     maxLength={4}
                  />
                  {errors.cvv && <span className="Field__error">{errors.cvv}</span>}
               </div>
            </div>

            {isProcessing && (
               <div className="PaymentProcessing">
                  <div className="PaymentProcessing__spinner" />
                  <span>Procesando pago...</span>
               </div>
            )}

            <div className="CheckoutStep__actions">
               <button type="button" className="CheckoutStep__button CheckoutStep__button--secondary" onClick={onBack}>
                  Atrás
               </button>
               <button type="submit" className="CheckoutStep__button" disabled={isProcessing}>
                  {isProcessing ? 'Procesando...' : 'Pagar ahora'}
               </button>
            </div>
         </form>
      </div>
   );
};