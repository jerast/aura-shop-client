import { Link } from 'react-router-dom';
import { MdErrorOutline } from 'react-icons/md';
import { FaHome } from 'react-icons/fa';

export const NotFound = ({ 
   title = '404', 
   message = 'La página que buscas no existe o fue movida.' 
}) => {
   return (
      <section className="NotFound">
         <div className="NotFound__content">
            <div className="NotFound__icon">
               <MdErrorOutline />
            </div>
            <h1 className="NotFound__title">{title}</h1>
            <p className="NotFound__message">{message}</p>
            <Link to="/" className="NotFound__button">
               <FaHome />
               <span>Volver al inicio</span>
            </Link>
         </div>
      </section>
   );
};

export default NotFound;