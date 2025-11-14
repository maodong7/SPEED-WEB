const nextJest = require('next/jest');

// 指向 Next.js 项目根目录（frontend 目录）
const createJestConfig = nextJest({
  dir: './',
});

// 自定义 Jest 配置
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // 测试前置配置（如下）
  testEnvironment: 'jest-environment-jsdom', // 适配 React DOM 测试
  moduleNameMapper: {
    // 处理模块别名（若项目用了 @ 别名，需配置）
    '^@/(.*)$': '<rootDir>/$1',
  },
};

// 导出配置（Next.js 专用）
module.exports = createJestConfig(customJestConfig);