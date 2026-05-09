import { Route, Routes } from 'react-router-dom';
import { AuthPage } from '@/modules/auth';
import { CategoriesPage, ProductsPage, HomePage, ProductPage, ContactPage } from '@/modules/shop';

export const PublicRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={ <HomePage /> } />
			<Route path="/categories" element={ <CategoriesPage /> } />
			<Route path="/products" element={ <ProductsPage /> } />
			<Route path="/products/:id" element={ <ProductPage /> } />
			<Route path="/categories/:category" element={ <ProductsPage /> } />
			<Route path="/login" element={ <AuthPage /> } />
			<Route path="/signup" element={ <AuthPage /> } />
			<Route path="/contact" element={ <ContactPage /> } />
			<Route path="*" element={ <h1>Not Found</h1> } />
		</Routes>
	);
};