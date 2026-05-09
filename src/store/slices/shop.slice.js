import { createSlice } from '@reduxjs/toolkit';

export const shopSlice = createSlice({
	name: 'shop',
	initialState: {
      categories: [],
      products: [],
      banners: [],
	},
	reducers: {
		onLoadCategories: (state, { payload = [] }) => {
			state.categories = payload;
		},
		onLoadProducts: (state, { payload = [] }) => {
			state.products = payload;
		},
		onLoadBanners: (state, { payload = [] }) => {
			state.banners = payload;
		},
		onReduceProductStock: (state, { payload }) => {
			state.products[ payload.index ].stock -= payload.count;
		},
	},
});

export const { 
	onLoadCategories,
	onLoadProducts,
	onLoadBanners,
	onReduceProductStock,
} = shopSlice.actions;
