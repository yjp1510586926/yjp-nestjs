import type React from 'react';

export const HomePage: React.FC = () => {
	return (
		<div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-3xl font-bold text-center text-gray-900 mb-10">
					项目页面导航
				</h1>

				<div className="grid gap-6 sm:grid-cols-2">
					{/* 用户管理入口 */}
					<a
						href="/users/manage"
						className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition duration-150 ease-in-out"
					>
						<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
							👥 用户管理
						</h5>
						<p className="font-normal text-gray-700">
							进入用户管理系统，进行用户的增删改查操作。
						</p>
					</a>

					{/* 这里可以添加更多页面的入口 */}
					{/* 
          <a href="/other/page" ...>
             ...
          </a> 
          */}
				</div>

				<div className="mt-12 text-center text-sm text-gray-500">
					<p>当前环境: Dev</p>
					<p>更多页面开发中...</p>
				</div>
			</div>
		</div>
	);
};
