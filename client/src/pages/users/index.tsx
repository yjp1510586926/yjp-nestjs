import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { UsersPage } from './UsersPage';
import './styles.css';

// 客户端水合
const container = document.getElementById('root');

if (container) {
	hydrateRoot(container, <UsersPage />);
}
