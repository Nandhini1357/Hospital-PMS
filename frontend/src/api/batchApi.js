import api from './axiosConfig';

export const batchApi = {
  getAll: () => api.get('/api/inventory-batches'),
  getByDrug: (drugId) => api.get(`/api/inventory-batches/drug/${drugId}`),
  getFefoByDrug: (drugId) => api.get(`/api/inventory-batches/drug/${drugId}/fefo`),
  getFefoForDrug: (drugId) => api.get(`/api/inventory-batches/drug/${drugId}/fefo`),
  getById: (id) => api.get(`/api/inventory-batches/${id}`),
  create: (data) => api.post('/api/inventory-batches', data),
  update: (id, data) => api.put(`/api/inventory-batches/${id}`, data),
  discard: (id) => api.patch(`/api/inventory-batches/${id}/discard`),
  delete: (id) => api.delete(`/api/inventory-batches/${id}`),
};

export default batchApi;
