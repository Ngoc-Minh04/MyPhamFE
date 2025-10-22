import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { loginUser } from "../reposi/Login";
import { useUser } from "../contexts/UserContext";
import { testConnection } from "../utils/testConnection";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: { screen?: string; params?: any };
};

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    testConnection();
  }, []);

  const handleLogin = async () => {
    if (!email || !matKhau) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ!");
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser(email.trim(), matKhau);
      if (result.success) {
        setUser(result.data);
        Alert.alert("Thành công", result.message);
        navigation.navigate("MainTabs", { screen: "Home" });
      } else {
        Alert.alert("Lỗi", result.message || "Đăng nhập thất bại!");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể kết nối tới server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>💋 MyBeauty</Text>
          <Text style={styles.subtitle}>Chào mừng bạn quay lại với thế giới sắc đẹp!</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập email của bạn"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
              placeholderTextColor="#bbb"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu"
              value={matKhau}
              onChangeText={setMatKhau}
              secureTextEntry
              editable={!loading}
              placeholderTextColor="#bbb"
            />
          </View>

          {/* 🔥 Nút gradient hồng chuyển tím */}
          <TouchableOpacity
            disabled={loading}
            onPress={handleLogin}
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
                <Text style={styles.buttonText}>Đăng nhập</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffe6f0" }, // nền hồng nhạt
  scrollView: { flexGrow: 1, justifyContent: "center", padding: 20 },
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
    fontSize: 32,
    fontWeight: "800",
    color: "#d63384",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#d63384",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#f7a1c4",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#333",
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
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  registerText: { color: "#555", fontSize: 14 },
  registerLink: { color: "#d63384", fontWeight: "700", fontSize: 14 },
});

export default LoginScreen;
