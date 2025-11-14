'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import axios from '@/utils/axios';

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();

  // 已登录状态下跳首页
  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/');
    }
  }, [router]);

  // 表单校验
  useEffect(() => {
    const isValid = formData.username.trim() !== '' && formData.password.trim() !== '';
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // 输入时清空错误提示
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError('');

    try {
      // 调用后端真实登录接口
      const res = await axios.post('/api/users/login', formData);
      // 存储真实Token和用户信息
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.push('/');
      window.location.reload();
    } catch (err: any) {
      setError(err || '登录失败，请检查账号密码是否正确');
    } finally {
      setLoading(false);
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
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              placeholder="请输入用户名"
              required
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
              backgroundColor: isFormValid ? '#0071e3' : '#ccc', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: isFormValid ? 'pointer' : 'not-allowed' 
            }}
            disabled={loading || !isFormValid}
          >
            {loading ? '登录中...' : '登录'}
          </button>
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            没有账号？<a href="/auth/register" style={{ color: '#0071e3', textDecoration: 'none' }}>立即注册</a>
          </p>
        </form>
      </div>
    </div>
  );
}