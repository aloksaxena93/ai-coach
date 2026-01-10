import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Lightbulb, HelpCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

const QuickPrompt = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all hover:border-slate-300"
  >
    <Icon className="w-3.5 h-3.5" />
    {label}
  </button>
);

const Message = ({ message }) => {
  const isAI = message.role === 'assistant';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
    >
      <div className={`
        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
        ${isAI 
          ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
          : 'bg-slate-200'
        }
      `}>
        {isAI ? (
          <Sparkles className="w-4 h-4 text-white" />
        ) : (
          <User className="w-4 h-4 text-slate-600" />
        )}
      </div>
      
      <div className={`
        flex-1 max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed
        ${isAI 
          ? 'bg-slate-50 text-slate-700 rounded-tl-sm' 
          : 'bg-blue-600 text-white rounded-tr-sm'
        }
      `}>
        {message.content}
      </div>
    </motion.div>
  );
};

export default function TutorPanel({ messages, onSendMessage, isLoading }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleQuickPrompt = (prompt) => {
    onSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200">
      {/* Panel Header */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">AI Tutor</h2>
            <p className="text-xs text-slate-500">Socratic guidance mode</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">
              Ready to help you learn
            </h3>
            <p className="text-xs text-slate-500 mb-6 max-w-[200px]">
              I'll guide you through the problem with questions, not answers.
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <QuickPrompt
                icon={HelpCircle}
                label="Where do I start?"
                onClick={() => handleQuickPrompt("Where should I start with this problem?")}
              />
              <QuickPrompt
                icon={Lightbulb}
                label="Give me a hint"
                onClick={() => handleQuickPrompt("Can you give me a hint?")}
              />
              <QuickPrompt
                icon={CheckCircle}
                label="Check my approach"
                onClick={() => handleQuickPrompt("Can you check if my approach is correct?")}
              />
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message, index) => (
              <Message 
                key={index} 
                message={message} 
              />
            ))}
          </AnimatePresence>
        )}
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-50 px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for guidance..."
            disabled={isLoading}
            className="flex-1 h-10 bg-slate-50 border-slate-200 focus:border-blue-300 focus:ring-blue-200 placeholder:text-slate-400"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-10 w-10 p-0 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

