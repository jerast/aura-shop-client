import { Navigate, Route, Routes } from 'react-router-dom';
import { Checkout, OrderPage, OrdersPage, ProfilePage } from '@/modules/session';

export const UserRoutes = () => {
	if (!localStorage.getItem('aura-shop-token')) return <Navigate to="/login" replace/>;

	return (
		<Routes>
			<Route path="/" element={ <Navigate to="/account/profile" replace /> } />
			<Route path="/profile" element={ <ProfilePage /> } />
			<Route path="/orders" element={ <OrdersPage /> } />
			<Route path="/orders/checkout" element={ <Checkout /> } />
			<Route path="/orders/:id" element={ <OrderPage /> } />
			<Route path="*" element={ <h1>Not Found</h1> } />
		</Routes>
	);
};
