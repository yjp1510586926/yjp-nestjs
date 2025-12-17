import type React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface GitHubUser {
	id: number;
	login: string;
	avatar_url: string;
	name: string;
	html_url: string;
	bio: string;
}

export const GitHubTokenPage: React.FC = () => {
	const [token, setToken] = useState('');
	const [users, setUsers] = useState<GitHubUser[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchUser = async () => {
		if (!token.trim()) {
			setError('请输入 GitHub Token');
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await fetch('https://api.github.com/user', {
				headers: {
					Authorization: `token ${token}`,
					Accept: 'application/vnd.github.v3+json',
				},
			});

			if (!response.ok) {
				if (response.status === 401) {
					throw new Error('Token 无效或已过期');
				}
				const errData = await response.json();
				throw new Error(errData.message || '获取用户信息失败');
			}

			const data = await response.json();

			setUsers((prev) => {
				// 避免重复添加
				if (prev.find((u) => u.id === data.id)) {
					setError('该用户已在列表中');
					return prev;
				}
				return [data, ...prev];
			});
			// setToken(''); // 保留 token 方便再次使用？还是清空？用户体验通常清空或者保留。这里清空吧。
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError('发生未知错误');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
			<div className="container px-4 py-8 mx-auto max-w-7xl">
				{/* Header */}
				<div className="p-8 mb-8 text-center shadow-2xl bg-white/95 backdrop-blur-sm rounded-3xl">
					<div className="flex items-center justify-between mb-4">
						<Link
							to="/"
							className="px-4 py-2 text-sm font-medium text-purple-600 transition-all duration-200 border-2 border-purple-600 rounded-lg hover:bg-purple-600 hover:text-white"
						>
							← 返回首页
						</Link>
						<div className="flex-1" />
					</div>
					<h1 className="mb-3 text-4xl font-bold text-transparent md:text-5xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text">
						🐱 GitHub 用户获取
					</h1>
					<p className="text-lg text-gray-600">输入 Token 获取个人信息并展示</p>
				</div>

				{/* Input Section */}
				<div className="max-w-2xl p-8 mx-auto mb-8 shadow-2xl bg-white/95 backdrop-blur-sm rounded-3xl">
					<div className="flex flex-col gap-4">
						<label
							htmlFor="token"
							className="text-lg font-semibold text-gray-700"
						>
							GitHub Personal Access Token
						</label>
						<div className="flex flex-col gap-4 sm:flex-row">
							<input
								id="token"
								type="password"
								value={token}
								onChange={(e) => setToken(e.target.value)}
								placeholder="ghp_..."
								className="flex-1 px-4 py-3 transition-all border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								onKeyDown={(e) => e.key === 'Enter' && fetchUser()}
							/>
							<button
								type="button"
								onClick={fetchUser}
								disabled={loading}
								className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg"
							>
								{loading ? '获取中...' : '获取信息'}
							</button>
						</div>
						{error && (
							<p className="px-4 py-2 text-red-500 border border-red-100 rounded-lg bg-red-50 animate-pulse">
								⚠️ {error}
							</p>
						)}
					</div>
				</div>

				{/* List Section */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{users.map((user) => (
						<div
							key={user.id}
							className="relative p-6 transition-all duration-300 transform shadow-xl group bg-white/95 backdrop-blur-sm rounded-2xl hover:shadow-2xl hover:-translate-y-1"
						>
							<div className="flex items-start gap-4">
								<img
									src={user.avatar_url}
									alt={user.login}
									className="w-20 h-20 transition-transform border-4 border-purple-100 rounded-full shadow-md group-hover:scale-105"
								/>
								<div className="flex-1 min-w-0">
									<h3 className="text-xl font-bold text-gray-800 truncate">
										{user.name || user.login}
									</h3>
									<p className="mb-1 text-sm text-purple-600">@{user.login}</p>
									<p className="text-sm text-gray-500 line-clamp-2">
										{user.bio || '这个人很懒，什么都没写~'}
									</p>
									<a
										href={user.html_url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
									>
										查看 GitHub 主页 →
									</a>
								</div>
							</div>
							{/* Delete button (optional, for UX) */}
							<button
								type="button"
								onClick={() => setUsers(users.filter((u) => u.id !== user.id))}
								className="absolute p-1 text-gray-400 transition-opacity opacity-0 top-2 right-2 hover:text-red-500 group-hover:opacity-100"
								aria-label="删除"
							>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>删除</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					))}
				</div>

				{users.length === 0 && !loading && (
					<div className="mt-12 text-lg text-center text-white/60">
						暂无数据，请在上方输入 Token 获取
					</div>
				)}
			</div>
		</div>
	);
};
