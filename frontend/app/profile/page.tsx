'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import axios from '@/utils/axios';

// 收藏文献类型
type CollectionItem = {
  _id: string;
  title: string;
  doi: string;
  author: string;
  createdAt: string;
};

// 用户信息类型
type UserProfile = {
  username: string;
  email: string;
  role: 'user' | 'moderator';
  createdAt: string;
};

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState<string>('');
  const router = useRouter();

  // 加载用户信息和收藏列表
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // 并行请求：用户信息 + 收藏列表
        const [profileRes, collectionsRes] = await Promise.all([
          axios.get('/api/users/profile'), // 后端用户信息接口
          axios.get('/api/users/collections') // 后端收藏列表接口
        ]);

        setUserInfo({
          username: profileRes.data.username,
          email: profileRes.data.email,
          role: profileRes.data.role,
          createdAt: profileRes.data.createdAt
        });

        setCollections(collectionsRes.data);
      } catch (err: any) {
        console.error('加载个人信息失败', err);
        alert(err || '加载个人信息失败，请重试');
      } finally {
        setLoading(false);
      }
    };

    // 未登录跳登录页
    if (!localStorage.getItem('token')) {
      router.push('/auth/login');
    } else {
      fetchProfileData();
    }
  }, [router]);

  // 取消收藏（调用后端接口）
  const removeCollection = async (submissionId: string) => {
    setOperationLoading(submissionId);
    try {
      await axios.post('/api/users/collection/remove', { submissionId });
      alert('取消收藏成功');
      // 刷新收藏列表
      const res = await axios.get('/api/users/collections');
      setCollections(res.data);
    } catch (err: any) {
      console.error('取消收藏失败', err);
      alert(err || '取消收藏失败，请重试');
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

  if (!userInfo) {
    return null;
  }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>个人中心</h1>

        {/* 用户信息卡片 */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem', backgroundColor: '#f9f9f9' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>基本信息</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1.2rem', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>用户名：</span>
            <span>{userInfo.username}</span>
            <span style={{ fontWeight: 'bold' }}>邮箱：</span>
            <span>{userInfo.email}</span>
            <span style={{ fontWeight: 'bold' }}>用户角色：</span>
            <span>{userInfo.role === 'moderator' ? '管理员（审核员）' : '普通用户'}</span>
            <span style={{ fontWeight: 'bold' }}>注册时间：</span>
            <span>{new Date(userInfo.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* 收藏列表 */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>我的收藏</h2>
          {collections.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
              暂无收藏的文献，快去浏览并收藏感兴趣的文献吧～
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
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
                  {collections.map((item) => (
                    <tr key={item._id} hover>
                      <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>{item.title}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>{item.doi}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>{item.author}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                        <button
                          onClick={() => removeCollection(item._id)}
                          disabled={operationLoading === item._id}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#ff3b30',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: operationLoading === item._id ? 'not-allowed' : 'pointer',
                            opacity: operationLoading === item._id ? 0.7 : 1
                          }}
                        >
                          {operationLoading === item._id ? '操作中...' : '取消收藏'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}