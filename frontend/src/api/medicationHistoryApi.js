import api from './axiosConfig';

export const medicationHistoryApi = {
  getAll: () => api.get('/api/medication-history'),
  getByPatientId: (patientId) => api.get(`/api/medication-history/patient/${patientId}`),
};

export default medicationHistoryApi;
