import React, { useState } from 'react';
import ProblemHeader from '@/components/ide/ProblemHeader';
import CodeEditor from '@/components/ide/CodeEditor';
import TutorPanel from '@/components/ide/TutorPanel';

// Backend API URL
const API_URL = 'http://localhost:8000';

const DEFAULT_PROBLEM = {
  title: "Two Sum",
  difficulty: "Easy",
  category: "Arrays",
  estimatedTime: "15 min",
  description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0, 1]"
    }
  ]
};

const DEFAULT_STARTER_CODE = `def two_sum(nums, target):
    # Your solution here
    pass

# Test your solution
nums = [2, 7, 11, 15]
target = 9
print(two_sum(nums, target))
`;

const CUSTOM_STARTER_CODE = `# Your solution here

`;

export default function IDE() {
  const [problem, setProblem] = useState(DEFAULT_PROBLEM);
  const [code, setCode] = useState(DEFAULT_STARTER_CODE);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState('');

  const handleGenerateNew = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch(`${API_URL}/api/generate-problem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          difficulty: null, // Random difficulty
          category: null,   // Random category
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate problem');
      }

      const data = await response.json();
      
      setProblem({
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        category: data.category,
        estimatedTime: data.estimatedTime,
        examples: data.examples,
      });
      
      setCode(data.starterCode || CUSTOM_STARTER_CODE);
      setMessages([]); // Clear chat for new problem
      setOutput('');   // Clear output
      
    } catch (error) {
      console.error('Error generating problem:', error);
      alert(`Failed to generate problem: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomProblem = (customProblem) => {
    setProblem(customProblem);
    setCode(CUSTOM_STARTER_CODE);
    setMessages([]); // Clear chat for new problem
    setOutput('');   // Clear output
  };

  const handleSendMessage = async (content) => {
    const userMessage = { role: 'user', content };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          problem: {
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            category: problem.category,
            examples: problem.examples,
          },
          code: code,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get response from tutor');
      }

      const data = await response.json();
      const assistantMessage = { 
        role: 'assistant', 
        content: data.response 
      };
      
      setMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error('Error getting tutor response:', error);
      setMessages([
        ...updatedMessages, 
        { 
          role: 'assistant', 
          content: `I'm having trouble connecting to the backend. Please make sure the server is running at ${API_URL}. Error: ${error.message}` 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunCode = () => {
    // Simple Python-like execution simulation
    setOutput('Running code...\n');
    setTimeout(() => {
      if (code.includes('pass') && !code.includes('return')) {
        setOutput('Output: None\n\n💡 Tip: Your function returns None. Try implementing the logic!');
      } else if (code.includes('return')) {
        setOutput('Output: [0, 1]\n\n✅ Your solution produced output! Check if it matches the expected result.');
      } else {
        setOutput('Output: None\n\n🔍 Make sure your function has a return statement.');
      }
    }, 500);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      {/* Problem Header */}
      <ProblemHeader 
        problem={problem} 
        onGenerateNew={handleGenerateNew}
        onCustomProblem={handleCustomProblem}
        isGenerating={isGenerating}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor - Main Area */}
        <div className="flex-1 p-4 pr-2 flex flex-col gap-3">
          <div className="flex-[3] min-h-0">
            <CodeEditor 
              code={code} 
              onChange={setCode} 
              language="python"
              onRun={handleRunCode}
            />
          </div>
          
          {/* Output Panel */}
          {output && (
            <div className="flex-[2] min-h-[200px] bg-[#0d1117] rounded-lg p-4 overflow-auto">
              <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">Console Output</div>
              <pre className="text-sm text-slate-200 font-mono whitespace-pre-wrap">{output}</pre>
            </div>
          )}
        </div>
        
        {/* AI Tutor Panel - Side Panel */}
        <div className="w-80 lg:w-96 flex-shrink-0">
          <div className="h-full py-4 pr-4">
            <div className="h-full rounded-lg overflow-hidden shadow-sm">
              <TutorPanel 
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
