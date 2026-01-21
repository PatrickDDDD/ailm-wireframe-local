import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Square, Circle, ChevronRight, Trash2, X, AlertTriangle } from 'lucide-react';
import { ProjectType, Project } from '../types';

export const Dashboard: React.FC = () => {
  const { projects, deleteProject } = useApp();
  const navigate = useNavigate();

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [confirmationText, setConfirmationText] = useState('');
  const CONFIRMATION_PHRASE = "我确定删除此项目";

  const handleProjectClick = (project: any) => {
      if (project.type === ProjectType.ML) {
          // Determine stage based on status
          let stage = 'UPLOAD';
          if (project.status === 'deployed') stage = 'RESULT';
          else if (project.status === 'active') stage = 'TRAINING';
          else stage = 'UPLOAD'; // 'draft'

          navigate('/automl', { 
            state: { 
              stage,
              projectName: project.name,
              projectId: project.id
            } 
          });
      } else {
          // Pass the specific Dify URL to the AI Studio page
          navigate('/ai-studio', { state: { projectUrl: project.externalUrl, projectName: project.name } });
      }
  };

  const handleDeleteClick = (e: React.MouseEvent, project: Project) => {
      e.stopPropagation(); // Prevent navigation
      setProjectToDelete(project);
      setConfirmationText('');
      setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
      if (projectToDelete && confirmationText === CONFIRMATION_PHRASE) {
          deleteProject(projectToDelete.id);
          setDeleteModalOpen(false);
          setProjectToDelete(null);
      }
  };

  const getStatusLabel = (status: string, type: ProjectType) => {
     if (type === ProjectType.ML) {
         if (status === 'deployed') return '建模进度: 100% (已完成)';
         if (status === 'active') return '建模进度: 45% (训练中)';
         if (status === 'draft') return '建模进度: 0% (草稿)';
     }
     // Default translation for others
     const map: Record<string, string> = {
         'active': '运行中',
         'deployed': '已部署',
         'training': '训练中',
         'draft': '草稿'
     };
     return `状态: ${map[status] || status}`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto relative">
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && projectToDelete && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white border-2 border-black p-6 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="w-6 h-6" />
                          <h2 className="text-xl font-black uppercase">确认删除项目?</h2>
                      </div>
                      <button onClick={() => setDeleteModalOpen(false)} className="hover:bg-gray-100 p-1">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <p className="font-mono text-sm mb-4">
                      您正在删除项目 <span className="font-bold">"{projectToDelete.name}"</span>。此操作<span className="font-bold underline">无法撤销</span>。
                  </p>

                  <div className="mb-6">
                      <label className="block text-xs font-bold mb-2 uppercase text-gray-500">
                          请输入 "<span className="text-black select-all">{CONFIRMATION_PHRASE}</span>" 以确认:
                      </label>
                      <input 
                          type="text" 
                          value={confirmationText}
                          onChange={(e) => setConfirmationText(e.target.value)}
                          className="w-full border-2 border-black p-2 font-bold focus:outline-none focus:bg-gray-50"
                          placeholder={CONFIRMATION_PHRASE}
                          autoFocus
                      />
                  </div>

                  <div className="flex justify-end gap-3">
                      <button 
                          onClick={() => setDeleteModalOpen(false)}
                          className="px-4 py-2 border-2 border-transparent hover:bg-gray-100 font-bold"
                      >
                          取消
                      </button>
                      <button 
                          onClick={confirmDelete}
                          disabled={confirmationText !== CONFIRMATION_PHRASE}
                          className="px-4 py-2 bg-red-600 text-white border-2 border-black font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700"
                      >
                          删除项目
                      </button>
                  </div>
              </div>
          </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b-2 border-black pb-6">
        <div>
          <h1 className="text-4xl font-black text-black uppercase tracking-tight">项目仪表盘</h1>
          <p className="text-gray-600 font-mono mt-2">概览与管理</p>
        </div>
        <Link
          to="/new-project"
          className="bg-black text-white px-6 py-3 border-2 border-black hover:bg-white hover:text-black font-bold flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none transition-all"
        >
          <Plus className="w-5 h-5" />
          新建项目
        </Link>
      </div>

      {/* Filters & Search - Wireframe Style */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
              <input 
                type="text" 
                placeholder="搜索项目..." 
                className="w-full bg-white border-2 border-black rounded-none pl-10 pr-4 py-2 text-black focus:outline-none focus:bg-gray-50 font-mono text-sm"
              />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black text-black hover:bg-gray-100 font-bold text-sm">
              <Filter className="w-4 h-4" />
              <span>筛选视图</span>
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => handleProjectClick(project)}
            className="group bg-white border-2 border-black p-6 hover:bg-gray-50 cursor-pointer relative shadow-[4px_4px_0px_0px_rgba(200,200,200,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <div className="flex justify-between items-start mb-6 border-b-2 border-black border-dashed pb-4">
              <div className="flex items-center gap-2">
                {project.type === ProjectType.LLM ? <Square className="w-5 h-5 fill-black" /> : <Circle className="w-5 h-5 fill-black" />}
                <span className="font-mono text-xs font-bold uppercase">{project.type === ProjectType.LLM ? 'Dify 智能体' : 'AutoML 任务'}</span>
              </div>
              <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => handleDeleteClick(e, project)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200 transition-all z-10"
                    title="删除项目"
                  >
                      <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-black mb-2">{project.name}</h3>
            <p className="text-sm text-gray-600 mb-6 font-mono leading-relaxed h-10 line-clamp-2">{project.description}</p>

            <div className="bg-gray-100 p-3 border border-black mb-6">
               <span className="block text-xs font-bold text-gray-500 mb-1">子项目 / 实验</span>
               <span className="font-bold text-sm">{project.subProjectName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className={`border border-black px-2 py-1 text-xs font-bold ${project.type === ProjectType.ML ? 'bg-black text-white' : 'bg-white text-black'}`}>
                  {getStatusLabel(project.status, project.type)}
              </span>
              <span className="text-xs font-mono text-gray-500">
                  {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        
        {/* Empty State / Add New Card */}
        <Link to="/new-project" className="flex flex-col items-center justify-center p-6 border-2 border-black border-dashed hover:bg-gray-50 transition-all min-h-[280px]">
            <div className="w-12 h-12 border-2 border-black flex items-center justify-center mb-4 bg-white">
                <Plus className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-lg font-bold text-black">新建项目</h3>
        </Link>
      </div>
    </div>
  );
};