import { shopApi } from '@/api';
import { onLoadProducts, onLoadCategories, onLoadBanners } from '@/store';

export const startLoadingCategories = () => 
	async (dispatch) => {
		try {
			const { data } = await shopApi.get('/categories');
			dispatch( onLoadCategories(data.categories) );
		} catch {
			console.error( 'Something fails at load Categories' );
		}
	};

export const startLoadingProducts = () => 
	async (dispatch) => {
		try {
			const { data } = await shopApi.get('/products');
			dispatch( onLoadProducts(data.products) );
			
		} catch {
			console.error( 'Something fails at load Products' );
		}
	};

export const startLoadingBanners = () => 
	async (dispatch) => {
		try {
			const { data } = await shopApi.get('/banners');
			dispatch( onLoadBanners(data.banners) );
		} catch {
			console.error( 'Something fails at load Banners' );
		}
	};