'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import axios from '@/utils/axios';

// 文献类型定义（与后端一致）
type Submission = {
  _id: string;
  title: string;
  doi: string;
  author: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

// 审核表单类型
type ReviewForm = {
  submissionId: string;
  status: 'approved' | 'rejected';
  reviewComment: string;
};

export default function ModeratePage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    submissionId: '',
    status: 'approved',
    reviewComment: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const router = useRouter();

  // 权限校验：未登录/非审核员跳登录页
  useEffect(() => {
    const checkAuth = () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!localStorage.getItem('token')) {
        router.push('/auth/login');
      } else if (user.role !== 'moderator') {
        router.push('/'); // 非审核员跳首页
      }
    };

    checkAuth();
  }, [router]);

  // 获取后端待审核文献列表
  useEffect(() => {
    const fetchPendingSubmissions = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/submissions/pending');
        setSubmissions(res.data);
      } catch (err: any) {
        console.error('获取待审核文献失败', err);
        alert(err || '获取待审核文献失败，请重试');
      } finally {
        setLoading(false);
      }
    };

    // 仅审核员加载数据
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'moderator') {
      fetchPendingSubmissions();
    }
  }, []);

  // 打开审核弹窗
  const openModal = (submission: Submission) => {
    setReviewForm({
      submissionId: submission._id,
      status: 'approved',
      reviewComment: ''
    });
    setIsModalOpen(true);
    setReviewSuccess('');
  };

  // 提交审核（调用后端审核接口）
  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.reviewComment.trim()) {
      alert('请输入审核意见');
      return;
    }

    setReviewLoading(true);
    try {
      await axios.post(`/api/submissions/${reviewForm.submissionId}/review`, reviewForm);
      setReviewSuccess('审核提交成功！');
      // 刷新待审核列表
      const res = await axios.get('/api/submissions/pending');
      setSubmissions(res.data);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    } catch (err: any) {
      console.error('审核失败', err);
      alert(err || '审核提交失败，请重试');
    } finally {
      setReviewLoading(false);
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
        
        {/* 审核成功提示 */}
        {reviewSuccess && <p style={{ color: 'green', marginBottom: '1rem' }}>{reviewSuccess}</p>}
        
        {/* 待审核文献表格 */}
        <div style={{ overflowX: 'auto', border: '1px solid #ddd', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>文献标题</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>DOI</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>作者</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>提交时间</th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #ddd' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                    暂无待审核文献
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub._id}>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>{sub.title}</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>{sub.doi}</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>{sub.author}</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                      {new Date(sub.createdAt).toLocaleString()}
                    </td>
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

        {/* 审核弹窗 */}
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
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>审核意见（必填）</label>
                  <textarea
                    value={reviewForm.reviewComment}
                    onChange={(e) => setReviewForm({ ...reviewForm, reviewComment: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', minHeight: '100px' }}
                    placeholder="请输入审核意见"
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
                    disabled={reviewLoading}
                  >
                    {reviewLoading ? '提交中...' : '提交审核'}
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