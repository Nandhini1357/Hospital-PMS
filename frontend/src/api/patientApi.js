import api from './axiosConfig';

export const patientApi = {
  getAll: (query) => api.get('/api/patients', { params: query ? { query } : {} }),
  getById: (id) => api.get(`/api/patients/${id}`),
  getByNumber: (number) => api.get(`/api/patients/number/${number}`),
  create: (data) => api.post('/api/patients', data),
  update: (id, data) => api.put(`/api/patients/${id}`, data),
  delete: (id) => api.delete(`/api/patients/${id}`),
  getHistory: (id) => api.get(`/api/patients/${id}/history`),
};

export default patientApi;
