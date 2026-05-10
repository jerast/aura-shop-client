import { useLoader } from '@/hooks';
import { AppRoutes } from '@/routes';
import { 
   Breadcrubs, 
   Footer, 
   Header, 
   NotifyBar, 
   ShoppingCart, 
   Sidebar 
} from '@/interface';

import './assets/styles/config.css';
import './assets/styles/main.css';
import './assets/styles/loading.css';

export const App = () => {
   const { pathname } = useLoader();
   const isAuthView = pathname === '/login' || pathname === '/signup'
   const isHome = pathname === '/'

   return (
      <>
         {!isAuthView &&
            <>
               {/* <NotifyBar /> */}
               <Header />
            </>
         }
         <main className={`Main ${isHome ? 'Main--home' : 'Main--content'}`}>
            <Breadcrubs />
            <AppRoutes />
         </main>
         {!isAuthView &&
            <>
               <Footer />
               <Sidebar />
               <ShoppingCart />
            </>
         }
      </>
   );
};