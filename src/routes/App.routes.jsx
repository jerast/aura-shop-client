import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PublicRoutes, UserRoutes } from '@/routes';

export const AppRoutes = () => {
	const { user } = useSelector( state => state.session );

	return (
		<Routes>
			<Route path="/account/*" element={<UserRoutes />} />
			<Route path="/*" element={ <PublicRoutes /> } /> 
		</Routes>
	);
};