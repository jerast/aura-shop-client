import { useSelector } from 'react-redux'
import { OrderCard } from '@/modules/session'

export const OrdersPage = () => {
	const { orders } = useSelector( state => state.session )
	
	const { isLoading } = useSelector( state => state.app )
	
	if ( isLoading ) return (
		<section className="Section">
			<h1 className="Section__title">Mis pedidos</h1>
			<h4>Cargando...</h4>
		</section>
	)
	
	if ( !orders.length ) return (
		<section className="Section">
			<h1 className="Section__title">Mis pedidos</h1>
			<h4>No tienes pedidos aún...</h4>
		</section>
	)

	return (
		<section className="Section">
			<h1 className="Section__title">Mis pedidos</h1>
			<article className="Section__content OrderList">
				<div className="overflow-hidden rounded-2xl border border-border bg-card">
					<div className="overflow-x-auto">
						<table className="w-full min-w-[900px]">
							<thead>
								<tr className="border-b border-border bg-muted/30">
									<th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">ID Pedido</th>
									<th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Fecha</th>
									<th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Articulos</th>
									<th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Importe</th>
									<th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Estado</th>
									<th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Acciones</th>
								</tr>
							</thead>
							<tbody>
								{[...orders].reverse().map((order) => (
									<OrderCard
										key={ order.id }
										order={ order }
									/>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</article>
		</section>
	)
}
