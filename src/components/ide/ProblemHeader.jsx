import React from 'react';
import { FileCode, Target, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ProblemHeader({ problem }) {
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

