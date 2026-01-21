import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, ArrowRight, Lock } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('请输入有效的邮箱地址');
      return;
    }
    if (password.length < 4) {
       setError('密码长度需大于4位');
       return;
    }
    login(email);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
            <div className="bg-white p-4 border-2 border-black">
                <BrainCircuit className="w-16 h-16 text-black" />
            </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-black mb-2 tracking-tighter">AiLM 登录</h1>
          <p className="text-gray-600 font-mono text-sm">AI 全生命周期管理平台</p>
        </div>

        <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-black mb-2">
                企业邮箱
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                  }}
                  className="w-full bg-white border-2 border-black px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:bg-gray-50 transition-none"
                  placeholder="name@company.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-black mb-2">
                密码
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                  }}
                  className="w-full bg-white border-2 border-black px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:bg-gray-50 transition-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && <p className="mt-2 text-sm text-black font-bold border-l-4 border-red-500 pl-2 bg-red-50 p-1">{error}</p>}

            <button
              type="submit"
              className="w-full bg-black text-white font-bold py-4 px-4 border-2 border-black hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2"
            >
              进入平台
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};