import api from "../Service/api";

// 🧩 Kiểu dữ liệu khi thêm sản phẩm vào giỏ hàng
export interface AddToCartRequest {
  taiKhoanId: number;
  sanPhamId: number;
  soLuong: number;
}

// 🧩 Kiểu phản hồi API chung
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// ✅ Kiểu dữ liệu trả về từ API thêm giỏ hàng
interface AddToCartResponse {
  message: string;
  gioHangId: number;
}

// ✅ Thêm sản phẩm vào giỏ hàng
export const addToCart = async (
  request: AddToCartRequest
): Promise<ApiResponse<AddToCartResponse>> => {
  try {
    const response = await api.post<AddToCartResponse>(
      "/ChiTietGioHang/Them",
      request
    );

    return {
      success: true,
      message: response.data.message || "Đã thêm vào giỏ hàng!",
      data: response.data,
    };
  } catch (error: any) {
    console.error("❌ Lỗi thêm giỏ hàng:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Không thể thêm vào giỏ hàng!",
    };
  }
};

// 🛒 Kiểu dữ liệu sản phẩm trong giỏ hàng
export interface CartItem {
  id: number;
  tenSanPham: string;
  gia: number;
  hinhAnh: string;
  soLuong: number;
}

// ✅ Lấy danh sách giỏ hàng theo tài khoản
export const getCartByUser = async (
  taiKhoanId: number
): Promise<ApiResponse<CartItem[]>> => {
  try {
    const response = await api.get<{ message: string; data: CartItem[] }>(
      `/ChiTietGioHang/LayTheoTaiKhoan/${taiKhoanId}`
    );

    return {
      success: true,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("❌ Lỗi lấy giỏ hàng:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Không thể lấy giỏ hàng!",
      data: [],
    };
  }
};
