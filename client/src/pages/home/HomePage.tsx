import React from 'react';

interface HomePageProps {
  initialData: {
    message: string;
    description: string;
    features: string[];
  };
}

export function HomePage({ initialData }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 头部 */}
      <header className="bg-white shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">NestJS 多页应用</h1>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* 英雄区域 */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {initialData.message}
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              {initialData.description}
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl">
                立即开始
              </button>
              <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-200">
                了解更多
              </button>
            </div>
          </div>

          {/* 功能网格 */}
          <div className="grid md:grid-2 lg:grid-cols-2 gap-6 mb-16">
            {initialData.features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-soft hover:shadow-soft-lg transition-shadow duration-200 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature}
                    </h3>
                    <p className="text-gray-600">
                      采用现代化最佳实践和企业级架构构建，提供稳定可靠的解决方案。
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 技术栈 */}
          <div className="bg-white rounded-xl shadow-soft p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              核心技术
            </h3>
            <div className="flex flex-wrap justify-center gap-6">
              {['NestJS', 'React', 'TypeScript', 'TailwindCSS', 'Webpack'].map(
                (tech) => (
                  <div
                    key={tech}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg"
                  >
                    {tech}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 NestJS 多页应用。使用现代化 Web 技术精心打造 ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
