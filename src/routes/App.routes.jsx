import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const AppRoutes = () => {
	const { status } = useSelector( state => state.session );

	return (
		<Routes>
			<Route path="/login" element={ <AuthPage /> } />
			<Route path="/signup" element={ <AuthPage /> } />

			<Route path="/" element={ <HomePage /> } />
			<Route path="/categories" element={ <CategoriesPage /> } />
			<Route path="/products" element={ <ProductsPage /> } />
			<Route path="/products/:id" element={ <ProductPage /> } />
			<Route path="/categories/:category" element={ <ProductsPage /> } />
			<Route path="/contact" element={ <ContactPage /> } />

			{
				status === 'auth' && <>
					<Route path="/account" element={ <Navigate to="/account/profile" replace /> } />
					<Route path="/account/profile" element={ <ProfilePage /> } />
					<Route path="/account/orders" element={ <OrdersPage /> } />
					<Route path="/account/orders/checkout" element={ <Checkout /> } />
					<Route path="/account/orders/:id" element={ <OrderPage /> } />
				</>
			}

			<Route path="*" element={ <h1>Not Found</h1> } />
		</Routes>
	);
};