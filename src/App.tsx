import React from 'react';
import { AppShell } from './components/layout/AppShell';
import { ToastContainer } from './components/ui/Overlay';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AddressFormPage } from './pages/AddressFormPage';
import { HomePage } from './pages/HomePage';
import { LiveChatPage } from './pages/LiveChatPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AccountPage, AddressesPage, PaymentMethodsPage } from './pages/ProfileSubPages';

const AppRouter: React.FC = () => {
  const { pathname } = useStore();

  // Standalone routes
  if (pathname === '/notifications') return <NotificationsPage />;
  if (pathname === '/cart') return <CartPage />;
  if (pathname === '/livechat') return <LiveChatPage />;
  if (pathname === '/checkout') return <CheckoutPage />;
  if (pathname === '/order-success') return <OrderSuccessPage />;
  if (pathname === '/orders') return <OrdersPage />;
  if (pathname.startsWith('/orders/')) {
    const orderId = decodeURIComponent(pathname.slice('/orders/'.length));
    return <OrderDetailPage key={orderId} orderId={orderId} />;
  }
  if (pathname.startsWith('/product/')) {
    const productId = decodeURIComponent(pathname.slice('/product/'.length));
    return <ProductDetailPage key={productId} productId={productId} />;
  }
  if (pathname === '/profile/account') return <AccountPage />;
  if (pathname === '/profile/addresses') return <AddressesPage />;
  if (pathname === '/profile/addresses/new') return <AddressFormPage />;
  if (pathname === '/profile/payment-methods') return <PaymentMethodsPage />;

  // Primary AppShell routes (Home, Products, Profile)
  let screen: React.ReactNode;
  if (pathname === '/products') {
    screen = <ProductsPage />;
  } else if (pathname === '/profile') {
    screen = <ProfilePage />;
  } else {
    screen = <HomePage />;
  }

  return <AppShell>{screen}</AppShell>;
};

export default function App() {
  return (
    <StoreProvider>
      <ToastContainer />
      <AppRouter />
    </StoreProvider>
  );
}
