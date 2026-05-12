import { createSlice } from '@reduxjs/toolkit';

export const sessionSlice = createSlice({
	name: 'session',
	initialState: {
		isChecking: false,
		status: 'checking', // 'auth', 'not-auth'
		user: {},
		orders: [],
		errorMessage: undefined,
	},
	reducers: {
		onChecking: (state) => {
			state.status = 'checking';
			state.isChecking = true;
		},
		onLogin: (state, { payload }) => {
			state.isChecking = false;
			state.status = 'auth';
			state.user = payload;
			state.errorMessage = undefined;
		},
		onLogout: (state, { payload }) => {
			state.isChecking = false;
			state.status = 'not-auth';
			state.user = {};
			state.orders = [];
			state.errorMessage = payload;
		},
		onAddToOrders: (state, { payload }) => {
			state.orders.push( payload );
		},
		onLoadOrders: (state, { payload = [] }) => {
			state.orders = payload;
		},
		onUpdateUser: (state, { payload }) => {
			state.user = { ...state.user, ...payload };
		},
		onUpdateOrderStatus: (state, { payload }) => {
			const index = state.orders.findIndex(order => order._id === payload.id);
			if (index !== -1) {
				state.orders[index].status = payload.status;
			}
		},
		setErrorMessage: (state, { payload }) => {
			state.errorMessage = payload;
		},
		clearErrorMessage: (state) => {
			state.errorMessage = undefined;
		},
		
	},
});

export const { 
   onChecking, 
   onLogin, 
   onLogout, 
	onLoadOrders, 
	onUpdateUser,
	onUpdateOrderStatus,
   setErrorMessage, 
   clearErrorMessage, 
	onAddToOrders,
} = sessionSlice.actions;
