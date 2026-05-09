import { TbPackage } from 'react-icons/tb';
import { BiStore } from 'react-icons/bi';
import { GiShoppingBag } from 'react-icons/gi';
import { Link } from 'react-router-dom';

const icons = {
   products: TbPackage,
   categories: BiStore,
   orders: GiShoppingBag,
};

export const EmptyState = ({ type = 'products', title, description, showAction = false }) => {
   const Icon = icons[type] || TbPackage;
   const defaultMessages = {
      products: {
         title: 'No se encontraron productos',
         description: 'No hay productos disponibles en este momento.',
      },
      categories: {
         title: 'No hay categorías',
         description: 'No hay categorías disponibles.',
      },
      orders: {
         title: 'No tienes pedidos aún',
         description: 'Cuando realices tu primera compra, aquí podrás ver tus pedidos.',
      },
   };

   const message = defaultMessages[type] || defaultMessages.products;

   return (
      <div className="EmptyState">
         <div className="EmptyState__icon">
            <Icon />
         </div>
         <h3 className="EmptyState__title">{ title || message.title }</h3>
         <p className="EmptyState__description">{ description || message.description }</p>
         {showAction && type === 'orders' && (
            <Link to="/products" className="EmptyState__action">
               Ver productos
            </Link>
         )}
      </div>
   );
};