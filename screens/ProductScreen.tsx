import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getProducts, Product } from "../reposi/Product";
import { getCategories, Category } from "../reposi/Category";

export default function ProductScreen({ navigation }: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const loadProducts = async (danhMucId?: number) => {
    setLoading(true);
    const data = await getProducts(danhMucId);
    setProducts(data);
    setLoading(false);
  };

  const handleSelectCategory = (id: number | null) => {
    setSelectedCategory(id);
    loadProducts(id ?? undefined);
  };

  // 💄 Ảnh mặc định cho các sản phẩm (giống HomeScreen)
  const getProductImage = (productName: string, originalImage?: string) => {
    const imageMap: Record<string, string> = {
      // Kem dưỡng da
      "kem dưỡng": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400",
      "la mer": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400",
      
      // Son môi
      "son": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
      "dior": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
      "mac": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
      
      // Nước hoa
      "nước hoa": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
      "chanel": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
      "perfume": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
      
      // Serum
      "serum": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
      "vitamin": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
      
      // Kem chống nắng
      "chống nắng": "https://images.unsplash.com/photo-1556228852-80c035a65f7c?w=400",
      "sunscreen": "https://images.unsplash.com/photo-1556228852-80c035a65f7c?w=400",
      "anessa": "https://images.unsplash.com/photo-1556228852-80c035a65f7c?w=400",
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

    return "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400";
  };

  // Tìm kiếm
  const filteredProducts = products.filter((p) =>
    p.tenSanPham.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Sản phẩm</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          <Ionicons name="cart-outline" size={28} color="#d63384" />
        </TouchableOpacity>
      </View>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm..."
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Danh mục */}
      <View style={styles.categoryWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === null && styles.categoryActive,
            ]}
            onPress={() => handleSelectCategory(null)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === null && styles.categoryTextActive,
              ]}
            >
              Tất cả
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.8}
                style={[
                  styles.categoryButton,
                  active && styles.categoryActive,
                ]}
                onPress={() => handleSelectCategory(cat.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    active && styles.categoryTextActive,
                  ]}
                >
                  {cat.tenDanhMuc}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Danh sách sản phẩm */}
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#d63384" />
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.productList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => navigation.navigate("ProductDetail", { product: item })}
              >
                <Image
                  source={{
                    uri: getProductImage(item.tenSanPham, item.hinhAnh),
                  }}
                  style={styles.image}
                />
                <Text numberOfLines={2} style={styles.name}>
                  {item.tenSanPham}
                </Text>
                <Text style={styles.price}>{item.gia.toLocaleString()}đ</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#d63384" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: "#333" },
  categoryWrapper: { marginTop: 10 },
  categoryContainer: {
    paddingHorizontal: 12,
    alignItems: "center",
  },
  categoryButton: {
    borderWidth: 1.5,
    borderColor: "#d63384",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryActive: { backgroundColor: "#d63384", borderColor: "#d63384" },
  categoryText: { fontSize: 14, fontWeight: "600", color: "#d63384" },
  categoryTextActive: { color: "#fff" },
  productList: { alignItems: "center", paddingBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    margin: 8,
    alignItems: "center",
    width: "45%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 10,
    resizeMode: "cover",
    backgroundColor: "#f9f9f9",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
    color: "#333",
    minHeight: 40,
  },
  price: { fontSize: 14, fontWeight: "bold", color: "#d63384", marginTop: 5 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});