import { toCapitalize } from '@/helpers'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useLocation } from 'react-router-dom'

const pathNames = {
   products: { path: '/products', name: 'Productos' },
   categories: { path: '/categories', name: 'Categorías' },
   contact: { path: '/contact', name: 'Contacto' },
   account: { path: '/account', name: 'Cuenta' },
   profile: { path: '/account/profile', name: 'Mi Perfil' },
   orders: { path: '/account/orders', name: 'Mis Pedidos'},
}

export const Breadcrubs = () => {
   const { products, categories } = useSelector( state => state.shop )
   const { isLoading } = useSelector( state => state.app )
   const { pathname } = useLocation()

   const findPath = useCallback((namepath, pathIndex) => {
      if (!namepath) return

      const path = pathNames[namepath]
      if (!!path) return (
         <NavLink key={pathIndex} to={path?.path}>{path?.name}</NavLink>
      )

      const categoryPath = categories.find(category => category.name === toCapitalize(namepath))
      if (categoryPath) return (
         <NavLink key={pathIndex} to={`/categories/${namepath}`}>{categoryPath?.name}</NavLink>
      )

      const productPath = products.find(product => product.id === namepath)
      if (productPath) return (
         <NavLink key={pathIndex} to={`/products/${namepath}`}>{productPath?.name}</NavLink>
      )
   })

   if ( pathname === '/' || pathname === '/login' ) return 

   return (
      <div className="Breadcrumbs">
         <NavLink to={ '/' }>Inicio</NavLink>
         {!isLoading && pathname.slice(1).split('/').map((pathname, index) => findPath(pathname, index))}
      </div>
   )
}