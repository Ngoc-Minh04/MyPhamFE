import api from '../Service/api';

export const testConnection = async () => {
  try {
    console.log('🔍 Testing connection to server...');
    const response = await api.get('/SanPham');
    console.log('✅ Connection successful!', response.status);
    return true;
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message);
    if (error.code === 'NETWORK_ERROR') {
      console.error('🌐 Network error - check if server is running');
    }
    if (error.response?.status === 404) {
      console.error('🔍 Server is running but endpoint not found');
    }
    return false;
  }
};
