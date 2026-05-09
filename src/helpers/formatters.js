export const dateFormatter = ( value ) => 
   new Date( value ).toLocaleString();
   // toCapitalize(new Intl.DateTimeFormat('es-ES', { dateStyle: 'full', timeStyle: 'short' }).format(new Date()))

export const currencyFormatter = ( value ) => 
   new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      maximumFractionDigits: 0, 
      minimumFractionDigits: 0,
   }).format( value );