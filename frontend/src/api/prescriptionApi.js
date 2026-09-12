import api from './axiosConfig';

export const prescriptionApi = {
  getAll: (query, status) => {
    const params = {};
    if (query) params.query = query;
    if (status) params.status = status;
    return api.get('/api/prescriptions', { params });
  },
  getPending: () => api.get('/api/prescriptions/pending'),
  getById: (id) => api.get(`/api/prescriptions/${id}`),
  getByNumber: (number) => api.get(`/api/prescriptions/number/${number}`),
  getByPatientId: (patientId) => api.get(`/api/prescriptions/patient/${patientId}`),
  checkStock: (id) => api.get(`/api/prescriptions/${id}/stock-check`),
  create: (data) => api.post('/api/prescriptions', data),
  update: (id, data) => api.put(`/api/prescriptions/${id}`, data),
  verify: (id) => api.put(`/api/prescriptions/${id}/verify`),
  cancel: (id, reason) => api.put(`/api/prescriptions/${id}/cancel`, null, { params: { reason } }),
};

export default prescriptionApi;
