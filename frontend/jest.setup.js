// 导入 React 测试库的扩展（如 fireEvent、screen 全局可用）
import '@testing-library/jest-dom';

// 模拟 Next.js 的路由（避免测试时路由报错）
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// 模拟 localStorage（适配登录状态等本地存储逻辑）
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};