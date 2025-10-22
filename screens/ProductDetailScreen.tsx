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

  // 💄 Ảnh mặc định cho các sản phẩm (giống HomeScreen)
  const getProductImage = (productName: string, originalImage?: string) => {
    const imageMap: Record<string, string> = {
      // Kem dưỡng da
      "kem dưỡng": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800",
      "la mer": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800",
      
      // Son môi
      "son": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800",
      "dior": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800",
      "mac": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800",
      
      // Nước hoa
      "nước hoa": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
      "chanel": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
      "perfume": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
      
      // Serum
      "serum": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
      "vitamin": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
      
      // Kem chống nắng
      "chống nắng": "https://images.unsplash.com/photo-1556228852-80c035a65f7c?w=800",
      "sunscreen": "https://images.unsplash.com/photo-1556228852-80c035a65f7c?w=800",
      "anessa": "https://images.unsplash.com/photo-1556228852-80c035a65f7c?w=800",
    };

    const lowerName = productName.toLowerCase();
    for (const [keyword, imageUrl] of Object.entries(imageMap)) {
      if (lowerName.includes(keyword)) {
        return imageUrl;
      }
    }

    if (originalImage) {
      return originalImage;
    }

    return "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800";
  };

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
          uri: getProductImage(product.tenSanPham, product.hinhAnh),
        }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.tenSanPham}</Text>
        <Text style={styles.price}>{product.gia.toLocaleString()}đ</Text>
        {product.moTa && <Text style={styles.description}>{product.moTa}</Text>}
        
        {/* Quantity Selector */}
        <View style={styles.qtyRow}>
          <Text style={styles.qtyLabel}>Số lượng:</Text>
          <TouchableOpacity 
            style={styles.qtyBtn} 
            onPress={() => setQuantity(q => Math.max(1, q - 1))}
          >
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <TouchableOpacity 
            style={styles.qtyBtn} 
            onPress={() => setQuantity(q => q + 1)}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Total Price */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng tiền:</Text>
          <Text style={styles.totalPrice}>
            {(product.gia * quantity).toLocaleString()}đ
          </Text>
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
    height: 350,
    resizeMode: "cover",
    backgroundColor: "#f9f9f9",
  },
  infoContainer: { padding: 16 },
  name: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#333",
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    color: "#d63384",
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: { 
    fontSize: 15, 
    color: "#666", 
    lineHeight: 22, 
    marginBottom: 20,
  },
  qtyRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 12,
    marginBottom: 16,
  },
  qtyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 12,
  },
  qtyBtn: { 
    width: 36, 
    height: 36, 
    borderRadius: 8, 
    backgroundColor: '#f1f1f1', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  qtyBtnText: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#333',
  },
  qtyValue: { 
    marginHorizontal: 16, 
    fontSize: 18, 
    fontWeight: '700', 
    minWidth: 30, 
    textAlign: 'center',
    color: '#333',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d63384',
  },
  addButton: {
    backgroundColor: "#d63384",
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 16,
    shadowColor: '#d63384',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold",
  },
});