'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import axios from '@/utils/axios';

// 文献类型定义（与后端一致）
type Submission = {
  _id: string;
  title: string;
  doi: string;
  author: string;
  status: 'approved';
  reviewComment?: string;
  reviewTime?: string;
  createdAt: string;
};

export default function ExplorePage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [collectionStatus, setCollectionStatus] = useState<Record<string, boolean>>({}); // 收藏状态
  const [operationLoading, setOperationLoading] = useState<string>(''); // 操作加载状态

  // 加载已通过审核的文献+用户收藏状态
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 并行请求：已通过文献列表 + 用户收藏列表
        const [submissionsRes, collectionsRes] = await Promise.all([
          axios.get('/api/submissions/approved'), // 后端已通过文献接口
          axios.get('/api/users/collections') // 后端用户收藏列表接口
        ]);

        const approvedSubmissions = submissionsRes.data;
        const userCollections = collectionsRes.data.map((item: any) => item._id);

        // 初始化收藏状态
        const initialCollectionStatus: Record<string, boolean> = {};
        approvedSubmissions.forEach(sub => {
          initialCollectionStatus[sub._id] = userCollections.includes(sub._id);
        });

        setSubmissions(approvedSubmissions);
        setCollectionStatus(initialCollectionStatus);
      } catch (err: any) {
        console.error('加载数据失败', err);
        alert(err || '加载文献失败，请重试');
      } finally {
        setLoading(false);
      }
    };

    // 已登录才加载数据
    if (localStorage.getItem('token')) {
      fetchData();
    }
  }, []);

  // 收藏/取消收藏（调用后端接口）
  const toggleCollection = async (submissionId: string) => {
    const isCollected = collectionStatus[submissionId];
    setOperationLoading(submissionId);

    try {
      if (isCollected) {
        // 取消收藏
        await axios.post('/api/users/collection/remove', { submissionId });
        alert('取消收藏成功');
      } else {
        // 收藏
        await axios.post('/api/users/collection/add', { submissionId });
        alert('收藏成功');
      }

      // 更新收藏状态
      setCollectionStatus({
        ...collectionStatus,
        [submissionId]: !isCollected
      });
    } catch (err: any) {
      console.error('操作失败', err);
      alert(err || '操作失败，请重试');
    } finally {
      setOperationLoading('');
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
        <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>已通过文献浏览</h1>
        
        {submissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', border: '1px solid #ddd', borderRadius: '8px' }}>
            暂无已通过审核的文献
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {submissions.map((sub) => (
              <div key={sub._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', transition: 'box-shadow 0.3s' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {sub.title}
                </h3>
                <p style={{ color: '#666', marginBottom: '0.3rem', fontSize: '0.9rem' }}>DOI: {sub.doi}</p>
                <p style={{ color: '#666', marginBottom: '0.3rem', fontSize: '0.9rem' }}>作者: {sub.author}</p>
                <p style={{ color: '#666', marginBottom: '0.3rem', fontSize: '0.9rem' }}>提交时间: {new Date(sub.createdAt).toLocaleDateString()}</p>
                <p style={{ color: '#666', marginBottom: '0.3rem', fontSize: '0.9rem' }}>审核时间: {sub.reviewTime ? new Date(sub.reviewTime).toLocaleDateString() : '-'}</p>
                <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#888', lineHeight: '1.4' }}>
                  审核意见: {sub.reviewComment || '无'}
                </p>
                <button
                  onClick={() => toggleCollection(sub._id)}
                  disabled={operationLoading === sub._id}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    backgroundColor: collectionStatus[sub._id] ? '#ff3b30' : '#0071e3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: operationLoading === sub._id ? 'not-allowed' : 'pointer',
                    opacity: operationLoading === sub._id ? 0.7 : 1
                  }}
                >
                  {operationLoading === sub._id ? '操作中...' : (collectionStatus[sub._id] ? '取消收藏' : '收藏文献')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}