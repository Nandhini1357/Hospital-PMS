import api from './axiosConfig';

export const dispensingApi = {
  dispense: (data) => api.post('/api/dispensing', data),
  getAll: () => api.get('/api/dispensing'),
  getById: (id) => api.get(`/api/dispensing/${id}`),
  getByPrescriptionId: (prescriptionId) => api.get(`/api/dispensing/prescription/${prescriptionId}`),
};

export default dispensingApi;
