import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }: any) {
  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy' },
      { text: 'Đăng xuất', onPress: () => navigation.replace('Login') },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>👤 Tài khoản của bạn</Text>

      <View style={styles.profileBox}>
        <Ionicons name="person-circle-outline" size={70} color="#d63384" />
        <Text style={styles.name}>Nguyễn Ngọc Minh</Text>
        <Text style={styles.email}>user@gmail.com</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Orders')}
        >
          <Ionicons name="cube-outline" size={22} color="#d63384" />
          <Text style={styles.menuText}>Đơn hàng của tôi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#d63384" />
          <Text style={styles.menuText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d63384',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  profileBox: { alignItems: 'center', marginBottom: 20 },
  name: { fontSize: 18, fontWeight: '600', color: '#333' },
  email: { fontSize: 14, color: '#888' },
  menu: { marginTop: 20, paddingHorizontal: 25 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdf2f8',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  menuText: { marginLeft: 10, fontSize: 16, fontWeight: '500', color: '#333' },
});
