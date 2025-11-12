'use client'; // 关键：标记为仅客户端组件
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState({ role: '' });
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // 仅在客户端执行localStorage操作
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    setUser(storedUser ? JSON.parse(storedUser) : { role: '' });
    setIsLogin(!!storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
              <Link href="/submit" style={{ color: 'white', textDecoration: 'none' }}>提交文献</Link>
              {user.role === 'moderator' && (
                <Link href="/moderate" style={{ color: 'white', textDecoration: 'none' }}>审核中心</Link>
              )}
              <button 
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', textDecoration: 'none' }}
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