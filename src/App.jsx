import { useLoader } from '@/hooks';
import { AppRoutes } from '@/routes';
import { 
   Breadcrubs, 
   Footer, 
   Navbar, 
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

   return (
      <>
         {
            !isAuthView &&
               <>
                  <NotifyBar />
                  <header className="Header">
                     <Navbar />
                  </header>
               </>
         }
         <main className={`Main${ (pathname !== '/') ? ' Main--content' : ''}`}>
            <Breadcrubs />
            <AppRoutes />
         </main>
         {
            !isAuthView &&
               <>
                  <Footer />
                  <Sidebar />
                  <ShoppingCart />
               </>
         }
      </>
   );
};