import api from "../Service/api";

export interface OrderItemRequest {
  sanPhamId: number;
  soLuong: number;
  donGia?: number;
}

export interface CreateOrderRequest {
  taiKhoanId: number;
  items: OrderItemRequest[];
}

export interface OrderDetailItem {
  id: number;
  sanPhamId: number;
  soLuong: number;
  donGia: number;
  tenSanPham?: string;
  hinhAnh?: string;
}

export interface OrderDetailResponse {
  id: number;
  taiKhoanId: number;
  ngayDat: string;
  tongTien: number;
  trangThai: string;
  chiTietDonHangs: OrderDetailItem[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export const createOrder = async (
  payload: CreateOrderRequest
): Promise<ApiResponse<{ donHangId: number; message?: string }>> => {
  try {
    // Try 1: body with "chiTiet"
    const body1 = {
      taiKhoanId: payload.taiKhoanId,
      chiTiet: payload.items.map(i => ({ sanPhamId: i.sanPhamId, soLuong: i.soLuong, donGia: i.donGia })),
    } as any;
    try {
      const res1 = await api.post("/DonHang/TaoDonHang", body1);
      const data1 = (res1.data as any) || {};
      return {
        success: true,
        message: data1.message || "Tạo đơn hàng thành công",
        data: { donHangId: data1.donHangId ?? data1.id ?? data1.data?.id ?? 0, message: data1.message },
      };
    } catch (e1: any) {
      // Try 2: body with "chiTietDonHangs" to mirror C# entity name
      if (e1.response?.status && e1.response.status !== 200 && e1.response.status !== 201) {
        const body2 = {
          taiKhoanId: payload.taiKhoanId,
          chiTietDonHangs: payload.items.map(i => ({ sanPhamId: i.sanPhamId, soLuong: i.soLuong, donGia: i.donGia })),
        } as any;
        const res2 = await api.post("/DonHang/TaoDonHang", body2);
        const data2 = (res2.data as any) || {};
        return {
          success: true,
          message: data2.message || "Tạo đơn hàng thành công",
          data: { donHangId: data2.donHangId ?? data2.id ?? data2.data?.id ?? 0, message: data2.message },
        };
      }
      throw e1;
    }
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message };
  }
};

export const getOrderDetail = async (donHangId: number): Promise<ApiResponse<OrderDetailResponse>> => {
  try {
    const res = await api.get(`/DonHang/ChiTiet/${donHangId}`);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message };
  }
};
