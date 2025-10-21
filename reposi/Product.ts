import api from "../Service/api";

export interface Product {
  id: number;
  tenSanPham: string;
  moTa?: string;
  gia: number;
  hinhAnh?: string;
  danhMucId: number;
  tenDanhMuc: string;
}

// ✅ Hàm lấy danh sách sản phẩm (lọc theo danh mục)
export const getProducts = async (danhMucId?: number): Promise<Product[]> => {
  try {
    const url = danhMucId ? `/api/SanPham?danhMucId=${danhMucId}` : "/api/SanPham";
    const response = await api.get<Product[]>(url);
    return response.data;
  } catch (error: any) {
    console.error("❌ Lỗi lấy sản phẩm:", error.response?.data || error.message);
    return [];
  }
};
