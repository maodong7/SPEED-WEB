import axios from 'axios';

// 简单封装，避免复杂拦截器
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // 后端接口地址（固定）
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

export default api;