// This service is mocked for local offline demonstration
// Removing the dependency on @google/genai to fix npm install errors

export const createChatSession = (systemInstruction?: string): any => {
  console.log("Mock AI Chat Session Created");
  return {
    sendMessageStream: async (message: string) => {
      // Return an async iterator to mock the stream
      return {
        async *[Symbol.asyncIterator]() {
          yield { text: "本地演示模式：AI 服务当前未连接。请检查网络配置或 API Key。" };
        }
      };
    }
  };
};

export const sendMessageStream = async (chat: any, message: string) => {
  return chat.sendMessageStream({ message });
};