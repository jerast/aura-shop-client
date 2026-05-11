import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onToogleSidebar } from '@/store';
import { RiSearchLine } from 'react-icons/ri';

export const Search = () => {
   const { sidebarIsOpen } = useSelector( state => state.app );
   const [ searchField, onChangeSearchField ] = useState('');
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const searchProduct = (event) => {
		event.preventDefault();
		if (!searchField) return;
		navigate(`/products?q=${ encodeURIComponent(searchField) }`);
      sidebarIsOpen && dispatch( onToogleSidebar() );
	};

   return (
      <form 
         className="Search" 
         onSubmit={ searchProduct }
      >
         <input 
            type="text" 
            placeholder="Buscar productos" 
            name="search"
            autoComplete="off"
            value={ searchField }
            onChange={ ({ target }) => onChangeSearchField( target.value ) }
            onBlur={ () => onChangeSearchField('') }
         />
         <button type="submit" disabled={ !searchField }>
            <RiSearchLine />
         </button>
      </form>
   );
};