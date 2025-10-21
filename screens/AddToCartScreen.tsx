// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { addToCart } from "";

// export default function AddToCartScreen() {
//   const [taiKhoanId, setTaiKhoanId] = useState("");
//   const [sanPhamId, setSanPhamId] = useState("");
//   const [soLuong, setSoLuong] = useState("1");
//   const [loading, setLoading] = useState(false);

//   const handleAddToCart = async () => {
//     if (!taiKhoanId || !sanPhamId) {
//       Alert.alert("Thông báo", "Vui lòng nhập ID tài khoản và sản phẩm!");
//       return;
//     }

//     setLoading(true);
//     const result = await addToCart({
//       taiKhoanId: parseInt(taiKhoanId),
//       sanPhamId: parseInt(sanPhamId),
//       soLuong: parseInt(soLuong),
//     });
//     setLoading(false);

//     if (result.success) {
//       Alert.alert("✅ Thành công", result.message);
//       setTaiKhoanId("");
//       setSanPhamId("");
//       setSoLuong("1");
//     } else {
//       Alert.alert("❌ Lỗi", result.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Thêm vào giỏ hàng</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="ID tài khoản"
//         keyboardType="numeric"
//         value={taiKhoanId}
//         onChangeText={setTaiKhoanId}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="ID sản phẩm"
//         keyboardType="numeric"
//         value={sanPhamId}
//         onChangeText={setSanPhamId}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Số lượng"
//         keyboardType="numeric"
//         value={soLuong}
//         onChangeText={setSoLuong}
//       />

//       <TouchableOpacity
//         style={styles.button}
//         onPress={handleAddToCart}
//         disabled={loading}
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Thêm vào giỏ</Text>
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: "center",
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 15,
//   },
//   button: {
//     backgroundColor: "#ff6699",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });
