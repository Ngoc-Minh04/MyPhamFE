import api from "../Service/api";

export interface PaymentHistoryItem {
  id: number;
  donHangId: number;
  phuongThuc: string;
  soTien: number;
  trangThai: string;
  ngayThanhToan: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export const getPaymentHistory = async (donHangId: number): Promise<ApiResponse<PaymentHistoryItem[]>> => {
  try {
    const res = await api.get(`/ThanhToan/LichSu/${donHangId}`);
    const data = (res.data as any)?.data ?? res.data;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message };
  }
};

export const performPayment = async (
  donHangId: number,
  phuongThuc: string,
  soTien?: number
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const body: any = { donHangId, phuongThuc };
    if (typeof soTien === "number") body.soTien = soTien;
    const res = await api.post(`/ThanhToan/ThucHien`, body);
    return { success: true, message: (res.data as any)?.message || "Thanh toán thành công" };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message };
  }
};
