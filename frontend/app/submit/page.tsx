'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    title: '',
    doi: '',
    author: '',
    email: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // 登录校验：未登录跳登录页
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/auth/login');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/api/submissions', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('文献提交成功，等待审核');
      setFormData({ title: '', doi: '', author: '', email: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || '提交失败，请重试');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '1.5rem' }}>提交学术文献</h1>
        {success && <p style={{ color: 'green', textAlign: 'center', marginBottom: '1rem' }}>{success}</p>}
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }} htmlFor="title">文献标题</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }} htmlFor="doi">DOI</label>
            <input
              type="text"
              id="doi"
              name="doi"
              value={formData.doi}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }} htmlFor="author">作者</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }} htmlFor="email">联系邮箱</label>
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
          <button
            type="submit"
            style={{ width: '100%', padding: '0.8rem', backgroundColor: '#0071e3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            提交
          </button>
        </form>
      </div>
    </div>
  );
}