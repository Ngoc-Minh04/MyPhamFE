import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';

// App chính của dự án
export default function App() {
  return (
    <>
      {/* Thanh trạng thái (màu chữ trắng, nền tối) */}
      <StatusBar style="dark" />
      {/* Gọi hệ thống navigation */}
      <AppNavigator />
    </>
  );
}
