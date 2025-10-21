import api from "../Service/api";

// ✅ 1. Kiểu dữ liệu request gửi lên server
export interface ProductRequest {
  tenSanPham: string;
  gia: number;
  moTa?: string;
  hinhAnh?: string;
  danhMucId: number;
}

// ✅ 2. Kiểu dữ liệu trả về từ API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// ✅ 3. Hàm gọi API thêm sản phẩm
export const addProduct = async (
  product: ProductRequest
): Promise<ApiResponse> => {
  try {
    // 🧠 Gán kiểu cho dữ liệu trả về từ axios
    const response = await api.post<{ message: string; data: any }>(
      "/api/SanPham/Them",
      product
    );

    return {
      success: true,
      message: response.data.message || "Thêm sản phẩm thành công!",
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("❌ Lỗi thêm sản phẩm:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Không thể thêm sản phẩm",
    };
  }
};
