import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ExternalLink, Bot, AlertCircle, ArrowLeft } from 'lucide-react';

export const AIStudio: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Get URL from navigation state, or fallback to a demo Dify URL
  const projectUrl = location.state?.projectUrl || 'https://udify.app/chat/placeholder'; 
  const projectName = location.state?.projectName || '新建 Dify 会话';

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen pt-0 md:pt-0 bg-white">
      {/* Header */}
      <div className="h-16 border-b-2 border-black flex items-center px-6 justify-between bg-gray-50 shrink-0">
          <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/dashboard')}
                className="mr-2 p-1 border-2 border-transparent hover:border-black hover:bg-white transition-all"
                title="返回仪表盘"
              >
                  <ArrowLeft className="w-5 h-5 text-black" />
              </button>
              <div className="w-8 h-8 border-2 border-black flex items-center justify-center bg-white">
                  <Bot className="w-5 h-5 text-black" />
              </div>
              <div>
                  <h1 className="text-sm font-black uppercase">AI 工作室 (Dify 集成)</h1>
                  <p className="text-xs font-mono text-gray-600">Project: {projectName}</p>
              </div>
          </div>
          
          <a 
            href={projectUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black text-xs font-bold hover:bg-black hover:text-white transition-colors"
          >
              <ExternalLink className="w-3 h-3" />
              新窗口打开
          </a>
      </div>

      {/* Iframe Container */}
      <div className="flex-1 bg-gray-100 relative p-4">
        <div className="w-full h-full border-2 border-black bg-white relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {projectUrl.includes('placeholder') ? (
                // Fallback for demo when no real URL is provided
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mb-4 bg-gray-50">
                        <Bot className="w-8 h-8 text-black" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Dify 平台连接中</h2>
                    <p className="text-gray-600 font-mono mb-6 max-w-md">
                        这是一个 Dify 智能体集成演示。在实际生产环境中，此处将加载 configured Dify WebApp URL。
                    </p>
                    <div className="p-4 bg-gray-50 border border-black text-xs font-mono text-left">
                        <p className="font-bold mb-1">Target URL:</p>
                        <p className="text-gray-500 break-all">{projectUrl}</p>
                    </div>
                </div>
            ) : (
                <iframe 
                    src={projectUrl}
                    className="w-full h-full border-0"
                    title="Dify Chat Interface"
                    allow="microphone"
                />
            )}
            
            {/* Watermark / Label */}
            <div className="absolute bottom-2 right-2 bg-black text-white text-[10px] px-2 py-1 font-mono opacity-50 pointer-events-none">
                POWERED BY DIFY
            </div>
        </div>
      </div>
    </div>
  );
};