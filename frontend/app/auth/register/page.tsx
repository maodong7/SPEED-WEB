'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // 表单输入变更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 提交注册
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/users/register', {
        ...formData,
        role: 'user' // 默认注册普通用户
      });
      setSuccess('注册成功，即将跳转到登录页');
      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || '注册失败，请检查信息是否正确');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '1.5rem' }}>用户注册</h1>
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
        {success && <p style={{ color: 'green', textAlign: 'center', marginBottom: '1rem' }}>{success}</p>}
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
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }} htmlFor="email">邮箱</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }} htmlFor="password">密码（6-12位，含数字和小写字母）</label>
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
            style={{ width: '100%', padding: '0.8rem', backgroundColor: '#34c759', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            注册
          </button>
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            已有账号？<a href="/auth/login" style={{ color: '#0071e3', textDecoration: 'none' }}>立即登录</a>
          </p>
        </form>
      </div>
    </div>
  );
}