export const GEMINI_MODEL_CHAT = 'gemini-3-flash-preview';

export const MOCK_PROJECTS = [
  {
    id: '1',
    name: '酒鬼酒销售预测 (2024 Q4)',
    description: '基于历史销售数据和市场投放预测下一季度销售额 (回归任务)',
    subProjectName: '特征工程 V2',
    type: 'ML',
    createdAt: new Date('2023-10-15'),
    status: 'deployed', // Mapped to "已完成"
    accuracy: 94.2
  },
  {
    id: '2',
    name: '企业合同知识库助手',
    description: '基于Dify平台的合同合规性审查与问答助手',
    subProjectName: 'Dify Agent V1',
    type: 'LLM',
    createdAt: new Date('2023-11-02'),
    status: 'active', // Mapped to "进行中"
    modelName: 'gemini-3-pro-preview',
    externalUrl: 'https://udify.app/chat/placeholder-id' // Example Dify URL
  },
  {
    id: '3',
    name: '业管智能助手',
    description: '业务管理流程自动化问答',
    subProjectName: 'Workflow V3',
    type: 'LLM',
    createdAt: new Date('2023-12-10'),
    status: 'active',
    modelName: 'gemini-3-flash',
    externalUrl: 'https://udify.app/chat/placeholder-id-2'
  }
] as const;