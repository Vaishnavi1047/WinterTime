import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateAdvisorResponse } from '../services/geminiService';
import { IconRobot } from './Icons';

const CarbonAdvisor = ({ user, recentLog }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      text: `Namaste! I am your **BEE Carbon Advisor**. Based on your target of **${user.complianceTarget2025} tCO2e**, how can I assist you today?`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;

    const userMsg = { id: Date.now().toString(), role: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    const typingId = 'typing-' + Date.now();
    setMessages(prev => [...prev, { id: typingId, role: 'assistant', text: 'Thinking...', isTyping: true }]);

    try {
      const responseText = await generateAdvisorResponse(user, recentLog, userMsg.text);

      // Split response by lines for better rendering
      const formattedText = responseText
        .split(/\n+/)
        .map(line => line.trim())
        .filter(Boolean);

      setMessages(prev =>
        prev.filter(m => m.id !== typingId).concat({
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: formattedText
        })
      );
    } catch (err) {
      setMessages(prev =>
        prev.filter(m => m.id !== typingId).concat({
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: ['❌ Error generating response, please try again.']
        })
      );
    }

    setIsProcessing(false);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col max-w-4xl mx-auto p-6">
      <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg flex flex-col overflow-hidden shadow-2xl">
        <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-full text-emerald-400"><IconRobot /></div>
          <h3 className="text-slate-100 font-bold">AI Carbon Advisor</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${msg.role === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-700 text-slate-200 border border-slate-600'
                }`}
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {Array.isArray(msg.text)
                  ? msg.text.map((line, idx) => <ReactMarkdown key={idx}>{line}</ReactMarkdown>)
                  : <ReactMarkdown>{msg.text}</ReactMarkdown>
                }
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 text-slate-200 outline-none focus:border-emerald-500"
            placeholder="Ask about compliance strategies..."
            disabled={isProcessing}
          />
          <button type="submit" disabled={isProcessing} className="bg-emerald-600 px-6 py-2 rounded-lg text-white font-medium">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default CarbonAdvisor;
