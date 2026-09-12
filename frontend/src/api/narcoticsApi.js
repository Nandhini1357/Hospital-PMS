import axiosInstance from './axiosConfig';

export const getNarcoticsRegister = async (params = {}) => {
  const response = await axiosInstance.get('/api/narcotics/register', { params });
  return response.data;
};

export const dispenseNarcotics = async (data) => {
  const response = await axiosInstance.post('/api/narcotics/dispense', data);
  return response.data;
};

export const getNarcoticsBalance = async (drugId, batchNo = '') => {
  const response = await axiosInstance.get('/api/narcotics/balance', {
    params: { drugId, batchNo }
  });
  return response.data;
};

export const getCDSCOReport = async (month = '') => {
  const response = await axiosInstance.get('/api/narcotics/report', {
    params: { month }
  });
  return response.data;
};

export const reconcileNarcoticsStock = async (data) => {
  const response = await axiosInstance.post('/api/narcotics/reconcile', data);
  return response.data;
};

export const recordNarcoticsReceipt = async (data) => {
  const response = await axiosInstance.post('/api/narcotics/receipt', data);
  return response.data;
};

export const recordNarcoticsDestruction = async (data) => {
  const response = await axiosInstance.post('/api/narcotics/destruction', data);
  return response.data;
};

export const approveEmergencyOverride = async (id, data) => {
  const response = await axiosInstance.post(`/api/narcotics/${id}/approve-override`, data);
  return response.data;
};
