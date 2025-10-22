import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';

// App chính của dự án
export default function App() {
  return (
    <UserProvider>
      <CartProvider>
        {/* Thanh trạng thái (màu chữ trắng, nền tối) */}
        <StatusBar style="dark" />
        {/* Gọi hệ thống navigation */}
        <AppNavigator />
      </CartProvider>
    </UserProvider>
  );
}
