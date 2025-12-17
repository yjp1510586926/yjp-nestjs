import type React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../../config/api';

interface User {
	id: string;
	email: string;
	name: string | null;
	role: 'USER' | 'ADMIN';
	createdAt: string;
	updatedAt: string;
}

interface UserFormData {
	email: string;
	name: string;
	password: string;
}

export const UsersPage: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [formData, setFormData] = useState<UserFormData>({
		email: '',
		name: '',
		password: '',
	});
	const [alert, setAlert] = useState<{
		message: string;
		type: 'success' | 'error';
	} | null>(null);

	// 加载用户列表
	const loadUsers = async () => {
		try {
			const response = await fetch(getApiUrl('/api/users'));
			if (!response.ok) throw new Error('加载失败');
			const data = await response.json();
			setUsers(data);
		} catch (error) {
			showAlert(`加载用户列表失败: ${(error as Error).message}`, 'error');
		} finally {
			setLoading(false);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: loadUsers 包含多个状态依赖，且我们只希望在挂载时加载一次
	useEffect(() => {
		loadUsers();
	}, []);

	// 显示提示
	const showAlert = (message: string, type: 'success' | 'error') => {
		setAlert({ message, type });
		setTimeout(() => setAlert(null), 3000);
	};

	// 打开创建模态框
	const openCreateModal = () => {
		setEditingUser(null);
		setFormData({ email: '', name: '', password: '' });
		setShowModal(true);
	};

	// 打开编辑模态框
	const openEditModal = async (user: User) => {
		setEditingUser(user);
		setFormData({
			email: user.email,
			name: user.name || '',
			password: '',
		});
		setShowModal(true);
	};

	// 关闭模态框
	const closeModal = () => {
		setShowModal(false);
		setEditingUser(null);
		setFormData({ email: '', name: '', password: '' });
	};

	// 提交表单
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// biome-ignore lint/suspicious/noExplicitAny: 构建动态对象时临时使用 any
		const submitData: any = {
			email: formData.email,
			name: formData.name || undefined,
		};

		if (editingUser) {
			if (formData.password) {
				submitData.password = formData.password;
			}
		} else {
			submitData.password = formData.password;
		}

		try {
			const url = editingUser
				? getApiUrl(`/api/users/${editingUser.id}`)
				: getApiUrl('/api/users');
			const method = editingUser ? 'PATCH' : 'POST';

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(submitData),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || '操作失败');
			}

			showAlert(editingUser ? '用户更新成功！' : '用户创建成功！', 'success');
			closeModal();
			await loadUsers();
		} catch (error) {
			showAlert(`操作失败: ${(error as Error).message}`, 'error');
		}
	};

	// 删除用户
	const deleteUser = async (id: string) => {
		if (!confirm('确定要删除这个用户吗？此操作不可恢复！')) {
			return;
		}

		try {
			const response = await fetch(getApiUrl(`/api/users/${id}`), {
				method: 'DELETE',
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || '删除失败');
			}

			showAlert('用户删除成功！', 'success');
			await loadUsers();
		} catch (error) {
			showAlert(`删除失败: ${(error as Error).message}`, 'error');
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
						🎯 用户管理
					</h1>
					<p className="text-lg text-gray-600">完整的用户增删改查系统</p>
				</div>

				{/* Main Content */}
				<div className="p-8 shadow-2xl bg-white/95 backdrop-blur-sm rounded-3xl">
					{/* Alert */}
					{alert && (
						<div
							className={`mb-6 px-6 py-4 rounded-xl text-white font-medium animate-slide-in ${
								alert.type === 'success'
									? 'bg-gradient-to-r from-green-500 to-emerald-500'
									: 'bg-gradient-to-r from-red-500 to-pink-500'
							}`}
						>
							{alert.message}
						</div>
					)}

					{/* Toolbar */}
					<div className="flex flex-col items-center justify-between gap-4 mb-8 sm:flex-row">
						<h2 className="text-2xl font-bold text-gray-800">用户列表</h2>
						<button
							type="button"
							onClick={openCreateModal}
							className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl"
						>
							➕ 添加用户
						</button>
					</div>

					{/* Table Container */}
					<div className="overflow-x-auto shadow-lg rounded-xl">
						{loading ? (
							<div className="py-16 text-center">
								<div className="inline-block w-12 h-12 border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
								<p className="mt-4 text-xl font-medium text-purple-600">
									加载中...
								</p>
							</div>
						) : users.length === 0 ? (
							<div className="px-4 py-20 text-center">
								<svg
									className="w-24 h-24 mx-auto mb-6 text-gray-400 opacity-50"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									aria-label="用户图标"
								>
									<title>用户图标</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
								<h3 className="mb-2 text-2xl font-semibold text-gray-600">
									暂无用户
								</h3>
								<p className="mb-6 text-gray-500">
									点击上方"添加用户"按钮创建第一个用户
								</p>
							</div>
						) : (
							<table className="w-full">
								<thead className="text-white bg-gradient-to-r from-purple-600 to-indigo-600">
									<tr>
										<th className="px-6 py-4 text-sm font-semibold tracking-wider text-left uppercase">
											邮箱
										</th>
										<th className="px-6 py-4 text-sm font-semibold tracking-wider text-left uppercase">
											姓名
										</th>
										<th className="px-6 py-4 text-sm font-semibold tracking-wider text-left uppercase">
											角色
										</th>
										<th className="px-6 py-4 text-sm font-semibold tracking-wider text-left uppercase">
											创建时间
										</th>
										<th className="px-6 py-4 text-sm font-semibold tracking-wider text-left uppercase">
											操作
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-100">
									{users.map((user) => (
										<tr
											key={user.id}
											className="transition-colors duration-150 hover:bg-purple-50"
										>
											<td className="px-6 py-4 text-gray-900">{user.email}</td>
											<td className="px-6 py-4 text-gray-900">
												{user.name || '-'}
											</td>
											<td className="px-6 py-4">
												<span
													className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
														user.role === 'ADMIN'
															? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
															: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
													}`}
												>
													{user.role === 'ADMIN' ? '管理员' : '普通用户'}
												</span>
											</td>
											<td className="px-6 py-4 text-gray-600">
												{new Date(user.createdAt).toLocaleString('zh-CN')}
											</td>
											<td className="px-6 py-4">
												<div className="flex gap-2">
													<button
														type="button"
														onClick={() => openEditModal(user)}
														className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow hover:shadow-lg"
													>
														✏️ 编辑
													</button>
													<button
														type="button"
														onClick={() => deleteUser(user.id)}
														className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-pink-600 transform hover:-translate-y-0.5 transition-all duration-200 shadow hover:shadow-lg"
													>
														🗑️ 删除
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>
				</div>
			</div>

			{/* Modal */}
			{showModal && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
					onClick={closeModal}
					onKeyDown={(e) => e.key === 'Escape' && closeModal()}
					role="dialog"
					aria-modal="true"
				>
					<div
						className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl animate-slide-up"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.key === 'Escape' && closeModal()}
						role="document"
					>
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text">
								{editingUser ? '编辑用户' : '添加用户'}
							</h2>
							<button
								type="button"
								onClick={closeModal}
								className="text-3xl leading-none text-gray-400 transition-all duration-200 hover:text-gray-600 hover:rotate-90"
								aria-label="关闭"
							>
								×
							</button>
						</div>

						<form onSubmit={handleSubmit} className="space-y-5">
							<div>
								<label
									htmlFor="email"
									className="block mb-2 text-sm font-semibold text-gray-700"
								>
									邮箱 *
								</label>
								<input
									type="email"
									id="email"
									required
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
									placeholder="user@example.com"
									className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 outline-none rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
								/>
							</div>

							<div>
								<label
									htmlFor="name"
									className="block mb-2 text-sm font-semibold text-gray-700"
								>
									姓名
								</label>
								<input
									type="text"
									id="name"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									placeholder="张三"
									className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 outline-none rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
								/>
							</div>

							<div>
								<label
									htmlFor="password"
									className="block mb-2 text-sm font-semibold text-gray-700"
								>
									密码 {editingUser ? '(留空则不修改)' : '* (至少6位)'}
								</label>
								<input
									type="password"
									id="password"
									required={!editingUser}
									minLength={6}
									value={formData.password}
									onChange={(e) =>
										setFormData({ ...formData, password: e.target.value })
									}
									placeholder="••••••"
									className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 outline-none rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
								/>
							</div>

							<div className="flex gap-3 pt-4">
								<button
									type="button"
									onClick={closeModal}
									className="flex-1 px-6 py-3 font-semibold text-gray-700 transition-colors duration-200 bg-gray-200 rounded-xl hover:bg-gray-300"
								>
									取消
								</button>
								<button
									type="submit"
									className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl"
								>
									保存
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};
