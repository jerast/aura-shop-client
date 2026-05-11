import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearErrorMessage } from '@/store';
import { LoginForm, SignupForm } from '@/modules/auth';
import { useDocumentTitle } from '@/hooks';

export const AuthPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const isLogin = location.pathname === '/login';

	useDocumentTitle(isLogin ? 'Iniciar Sesión' : 'Crear Cuenta');

	const handleSwitchForm = () => {
		dispatch( clearErrorMessage() );
		navigate(isLogin ? '/signup' : '/login');
	};

	if ( localStorage.getItem('aura-shop-token') ) 
		return <Navigate to={ '/' } replace/>;

	return (
		<section className={`Auth ${ isLogin ? '' : 'Auth--sign-up' }`}>
			<div className="Auth__box">
				<LoginForm
					disabled={ !isLogin }
					onSwitchForm={ handleSwitchForm }
				/>
			</div>
			<div className="Auth__box">
				<SignupForm
					disabled={ isLogin }
					onSwitchForm={ handleSwitchForm }
				/>
			</div>
		</section>
	);
};