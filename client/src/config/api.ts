// API 配置
// 在 Lambda 环境中，API 需要加上 stage 前缀（如 /dev）
// 在本地开发环境中，不需要前缀
export const API_BASE_URL =
	typeof window !== 'undefined' &&
	window.location.hostname.includes('amazonaws.com')
		? '/dev'
		: '';

export const getApiUrl = (path: string) => `${API_BASE_URL}${path}`;
