# MyBeautyApp - Ứng dụng mỹ phẩm

## Tính năng đã hoàn thành

### 🔐 Đăng nhập/Đăng ký
- **Đăng nhập**: Sử dụng email và mật khẩu
- **Đăng ký**: Tạo tài khoản mới với thông tin đầy đủ
- **Quản lý session**: Lưu trữ thông tin user đã đăng nhập

### 🛒 Giỏ hàng
- **Thêm sản phẩm**: Thêm sản phẩm vào giỏ hàng từ trang chi tiết
- **Xem giỏ hàng**: Hiển thị danh sách sản phẩm đã thêm
- **Quản lý state**: Tự động cập nhật giỏ hàng khi thêm sản phẩm mới

### 🏠 Giao diện chính
- **Tab Navigation**: 4 tab chính (Trang chủ, Sản phẩm, Giỏ hàng, Cá nhân)
- **Responsive**: Giao diện thân thiện trên mọi thiết bị
- **User Experience**: Trải nghiệm mượt mà và trực quan

## Cấu trúc dự án

```
MyBeautyApp/
├── contexts/           # Quản lý state toàn cục
│   ├── UserContext.tsx # Context cho thông tin user
│   └── CartContext.tsx # Context cho giỏ hàng
├── reposi/            # API services
│   ├── Login.ts       # API đăng nhập
│   ├── Register.ts    # API đăng ký
│   ├── Product.ts     # API sản phẩm
│   └── Card.ts        # API giỏ hàng
├── screens/           # Các màn hình
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── HomeScreen.tsx
│   ├── ProductScreen.tsx
│   ├── ProductDetailScreen.tsx
│   ├── CartScreen.tsx
│   └── ProfileScreen.tsx
├── navigation/        # Điều hướng
│   └── AppNavigator.tsx
└── Service/          # Cấu hình API
    └── api.ts
```

## API Endpoints

### Đăng nhập
- **POST** `/api/TaiKhoan/DangNhap?Email={email}&MatKhau={password}`

### Đăng ký
- **POST** `/api/TaiKhoan/DangKy`

### Sản phẩm
- **GET** `/api/SanPham` - Lấy tất cả sản phẩm
- **GET** `/api/SanPham?danhMucId={id}` - Lấy sản phẩm theo danh mục

### Giỏ hàng
- **POST** `/api/ChiTietGioHang/Them` - Thêm sản phẩm vào giỏ hàng
- **GET** `/api/ChiTietGioHang/LayTheoTaiKhoan/{userId}` - Lấy giỏ hàng theo user

## Cách sử dụng

### 1. Đăng nhập
1. Mở ứng dụng
2. Nhập email và mật khẩu
3. Nhấn "Đăng nhập"
4. Sau khi đăng nhập thành công, sẽ chuyển đến trang chủ

### 2. Thêm sản phẩm vào giỏ hàng
1. Điều hướng đến tab "Sản phẩm"
2. Chọn sản phẩm muốn xem chi tiết
3. Nhấn "Thêm vào giỏ hàng"
4. Sản phẩm sẽ được thêm vào giỏ hàng

### 3. Xem giỏ hàng
1. Điều hướng đến tab "Giỏ hàng"
2. Xem danh sách sản phẩm đã thêm
3. Số lượng và thông tin sản phẩm sẽ được hiển thị

### 4. Đăng xuất
1. Điều hướng đến tab "Cá nhân"
2. Nhấn "Đăng xuất"
3. Xác nhận đăng xuất
4. Quay về màn hình đăng nhập

## Lưu ý quan trọng

- **Phải đăng nhập** trước khi có thể thêm sản phẩm vào giỏ hàng
- **Giỏ hàng** chỉ hiển thị khi đã đăng nhập
- **Thông tin user** được lưu trữ trong context và tự động cập nhật
- **API base URL**: `http://192.168.40.17:5248/api`

## Công nghệ sử dụng

- **React Native** với Expo
- **TypeScript** cho type safety
- **React Navigation** cho điều hướng
- **Axios** cho API calls
- **Context API** cho state management
- **Expo Vector Icons** cho icons

## Cài đặt và chạy

```bash
# Cài đặt dependencies
npm install

# Chạy ứng dụng
npm start
```

## Tác giả

Dự án được phát triển bởi team MyBeautyApp với mục tiêu tạo ra một ứng dụng mỹ phẩm hoàn chỉnh và dễ sử dụng.
