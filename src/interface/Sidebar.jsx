import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { onToogleSidebar, startLogout } from '@/store';
import { DropdownButton, Search } from '@/interface';
import { MdClose } from 'react-icons/md';
import { RiLoader4Line } from 'react-icons/ri';
import { FaRegUser } from 'react-icons/fa';
import { SVGLogo } from '@/assets';

export const Sidebar = () => {
	const { isLoading, sidebarIsOpen } = useSelector( state => state.app );
	const { status, user } = useSelector( state => state.session );
	const [ isShow, toogleShow ] = useState( false );
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		sidebarIsOpen 
			? toogleShow(true) 
			: setTimeout(() => toogleShow(false), 250);
	}, [sidebarIsOpen]);

	const handleCloseSidebar = () => 
		dispatch(onToogleSidebar());

	const handleLogout = () => {
		dispatch(startLogout());
		navigate('/', { replace: true });
		dispatch(onToogleSidebar());
	};

	const handleLogin = () => {
		dispatch(onToogleSidebar());
		navigate('/login', { replace: true });
	};

	const handleSetInitials = () => {
		const { name, surname, email } = user;

		if (name && surname) {
			return `${name[0]}${surname[0]}`.toUpperCase();
		}

		if (name) {
			return name.slice(0, 2).toUpperCase();
		}

		if (email) {
			const emailInitials = email.split('@')[0].slice(0, 2);
			return emailInitials.toUpperCase();
		}

		return 'U';
	};

   return (
      (isShow) && (
			<div className="Sidebar">
				<div 
					className={`Sidebar__backdrop ${ sidebarIsOpen ? 'animate-in fade-in duration-300' : 'animate-out fade-out duration-300' }`}
					onClick={ handleCloseSidebar }
				/>
				<div className={`Sidebar__content ${ sidebarIsOpen ? 'animate-in slide-in-from-left duration-300' : 'animate-out slide-out-to-left duration-300' }`}>					
					<div className="Sidebar__header">
						<button className="Sidebar__close-button fluid" onClick={ handleCloseSidebar }>
							<MdClose />
						</button>
						<DropdownButton 
							className="Navbar__controls-login"
							disabled={ isLoading || status === 'checking' }
							conditions={ !isLoading && status === 'auth' }
						>
							<span 
								className={`Navbar__controls-login-button fluid ${ (status === 'auth' && !isLoading ) ? 'logged' : '' }`} 
								onClick={ (status !== 'auth') ? handleLogin : null }
							>
								{ 
									( isLoading || status === 'checking' )
									? 	<RiLoader4Line className="animate-spin text-2xl"/>
									: 	( status === 'auth' ) 
										? handleSetInitials()
										: <FaRegUser /> 
								}
							</span>
							<div className="Navbar__controls-login-dropdown">
								<ul>
									<li><span onClick={ handleLogout }>Cerrar sesión</span></li>
								</ul>
							</div>
						</DropdownButton>
					</div>
					<Search />
					<ul className="Sidebar__group">
						<li><NavLink onClick={ handleCloseSidebar } to="/">Inicio</NavLink></li>
						<li><NavLink onClick={ handleCloseSidebar } to="/categories">Categorías</NavLink></li>
						<li><NavLink onClick={ handleCloseSidebar } to="/products">Productos</NavLink></li>
						<li><NavLink onClick={ handleCloseSidebar } to="/contact">Contacto</NavLink></li>
					</ul>
					{
						(!isLoading && status === 'auth') && (
							<ul className="Sidebar__group">
								<li><NavLink onClick={ handleCloseSidebar } to="/account/profile">Mi cuenta</NavLink></li>
								<li><NavLink onClick={ handleCloseSidebar } to="/account/orders">Mis pedidos</NavLink></li>
							</ul>
						)
					}
					{
						(!isLoading) && (
							<ul className="Sidebar__group">
								<li>
									<button onClick={ (status === 'auth') ? handleLogout : handleLogin }>
										{ (status === 'auth') ? 'Cerrar sesión' : 'Iniciar sesión' }
									</button>
								</li>
							</ul>
						)
					}
					<SVGLogo className="Sidebar__logo" />
				</div>
			</div>
		)
   );
};