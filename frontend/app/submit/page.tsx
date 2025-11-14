'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import axios from '@/utils/axios';

// 表单数据类型
type FormData = {
  title: string;
  doi: string;
  author: string;
  email: string;
};

export default function SubmitPage() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    doi: '',
    author: '',
    email: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();

  // 未登录跳登录页
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/auth/login');
    } else {
      // 初始化用户邮箱（从本地存储获取）
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.email) {
        setFormData(prev => ({ ...prev, email: user.email }));
      }
    }
  }, [router]);

  // 表单校验（所有字段非空+邮箱格式正确）
  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every(val => val.trim() !== '');
    const isEmailValid = /^[\w-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(formData.email);
    setIsFormValid(allFieldsFilled && isEmailValid);
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
      // 调用后端真实提交文献接口
      await axios.post('/api/submissions', formData);
      setSuccess('文献提交成功，等待审核员审核');
      // 清空表单
      setFormData({ title: '', doi: '', author: '', email: formData.email });
    } catch (err: any) {
      setError(err || '提交失败，请重试');
    } finally {
      setLoading(false);
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
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              placeholder="请输入文献标题"
              required
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
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              placeholder="格式示例：10.1038/nature12345"
              required
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
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              placeholder="请输入作者姓名"
              required
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
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              placeholder="请输入联系邮箱"
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
            {loading ? '提交中...' : '提交'}
          </button>
        </form>
      </div>
    </div>
  );
}