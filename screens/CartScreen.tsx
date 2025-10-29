import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../Service/api";
import { getCartByUser, CartItem } from "../reposi/Card";
import { useUser } from "../contexts/UserContext";
import { useCart } from "../contexts/CartContext";

export default function CartScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const { user, isLoggedIn } = useUser();
  const { cartItems, refreshCart } = useCart();

  // 🔹 Tải giỏ hàng khi đăng nhập hoặc reload
  useEffect(() => {
    if (isLoggedIn && user) {
      loadCart();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, user]);

  const loadCart = async () => {
    if (!user) return;
    setLoading(true);
    await refreshCart(user.id);
    setLoading(false);
  };

  // 🗑️ Xóa sản phẩm khỏi giỏ hàng
  const handleRemoveFromCart = async (sanPhamId: number) => {
    if (!user) return;

    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
          const res = await api.delete("/SanPham/XoaSanPhamKhoiGioHang", {
  params: { taiKhoanId: user.id, sanPhamId },
});


            // ✅ Fix lỗi res.data unknown bằng cách ép kiểu rõ ràng
            const data = res.data as { message?: string };
            Alert.alert("🗑️", data.message || "Đã xóa sản phẩm!");
            await refreshCart(user.id); // 🔄 Cập nhật lại giỏ hàng
          } catch (error: any) {
            console.error("❌ Lỗi xóa sản phẩm:", error);
            Alert.alert(
              "Lỗi",
              error.response?.data?.message ||
                "Không thể xóa sản phẩm khỏi giỏ hàng!"
            );
          }
        },
      },
    ]);
  };

  // 🎨 Render từng sản phẩm trong giỏ
  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.item}>
      <Image
        source={{
          uri:
            item.hinhAnh ||
            "https://cdn-icons-png.flaticon.com/512/679/679720.png",
        }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.tenSanPham}</Text>
        <Text style={styles.price}>{item.gia.toLocaleString()}đ</Text>
        <Text style={styles.qty}>Số lượng: {item.soLuong}</Text>

        {/* 🗑️ Nút xóa sản phẩm */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleRemoveFromCart(item.id)} // ✅ đổi sanPhamId -> id
        >
          <Text style={styles.deleteText}>🗑️ Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const total = cartItems.reduce((sum, i) => sum + i.gia * i.soLuong, 0);

  const goCheckout = () => {
    navigation.navigate("Checkout", {
      cartItems: cartItems.map((i) => ({
        id: i.id,
        name: i.tenSanPham,
        price: i.gia,
        quantity: i.soLuong,
      })),
    });
  };

  // 🕓 Loading
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#d63384" />
      </View>
    );
  }

  // 🧑‍💻 Chưa đăng nhập
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>🛒 Giỏ hàng của bạn</Text>
        <Text style={styles.empty}>Vui lòng đăng nhập để xem giỏ hàng.</Text>
      </SafeAreaView>
    );
  }

  // ✅ Hiển thị giỏ hàng
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🛒 Giỏ hàng của bạn</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.empty}>Giỏ hàng trống.</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
          />

          <View style={styles.totalBar}>
            <Text style={styles.totalText}>
              Tổng: {total.toLocaleString()}đ
            </Text>
            <TouchableOpacity style={styles.checkoutBtn} onPress={goCheckout}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                Thanh toán
              </Text>
            </TouchableOpacity>
          </View>
        </>
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
  deleteButton: {
    backgroundColor: "#ffe3ea",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  deleteText: { color: "#d63384", fontWeight: "bold" },
  empty: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 20,
  },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  totalBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  totalText: { fontSize: 16, fontWeight: "700", color: "#333" },
  checkoutBtn: {
    backgroundColor: "#d63384",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});
