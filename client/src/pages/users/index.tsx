// 立即执行的调试代码 - 验证脚本是否被执行
console.log('🚀 users/index.tsx 文件开始执行！');
(window as any).__USERS_SCRIPT_LOADED__ = true;

import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { UsersPage } from './UsersPage';
import './styles.css';

// 客户端水合
const container = document.getElementById('root');

if (container) {
	console.log('🔍 开始 React hydration...');
	console.log('📦 Container HTML:', container.innerHTML.substring(0, 200));

	try {
		const root = hydrateRoot(container, <UsersPage />);
		console.log('✅ Hydration 成功!', root);
	} catch (error) {
		console.error('❌ Hydration 失败，降级到 createRoot:', error);
		// 清空容器并重新渲染
		container.innerHTML = '';
		const root = createRoot(container);
		root.render(<UsersPage />);
		console.log('✅ CreateRoot 渲染成功!', root);
	}
}
