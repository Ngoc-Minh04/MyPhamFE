import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import { createOrder } from '../reposi/Order';

// ✅ Kiểu dữ liệu giỏ hàng
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function CheckoutScreen({ route, navigation }: any) {
  // ✅ Nhận dữ liệu giỏ hàng truyền từ CartScreen
  const cartItems: CartItem[] = route?.params?.cartItems || [];

  const { user } = useUser();
  const { clearCartLocal } = useCart();

  // ✅ Tính tổng tiền
  const total = cartItems.reduce(
    (sum: number, i: CartItem) => sum + i.price * i.quantity,
    0
  );

  // ✅ Thông tin người nhận
  const [receiver, setReceiver] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK'>('COD');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!user) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập trước khi đặt hàng.');
      return;
    }
    if (cartItems.length === 0) {
      Alert.alert('Lỗi', 'Giỏ hàng trống.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        taiKhoanId: user.id,
        items: cartItems.map(i => ({ sanPhamId: Number(i.id), soLuong: i.quantity, donGia: i.price })),
      };
      const res = await createOrder(payload);
      if (res.success && res.data) {
        // clear cart locally after successful order
        clearCartLocal();
        Alert.alert('✅ Xác nhận đơn hàng!', `Mã đơn ${res.data.donHangId}\nTổng: ${total.toLocaleString()}đ`, [
          { text: 'Thanh toán', onPress: () => navigation.replace('OrderDetail', { donHangId: res.data?.donHangId }) },
        ]);
      } else {
        Alert.alert('Lỗi', res.message || 'Không thể tạo đơn hàng');
      }
    } catch (e: any) {
      Alert.alert('Lỗi', e.message || 'Không thể tạo đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.header}>🧾 Thông tin đặt hàng</Text>

        {/* --- Thông tin người nhận --- */}
        <View style={styles.box}>
          <Text style={styles.title}>👤 Người nhận</Text>
          <TextInput
            style={styles.input}
            placeholder="Họ và tên"
            value={receiver}
            onChangeText={setReceiver}
          />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            style={styles.input}
            placeholder="Địa chỉ giao hàng"
            multiline
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* --- Danh sách sản phẩm --- */}
        <View style={styles.box}>
          <Text style={styles.title}>🛍️ Sản phẩm</Text>
          {cartItems.map((item: CartItem) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={{ flex: 1 }}>{item.name}</Text>
              <Text>
                {item.quantity} x {item.price.toLocaleString()}đ
              </Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>{total.toLocaleString()}đ</Text>
          </View>
        </View>

        {/* --- Phương thức thanh toán --- */}
        <View style={styles.box}>
          <Text style={styles.title}>💳 Phương thức thanh toán</Text>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'COD' && styles.activeOption,
            ]}
            onPress={() => setPaymentMethod('COD')}
          >
            <Text
              style={[
                styles.paymentText,
                paymentMethod === 'COD' && styles.activeText,
              ]}
            >
              Thanh toán khi nhận hàng (COD)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'BANK' && styles.activeOption,
            ]}
            onPress={() => setPaymentMethod('BANK')}
          >
            <Text
              style={[
                styles.paymentText,
                paymentMethod === 'BANK' && styles.activeText,
              ]}
            >
              Chuyển khoản ngân hàng
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- Nút xác nhận --- */}
        <TouchableOpacity style={styles.btnConfirm} onPress={handleConfirm} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}</Text>
        </TouchableOpacity>
      </ScrollView>
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
    marginBottom: 10,
  },
  box: {
    backgroundColor: '#fdf2f8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
  },
  title: { fontWeight: '600', fontSize: 16, marginBottom: 8, color: '#d63384' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    fontSize: 14,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 6,
  },
  totalText: { fontWeight: '600', color: '#333' },
  totalValue: { fontWeight: 'bold', color: '#d63384' },
  paymentOption: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  activeOption: {
    backgroundColor: '#d63384',
    borderColor: '#d63384',
  },
  paymentText: { color: '#333', textAlign: 'center', fontWeight: '500' },
  activeText: { color: '#fff' },
  btnConfirm: {
    backgroundColor: '#d63384',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 30,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
