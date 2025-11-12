import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 1rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>欢迎使用学术文献管理系统</h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#666' }}>
          便捷提交学术文献，高效完成审核流程
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          <a 
            href="/submit"
            style={{ padding: '1rem 2rem', backgroundColor: '#0071e3', color: 'white', textDecoration: 'none', borderRadius: '4px' }}
          >
            提交文献
          </a>
          <a 
            href="/auth/login"
            style={{ padding: '1rem 2rem', backgroundColor: '#f5f5f5', color: '#333', textDecoration: 'none', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            登录管理
          </a>
        </div>
      </main>
    </div>
  );
}