import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProjectType } from '../types';
import { ArrowLeft, Square, Circle, Check, Link as LinkIcon } from 'lucide-react';

export const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const { addProject } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subProjectName: '',
    type: ProjectType.ML
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For Dify projects, we might add a placeholder URL here in a real app
    const projectPayload = {
        ...formData,
        externalUrl: formData.type === ProjectType.LLM ? 'https://udify.app/chat/demo-placeholder' : undefined,
        // Set initial status to draft for ML so it goes to upload
        status: formData.type === ProjectType.ML ? 'draft' : 'active' 
    };

    addProject(projectPayload as any);
    
    // Routing logic based on selection
    if (formData.type === ProjectType.ML) {
      navigate('/automl', { state: { stage: 'UPLOAD' } });
    } else {
      navigate('/ai-studio', { state: { projectName: formData.name, projectUrl: projectPayload.externalUrl } });
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-black font-bold mb-8 hover:underline text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        返回仪表盘
      </button>

      <div className="bg-white border-2 border-black p-8">
        <h1 className="text-3xl font-black text-black mb-2">新建 AI 项目</h1>
        <p className="text-gray-600 mb-8 font-mono border-b-2 border-black pb-4">配置项目基础信息与类型</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-black bg-gray-100 p-2 border border-black inline-block">1. 项目详情</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-black mb-2">主项目名称</label>
                    <input
                        required
                        type="text"
                        className="w-full bg-white border-2 border-black px-4 py-3 text-black focus:outline-none focus:bg-gray-50 rounded-none"
                        placeholder="例如：集团合同管理库"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-black mb-2">子项目 / 实验名称</label>
                    <input
                        required
                        type="text"
                        className="w-full bg-white border-2 border-black px-4 py-3 text-black focus:outline-none focus:bg-gray-50 rounded-none"
                        placeholder="例如：Dify 知识库 V1"
                        value={formData.subProjectName}
                        onChange={(e) => setFormData({...formData, subProjectName: e.target.value})}
                    />
                </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">项目描述</label>
              <textarea
                required
                rows={3}
                className="w-full bg-white border-2 border-black px-4 py-3 text-black focus:outline-none focus:bg-gray-50 rounded-none"
                placeholder="描述项目的目标和范围..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-bold text-black bg-gray-100 p-2 border border-black inline-block">2. 选择平台 / 方法论</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* AutoML Selection */}
              <div 
                onClick={() => setFormData({...formData, type: ProjectType.ML})}
                className={`cursor-pointer relative p-6 border-2 transition-all ${
                  formData.type === ProjectType.ML 
                    ? 'border-black bg-black text-white' 
                    : 'border-black bg-white text-black hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                    <Circle className={`w-8 h-8 ${formData.type === ProjectType.ML ? 'text-white fill-white' : 'text-black'}`} />
                    {formData.type === ProjectType.ML && <Check className="w-6 h-6" />}
                </div>
                <h3 className="text-lg font-bold mb-2">机器学习 (AutoML)</h3>
                <p className={`text-sm font-mono ${formData.type === ProjectType.ML ? 'text-gray-300' : 'text-gray-600'}`}>
                    AiLM 原生 AutoML 引擎。处理结构化数据，回归与分类任务。
                </p>
                <div className={`mt-4 text-xs p-2 border ${formData.type === ProjectType.ML ? 'border-white text-white' : 'border-black text-black'}`}>
                    内置功能: 数据清洗, 特征工程, 模型训练
                </div>
              </div>

              {/* LLM Selection */}
              <div 
                onClick={() => setFormData({...formData, type: ProjectType.LLM})}
                className={`cursor-pointer relative p-6 border-2 transition-all ${
                  formData.type === ProjectType.LLM 
                    ? 'border-black bg-black text-white' 
                    : 'border-black bg-white text-black hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        <Square className={`w-8 h-8 ${formData.type === ProjectType.LLM ? 'text-white fill-white' : 'text-black'}`} />
                        {/* Indicate Dify */}
                        <span className={`text-xs font-bold px-1 border ${formData.type === ProjectType.LLM ? 'border-white text-white' : 'border-black text-black'}`}>DIFY</span>
                    </div>
                    {formData.type === ProjectType.LLM && <Check className="w-6 h-6" />}
                </div>
                <h3 className="text-lg font-bold mb-2">AI 工作室 (Dify)</h3>
                <p className={`text-sm font-mono ${formData.type === ProjectType.LLM ? 'text-gray-300' : 'text-gray-600'}`}>
                    连接 Dify 平台。构建知识库、智能助手与工作流 Agent。
                </p>
                 <div className={`mt-4 text-xs p-2 border ${formData.type === ProjectType.LLM ? 'border-white text-white' : 'border-black text-black'}`}>
                    集成: <LinkIcon className="w-3 h-3 inline mr-1" />跳转至 Dify WebApp
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t-2 border-black flex justify-end">
             <button
                type="submit"
                className="bg-white text-black border-2 border-black px-8 py-3 font-black hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
             >
                创建项目并连接
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};