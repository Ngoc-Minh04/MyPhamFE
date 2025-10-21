import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCartByUser, CartItem } from "../reposi/Card";

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const taiKhoanId = 6; // 🔹 tạm thời fix ID tài khoản (thay bằng ID đăng nhập thật sau)

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    const res = await getCartByUser(taiKhoanId);
    setLoading(false);

    if (res.success) {
      setCartItems(res.data || []);
    } else {
      Alert.alert("❌ Lỗi", res.message);
    }
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.item}>
      <Image
        source={{
          uri: item.hinhAnh || "https://cdn-icons-png.flaticon.com/512/679/679720.png",
        }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.tenSanPham}</Text>
        <Text style={styles.price}>{item.gia.toLocaleString()}đ</Text>
        <Text style={styles.qty}>Số lượng: {item.soLuong}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#d63384" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🛒 Giỏ hàng của bạn</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.empty}>Giỏ hàng trống.</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 12 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#d63384",
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  image: { width: 80, height: 80, borderRadius: 10, marginRight: 12 },
  info: { flex: 1, justifyContent: "center" },
  name: { fontSize: 16, fontWeight: "600", color: "#333" },
  price: { fontSize: 15, fontWeight: "bold", color: "#d63384", marginTop: 4 },
  qty: { fontSize: 13, color: "#555", marginTop: 2 },
  empty: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 20,
  },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});
