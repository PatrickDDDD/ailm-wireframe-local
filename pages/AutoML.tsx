import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Package, CheckCircle2, TrendingUp, ArrowRight, UploadCloud, 
  FileSpreadsheet, AlertTriangle, Eraser, Play, Loader2, Check, ArrowLeft, Sparkles, Trophy
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Types & Constants ---
type WorkflowStage = 'UPLOAD' | 'CLEANING' | 'SELECTION' | 'TRAINING' | 'RESULT';

const AVAILABLE_MODELS = [
  { id: 'xgboost', name: 'XGBoost', type: 'Ensemble', recommended: true },
  { id: 'lightgbm', name: 'LightGBM', type: 'Ensemble', recommended: true },
  { id: 'rf', name: 'Random Forest', type: 'Bagging', recommended: false },
  { id: 'linear', name: 'Linear Regression', type: 'Linear', recommended: false },
  { id: 'mlp', name: 'MLP Neural Net', type: 'Deep Learning', recommended: false },
];

interface ModelResult {
    id: string;
    name: string;
    type: string;
    accuracy: number;
    r2: number;
    status: string;
}

const PREDICTION_DATA = [
    { month: '1月', actual: 4000, predicted: 4100 },
    { month: '2月', actual: 3000, predicted: 2950 },
    { month: '3月', actual: 2000, predicted: 2100 },
    { month: '4月', actual: 2780, predicted: 2908 },
    { month: '5月', actual: 1890, predicted: 1800 },
    { month: '6月', actual: 2390, predicted: 2450 },
];

export const AutoML: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Project Info
  const projectName = location.state?.projectName || '未命名 AutoML 项目';
  const isUnfitProject = projectName.includes('未拟合');

  // Initial state based on navigation (default to UPLOAD for new projects)
  const [stage, setStage] = useState<WorkflowStage>(location.state?.stage || 'UPLOAD');
  
  // Workflow State
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isCleaning, setIsCleaning] = useState(false);
  const [dataCleaned, setDataCleaned] = useState(false);
  const [selectedModels, setSelectedModels] = useState<string[]>(['xgboost', 'lightgbm']);
  const [trainingProgress, setTrainingProgress] = useState(0);
  
  // Result View State
  const [results, setResults] = useState<ModelResult[]>([]);
  const [selectedResultModel, setSelectedResultModel] = useState<string>('');
  const [isPackaged, setIsPackaged] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');

  // --- Handlers ---

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    setError('');
    
    if (!uploadedFile) return;
    
    // Simulate parsing check
    if (uploadedFile.size === 0) {
        setError('文件内容为空，请上传有效数据。');
        return;
    }
    const ext = uploadedFile.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext || '')) {
        setError('仅支持 CSV 或 Excel 格式。');
        return;
    }

    setFile(uploadedFile);
  };

  const startCleaning = () => {
      setIsCleaning(true);
      // Simulate API call
      setTimeout(() => {
          setIsCleaning(false);
          setDataCleaned(true);
      }, 1500);
  };

  const toggleModel = (id: string) => {
      setSelectedModels(prev => 
        prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
      );
  };

  const startTraining = () => {
      setStage('TRAINING');
      setTrainingProgress(0);
  };

  // Simulate Training Progress
  useEffect(() => {
      if (stage === 'TRAINING') {
          const interval = setInterval(() => {
              setTrainingProgress(prev => {
                  if (prev >= 100) {
                      clearInterval(interval);
                      setTimeout(() => setStage('RESULT'), 500);
                      return 100;
                  }
                  return prev + 5; // increment
              });
          }, 200);
          return () => clearInterval(interval);
      }
  }, [stage]);

  // Generate Results and Analysis when entering RESULT stage
  useEffect(() => {
      if (stage === 'RESULT' && results.length === 0) {
          generateResults();
      }
  }, [stage]);

  const generateResults = () => {
      // 1. Determine which models to show.
      // If we came from a 'deployed' state (Dashboard click), assume some defaults if empty.
      // If we went through the flow, use `selectedModels`.
      let modelsToRun = selectedModels;
      if (modelsToRun.length === 0) {
          modelsToRun = ['xgboost', 'lightgbm', 'rf']; // Fallback for direct view
      }
      
      // 2. Generate Mock Data based on "Unfit" flag
      const generatedResults: ModelResult[] = modelsToRun.map(id => {
          const template = AVAILABLE_MODELS.find(m => m.id === id)!;
          
          let baseAcc, baseR2;
          if (isUnfitProject) {
              // Generate bad scores
              baseAcc = 40 + Math.random() * 20; // 40-60%
              baseR2 = 0.2 + Math.random() * 0.3; // 0.2-0.5
          } else {
              // Generate good scores
              baseAcc = 85 + Math.random() * 10; // 85-95%
              baseR2 = 0.8 + Math.random() * 0.15; // 0.8-0.95
          }

          return {
              id: id,
              name: template.name,
              type: template.type,
              accuracy: parseFloat(baseAcc.toFixed(1)),
              r2: parseFloat(baseR2.toFixed(2)),
              status: isUnfitProject ? '收敛(效果差)' : '已收敛'
          };
      });

      // Sort by accuracy descending
      generatedResults.sort((a, b) => b.accuracy - a.accuracy);
      setResults(generatedResults);
      if (generatedResults.length > 0) {
          setSelectedResultModel(generatedResults[0].id);
      }

      // 3. Generate Static Analysis Text (Hardcoded)
      if (isUnfitProject) {
          setAiAnalysis(`
**警报：模型拟合效果不佳**

根据评估结果，所有选中模型的准确率均低于 **60%** (最高仅 ${generatedResults[0].accuracy}%)，无法达到生产环境部署标准。

**问题诊断：**
1. **数据相关性低**：特征与目标变量之间缺乏强相关性，当前数据可能属于"噪音"数据。
2. **特征缺失**：可能缺少关键的业务特征（如季节性因子、宏观经济指标等）。
3. **样本量不足**：训练样本过少导致模型无法学习到有效规律。

**建议方案：**
- 重新审视数据源，尝试引入新的外部数据。
- 进行更深入的特征工程（Feature Engineering）。
- 检查是否存在大量异常值干扰训练。
          `);
      } else {
          const winner = generatedResults[0];
          setAiAnalysis(`
**模型表现优秀**

经过 AutoML 引擎评估，**${winner.name}** 模型表现最佳，测试集准确率达到 **${winner.accuracy}%**。

**分析摘要：**
- **${winner.name}** (${winner.type}) 在当前结构化数据集上表现出了极强的泛化能力。
- 相比于线性模型，该模型能更好地捕捉非线性关系。
- R2 Score 为 ${winner.r2}，表明模型解释了绝大部分的数据变异。

**下一步建议：**
- 模型已通过基准测试，建议直接打包部署。
- 可尝试使用全量数据进行最终微调。
          `);
      }
  };


  // --- Render Helpers ---

  const renderStepper = () => {
      const steps: {id: WorkflowStage, label: string}[] = [
          { id: 'UPLOAD', label: '上传数据' },
          { id: 'CLEANING', label: '数据清洗' },
          { id: 'SELECTION', label: '选择模型' },
          { id: 'TRAINING', label: '建模中' },
          { id: 'RESULT', label: '模型结果' }
      ];

      return (
          <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-6 px-4">
              {steps.map((s, idx) => {
                  const isCurrent = s.id === stage;
                  const isPast = steps.findIndex(step => step.id === stage) > idx;
                  
                  return (
                      <div key={s.id} className="flex flex-col items-center relative z-10 w-24">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 font-bold text-xs transition-colors
                              ${isCurrent ? 'bg-black text-white border-black' : ''}
                              ${isPast ? 'bg-gray-200 border-black text-black' : ''}
                              ${!isCurrent && !isPast ? 'bg-white border-gray-300 text-gray-300' : ''}
                          `}>
                              {isPast ? <Check className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span className={`text-xs font-bold uppercase ${isCurrent || isPast ? 'text-black' : 'text-gray-300'}`}>{s.label}</span>
                      </div>
                  )
              })}
              {/* Connector Line could go here via absolute positioning */}
          </div>
      );
  };

  const renderBackButton = () => (
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-black font-bold mb-6 hover:underline text-sm w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        返回仪表盘
      </button>
  );

  // --- VIEW: UPLOAD ---
  if (stage === 'UPLOAD') {
      return (
          <div className="p-8 max-w-4xl mx-auto">
              {renderBackButton()}
              {renderStepper()}
              <div className="bg-white border-2 border-black p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
                  <h2 className="text-2xl font-black uppercase mb-2">步骤 1: 上传训练数据</h2>
                  <p className="text-gray-600 font-mono text-sm mb-8">支持 CSV, Excel (.xlsx) 格式。请确保包含表头。</p>
                  
                  <label className="cursor-pointer group">
                      <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
                      <div className="w-64 h-48 border-2 border-black border-dashed flex flex-col items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
                          <UploadCloud className="w-12 h-12 mb-4 text-black" />
                          <span className="font-bold uppercase text-sm">点击选择文件</span>
                      </div>
                  </label>

                  {error && (
                      <div className="mt-6 flex items-center gap-2 text-red-600 border border-red-500 bg-red-50 px-4 py-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-bold">{error}</span>
                      </div>
                  )}

                  {file && !error && (
                      <div className="mt-6 w-full max-w-md">
                          <div className="flex items-center gap-3 border-2 border-black p-3 bg-white">
                              <FileSpreadsheet className="w-6 h-6" />
                              <div className="flex-1 text-left">
                                  <p className="font-bold text-sm truncate">{file.name}</p>
                                  <p className="text-xs text-gray-500 font-mono">{(file.size / 1024).toFixed(2)} KB</p>
                              </div>
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                          </div>
                          <button 
                            onClick={() => setStage('CLEANING')}
                            className="w-full mt-4 bg-black text-white border-2 border-black py-3 font-bold uppercase hover:bg-white hover:text-black transition-colors"
                          >
                              解析并下一步
                          </button>
                      </div>
                  )}
              </div>
          </div>
      );
  }

  // --- VIEW: CLEANING ---
  if (stage === 'CLEANING') {
      return (
          <div className="p-8 max-w-4xl mx-auto">
              {renderBackButton()}
              {renderStepper()}
              <div className="bg-white border-2 border-black p-8">
                  <h2 className="text-2xl font-black uppercase mb-6">步骤 2: 数据质量检查</h2>
                  
                  <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="p-4 bg-gray-50 border border-black">
                          <p className="text-xs font-bold uppercase text-gray-500 mb-1">行数 (Rows)</p>
                          <p className="text-2xl font-mono font-bold">12,450</p>
                      </div>
                      <div className="p-4 bg-gray-50 border border-black">
                          <p className="text-xs font-bold uppercase text-gray-500 mb-1">特征数 (Features)</p>
                          <p className="text-2xl font-mono font-bold">18</p>
                      </div>
                  </div>

                  {!dataCleaned ? (
                      <div className="border border-red-200 bg-red-50 p-6 mb-8">
                          <div className="flex items-start gap-3">
                              <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
                              <div>
                                  <h3 className="font-bold text-red-800 mb-2">发现数据问题</h3>
                                  <ul className="list-disc list-inside text-sm text-red-700 font-mono space-y-1">
                                      <li>3 列存在缺失值 (Total: 450)</li>
                                      <li>发现 2 个重复 ID</li>
                                      <li>"Date" 列格式不统一</li>
                                  </ul>
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className="border border-green-200 bg-green-50 p-6 mb-8">
                           <div className="flex items-start gap-3">
                              <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                              <div>
                                  <h3 className="font-bold text-green-800 mb-2">数据清洗完成</h3>
                                  <p className="text-sm text-green-700 font-mono">
                                      已自动填充缺失值 (Mean)，删除重复项，并标准化日期格式。数据现已准备就绪。
                                  </p>
                              </div>
                          </div>
                      </div>
                  )}

                  <div className="flex justify-end gap-4">
                      {!dataCleaned ? (
                          <button 
                            onClick={startCleaning}
                            disabled={isCleaning}
                            className="flex items-center gap-2 bg-white text-black border-2 border-black px-6 py-3 font-bold uppercase hover:bg-gray-100"
                          >
                              {isCleaning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eraser className="w-4 h-4" />}
                              {isCleaning ? '正在清洗...' : '自动清洗数据'}
                          </button>
                      ) : (
                          <button 
                             onClick={() => setStage('SELECTION')}
                             className="flex items-center gap-2 bg-black text-white border-2 border-black px-8 py-3 font-bold uppercase hover:bg-white hover:text-black transition-colors"
                          >
                              下一步: 模型选择
                              <ArrowRight className="w-4 h-4" />
                          </button>
                      )}
                  </div>
              </div>
          </div>
      );
  }

  // --- VIEW: SELECTION ---
  if (stage === 'SELECTION') {
      return (
          <div className="p-8 max-w-4xl mx-auto">
              {renderBackButton()}
              {renderStepper()}
              <div className="bg-white border-2 border-black p-8">
                  <h2 className="text-2xl font-black uppercase mb-2">步骤 3: 选择算法</h2>
                  <p className="text-gray-600 font-mono text-sm mb-6">AutoML 将并行训练选中的模型并进行超参数调优。</p>

                  <div className="space-y-3 mb-8">
                      {AVAILABLE_MODELS.map(model => (
                          <div 
                            key={model.id}
                            onClick={() => toggleModel(model.id)}
                            className={`flex items-center justify-between p-4 border-2 cursor-pointer transition-all ${
                                selectedModels.includes(model.id) ? 'border-black bg-gray-50' : 'border-transparent hover:bg-gray-50 border-gray-100'
                            }`}
                          >
                              <div className="flex items-center gap-4">
                                  <div className={`w-5 h-5 border-2 border-black flex items-center justify-center ${selectedModels.includes(model.id) ? 'bg-black' : 'bg-white'}`}>
                                      {selectedModels.includes(model.id) && <Check className="w-3 h-3 text-white" />}
                                  </div>
                                  <div>
                                      <p className="font-bold text-sm">{model.name}</p>
                                      <p className="text-xs text-gray-500 font-mono">{model.type}</p>
                                  </div>
                              </div>
                              {model.recommended && (
                                  <span className="text-[10px] font-bold uppercase bg-black text-white px-2 py-1">推荐</span>
                              )}
                          </div>
                      ))}
                  </div>

                  <div className="flex justify-end">
                      <button 
                        onClick={startTraining}
                        disabled={selectedModels.length === 0}
                        className="flex items-center gap-2 bg-black text-white border-2 border-black px-8 py-3 font-bold uppercase hover:bg-white hover:text-black transition-colors disabled:opacity-50"
                      >
                          <Play className="w-4 h-4" />
                          开始建模
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  // --- VIEW: TRAINING ---
  if (stage === 'TRAINING') {
      return (
          <div className="p-8 max-w-4xl mx-auto">
               {renderBackButton()}
               {renderStepper()}
               <div className="bg-white border-2 border-black p-12 text-center">
                   <h2 className="text-2xl font-black uppercase mb-8">正在训练模型...</h2>
                   
                   <div className="w-full h-8 border-2 border-black p-1 mb-4">
                       <div 
                         className="h-full bg-black transition-all duration-200" 
                         style={{ width: `${trainingProgress}%` }}
                       ></div>
                   </div>
                   <p className="font-mono text-right font-bold text-lg mb-8">{trainingProgress}%</p>

                   <div className="bg-gray-50 border border-black p-4 font-mono text-xs text-left h-48 overflow-y-auto space-y-2">
                       <p>&gt; Initializing AutoML engine...</p>
                       <p>&gt; Loading dataset (12,450 rows)...</p>
                       {trainingProgress > 10 && <p>&gt; [System] Starting parallel training on selected models...</p>}
                       {trainingProgress > 30 && <p>&gt; [Training] Cross-validation fold 2/5 complete...</p>}
                       {trainingProgress > 50 && <p>&gt; [Tuning] Hyperparameter optimization in progress...</p>}
                       {trainingProgress > 90 && <p>&gt; Finalizing model ensemble...</p>}
                   </div>
               </div>
          </div>
      );
  }

  // --- VIEW: RESULT ---
  const handlePackage = () => {
      setIsPackaged(true);
  };
  
  // Logic for trophy
  const topModelId = results.length > 0 ? results[0].id : '';

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      {/* Back Button */}
      {renderBackButton()}

      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-6">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <span className="px-2 py-0.5 border border-black text-[10px] font-bold uppercase bg-gray-100">AutoML 回归任务</span>
             {isUnfitProject && <span className="px-2 py-0.5 border border-red-600 text-red-600 text-[10px] font-bold uppercase bg-red-50">数据质量警告</span>}
           </div>
           <h1 className="text-2xl font-black text-black">{projectName}</h1>
           <p className="text-gray-600 font-mono text-sm mt-1">&gt; 状态: 训练完成 ({results.length}个模型)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left: Leaderboard & Charts */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* AI Analysis Card */}
            <div className={`border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${isUnfitProject ? 'bg-red-50' : 'bg-yellow-50'}`}>
                <div className="flex items-center gap-2 mb-4 border-b-2 border-black border-dashed pb-2">
                    <Sparkles className="w-5 h-5 text-black" />
                    <h3 className="font-black text-lg uppercase">AI 智能评估报告 (本地模式)</h3>
                </div>
                
                <div className="prose prose-sm max-w-none font-mono text-sm leading-relaxed whitespace-pre-line">
                    {aiAnalysis || "正在生成分析..."}
                </div>
            </div>

            {/* Leaderboard Table */}
            <div>
                <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    模型排行榜 (按准确率排序)
                </h2>
                <div className="border-2 border-black bg-white">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b-2 border-black text-sm uppercase">
                                <th className="p-4 border-r border-black">选择</th>
                                <th className="p-4 border-r border-black">模型名称</th>
                                <th className="p-4 border-r border-black">算法类型</th>
                                <th className="p-4 border-r border-black">准确率</th>
                                <th className="p-4">R2 Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((model) => (
                                <tr 
                                    key={model.id} 
                                    onClick={() => setSelectedResultModel(model.id)}
                                    className={`cursor-pointer hover:bg-gray-50 font-mono text-sm border-b border-gray-200 ${selectedResultModel === model.id ? 'bg-black text-white hover:bg-gray-900' : 'text-black'}`}
                                >
                                    <td className="p-4 border-r border-black text-center">
                                        <div className={`w-4 h-4 rounded-full border-2 ${selectedResultModel === model.id ? 'border-white bg-white' : 'border-black'}`}></div>
                                    </td>
                                    <td className="p-4 border-r border-black font-bold flex items-center gap-2">
                                        {model.name}
                                        {model.id === topModelId && !isUnfitProject && <Trophy className={`w-4 h-4 ${selectedResultModel === model.id ? 'text-yellow-400' : 'text-yellow-600'}`} />}
                                    </td>
                                    <td className="p-4 border-r border-black">{model.type}</td>
                                    <td className="p-4 border-r border-black font-bold">{model.accuracy}%</td>
                                    <td className="p-4">{model.r2}</td>
                                </tr>
                            ))}
                            {results.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-500 font-mono">暂无模型数据</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Model Details Chart */}
            <div className="border-2 border-black p-6 bg-white">
                 <h3 className="font-bold mb-4">预测 vs 实际 (Top 1 模型验证集表现)</h3>
                 <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={PREDICTION_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" tick={{fontSize: 12}} />
                            <YAxis />
                            <Tooltip 
                                contentStyle={{ border: '2px solid black', borderRadius: '0px' }}
                                cursor={{fill: '#f5f5f5'}}
                            />
                            <Bar dataKey="actual" fill="#000000" name="实际销售额" />
                            <Bar dataKey="predicted" fill="#9ca3af" name="预测销售额" />
                        </BarChart>
                    </ResponsiveContainer>
                 </div>
            </div>
         </div>

         {/* Right: Action Panel */}
         <div className="lg:col-span-1">
            <div className="bg-white border-2 border-black p-6 sticky top-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-xl font-black mb-6 border-b-2 border-black pb-2">模型操作</h3>
                
                <div className="mb-6">
                    <p className="text-sm text-gray-500 font-bold mb-1">当前选中模型</p>
                    <p className="text-lg font-bold">{results.find(m => m.id === selectedResultModel)?.name || '未选择'}</p>
                    {selectedResultModel && (
                        <div className="flex gap-2 mt-2">
                            <span className="bg-gray-100 border border-black px-2 py-1 text-xs font-mono">Accuracy: {results.find(m => m.id === selectedResultModel)?.accuracy}%</span>
                            <span className="bg-gray-100 border border-black px-2 py-1 text-xs font-mono">{results.find(m => m.id === selectedResultModel)?.status}</span>
                        </div>
                    )}
                </div>

                {!isPackaged ? (
                    <button 
                        onClick={handlePackage}
                        disabled={isUnfitProject}
                        className="w-full bg-black text-white border-2 border-black py-4 font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={isUnfitProject ? '模型效果不佳，无法打包' : '打包模型'}
                    >
                        <Package className="w-5 h-5" />
                        {isUnfitProject ? '无法打包 (精度不足)' : '打包模型'}
                    </button>
                ) : (
                    <div className="bg-green-50 border-2 border-green-600 p-4 text-center">
                        <div className="flex justify-center mb-2">
                             <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <h4 className="font-bold text-green-800 mb-1">打包成功!</h4>
                        <p className="text-xs text-green-700 font-mono mb-4">Model_v2_release.pkl</p>
                        <button className="text-xs underline font-bold" onClick={() => navigate('/dashboard')}>返回项目列表</button>
                    </div>
                )}
                
                <div className="mt-6 pt-6 border-t-2 border-dashed border-black">
                     <button className="w-full flex justify-between items-center text-sm font-bold p-2 hover:bg-gray-50">
                        查看详细评估报告
                        <ArrowRight className="w-4 h-4" />
                     </button>
                     <button className="w-full flex justify-between items-center text-sm font-bold p-2 hover:bg-gray-50">
                        导出测试数据
                        <ArrowRight className="w-4 h-4" />
                     </button>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};