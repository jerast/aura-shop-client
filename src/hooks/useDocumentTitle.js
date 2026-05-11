import { useEffect } from 'react';

const BASE_TITLE = 'Aura Belleza';

export const useDocumentTitle = (title) => {
	useEffect(() => {
		if (!title) {
			document.title = BASE_TITLE;
			return;
		}
		document.title = `${title} - ${BASE_TITLE}`;
	}, [title]);

	useEffect(() => {
		return () => {
			document.title = BASE_TITLE;
		};
	}, []);
};

export default useDocumentTitle;