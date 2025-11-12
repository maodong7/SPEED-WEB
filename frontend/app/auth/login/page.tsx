'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  // 表单输入变更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 提交登录
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/users/login', formData);
      // 存储token和用户信息
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      router.push('/'); // 登录成功跳首页
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || '登录失败，请检查账号密码');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '1.5rem' }}>用户登录</h1>
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }} htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }} htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>
          <button
            type="submit"
            style={{ width: '100%', padding: '0.8rem', backgroundColor: '#0071e3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            登录
          </button>
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            没有账号？<a href="/auth/register" style={{ color: '#0071e3', textDecoration: 'none' }}>立即注册</a>
          </p>
        </form>
      </div>
    </div>
  );
}