import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PublicRoutes, UserRoutes } from '@/routes';

export const AppRoutes = () => {
	const { user } = useSelector( state => state.session );

	return (
		<Routes>
			<Route path="/*" element={ <PublicRoutes /> } /> 
			{!localStorage.getItem('aura-shop-token') && <Route path="/account/*" element={<UserRoutes />} />}
			<Route path="*" element={ <h1>Not Found</h1> } />
		</Routes>
	);
};