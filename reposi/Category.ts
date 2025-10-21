import api from "../Service/api";

export interface Category {
  id: number;
  tenDanhMuc: string;
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get<Category[]>("/api/DanhMuc");
    return response.data;
  } catch (error: any) {
    console.error("❌ Lỗi lấy danh mục:", error.response?.data || error.message);
    return [];
  }
};
