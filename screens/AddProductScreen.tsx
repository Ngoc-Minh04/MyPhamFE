import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { addProduct } from "../reposi/ProductDetail";

export default function AddProductScreen() {
  const [tenSanPham, setTenSanPham] = useState("");
  const [gia, setGia] = useState("");
  const [moTa, setMoTa] = useState("");
  const [hinhAnh, setHinhAnh] = useState("");
  const [danhMucId, setDanhMucId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async () => {
    if (!tenSanPham || !gia || !danhMucId) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ Tên, Giá và Danh mục ID!");
      return;
    }

    const newProduct = {
      tenSanPham,
      gia: parseFloat(gia),
      moTa,
      hinhAnh,
      danhMucId: parseInt(danhMucId),
    };

    setLoading(true);
    const result = await addProduct(newProduct);
    setLoading(false);

    if (result.success) {
      Alert.alert("✅ Thành công", result.message);
      // Reset form
      setTenSanPham("");
      setGia("");
      setMoTa("");
      setHinhAnh("");
      setDanhMucId("");
    } else {
      Alert.alert("❌ Lỗi", result.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thêm sản phẩm mới</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên sản phẩm"
        value={tenSanPham}
        onChangeText={setTenSanPham}
      />

      <TextInput
        style={styles.input}
        placeholder="Giá"
        value={gia}
        onChangeText={setGia}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Mô tả (tuỳ chọn)"
        value={moTa}
        onChangeText={setMoTa}
      />

      <TextInput
        style={styles.input}
        placeholder="Link hình ảnh (tuỳ chọn)"
        value={hinhAnh}
        onChangeText={setHinhAnh}
      />

      <TextInput
        style={styles.input}
        placeholder="ID danh mục"
        value={danhMucId}
        onChangeText={setDanhMucId}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleAddProduct}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Thêm sản phẩm</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#ff6699",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
