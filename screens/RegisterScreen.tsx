
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { registerUser } from "../reposi/Register";


export default function RegisterScreen({ navigation }: any) {
  const [hoTen, setHoTen] = useState("");
  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState("");
 

  const handleRegister = async () => {
    if (!hoTen || !email || !matKhau || !xacNhanMatKhau) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (matKhau !== xacNhanMatKhau) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
      return;
    }

   
    const result = await registerUser({ hoTen, email, matKhau, xacNhanMatKhau });
   

    if (result.success) {
      Alert.alert("✅ Thành công", result.message || "Đăng ký thành công!");
      navigation.navigate("Login");
    } else {
      Alert.alert("❌ Lỗi", result.message || "Đăng ký thất bại, vui lòng thử lại!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký tài khoản</Text>

      <TextInput style={styles.input} placeholder="Họ tên" value={hoTen} onChangeText={setHoTen} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={matKhau}
        onChangeText={setMatKhau}
      />
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu"
        secureTextEntry
        value={xacNhanMatKhau}
        onChangeText={setXacNhanMatKhau}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} >
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
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
  },
});
