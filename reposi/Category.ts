import api from "../Service/api";

export interface Category {
  id: number;
  tenDanhMuc: string;
}

// ✅ Thêm generic <Category[]>
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get<Category[]>("/DanhMuc"); // ✅
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tải danh mục:", error);
    return [];
  }
};
