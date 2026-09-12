import api from './axiosConfig';

export const supplierApi = {
  getAll: () => api.get('/api/suppliers'),
  getById: (id) => api.get(`/api/suppliers/${id}`),
  create: (data) => api.post('/api/suppliers', data),
  update: (id, data) => api.put(`/api/suppliers/${id}`, data),
  toggleStatus: (id, active) => api.patch(`/api/suppliers/${id}/status?active=${active}`),
  delete: (id) => api.delete(`/api/suppliers/${id}`),
};

export const purchaseOrderApi = {
  getAll: (status) => api.get(status ? `/api/purchase-orders?status=${status}` : '/api/purchase-orders'),
  getAutoDraftSuggestions: () => api.get('/api/purchase-orders/auto-draft-suggestions'),
  getById: (id) => api.get(`/api/purchase-orders/${id}`),
  create: (data) => api.post('/api/purchase-orders', data),
  update: (id, data) => api.put(`/api/purchase-orders/${id}`, data),
  updateStatus: (id, status) => api.patch(`/api/purchase-orders/${id}/status?status=${status}`),
  delete: (id) => api.delete(`/api/purchase-orders/${id}`),
};

export const grnApi = {
  getAll: () => api.get('/api/inventory/grn'),
  getById: (id) => api.get(`/api/inventory/grn/${id}`),
  getByPO: (poId) => api.get(`/api/inventory/grn/po/${poId}`),
  create: (data) => api.post('/api/inventory/grn', data),
};

export const qualityInspectionApi = {
  getAll: () => api.get('/api/procurement/quality-inspection'),
  getByGrnId: (grnId) => api.get(`/api/procurement/quality-inspection/grn/${grnId}`),
  perform: (data) => api.post('/api/procurement/quality-inspection', data),
};

export default {
  supplierApi,
  purchaseOrderApi,
  grnApi,
  qualityInspectionApi,
};
