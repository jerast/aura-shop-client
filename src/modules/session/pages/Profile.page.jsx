import { useSelector } from 'react-redux';
import { useState, useEffect, useMemo } from 'react';
import { shopApi } from '@/api';
import { ProfileField } from '@/modules/session';
import { useForm } from '@/hooks';

const documentTypes = [
   { value: 'CC', label: 'Cédula de Ciudadanía (CC)' },
   { value: 'CE', label: 'Cédula de Extranjería (CE)' },
];

const genderOptions = [
   { value: 'M', label: 'Masculino' },
   { value: 'F', label: 'Femenino' },
];

const initialFormState = {
   name: '',
   surname: '',
   dniType: '',
   dniNumber: '',
   gender: '',
   birthdate: '',
   phone: '',
};

export const ProfilePage = () => {
   const { user } = useSelector(state => state.session);
   
   const [isSaving, setIsSaving] = useState(false);
   const [successMessage, setSuccessMessage] = useState('');

   const {
      formState,
      onFormChange,
      setFormState,
   } = useForm(initialFormState);

   useEffect(() => {
      if (user && user.id) {
         setFormState({
            name: user.name || '',
            surname: user.surname || '',
            dniType: user.dniType || '',
            dniNumber: user.dniNumber || '',
            gender: user.gender || '',
            birthdate: user.birthdate || '',
            phone: user.phone || '',
         });
      }
   }, [user]);

   const email = user?.email || '';

   const hasChanges = useMemo(() => {
      if (!user || !user.id) return false;
      
      const userFields = {
         name: user.name || '',
         surname: user.surname || '',
         dniType: user.dniType || '',
         dniNumber: user.dniNumber || '',
         gender: user.gender || '',
         birthdate: user.birthdate || '',
         phone: user.phone || '',
      };

      return Object.keys(userFields).some(
         key => formState[key] !== userFields[key]
      );
   }, [formState, user]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      
      setIsSaving(true);
      setSuccessMessage('');

      try {
         const { data } = await shopApi.put(`/users/${user.id}`, {
            name: formState.name,
            surname: formState.surname,
            dniType: formState.dniType,
            dniNumber: formState.dniNumber,
            gender: formState.gender,
            birthdate: formState.birthdate,
            phone: formState.phone,
         });

         if (data.ok) {
            setSuccessMessage('Perfil actualizado correctamente');
            setTimeout(() => setSuccessMessage(''), 3000);
         }
      } catch (error) {
         console.error('Error updating profile:', error);
      } finally {
         setIsSaving(false);
      }
   };

   if (!user || !user.id) {
      return (
         <section className="Section">
            <div className="ProfilePage">
               <h1 className="ProfilePage__title">Mi Perfil</h1>
               <p className="text-gray-500 text-center mt-4">Cargando información...</p>
            </div>
         </section>
      );
   }

   return (
      <section className="Section">
         <div className="ProfilePage">
            <div className="ProfilePage__header">
               <h1 className="ProfilePage__title">Mi Perfil</h1>
               <p className="ProfilePage__subtitle">Gestiona tu información personal</p>
            </div>

            <form className="ProfilePage__form" onSubmit={ handleSubmit }>
               <div className="ProfilePage__row">
                  <ProfileField
                     type="text"
                     name="name"
                     label="Nombre"
                     value={ formState.name }
                     onChange={ onFormChange }
                     required
                  />
                  <ProfileField
                     type="text"
                     name="surname"
                     label="Apellido"
                     value={ formState.surname }
                     onChange={ onFormChange }
                     required
                  />
               </div>

               <div className="ProfilePage__row">
                  <div className="ProfilePage__row--full">
                     <ProfileField
                        type="email"
                        name="email"
                        label="Correo electrónico"
                        value={ email }
                        disabled
                     />
                  </div>
               </div>

               <div className="ProfilePage__row">
                  <ProfileField
                     type="select"
                     name="dniType"
                     label="Tipo de documento"
                     value={ formState.dniType }
                     onChange={ onFormChange }
                     options={ documentTypes }
                  />
                  <ProfileField
                     type="text"
                     name="dniNumber"
                     label="Número de documento"
                     value={ formState.dniNumber }
                     onChange={ onFormChange }
                  />
               </div>

               <div className="ProfilePage__row">
                  <ProfileField
                     type="select"
                     name="gender"
                     label="Género"
                     value={ formState.gender }
                     onChange={ onFormChange }
                     options={ genderOptions }
                  />
                  <ProfileField
                     type="date"
                     name="birthdate"
                     label="Fecha de nacimiento"
                     value={ formState.birthdate }
                     onChange={ onFormChange }
                  />
               </div>

               <div className="ProfilePage__row">
                  <div className="ProfilePage__row--full">
                     <ProfileField
                        type="tel"
                        name="phone"
                        label="Teléfono"
                        value={ formState.phone }
                        onChange={ onFormChange }
                     />
                  </div>
               </div>

               {successMessage && (
                  <p className="ProfilePage__success">{ successMessage }</p>
               )}

               <div className="ProfilePage__actions">
                  <button
                     type="submit"
                     className={`ProfilePage__button ${isSaving ? 'ProfilePage__button--saving' : ''}`}
                     disabled={ isSaving || !hasChanges }
                  >
                     { isSaving ? 'Guardando...' : 'Guardar cambios' }
                  </button>
               </div>
            </form>
         </div>
      </section>
   );
};