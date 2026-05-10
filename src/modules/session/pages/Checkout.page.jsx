import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MdArrowBack } from 'react-icons/md';
import { startLoadingCategories, startLoadingProducts } from '@/store';
import { CheckoutSteps, ProfileDataStep, PaymentStep } from '@/modules/session';

export const Checkout = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { isLoading, shoppingCart } = useSelector(state => state.app);
   const { user } = useSelector(state => state.session);
   const [currentStep, setCurrentStep] = useState(1);
   const [completedSteps, setCompletedSteps] = useState([]);
   const [userData, setUserData] = useState(null);

   useEffect(() => {
      (async () => {
         await dispatch(startLoadingProducts());
         await dispatch(startLoadingCategories());
      })();
   }, []);

   useEffect(() => {
      if (!isLoading && !shoppingCart.length) {
         navigate('/', { replace: true });
      }
   }, [isLoading, shoppingCart.length, navigate]);

   const handleStepClick = (stepId) => {
      setCurrentStep(stepId);
   };

   const handleProfileNext = (data) => {
      setUserData(data);
      setCompletedSteps(prev => [...prev, 1]);
      setCurrentStep(3);
   };

   const handlePaymentBack = () => {
      setCurrentStep(1);
   };

   const handleCancel = () => {
      navigate('/');
   };

   if (isLoading) {
      return (
         <section className="Section">
            <h1 className="CheckoutPage__title">Finalizar Compra</h1>
            <div className="CheckoutPage__loading">
               <div className="CheckoutPage__loading-card">
                  <div className="CheckoutPage__loading-header">
                     <span style={{ width: '50%' }} />
                     <span style={{ width: '30%' }} />
                  </div>
                  {[1, 2, 3].map((i) => (
                     <div key={i} className="CheckoutPage__loading-row">
                        <span style={{ width: '40%' }} />
                        <span style={{ width: '60%' }} />
                     </div>
                  ))}
               </div>
            </div>
         </section>
      );
   }

   return (
      <section className="Section">
         <div className="CheckoutPage__header">
            <Link to="/" className="CheckoutPage__back">
               <MdArrowBack />
               <span>Seguir comprando</span>
            </Link>
            <h1 className="CheckoutPage__title">Finalizar Compra</h1>
         </div>

         <CheckoutSteps
            currentStep={currentStep}
            onStepClick={handleStepClick}
            completedSteps={completedSteps}
         />

         <div className="CheckoutPage__steps-content">
            {currentStep === 1 && (
               <ProfileDataStep onNext={handleProfileNext} onCancel={handleCancel} />
            )}
            {currentStep === 3 && (
               <PaymentStep userData={userData} onBack={handlePaymentBack} onCancel={handleCancel} />
            )}
         </div>
      </section>
   );
};