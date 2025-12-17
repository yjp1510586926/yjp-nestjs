import React from 'react';
import { createRoot } from 'react-dom/client';
import { HomePage } from './HomePage';
import './styles.css';

// 客户端渲染
const container = document.getElementById('root');
// biome-ignore lint/suspicious/noExplicitAny: window.__INITIAL_DATA__ is injected by SSR
const initialData = (window as unknown as { __INITIAL_DATA__: any })
	.__INITIAL_DATA__;

if (container) {
	const root = createRoot(container);
	root.render(<HomePage />);
}
