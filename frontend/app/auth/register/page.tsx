'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import axios from '@/utils/axios';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();

  // 已登录状态下跳首页
  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/');
    }
  }, [router]);

  // 表单校验（用户名非空、密码≥6位、邮箱格式正确）
  useEffect(() => {
    const isUsernameValid = formData.username.trim() !== '';
    const isPasswordValid = formData.password.trim().length >= 6;
    const isEmailValid = /^[\w-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(formData.email);
    setIsFormValid(isUsernameValid && isPasswordValid && isEmailValid);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 调用后端真实注册接口
      await axios.post('/api/users/register', {
        ...formData,
        role: 'user' // 注册默认普通用户
      });
      setSuccess('注册成功，即将跳转到登录页');
      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);
    } catch (err: any) {
      setError(err || '注册失败，请检查信息是否已被占用');
    } finally {
      setLoading(false);
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
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              placeholder="请输入用户名"
              required
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
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              placeholder="请输入有效邮箱"
              required
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }} htmlFor="password">密码（不少于6位）</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              placeholder="请输入密码"
              required
            />
          </div>
          <button
            type="submit"
            style={{ 
              width: '100%', 
              padding: '0.8rem', 
              backgroundColor: isFormValid ? '#34c759' : '#ccc', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: isFormValid ? 'pointer' : 'not-allowed' 
            }}
            disabled={loading || !isFormValid}
          >
            {loading ? '注册中...' : '注册'}
          </button>
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            已有账号？<a href="/auth/login" style={{ color: '#0071e3', textDecoration: 'none' }}>立即登录</a>
          </p>
        </form>
      </div>
    </div>
  );
}