import api from "../Service/api";


export interface RegisterRequest {
  hoTen: string;
  email: string;
  matKhau: string;
  xacNhanMatKhau: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}


export const registerUser = async (userData: RegisterRequest): Promise<ApiResponse> => {
  try {
    const response = await api.post("/api/TaiKhoan/DangKy", userData);
    return {
      success: true,
      message: "Đăng ký thành công",
      data: response.data,
    };
  } catch (error: any) {
    console.error(" Lỗi đăng ký:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Đăng ký thất bại",
    };
  }
};
