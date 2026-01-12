import React, { useState } from 'react';
import PromptList from './components/PromptList';
import PromptEditor from './components/PromptEditor';
import type { Prompt } from './types';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [promptToLoad, setPromptToLoad] = useState<Prompt | null>(null);

  const handlePromptSaved = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLoadPrompt = (prompt: Prompt) => {
    setPromptToLoad(prompt);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800">Prompt Writer App</h1>
          <p className="text-gray-600 mt-2">Write, test, and save your prompts.</p>
        </header>

        <PromptEditor
          onPromptSaved={handlePromptSaved}
          promptToLoad={promptToLoad}
        />

        <PromptList
          refreshTrigger={refreshTrigger}
          onLoadPrompt={handleLoadPrompt}
        />
      </div>
    </div>
  );
}

export default App;
