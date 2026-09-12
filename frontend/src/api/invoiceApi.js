import api from './axiosConfig';

export const invoiceApi = {
  getMyInvoices: () => api.get('/api/patient/invoices'),
  getById: (id) => api.get(`/api/patient/invoices/${id}`),
  pay: (id, paymentData) => api.post(`/api/patient/invoices/${id}/pay`, paymentData || {}),
};

export default invoiceApi;
