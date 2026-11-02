import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pulse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If expired token, clear and allow guest
      if (localStorage.getItem('pulse_token')) {
        localStorage.removeItem('pulse_token');
        localStorage.removeItem('pulse_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  demoLogin: (role) => api.post(`/auth/demo-login/${role}`),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const doctorsAPI = {
  getAll: (params) => api.get('/doctors', { params }),
  getSpecializations: () => api.get('/doctors/specializations'),
  getById: (id) => api.get(`/doctors/${id}`),
};

export const appointmentsAPI = {
  getAll: () => api.get('/appointments'),
  create: (data) => api.post('/appointments', data),
  updateStatus: (id, data) => api.put(`/appointments/${id}/status`, data),
};

export const recordsAPI = {
  getAll: () => api.get('/records'),
  upload: (formData) => api.post('/records/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/records/${id}`),
  getVitals: () => api.get('/records/vitals'),
  logVitals: (data) => api.post('/records/vitals', data),
};

export const mlAPI = {
  getSymptoms: () => api.get('/predict/symptoms'),
  predictDisease: (data) => api.post('/predict/disease', data),
  chat: (data) => api.post('/chat', data),
};

export default api;
