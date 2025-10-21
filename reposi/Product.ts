import api from "../Service/api";

export interface Product {
  id: number;
  tenSanPham: string;
  moTa: string;
  gia: number;
  hinhAnh: string;
  soLuong: number;
  danhMucId: number;
  tenDanhMuc: string;
}

// ✅ Thêm generic <Product[]> vào api.get<>
export const getProducts = async (danhMucId?: number): Promise<Product[]> => {
  try {
    const url = danhMucId
      ? `/SanPham?danhMucId=${danhMucId}`
      : `/SanPham`;

    const response = await api.get<Product[]>(url); // ✅ Đúng kiểu
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
    return [];
  }
};
