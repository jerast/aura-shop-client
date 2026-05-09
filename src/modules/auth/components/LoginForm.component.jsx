import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearErrorMessage, startLogin } from '@/store';
import { getLastPath } from '@/helpers';
import { useForm } from '@/hooks';
import { Input, Button } from '@/modules/auth';
import { BiLeftArrowAlt } from 'react-icons/bi';

const loginFormFields = {
	loginEmail: '',
	loginPassword: '',
};

export const LoginForm = ({ disabled, onSwitchForm }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { errorMessage } = useSelector( state => state.session );

	const { 
		formState, 
		onFormChange, 
		onFormReset 
	} = useForm( loginFormFields );

	useEffect(() => {
		onFormReset();
	}, [disabled]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		dispatch( clearErrorMessage() );

		const response = await dispatch( startLogin({
			email: formState.loginEmail,
			password: formState.loginPassword,
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
			<h1 className="Auth__title">Iniciar Sesión</h1>
			<span className="Auth__description">Inicia sesión para continuar.</span>
			<Input 
				type="email" 
				name="loginEmail" 
				placeholder="Correo electrónico"
				value={ formState.loginEmail } 
				onChange={ onFormChange } 
				disabled={ disabled }
				required
			/>
			<Input 
				type="password" 
				name="loginPassword" 
				placeholder="Contraseña"
				value={ formState.loginPassword }
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
				<span>¿No tienes cuenta?</span>
				<span onClick={ onSwitchForm }>Regístrate</span>
			</p>
		</form>
	);
};