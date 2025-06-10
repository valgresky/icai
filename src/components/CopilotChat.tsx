import { useState } from 'react';
import { CopilotChat } from '@copilotkit/react-ui';
import { CopilotProvider } from '@copilotkit/react-core';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const WorkflowCopilot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CopilotProvider backendUrl={`${backendUrl}/api/chat`}>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn-primary rounded-full p-4 shadow-lg"
        >
          {isOpen ? 'Close Chat' : 'AI Assistant'}
        </button>
        
        {isOpen && (
          <div className="fixed bottom-20 right-4 w-96 h-[600px] bg-background-secondary rounded-lg shadow-xl border border-neutral-700">
            <CopilotChat
              className="w-full h-full"
              placeholder="Ask about workflows..."
              suggestions={[
                "How do I set up the Twitter to Discord workflow?",
                "Can you explain the GitHub integration?",
                "What's the best workflow for social media automation?"
              ]}
            />
          </div>
        )}
      </div>
    </CopilotProvider>
  );
};