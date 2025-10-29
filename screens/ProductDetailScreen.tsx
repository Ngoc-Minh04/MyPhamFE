import React, { useState, useEffect } from "react";
import {View,Text,Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import api from "../Service/api";
import { addToCart } from "../reposi/Card";
import { useUser } from "../contexts/UserContext";
import { useCart } from "../contexts/CartContext";

interface SanPhamResponse {
  id: number;
  tenSanPham: string;
  gia: number;
  moTa?: string;
  hinhAnh?: string;
  soLuong: number;
  danhMucId?: number;
  tenDanhMuc?: string;
}

export default function ProductDetailScreen({ route }: any) {
  const { product } = route.params;
  const { user, isLoggedIn } = useUser();
  const { refreshCart } = useCart();

  const [productDetail, setProductDetail] = useState<SanPhamResponse | null>(null);
  const [quantity, setQuantity] = useState<string>("1");
  const [loading, setLoading] = useState(true);

  // ✅ Lấy chi tiết sản phẩm (có số lượng tồn kho)
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const res = await api.get(`/SanPham/${product.id}`);
        setProductDetail(res.data as SanPhamResponse);
      } catch (error: any) {
        console.error("❌ Lỗi khi lấy chi tiết sản phẩm:", error.message);
        Alert.alert("Lỗi", "Không thể tải thông tin sản phẩm!");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [product.id]);

  // ✅ Hàm chọn ảnh mặc định (giống HomeScreen)
  // const getProductImage = (productName: string, originalImage?: string) => {
  //   const imageMap: Record<string, string> = {
      
  //   };
  //   const lower = productName.toLowerCase();
  //   for (const [key, val] of Object.entries(imageMap)) {
  //     if (lower.includes(key)) return val;
  //   }
  //   return originalImage || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800";
  // };

  // ✅ Thêm vào giỏ hàng (kiểm tra tồn kho, cập nhật tồn sau khi backend trừ kho)
  const handleAddToCart = async () => {
    if (!isLoggedIn || !user) {
      Alert.alert("❌ Lỗi", "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    const soLuongDat = parseInt(quantity);
    if (isNaN(soLuongDat) || soLuongDat <= 0) {
      Alert.alert("⚠️ Lỗi", "Vui lòng nhập số lượng hợp lệ!");
      return;
    }

    if (productDetail && soLuongDat > productDetail.soLuong) {
      Alert.alert(
        "⚠️ Không đủ hàng",
        `Chỉ còn ${productDetail.soLuong} sản phẩm trong kho!`
      );
      return;
    }

    try {
      const request = {
        taiKhoanId: user.id,
        sanPhamId: product.id,
        soLuong: soLuongDat,
      };

      const result = await addToCart(request);

      if (result.success) {
        Alert.alert("🛒 Thành công", result.message || "Đã thêm vào giỏ hàng!");
        await refreshCart(user.id);

        // 🔄 Cập nhật lại số lượng còn lại (fetch mới từ backend)
        const res = await api.get(`/SanPham/${product.id}`);
        setProductDetail(res.data as SanPhamResponse);
      } else {
        Alert.alert("❌ Lỗi", result.message || "Không thể thêm vào giỏ hàng!");
      }
    } catch (error: any) {
      console.error("💥 Lỗi thêm giỏ hàng:", error.message);
      Alert.alert("Lỗi", "Không thể thêm sản phẩm: " + error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d63384" />
        <Text style={{ marginTop: 10, color: "#555" }}>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  if (!productDetail) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy sản phẩm!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
          <Image
          source={{
            uri:
              productDetail.hinhAnh   
          }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{productDetail.tenSanPham}</Text>
        <Text style={styles.price}>{productDetail.gia.toLocaleString()}đ</Text>

        {productDetail.moTa && (
          <Text style={styles.description}>{productDetail.moTa}</Text>
        )}

        {/* ✅ Hiển thị tồn kho */}
        <Text style={styles.stock}>
          Còn lại:{" "}
          <Text style={{ color: "#d63384", fontWeight: "bold" }}>
            {productDetail.soLuong}
          </Text>{" "}
          sản phẩm
        </Text>

        {/* ✅ Nhập tay số lượng */}
        <View style={styles.qtyInputRow}>
          <Text style={styles.qtyLabel}>Số lượng mua:</Text>
          <TextInput
            style={styles.qtyInput}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />
        </View>

        {/* ✅ Tổng tiền */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng tiền:</Text>
          <Text style={styles.totalPrice}>
            {(productDetail.gia * (parseInt(quantity) || 0)).toLocaleString()}đ
          </Text>
        </View>
      </View>

      {/* ✅ Nút thêm vào giỏ hàng giữ nguyên */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
        <Text style={styles.addButtonText}>🛍️ Thêm vào giỏ hàng</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
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
    marginBottom: 16,
  },
  stock: { fontSize: 15, color: "#333", marginBottom: 10 },
  qtyInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  qtyLabel: { fontSize: 16, fontWeight: "600", color: "#333", marginRight: 12 },
  qtyInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 80,
    textAlign: "center",
    fontSize: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: { fontSize: 16, fontWeight: "600", color: "#333" },
  totalPrice: { fontSize: 22, fontWeight: "bold", color: "#d63384" },
  addButton: {
    backgroundColor: "#d63384",
    margin: 16,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 16,
    shadowColor: "#d63384",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
