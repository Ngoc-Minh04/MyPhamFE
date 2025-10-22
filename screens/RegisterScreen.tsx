import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { registerUser } from "../reposi/Register";

export default function RegisterScreen({ navigation }: any) {
  const [hoTen, setHoTen] = useState("");
  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!hoTen || !email || !matKhau || !xacNhanMatKhau) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (matKhau !== xacNhanMatKhau) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser({ hoTen, email, matKhau, xacNhanMatKhau });

      if (result.success) {
        Alert.alert("💖 Thành công", result.message || "Đăng ký thành công!");
        navigation.navigate("Login");
      } else {
        Alert.alert("❌ Lỗi", result.message || "Đăng ký thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      Alert.alert("⚠️ Lỗi", "Không thể kết nối đến máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>💋 Đăng ký tài khoản</Text>
          <Text style={styles.subtitle}>Tạo tài khoản để khám phá thế giới làm đẹp!</Text>

          <TextInput
            style={styles.input}
            placeholder="Họ và tên"
            value={hoTen}
            onChangeText={setHoTen}
            placeholderTextColor="#bbb"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#bbb"
          />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            secureTextEntry
            value={matKhau}
            onChangeText={setMatKhau}
            placeholderTextColor="#bbb"
          />
          <TextInput
            style={styles.input}
            placeholder="Xác nhận mật khẩu"
            secureTextEntry
            value={xacNhanMatKhau}
            onChangeText={setXacNhanMatKhau}
            placeholderTextColor="#bbb"
          />

          {/* Nút đăng ký gradient hồng */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#ff66b2", "#d63384"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Đăng ký</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffe6f0" }, // nền hồng pastel
  scrollContainer: { flexGrow: 1, justifyContent: "center", padding: 20 },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#ff80bf",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#d63384",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#f7a1c4",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  gradientButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#d63384",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  loginText: { color: "#555", fontSize: 14 },
  loginLink: { color: "#d63384", fontWeight: "700", fontSize: 14 },
});
