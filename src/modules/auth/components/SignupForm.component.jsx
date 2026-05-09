import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearErrorMessage, setErrorMessage, startSignin } from '@/store';
import { getLastPath } from '@/helpers';
import { useForm } from '@/hooks';
import { Input, Button } from '@/modules/auth';
import { BiLeftArrowAlt } from 'react-icons/bi';

const signFormFields = {
	signEmail: '',
	signPassword: '',
	signConfirmPassword: '',
};

export const SignupForm = ({ disabled, onSwitchForm }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { errorMessage } = useSelector( state => state.session );

	const { 
		formState, 
		onFormChange, 
		onFormReset 
	} = useForm( signFormFields );

	useEffect(() => {
		onFormReset();
	}, [disabled]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		dispatch( clearErrorMessage() );

		if (formState.signPassword !== formState.signConfirmPassword) {
			dispatch( setErrorMessage('Las contraseñas no coinciden') );
			return;
		}

		const response = await dispatch( startSignin({ 
			email: formState.signEmail,
			password: formState.signPassword,
		}) );

		if ( response ) {
			await navigate( getLastPath(), { replace: true });
		}
	};

	return (
		<form className="Auth__form" onSubmit={ handleSubmit }>
			<span className="ShoppingCart__close-button cursor-pointer fluid" onClick={ () => navigate('/') }>
				<BiLeftArrowAlt />
			</span>
			<h1 className="Auth__title">Crear Usuario</h1>
			<span className="Auth__description">Regístrate para crear un usuario.</span>
			<Input 
				type="email" 
				name="signEmail" 
				placeholder="Correo electrónico"
				value={ formState.signEmail } 
				onChange={ onFormChange } 
				disabled={ disabled }
				required
			/>
			<Input 
				type="password" 
				name="signPassword" 
				placeholder="Contraseña"
				value={ formState.signPassword } 
				onChange={ onFormChange } 
				disabled={ disabled }
				required
			/>
			<Input 
				type="password" 
				name="signConfirmPassword" 
				placeholder="Confirmar contraseña"
				value={ formState.signConfirmPassword } 
				onChange={ onFormChange } 
				disabled={ disabled }
				required
			/>
			<span className="Auth__error-message">{ errorMessage }</span>
			<Button 
				disabled={ disabled }
				value="Continuar"
			/>
			<p className="Auth__options">
				<span>¿Ya tienes una cuenta?</span>
				<span onClick={ onSwitchForm }>Inicia sesión</span>
			</p>
		</form>
	);
};