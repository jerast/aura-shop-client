import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PublicRoutes, UserRoutes } from '@/routes';

export const AppRoutes = () => {
	const { status } = useSelector( state => state.session );

	return (
		<Routes>
			<Route path="/*" element={ <PublicRoutes /> } />
			<Route path="/account/*" element={<UserRoutes />} />
		</Routes>
	);
};