import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { cn, currencyFormatter, dateFormatter, toCapitalize } from '@/helpers';
import { MdVisibility, MdMoreVert } from 'react-icons/md';
import { startCancelOrderStatus } from '@/store';
import { useDispatch } from 'react-redux';

const statusConfig = {
  pending: { label: "Pendiente", className: "bg-amber-100 text-amber-700" },
  ready: { label: "Listo", className: "bg-sky-100 text-sky-700" },
  delivered: { label: "Entregado", className: "bg-emerald-100 text-emerald-700" },
  canceled: { label: "Cancelado", className: "bg-rose-100 text-rose-700" },
}

export const OrderCard = ({ order }) => {
   const [userMenuOpen, setUserMenuOpen] = useState(false)
   const userMenuRef = useRef(null)
   const dispatch = useDispatch();
   
   return (
      <tr key={order.id} className="border-b border-border last:border-0 transition-colors hover:bg-secondary/30">
         <td className="px-6 py-4">
            <span className="font-medium text-foreground">{order.id}</span>
         </td>
         <td className="px-6 py-4 text-sm text-muted-foreground">{dateFormatter(order.date)}</td>
         <td className="px-6 py-4 text-sm tabular-nums text-foreground">{order.list.reduce((accum, item) => accum + item.count, 0)}</td>
         <td className="px-6 py-4 text-sm font-medium tabular-nums text-foreground">{currencyFormatter(order.total_price)}</td>
         <td className="px-6 py-4">
            <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", statusConfig[order.status].className)}>
               {statusConfig[order.status].label}
            </span>
         </td>
         <td className="px-6 py-4">
            <div className="flex items-center justify-end gap-2">
               <Link
                  to={`/account/orders/${ order.id }`}
                  type="button"
                  className="rounded-lg p-2 transition-colors hover:bg-muted"
                  aria-label={`Ver ${order.id}`}
               >
                  <MdVisibility className="text-xl text-muted-foreground" />
               </Link>
               {
                  order.status !== 'canceled' && 
                  <div ref={userMenuRef} className='relative'>
                     <button
                        type="button"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="rounded-lg p-2 transition-colors hover:bg-muted"
                        aria-label={`Cambiar estado de ${order.id}`}
                        
                     >
                        <MdMoreVert className="text-xl text-muted-foreground" />
                     </button>
                     {userMenuOpen && (
                        <div className="absolute w-[160px] bottom-full right-0 mb-2 bg-white rounded-lg border border-border shadow-lg">
                        <button 
                           onClick={() => {
                              setUserMenuOpen(false)
                              dispatch( startCancelOrderStatus(order._id));
                           }}
                           className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-[#F5F3FF] transition-colors"
                        >
                           Cancelar pedido
                        </button>
                        </div>
                     )}
                  </div>
               }
            </div>
         </td>
      </tr>
   );
};