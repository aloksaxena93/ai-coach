import React, { useState } from 'react';
import { FileCode, Target, Clock, Sparkles, Edit3, X, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ProblemHeader({ 
  problem, 
  onGenerateNew, 
  onCustomProblem,
  isGenerating 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');

  const handleSubmitCustom = () => {
    if (customTitle.trim() && customDescription.trim()) {
      onCustomProblem({
        title: customTitle.trim(),
        description: customDescription.trim(),
        difficulty: 'Custom',
        category: 'Custom',
        estimatedTime: '—',
        examples: []
      });
      setIsEditing(false);
      setCustomTitle('');
      setCustomDescription('');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCustomTitle('');
    setCustomDescription('');
  };

  if (isEditing) {
    return (
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
            <Edit3 className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Enter Your Own Problem</h2>
        </div>
        
        <div className="space-y-3">
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="Problem title (e.g., 'Reverse a Linked List')"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <textarea
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            placeholder="Problem description... (e.g., 'Given the head of a singly linked list, reverse the list and return the reversed list.')"
            rows={3}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSubmitCustom}
              disabled={!customTitle.trim() || !customDescription.trim()}
              className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
            >
              <Check className="w-3.5 h-3.5 mr-1.5" />
              Use This Problem
            </Button>
            <Button
              onClick={handleCancel}
              variant="ghost"
              className="h-8 px-4 text-slate-600 hover:text-slate-800 text-sm"
            >
              <X className="w-3.5 h-3.5 mr-1.5" />
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <FileCode className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-slate-900 truncate">
              {problem.title}
            </h1>
            <Badge 
              variant="secondary" 
              className={`
                ${problem.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                ${problem.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                ${problem.difficulty === 'Hard' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                ${problem.difficulty === 'Custom' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                border font-medium
              `}
            >
              {problem.difficulty}
            </Badge>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
            {problem.description}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              <span>{problem.category}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{problem.estimatedTime}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsEditing(true)}
              variant="ghost"
              className="h-8 px-3 text-slate-600 hover:text-slate-800 text-sm border border-slate-200"
            >
              <Edit3 className="w-3.5 h-3.5 mr-1.5" />
              Custom
            </Button>
            <Button
              onClick={onGenerateNew}
              disabled={isGenerating}
              className="h-8 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              {isGenerating ? 'Generating...' : 'Generate New'}
            </Button>
          </div>
        </div>
      </div>
      
      {problem.examples && problem.examples.length > 0 && (
        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Example</p>
          <div className="font-mono text-sm">
            <div className="text-slate-600">
              <span className="text-slate-400">Input: </span>
              <span className="text-slate-800">{problem.examples[0].input}</span>
            </div>
            <div className="text-slate-600 mt-1">
              <span className="text-slate-400">Output: </span>
              <span className="text-emerald-600 font-medium">{problem.examples[0].output}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
