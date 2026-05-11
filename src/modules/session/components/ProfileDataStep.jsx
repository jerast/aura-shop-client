import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser } from 'react-icons/fa';
import { shopApi } from '@/api';
import { onUpdateUser } from '@/store';
import { ProfileField } from './ProfileField';
import { formatDateForInput } from '@/helpers';

const documentTypes = [
   { value: 'CC', label: 'Cédula de Ciudadanía (CC)' },
   { value: 'CE', label: 'Cédula de Extranjería (CE)' },
];

const genderOptions = [
   { value: 'M', label: 'Masculino' },
   { value: 'F', label: 'Femenino' },
];

export const ProfileDataStep = ({ onNext, onCancel }) => {
   const dispatch = useDispatch();
   const { user } = useSelector(state => state.session);
   
   const [isSaving, setIsSaving] = useState(false);
   const [errors, setErrors] = useState({});

   const [formState, setFormState] = useState({
      name: user?.name || '',
      surname: user?.surname || '',
      dniType: user?.dniType || '',
      dniNumber: user?.dniNumber ? String(user.dniNumber) : '',
      gender: user?.gender || '',
      birthday: formatDateForInput(user?.birthday),
      phone: user?.phone ? String(user.phone) : '',
   });

   const email = user?.email || '';

   useEffect(() => {
      setFormState({
         name: user?.name || '',
         surname: user?.surname || '',
         dniType: user?.dniType || '',
         dniNumber: user?.dniNumber ? String(user.dniNumber) : '',
         gender: user?.gender || '',
         birthday: formatDateForInput(user?.birthday),
         phone: user?.phone ? String(user.phone) : '',
      });
   }, [user]);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormState(prev => ({ ...prev, [name]: value }));
      if (errors[name]) {
         setErrors(prev => ({ ...prev, [name]: '' }));
      }
   };

   const validate = () => {
      const newErrors = {};
      if (!formState.name.trim()) newErrors.name = 'El nombre es requerido';
      if (!formState.surname.trim()) newErrors.surname = 'El apellido es requerido';
      if (!formState.dniType) newErrors.dniType = 'El tipo de documento es requerido';
      if (!formState.dniNumber.trim()) newErrors.dniNumber = 'El número de documento es requerido';
      if (!formState.gender) newErrors.gender = 'El género es requerido';
      if (!formState.birthday) newErrors.birthday = 'La fecha de nacimiento es requerida';
      if (!formState.phone.trim()) newErrors.phone = 'El teléfono es requerido';
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validate()) return;

      setIsSaving(true);

      try {
         const updateData = {
            name: formState.name,
            surname: formState.surname,
            dniType: formState.dniType,
            dniNumber: formState.dniNumber,
            gender: formState.gender,
            birthday: formState.birthday,
            phone: formState.phone,
         };

         await shopApi.put(`/users/${user.id}`, updateData);
         dispatch(onUpdateUser(updateData));
         onNext(formState);
      } catch (error) {
         console.error('Error updating profile:', error);
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <div className="CheckoutStep">
         <div className="CheckoutStep__header">
            <FaUser className="text-2xl text-violet-700" />
            <h2>Datos Personales</h2>
         </div>

         <form className="CheckoutStep__form" onSubmit={handleSubmit}>
            <div className="CheckoutStep__row">
               <ProfileField
                  type="text"
                  name="name"
                  label="Nombre *"
                  value={formState.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
               />
               <ProfileField
                  type="text"
                  name="surname"
                  label="Apellido *"
                  value={formState.surname}
                  onChange={handleChange}
                  error={errors.surname}
                  required
               />
            </div>

            <div className="CheckoutStep__row">
               <ProfileField
                  type="email"
                  name="email"
                  label="Correo electrónico"
                  value={email}
                  disabled
               />
               <ProfileField
                     type="tel"
                     name="phone"
                     label="Teléfono *"
                     value={formState.phone}
                     onChange={handleChange}
                     error={errors.phone}
                     required
                  />
            </div>

            <div className="CheckoutStep__row">
               <ProfileField
                  type="select"
                  name="dniType"
                  label="Tipo de documento *"
                  value={formState.dniType}
                  onChange={handleChange}
                  options={documentTypes}
                  error={errors.dniType}
                  required
               />
               <ProfileField
                  type="text"
                  name="dniNumber"
                  label="Número de documento *"
                  value={formState.dniNumber}
                  onChange={handleChange}
                  error={errors.dniNumber}
                  required
               />
            </div>

            <div className="CheckoutStep__row">
               <ProfileField
                  type="select"
                  name="gender"
                  label="Género *"
                  value={formState.gender}
                  onChange={handleChange}
                  options={genderOptions}
                  error={errors.gender}
                  required
               />
               <ProfileField
                  type="date"
                  name="birthday"
                  label="Fecha de nacimiento *"
                  value={formState.birthday}
                  onChange={handleChange}
                  error={errors.birthday}
                  required
               />
            </div>

            <div className="CheckoutStep__actions">
               <button type="button" className="CheckoutStep__button CheckoutStep__button--secondary" onClick={onCancel}>
                  Cancelar
               </button>
               <button type="submit" className="CheckoutStep__button" disabled={isSaving}>
                  {isSaving ? 'Guardando...' : 'Continuar'}
               </button>
            </div>
         </form>
      </div>
   );
};