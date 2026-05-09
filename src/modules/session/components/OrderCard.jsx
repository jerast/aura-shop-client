import { Link } from 'react-router-dom';
import { cn, currencyFormatter, dateFormatter } from '@/helpers';
import { Search, ChevronDown, Eye, MoreHorizontal, X } from 'lucide-react'


const statusConfig = {
  pending: { label: "Pendiente", className: "bg-amber-100 text-amber-700" },
  ready: { label: "Listo", className: "bg-sky-100 text-sky-700" },
  delivered: { label: "Entregado", className: "bg-emerald-100 text-emerald-700" },
  canceled: { label: "Cancelado", className: "bg-rose-100 text-rose-700" },
}

export const OrderCard = ({ order }) => {
   console.log(order);
   
   return (
      <tr key={order.id} className="border-b border-border last:border-0 transition-colors hover:bg-secondary/30">
         <td className="px-6 py-4">
            <span className="font-medium text-foreground">{order.id}</span>
         </td>
         <td className="px-6 py-4 text-sm text-muted-foreground">{order.date}</td>
         <td className="px-6 py-4 text-sm tabular-nums text-foreground">{order.list.reduce((accum, item) => accum + item.count, 0)}</td>
         <td className="px-6 py-4 text-sm font-medium tabular-nums text-foreground">{order.total_price}</td>
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
                  <Eye className="h-4 w-4 text-muted-foreground" />
               </Link>
               <button
                  type="button"
                  onClick={() => cycleStatus(order)}
                  className="rounded-lg p-2 transition-colors hover:bg-muted"
                  aria-label={`Cambiar estado de ${order.id}`}
               >
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
               </button>
            </div>
         </td>
      </tr>
   );
};