// // import axios from "axios";

// // const api = axios.create({
// //   baseURL: "http://192.168.40.17:5248/api", //  đúng
// //   timeout: 15000,
// //   headers: {
// //     "Content-Type": "application/json",
// //   },
// // });
// import axios from "axios";

// const api = axios.create({
//     baseURL: "http://10.0.2.2:5248",
//     timeout: 15000,
//     headers: {
//         "Content-Type": "application/json"
//     }
// });
// // Tạo instance riêng cho form data nếu cần
// export const apiForm = axios.create({
//   baseURL: "http://192.168.40.17:5248/api",
//   timeout: 15000,
//   headers: {
//     "Content-Type": "application/x-www-form-urlencoded",
//   },
// });

// // Thêm interceptor để debug
// api.interceptors.request.use(
//   (config) => {
//     console.log("🌐 API Request:", config.method?.toUpperCase(), config.url);
//     console.log("🌐 Full URL:", config.baseURL + config.url);
//     return config;
//   },
//   (error) => {
//     console.error("❌ Request Error:", error);
//     return Promise.reject(error);
//   }
// );

// api.interceptors.response.use(
//   (response) => {
//     console.log("✅ API Response:", response.status, response.config.url);
//     return response;
//   },
//   (error) => {
//     console.error("❌ Response Error:", error.response?.status, error.response?.data);
//     console.error("❌ Error URL:", error.config?.url);
//     return Promise.reject(error);
//   }
// );

// // Interceptor cho apiForm
// apiForm.interceptors.request.use(
//   (config) => {
//     console.log("🌐 Form API Request:", config.method?.toUpperCase(), config.url);
//     return config;
//   },
//   (error) => {
//     console.error("❌ Form Request Error:", error);
//     return Promise.reject(error);
//   }
// );

// apiForm.interceptors.response.use(
//   (response) => {
//     console.log("✅ Form API Response:", response.status, response.config.url);
//     return response;
//   },
//   (error) => {
//     console.error("❌ Form Response Error:", error.response?.status, error.response?.data);
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "http://10.0.2.2:5248/api", // ✅ IP máy ảo Android -> API .NET đang chạy trên host
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Nếu bạn cần gửi form-data
export const apiForm = axios.create({
  baseURL: "http://10.0.2.2:5248/api", // ✅ dùng cùng IP
  timeout: 15000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

// 🌐 Interceptor debug
api.interceptors.request.use(
  (config) => {
    console.log("🌐 API Request:", config.method?.toUpperCase(), config.url);
    console.log("🌐 Full URL:", config.baseURL + config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("❌ Response Error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

apiForm.interceptors.request.use((config) => {
  console.log("🌐 Form API Request:", config.method?.toUpperCase(), config.url);
  return config;
});

apiForm.interceptors.response.use(
  (response) => {
    console.log("✅ Form API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("❌ Form Response Error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
