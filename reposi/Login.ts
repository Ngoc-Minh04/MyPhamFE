import api from "../Service/api";


export interface LoginRequest {
  email: string;
  matKhau: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export const loginUser = async (email: string, matKhau: string): Promise<ApiResponse> => {
  try {
    const response = await api.post(`/api/TaiKhoan/DangNhap?Email=${encodeURIComponent(email)}&MatKhau=${encodeURIComponent(matKhau)}`);
    return { success: true, message: "đăng nhập thành công", data: response.data };
  } catch (error: any) {
    console.error("❌ Lỗi đăng nhập:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Đăng nhập thất bại",
    };
  }
};