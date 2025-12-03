import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const removeBackground = async (file: File): Promise<Blob> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_URL}/api/remove-bg`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    responseType: 'blob',
    timeout: 30000,
  });

  return response.data;
};
