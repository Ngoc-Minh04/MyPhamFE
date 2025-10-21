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

// ✅ Kiểu dữ liệu giỏ hàng
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function CheckoutScreen({ route, navigation }: any) {
  // ✅ Nhận dữ liệu giỏ hàng truyền từ CartScreen
  const cartItems: CartItem[] =
    route?.params?.cartItems || [
      { id: '1', name: 'Son MAC Ruby Woo', price: 650000, quantity: 1 },
      { id: '2', name: 'Serum Estee Lauder', price: 2400000, quantity: 2 },
    ];

  // ✅ Tính tổng tiền
  const total = cartItems.reduce(
    (sum: number, i: CartItem) => sum + i.price * i.quantity,
    0
  );

  // ✅ Thông tin người nhận
  const [receiver, setReceiver] = useState('Nguyễn Mỹ Phẩm');
  const [phone, setPhone] = useState('0909123456');
  const [address, setAddress] = useState('123 Đường Hoa Hồng, Q.1, TP.HCM');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK'>('COD');

  // ✅ Lưu đơn hàng vào AsyncStorage (sẵn sàng kết nối API sau này)
  const handleConfirm = async () => {
    const newOrder = {
      id: Date.now().toString(),
      customerName: receiver,
      phoneNumber: phone,
      address,
      paymentMethod,
      totalPrice: total,
      createdAt: new Date().toISOString(),
      status: 'Đang xử lý',
      items: cartItems.map((item: CartItem) => ({
        productId: item.id,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    try {
      const existing = await AsyncStorage.getItem('orders');
      const orders = existing ? JSON.parse(existing) : [];
      orders.push(newOrder);
      await AsyncStorage.setItem('orders', JSON.stringify(orders));

      // 👉 Sau này chỉ cần thay bằng API call:
      // await fetch(`${API_URL}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newOrder) });

      Alert.alert(
        '✅ Đặt hàng thành công!',
        `Cảm ơn ${receiver}!\nTổng thanh toán: ${total.toLocaleString()}đ`,
        [
          {
            text: 'Xem đơn hàng',
            onPress: () => navigation.navigate('Orders'),
          },
        ]
      );
    } catch (error) {
      console.error('Lỗi khi lưu đơn hàng:', error);
      Alert.alert('Lỗi', 'Không thể lưu đơn hàng. Vui lòng thử lại.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.header}>🧾 Thông tin thanh toán</Text>

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
        <TouchableOpacity style={styles.btnConfirm} onPress={handleConfirm}>
          <Text style={styles.btnText}>Xác nhận đặt hàng</Text>
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
