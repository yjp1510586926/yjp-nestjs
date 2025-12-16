// 立即执行的调试代码 - 验证脚本是否被执行
console.log('🚀 users/index.tsx 文件开始执行！');
(window as any).__USERS_SCRIPT_LOADED__ = true;

import React from 'react';
import { createRoot } from 'react-dom/client';
import { UsersPage } from './UsersPage';
import './styles.css';

// 客户端渲染（放弃 hydration，直接重新渲染）
const container = document.getElementById('root');

if (container) {
	console.log('🔍 开始 React 渲染...');
	// 清空 SSR 内容，重新渲染
	container.innerHTML = '';
	const root = createRoot(container);
	root.render(<UsersPage />);
	console.log('✅ React 渲染成功!');
}
