import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HomePage } from './HomePage';
import './styles.css';

// 客户端水合
const container = document.getElementById('root');
const initialData = (window as any).__INITIAL_DATA__;

if (container && initialData) {
  hydrateRoot(container, <HomePage initialData={initialData} />);
}
