import api from './axiosConfig';

export const drugApi = {
  getAll: () => api.get('/api/drugs'),
  getById: (id) => api.get(`/api/drugs/${id}`),
  search: (query, categoryId) => {
    const params = {};
    if (query) params.query = query;
    if (categoryId) params.categoryId = categoryId;
    return api.get('/api/drugs/search', { params });
  },
  create: (data) => api.post('/api/drugs', data),
  update: (id, data) => api.put(`/api/drugs/${id}`, data),
  delete: (id) => api.delete(`/api/drugs/${id}`),
};

export default drugApi;
