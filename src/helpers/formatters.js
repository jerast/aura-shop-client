export const dateFormatter = ( value ) => 
   new Date( value ).toLocaleString();
   // toCapitalize(new Intl.DateTimeFormat('es-ES', { dateStyle: 'full', timeStyle: 'short' }).format(new Date()))

export const formatDateForInput = (value) => {
   if (!value) return '';
   const date = new Date(value);
   if (isNaN(date.getTime())) return '';
   return date.toISOString().split('T')[0];
};

export const currencyFormatter = ( value ) => 
   new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      maximumFractionDigits: 0, 
      minimumFractionDigits: 0,
   }).format( value );