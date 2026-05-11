import { useState } from 'react';
import { FaUser, FaCreditCard, FaCheck } from 'react-icons/fa';
import { MdLocalShipping } from 'react-icons/md';

const steps = [
   { id: 1, label: 'Datos', icon: FaUser },
   // { id: 2, label: 'Envío', icon: MdLocalShipping },
   { id: 3, label: 'Pago', icon: FaCreditCard },
];

export const CheckoutSteps = ({ currentStep, onStepClick, completedSteps }) => {
   return (
      <div className="CheckoutSteps">
         {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = completedSteps.includes(step.id);
            const Icon = step.icon;
            
            return (
               <div key={step.id} className="CheckoutSteps__item">
                  <button 
                     className={`CheckoutSteps__circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                     onClick={() => isCompleted && onStepClick(step.id)}
                     disabled={!isCompleted && !isActive}
                  >
                     {isCompleted ? <FaCheck /> : <Icon />}
                  </button>
                  <span className={`CheckoutSteps__label ${isActive ? 'active' : ''}`}>
                     {step.label}
                  </span>
                  {index < steps.length - 1 && (
                     <div className={`CheckoutSteps__line ${isCompleted ? 'completed' : ''}`} />
                  )}
               </div>
            );
         })}
      </div>
   );
};