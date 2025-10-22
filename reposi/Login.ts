import api, { apiForm } from "../Service/api";


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
    console.log("🔍 Đang gọi API đăng nhập với:", { email, matKhau });
    
    // Thử gửi JSON body thay vì query parameters
    const loginData = {
      email: email.trim(),
      matKhau: matKhau
    };
    
    console.log("📤 Gửi dữ liệu:", loginData);
    const response = await api.post('/TaiKhoan/DangNhap', loginData);
    console.log("✅ Response từ API:", response.data);
    
    // Kiểm tra cấu trúc response
    if (response.data && (response.data as any).data) {
      return { 
        success: true, 
        message: (response.data as any).message || "Đăng nhập thành công", 
        data: (response.data as any).data 
      };
    } else {
      return { 
        success: true, 
        message: "Đăng nhập thành công", 
        data: response.data 
      };
    }
  } catch (error: any) {
    console.error("❌ Lỗi đăng nhập:", error.response?.data || error.message);
    console.error("❌ Error details:", error);
    console.error("❌ Status code:", error.response?.status);
    
    // Nếu vẫn lỗi 415, thử lại với form data
    if (error.response?.status === 415) {
      console.log("🔄 Thử lại với form data...");
      try {
        const formData = new URLSearchParams();
        formData.append('email', email.trim());
        formData.append('matKhau', matKhau);
        
        const response = await apiForm.post('/TaiKhoan/DangNhap', formData);
        console.log("✅ Response từ API (form data):", response.data);
        
        if (response.data && (response.data as any).data) {
          return { 
            success: true, 
            message: (response.data as any).message || "Đăng nhập thành công", 
            data: (response.data as any).data 
          };
        } else {
          return { 
            success: true, 
            message: "Đăng nhập thành công", 
            data: response.data 
          };
        }
      } catch (formError: any) {
        console.error("❌ Lỗi form data:", formError.response?.data || formError.message);
        
        // Nếu vẫn lỗi, thử query parameters
        console.log("🔄 Thử lại với query parameters...");
        try {
          const response = await api.post(`/TaiKhoan/DangNhap?Email=${encodeURIComponent(email.trim())}&MatKhau=${encodeURIComponent(matKhau)}`);
          console.log("✅ Response từ API (query params):", response.data);
          
          if (response.data && (response.data as any).data) {
            return { 
              success: true, 
              message: (response.data as any).message || "Đăng nhập thành công", 
              data: (response.data as any).data 
            };
          } else {
            return { 
              success: true, 
              message: "Đăng nhập thành công", 
              data: response.data 
            };
          }
        } catch (queryError: any) {
          console.error("❌ Lỗi query params:", queryError.response?.data || queryError.message);
          return {
            success: false,
            message: queryError.response?.data?.message || queryError.message || "Đăng nhập thất bại",
          };
        }
      }
    }
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Đăng nhập thất bại",
    };
  }
};