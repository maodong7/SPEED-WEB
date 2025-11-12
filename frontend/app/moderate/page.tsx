'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

// 文献类型定义
type Submission = {
  _id: string;
  title: string;
  doi: string;
  author: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
};

export default function ModeratePage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({
    submissionId: '',
    status: 'approved' as 'approved' | 'rejected',
    reviewComment: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // 权限校验：未登录/非审核员跳登录页
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!localStorage.getItem('token') || user.role !== 'moderator') {
      router.push('/auth/login');
    }
  }, [router]);

  // 获取待审核文献
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/submissions/pending', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubmissions(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error('获取待审核文献失败', err);
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  // 打开审核弹窗
  const openModal = (submission: Submission) => {
    setReviewForm({
      submissionId: submission._id,
      status: 'approved',
      reviewComment: ''
    });
    setIsModalOpen(true);
  };

  // 提交审核
  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3001/api/submissions/${reviewForm.submissionId}/review`,
        reviewForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsModalOpen(false);
      router.refresh(); // 刷新页面更新列表
    } catch (err) {
      console.error('审核失败', err);
      alert('审核提交失败，请重试');
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: '5rem' }}>加载中...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>审核员工作台</h1>
        
        {/* 待审核文献表格 */}
        <div style={{ overflowX: 'auto', border: '1px solid #ddd', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>文献标题</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>DOI</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>作者</th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #ddd' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                    暂无待审核文献
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub._id}>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>{sub.title}</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>{sub.doi}</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>{sub.author}</td>
                    <td style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                      <button
                        onClick={() => openModal(sub)}
                        style={{ padding: '0.5rem 1rem', backgroundColor: '#0071e3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        审核
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 审核弹窗（原生CSS实现，无额外依赖） */}
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '500px' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>审核文献</h2>
              <form onSubmit={handleReview}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>审核结果</label>
                  <select
                    value={reviewForm.status}
                    onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value as 'approved' | 'rejected' })}
                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                    required
                  >
                    <option value="approved">通过</option>
                    <option value="rejected">驳回</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>审核意见</label>
                  <textarea
                    value={reviewForm.reviewComment}
                    onChange={(e) => setReviewForm({ ...reviewForm, reviewComment: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', minHeight: '100px' }}
                    required
                  ></textarea>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    style={{ flex: 1, padding: '0.8rem', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 1, padding: '0.8rem', backgroundColor: '#34c759', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    提交审核
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}