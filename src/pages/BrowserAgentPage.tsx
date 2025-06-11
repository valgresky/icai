import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Play, 
  Eye, 
  Copy, 
  RefreshCw, 
  Clock, 
  ExternalLink,
  Loader,
  AlertCircle,
  CheckCircle,
  Zap
} from 'lucide-react';
import { cn } from '../utils/helpers';

interface BrowserSession {
  liveViewUrl: string;
  sessionId: string;
  windowId: string;
}

const BrowserAgentPage = () => {
  const [url, setUrl] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<BrowserSession | null>(null);
  const [error, setError] = useState('');
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [copied, setCopied] = useState(false);

  // Example prompts for quick fill
  const examples = [
    {
      url: 'https://www.bestbuy.com',
      instructions: 'Search for laptops under $500 and find the top 3 results'
    },
    {
      url: 'https://www.amazon.com',
      instructions: 'Find product reviews for wireless headphones'
    },
    {
      url: 'https://news.ycombinator.com',
      instructions: 'Extract the top 5 trending tech stories'
    },
    {
      url: 'https://www.linkedin.com',
      instructions: 'Navigate to the jobs section and search for remote developer positions'
    }
  ];

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const startBrowserSession = async (url: string, instructions: string) => {
    try {
      // Replace with your actual n8n webhook URL
      const webhookUrl = process.env.VITE_N8N_BROWSER_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/browser-agent';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          instructions: instructions
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!url || !instructions) {
      setError('Please fill in both URL and instructions');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setIsLoading(true);

    try {
      const sessionData = await startBrowserSession(url, instructions);
      setSession(sessionData);
      setSessionStartTime(new Date());
    } catch (error) {
      setError('Failed to start browser session. Please try again.');
      console.error('Session error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (session?.liveViewUrl) {
      try {
        await navigator.clipboard.writeText(session.liveViewUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  const handleNewSession = () => {
    setSession(null);
    setSessionStartTime(null);
    setUrl('');
    setInstructions('');
    setError('');
    setCopied(false);
  };

  const fillExample = (example: typeof examples[0]) => {
    setUrl(example.url);
    setInstructions(example.instructions);
  };

  const getSessionDuration = () => {
    if (!sessionStartTime) return '';
    const now = new Date();
    const diff = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000);
    return `${diff}s`;
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary-500" />
              </div>
              <h1 className="text-4xl font-bold">Browser Automation Tool</h1>
            </div>
            <p className="text-xl text-neutral-300 mb-4">
              Control a real browser with AI - watch it work in real-time!
            </p>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Enter any website URL and tell our AI agent what to do. You'll get a live link to watch the browser complete your task.
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="glass-panel p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary-500" />
                  Start Browser Session
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Website URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://www.example.com"
                        className="glass-card w-full pl-10 pr-4 py-3"
                        disabled={isLoading || !!session}
                      />
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Instructions for AI Agent
                    </label>
                    <textarea
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Describe what you want the browser to do..."
                      rows={4}
                      className="glass-card w-full p-3 resize-none"
                      disabled={isLoading || !!session}
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-error-DEFAULT text-sm p-3 bg-error-DEFAULT/10 rounded-lg">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {!session ? (
                      <button
                        type="submit"
                        disabled={isLoading || !url || !instructions}
                        className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Setting up browser...
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5" />
                            Start Browser Session
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleNewSession}
                        className="btn-ghost flex-1 py-3 flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-5 h-5" />
                        New Session
                      </button>
                    )}
                  </div>
                </form>

                {/* Quick Examples */}
                {!session && (
                  <div className="mt-8">
                    <h3 className="text-sm font-medium mb-3 text-neutral-400">Quick Examples:</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {examples.map((example, index) => (
                        <button
                          key={index}
                          onClick={() => fillExample(example)}
                          className="text-left p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors text-sm"
                          disabled={isLoading}
                        >
                          <div className="font-medium text-primary-400 mb-1">
                            {new URL(example.url).hostname}
                          </div>
                          <div className="text-neutral-300 line-clamp-2">
                            {example.instructions}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="glass-panel p-6 h-full">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-secondary-500" />
                  Live Browser View
                </h2>

                {!session && !isLoading && (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
                      <Globe className="w-8 h-8 text-neutral-600" />
                    </div>
                    <p className="text-neutral-400 mb-2">No active session</p>
                    <p className="text-sm text-neutral-500">
                      Start a browser session to get your live view link
                    </p>
                  </div>
                )}

                {isLoading && (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Loader className="w-8 h-8 animate-spin text-primary-500 mb-4" />
                    <p className="text-neutral-300 mb-2">Setting up your browser session...</p>
                    <p className="text-sm text-neutral-500">
                      This usually takes 10-15 seconds
                    </p>
                  </div>
                )}

                {session && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-success-DEFAULT">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Session Active</span>
                      {sessionStartTime && (
                        <span className="text-sm text-neutral-400 ml-auto flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {getSessionDuration()}
                        </span>
                      )}
                    </div>

                    <div className="space-y-4">
                      <a
                        href={session.liveViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg"
                      >
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        Watch Live Browser Session
                        <ExternalLink className="w-5 h-5" />
                      </a>

                      <button
                        onClick={handleCopyLink}
                        className="btn-ghost w-full py-3 flex items-center justify-center gap-2"
                      >
                        {copied ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-success-DEFAULT" />
                            Link Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Live View Link
                          </>
                        )}
                      </button>
                    </div>

                    <div className="glass-card p-4 space-y-2">
                      <h4 className="font-medium text-sm text-neutral-400">Session Details</h4>
                      <div className="space-y-1 text-sm font-mono">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Session ID:</span>
                          <span className="text-neutral-300">{session.sessionId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Window ID:</span>
                          <span className="text-neutral-300">{session.windowId}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-warning-DEFAULT/10 border border-warning-DEFAULT/20 rounded-lg p-4">
                      <p className="text-sm text-warning-DEFAULT">
                        <strong>Note:</strong> Browser sessions are temporary and will expire after 30 minutes of inactivity.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12"
          >
            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold mb-4">How It Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary-500 font-bold">1</span>
                  </div>
                  <h4 className="font-medium mb-2">Enter Details</h4>
                  <p className="text-sm text-neutral-400">
                    Provide the website URL and describe what you want the AI to do
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-secondary-500/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-secondary-500 font-bold">2</span>
                  </div>
                  <h4 className="font-medium mb-2">AI Takes Control</h4>
                  <p className="text-sm text-neutral-400">
                    Our AI agent launches a real browser and follows your instructions
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-accent-500/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-accent-500 font-bold">3</span>
                  </div>
                  <h4 className="font-medium mb-2">Watch Live</h4>
                  <p className="text-sm text-neutral-400">
                    Get a live view link to watch the browser work in real-time
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BrowserAgentPage;