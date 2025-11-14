import axios from 'axios';

// 创建Axios实例
const service = axios.create({
  baseURL: 'http://localhost:3001', // 后端接口基础地址
  timeout: 5000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：添加Token
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：统一错误处理
service.interceptors.response.use(
  (response) => {
    // 后端返回格式：{ status: 200, message: '', data: {} }
    if (response.data.status !== 200) {
      return Promise.reject(new Error(response.data.message || '请求失败'));
    }
    return response.data;
  },
  (error) => {
    // 处理401未授权（Token过期/未登录）
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error.response?.data?.message || '网络异常，请重试');
  }
);

export default service;