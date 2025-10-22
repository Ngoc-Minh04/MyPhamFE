import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../contexts/UserContext";

// 🧩 Import các màn hình
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ProductScreen from "../screens/ProductScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CartScreen from "../screens/CartScreen";
import OrderScreen from "../screens/OrderScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import OrderDetailScreen from "../screens/OrderDetailScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ⚙️ Tabs chính (Home - Product - Cart - Profile)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#d63384",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: { height: 60 },
        tabBarIcon: ({ color }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Product") iconName = "pricetags-outline";
          else if (route.name === "Cart") iconName = "cart-outline";
          else if (route.name === "Profile") iconName = "person-outline";
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Trang chủ" }}
      />
      <Tab.Screen
        name="Product"
        component={ProductScreen}
        options={{ title: "Sản phẩm" }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: "Giỏ hàng" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Cá nhân" }}
      />
    </Tab.Navigator>
  );
}

// 🧭 Stack chính (Login → Register → MainTabs → các màn phụ)
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Orders"
          component={OrderScreen}
          options={{ title: "Đơn hàng" }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ title: "Thanh toán" }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ title: "Chi tiết sản phẩm" }}
        />
        <Stack.Screen
          name="OrderDetail"
          component={OrderDetailScreen}
          options={{ title: "Chi tiết đơn hàng" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
