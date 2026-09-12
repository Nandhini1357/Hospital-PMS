import api from './axiosConfig';

export const inventoryApi = {
  getSummary: () => api.get('/api/inventory'),
  getDashboard: () => api.get('/api/inventory/dashboard'),
  getLowStockAlerts: () => api.get('/api/inventory/alerts/low-stock'),
  getExpiryAlerts: (days = 60) => api.get('/api/inventory/alerts/expiry', { params: { days } }),
  getExpiredBatches: () => api.get('/api/inventory/alerts/expired'),
  deductStockFEFO: (drugId, quantity) => api.post('/api/inventory/deduct-fefo', { drugId, quantity }),
};

export default inventoryApi;
