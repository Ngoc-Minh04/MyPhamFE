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
    const raw: any = res.data;
    const d: any = raw?.data ?? raw; // unwrap if backend returns { data: {...} }

    const normalized: OrderDetailResponse = {
      id: d.id ?? d.donHangId ?? 0,
      taiKhoanId: d.taiKhoanId ?? d.accountId ?? 0,
      ngayDat: d.ngayDat ?? d.ngayTao ?? d.createdAt ?? "",
      tongTien: d.tongTien ?? d.tongSoTien ?? d.total ?? 0,
      trangThai: d.trangThai ?? d.status ?? "",
      chiTietDonHangs: (d.chiTietDonHangs ?? d.chiTiet ?? d.items ?? []).map((it: any) => ({
        id: it.id ?? 0,
        sanPhamId: it.sanPhamId ?? it.productId ?? 0,
        soLuong: it.soLuong ?? it.quantity ?? 0,
        donGia: it.donGia ?? it.price ?? 0,
        tenSanPham: it.tenSanPham ?? it.productName,
        hinhAnh: it.hinhAnh ?? it.image,
      })),
    };

    return { success: true, data: normalized };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message };
  }
};

// -------- List orders by user --------
export interface OrderSummary {
  id: number;
  date?: string;
  total?: number;
  status?: string;
}

export const getOrdersByUser = async (taiKhoanId: number): Promise<ApiResponse<OrderSummary[]>> => {
  try {
    // 1) Ưu tiên endpoint mới: /DonHang/DanhSach/{taiKhoanId}
    try {
      const res = await api.get(`/DonHang/DanhSach/${taiKhoanId}`);
      const raw: any = res.data;
      const arr: any[] = Array.isArray(raw) ? raw : (raw?.data ?? raw?.danhSach ?? []);
      return { success: true, data: arr };
    } catch (eDanhSach: any) {
      // 2) Thử /DonHang/LayTheoTaiKhoan/{id}
      try {
        const res2 = await api.get(`/DonHang/LayTheoTaiKhoan/${taiKhoanId}`);
        const data2 = (res2.data as any)?.data ?? res2.data;
        return { success: true, data: data2 };
      } catch (eOld: any) {
        // 3) Fallback query: /DonHang?taiKhoanId=xxx
        const res3 = await api.get(`/DonHang`, { params: { taiKhoanId } });
        const data3 = (res3.data as any)?.data ?? res3.data;
        return { success: true, data: data3 };
      }
    }
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message };
  }
};
