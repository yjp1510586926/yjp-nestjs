import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/home/HomePage';
import { UsersPage } from './pages/users/UsersPage';
import './styles/global.css';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/users" element={<UsersPage />} />
				<Route path="/users/manage" element={<UsersPage />} />
				<Route path="/users/create" element={<UsersPage />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
}

// 客户端渲染
const container = document.getElementById('root');
if (container) {
	const root = createRoot(container);
	root.render(<App />);
	console.log('✅ React SPA 应用已启动');
}
