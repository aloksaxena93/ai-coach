import React, { useState } from 'react';
import ProblemHeader from '@/components/ide/ProblemHeader';
import CodeEditor from '@/components/ide/CodeEditor';
import TutorPanel from '@/components/ide/TutorPanel';

const SAMPLE_PROBLEM = {
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

const STARTER_CODE = `def two_sum(nums, target):
    # Your solution here
    pass

# Test your solution
nums = [2, 7, 11, 15]
target = 9
print(two_sum(nums, target))
`;

// Socratic tutor responses - simulating AI behavior
const TUTOR_RESPONSES = {
  start: [
    "Great question! Let's think about this together. What information do we have, and what are we trying to find? 🤔",
    "Let's start by breaking down the problem. Can you tell me in your own words what the Two Sum problem is asking us to do?",
    "Excellent starting point! First, what patterns do you notice in the example? What does input [2,7,11,15] with target 9 tell you about the answer [0,1]?"
  ],
  hint: [
    "Here's a thought: what if you had a way to remember numbers you've already seen? What data structure could help with fast lookups? 💡",
    "Consider this: for each number, what other number would you need to find? How can you express that mathematically?",
    "Think about it this way: if you're at index i with value nums[i], what value are you looking for to complete the sum?"
  ],
  approach: [
    "Let's validate your thinking! Walk me through your approach step by step. What would happen with the first element in our example array?",
    "That's an interesting direction! What's the time complexity of your current approach? Is there a way to make it more efficient?",
    "I see where you're going! Have you considered what happens if there are duplicate values? How would your solution handle that?"
  ],
  general: [
    "Interesting question! What have you tried so far? Understanding your current thinking helps me guide you better.",
    "Let's explore that together. What's your intuition telling you about this problem?",
    "Good thinking! What's the relationship between the current number and the target? How might you use that relationship?",
    "I like your curiosity! Consider this: what's the simplest approach that comes to mind first, even if it's not optimal?",
    "Let's think about edge cases too. What happens if the array has only two elements? What about negative numbers?"
  ]
};

function getAIResponse(userMessage, code) {
  const message = userMessage.toLowerCase();
  
  // Determine response category based on keywords
  let responses;
  if (message.includes('start') || message.includes('begin') || message.includes('where')) {
    responses = TUTOR_RESPONSES.start;
  } else if (message.includes('hint') || message.includes('stuck') || message.includes('help')) {
    responses = TUTOR_RESPONSES.hint;
  } else if (message.includes('approach') || message.includes('check') || message.includes('correct') || message.includes('right')) {
    responses = TUTOR_RESPONSES.approach;
  } else {
    responses = TUTOR_RESPONSES.general;
  }
  
  // Pick a random response from the category
  return responses[Math.floor(Math.random() * responses.length)];
}

export default function IDE() {
  const [code, setCode] = useState(STARTER_CODE);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState('');

  const handleSendMessage = async (content) => {
    const userMessage = { role: 'user', content };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const aiResponse = getAIResponse(content, code);
    const assistantMessage = { 
      role: 'assistant', 
      content: aiResponse 
    };
    
    setMessages([...updatedMessages, assistantMessage]);
    setIsLoading(false);
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
      <ProblemHeader problem={SAMPLE_PROBLEM} />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor - Main Area */}
        <div className="flex-1 p-4 pr-2 flex flex-col gap-3">
          <div className="flex-1">
            <CodeEditor 
              code={code} 
              onChange={setCode} 
              language="python"
              onRun={handleRunCode}
            />
          </div>
          
          {/* Output Panel */}
          {output && (
            <div className="h-32 bg-[#0d1117] rounded-lg p-4 overflow-auto">
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

