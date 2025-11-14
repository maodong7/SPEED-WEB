'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// 用户类型定义
type User = {
  username: string;
  role: 'user' | 'moderator';
  email: string;
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // 页面加载时初始化登录状态
  useEffect(() => {
    const initLoginStatus = () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setIsLogin(true);
      } else {
        setUser(null);
        setIsLogin(false);
        // 未登录状态下，拦截需要登录的页面
        const needLoginPaths = ['/submit', '/explore', '/profile', '/moderate'];
        if (needLoginPaths.includes(pathname)) {
          router.push('/auth/login');
        }
      }
    };

    initLoginStatus();
    // 监听本地存储变化（处理退出登录、登录状态变更）
    window.addEventListener('storage', initLoginStatus);
    return () => window.removeEventListener('storage', initLoginStatus);
  }, [router, pathname]);

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsLogin(false);
    router.push('/');
    window.location.reload();
  };

  return (
    <nav style={{ backgroundColor: '#333', color: 'white', padding: '1rem', marginBottom: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold' }}>
          学术文献管理系统
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {!isLogin ? (
            <>
              <Link href="/auth/login" style={{ color: 'white', textDecoration: 'none' }}>登录</Link>
              <Link href="/auth/register" style={{ color: 'white', textDecoration: 'none' }}>注册</Link>
            </>
          ) : (
            <>
              <Link href="/explore" style={{ color: 'white', textDecoration: 'none' }}>文献浏览</Link>
              <Link href="/submit" style={{ color: 'white', textDecoration: 'none' }}>提交文献</Link>
              {user?.role === 'moderator' && (
                <Link href="/moderate" style={{ color: 'white', textDecoration: 'none' }}>审核中心</Link>
              )}
              <Link href="/profile" style={{ color: 'white', textDecoration: 'none' }}>个人中心</Link>
              <span style={{ color: '#ccc' }}>欢迎，{user?.username}</span>
              <button 
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', textDecoration: 'underline' }}
              >
                退出登录
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}