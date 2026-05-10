import { Route, Routes } from 'react-router-dom';
import { PublicRoutes, UserRoutes } from '@/routes';

export const AppRoutes = () => {
	return (
		<Routes>
			<Route path="/*" element={ <PublicRoutes /> } />
			<Route path="/account/*" element={<UserRoutes />} />
		</Routes>
	);
};