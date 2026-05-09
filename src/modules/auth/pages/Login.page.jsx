import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrorMessage, startLogin, startSignin } from '@/store';
import { getLastPath } from '@/helpers';
import { useForm } from '@/hooks';
import { BiLeftArrowAlt } from 'react-icons/bi';
import { Input, Button } from '@/modules/auth';

const loginFormFields = {
	loginEmail: '',
	loginPassword: '',
};

const signFormFields = {
	// signName: '',
	// signSurname: '',
	// signPhone: '',
	signEmail: '',
	signPassword: '',
};

export const LoginPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [ isloggin, setIsloggin ] = useState( true );
	const { errorMessage } = useSelector( state => state.session );
	
	const { 
		formState: loginFormState, 
		onFormChange: onLoginFormChange, 
		onFormReset: onLoginFormReset 
	} = useForm( loginFormFields );
	const { 
		formState: signFormState, 
		onFormChange: onSignFormChange, 
		onFormReset: onSignFormReset 
	} = useForm( signFormFields );

	const handleLoginFormSubmit = async (event) => {
		event.preventDefault();
		dispatch( clearErrorMessage() );

		const response = await dispatch( startLogin({
			email: loginFormState.loginEmail,
			password: loginFormState.loginPassword,
		}) );

		if ( response ) {
			await navigate( getLastPath(), { replace: true });
		}
	};

	const handleSignupFormSubmit = async (event) => {
		event.preventDefault();
		dispatch( clearErrorMessage() );

		const response = await dispatch( startSignin({ 
			name: signFormState.signName,
			surname: signFormState.signSurname,
			phone: signFormState.signPhone,
			email: signFormState.signEmail,
			password: signFormState.signPassword,
		}) );
		if ( response ) {
			await navigate( getLastPath(), { replace: true });
		}
	};

	const handleGoBack = () => {
		dispatch( clearErrorMessage() );
		navigate('/');
	};

	const handleSwitchForm = () => {
		setIsloggin( !isloggin );
		dispatch( clearErrorMessage() );
		onLoginFormReset();
		onSignFormReset();
	};

	if ( localStorage.getItem('aura-shop-token') ) 
			return <Navigate to={ '/' } replace/>;

	return (
		<section className={`Auth ${ isloggin ? '' : 'Auth--sign-up' }`}>

				<div className="Auth__box">
					<form className="Auth__form" onSubmit={ handleLoginFormSubmit }>
						<span className="ShoppingCart__close-button cursor-pointer fluid" onClick={ handleGoBack }><BiLeftArrowAlt /></span>
						<h1 className="Auth__title">Iniciar Sesión</h1>
						<span className="Auth__description">Inicia sesión para continuar.</span>
						<Input 
							type="email" 
							name="loginEmail" 
							placeholder="Correo electrónico"
							value={ loginFormState.loginEmail } 
							onChange={ onLoginFormChange } 
							disabled={ !isloggin }
							required
						/>
						<Input 
							type="password" 
							name="loginPassword" 
							placeholder="Contraseña"
							value={ loginFormState.loginPassword }
							onChange={ onLoginFormChange }
							disabled={ !isloggin }
							required
						/>
						<span className="Auth__error-message">{ errorMessage }</span>
						<Button 
							disabled={ !isloggin }
							value="Continuar"
						/>
						<p className="Auth__options">
							<span>¿No tienes cuenta?</span>
							<span onClick={ handleSwitchForm }>Regístrate</span>
						</p>
					</form>
				</div>
				
				<div className="Auth__box">
					<form className="Auth__form" onSubmit={ handleSignupFormSubmit } >
						<span className="ShoppingCart__close-button cursor-pointer fluid" onClick={ handleGoBack }><BiLeftArrowAlt /></span>
						<h1 className="Auth__title">Crear Usuario</h1>
						<span className="Auth__description">Regístrate para crear un usuario.</span>
						{/* <Input 
							type="text" 
							name="signName" 
							placeholder="Name"
							value={ signFormState.signName } 
							onChange={ onSignFormChange } 
							disabled={ isloggin }
							required
						/>
						<Input 
							type="text" 
							name="signSurname" 
							placeholder="Surname"
							value={ signFormState.signSurname } 
							onChange={ onSignFormChange } 
							disabled={ isloggin }
							required
						/>
						<Input 
							type="number" 
							name="signPhone" 
							placeholder="Phone"
							value={ signFormState.signPhone } 
							onChange={ onSignFormChange } 
							disabled={ isloggin }
						/> */}
						<Input 
							type="email" 
							name="signEmail" 
							placeholder="Email"
							value={ signFormState.signEmail } 
							onChange={ onSignFormChange } 
							disabled={ isloggin }
							required
						/>
						<Input 
							type="password" 
							name="signPassword" 
							placeholder="Password"
							value={ signFormState.signPassword } 
							onChange={ onSignFormChange } 
							disabled={ isloggin }
							required
						/>
						<span className="Auth__error-message">{ errorMessage }</span>
						<Button 
							disabled={ isloggin }
							value="Continuar"
						/>
						<p className="Auth__options">
							<span>¿Ya tienes una cuenta?</span>
							<span onClick={ handleSwitchForm }>Inicia sesión</span>
						</p>
					</form>
				</div>
		</section>
	);
};
