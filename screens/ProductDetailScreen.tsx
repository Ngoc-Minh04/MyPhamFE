import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { addToCart } from "../reposi/Card";
import { useUser } from "../contexts/UserContext";
import { useCart } from "../contexts/CartContext";

export default function ProductDetailScreen({ route }: any) {
  const { product } = route.params;
  const { user, isLoggedIn } = useUser();
  const { refreshCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = async () => {
    if (!isLoggedIn || !user) {
      Alert.alert("❌ Lỗi", "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    const request = {
      taiKhoanId: user.id,
      sanPhamId: product.id,
      soLuong: quantity,
    };

    const result = await addToCart(request);

    if (result.success) {
      Alert.alert("🛒 Thành công", result.message);
      // Refresh cart sau khi thêm thành công
      await refreshCart(user.id);
    } else {
      Alert.alert("❌ Lỗi", result.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri:
            product.hinhAnh ||
            "https://cdn-icons-png.flaticon.com/512/679/679720.png",
        }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.tenSanPham}</Text>
        <Text style={styles.price}>{product.gia.toLocaleString()}đ</Text>
        {product.moTa && <Text style={styles.description}>{product.moTa}</Text>}
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(q => Math.max(1, q - 1))}>
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(q => q + 1)}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
        <Text style={styles.addButtonText}>🛍️ Thêm vào giỏ hàng</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    backgroundColor: "#f9f9f9",
  },
  infoContainer: { padding: 16 },
  name: { fontSize: 20, fontWeight: "bold", color: "#333" },
  price: {
    fontSize: 18,
    color: "#d63384",
    fontWeight: "bold",
    marginVertical: 8,
  },
  description: { fontSize: 15, color: "#555", lineHeight: 22, marginTop: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  qtyBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#f1f1f1', justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 18, fontWeight: '700', color: '#333' },
  qtyValue: { marginHorizontal: 12, fontSize: 16, fontWeight: '700', minWidth: 24, textAlign: 'center' },
  addButton: {
    backgroundColor: "#d63384",
    margin: 16,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 14,
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
