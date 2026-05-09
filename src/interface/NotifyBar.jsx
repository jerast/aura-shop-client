import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export const NotifyBar = () => {
   const { status } = useSelector( state => state.session );

   return (
      <div className="NotifyBar">
         <p>Compra 6 o más productos y <span className="primary">Obtén un Descuento.</span></p>
         { status !== 'auth' 
            ? <Link to="/login" className="primary link">¡Regístrate!</Link> 
            : <Link to="/products" className="primary link">¡Compra Ya!</Link> }
      </div>
   );
};