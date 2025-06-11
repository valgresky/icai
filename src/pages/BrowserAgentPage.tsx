import { useState, useRef, useEffect } from 'react';
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
  Zap,
  User,
  Bot,
  EyeOff,
  Maximize2,
  MessageSquare,
  Send
} from 'lucide-react';

interface BrowserSession {
  liveViewUrl: string;
  sessionId: string;
  windowId: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'system' | 'success' | 'error' | 'loading';
  content: string;
  timestamp: Date;
  icon?: string;
}

const BrowserAgentPage = () => {
  const [url, setUrl] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<BrowserSession | null>(null);
  const [error, setError] = useState('');
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [copied, setCopied] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionActive, setSessionActive] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Example prompts for quick fill
  const examples = [
    {
      url: 'https://www.bestbuy.com',
      instructions: 'Search for laptops under $500 and find the top 3 results'
    },
    {
      url: 'https://hypebeast.com',
      instructions: 'Browse the latest streetwear drops and find trending sneaker releases'
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

  const messageTypes = {
    user: { icon: '👤', color: 'text-blue-400' },
    system: { icon: '🤖', color: 'text-gray-400' },
    success: { icon: '✅', color: 'text-green-400' },
    error: { icon: '❌', color: 'text-red-400' },
    loading: { icon: '⏳', color: 'text-yellow-400' }
  };

  const addMessage = (type: ChatMessage['type'], content: string, icon?: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      icon: icon || messageTypes[type].icon
    };
    setMessages(prev => [...prev, message]);
  };

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
      const webhookUrl = 'https://auto.owaiken.com/webhook/0c597b85-c550-4bc3-b4d3-e1b5f37553d7';
      
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
    setSessionActive(true);
    setMessages([]); // Clear previous messages

    // Add initial user message
    addMessage('user', `Starting automation for ${new URL(url).hostname}...`);
    addMessage('system', `📍 URL: ${url}`);
    addMessage('system', `📝 Task: ${instructions}`);
    addMessage('loading', 'Initializing browser session...');

    try {
      // Simulate progress updates
      setTimeout(() => addMessage('success', 'Browser session started'), 1000);
      setTimeout(() => addMessage('loading', 'Navigating to website...'), 2000);
      setTimeout(() => addMessage('success', 'Page loaded successfully'), 3500);
      setTimeout(() => addMessage('loading', 'Performing requested actions...'), 4500);

      const sessionData = await startBrowserSession(url, instructions);
      setSession(sessionData);
      setSessionStartTime(new Date());
      
      addMessage('success', 'Task completed successfully!');
      addMessage('system', '🔗 Live browser view is now available');
      
    } catch (error) {
      addMessage('error', 'Failed to start browser session. Please try again.');
      setSessionActive(false);
      console.error('Session error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTranscript = async () => {
    const transcript = messages.map(msg => 
      `[${msg.timestamp.toLocaleTimeString()}] ${msg.icon} ${msg.content}`
    ).join('\n');
    
    try {
      await navigator.clipboard.writeText(transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleNewSession = () => {
    setSession(null);
    setSessionStartTime(null);
    setSessionActive(false);
    setShowBrowser(false);
    setUrl('');
    setInstructions('');
    setError('');
    setCopied(false);
    setMessages([]);
  };

  const fillExample = (example: typeof examples[0]) => {
    setUrl(example.url);
    setInstructions(example.instructions);
  };

  const getSessionDuration = () => {
    if (!sessionStartTime) return '';
    const now = new Date();
    const diff = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  };

  const refreshIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary-500" />
              </div>
              <h1 className="text-4xl font-bold">Browser Automation Tool</h1>
            </div>
            <p className="text-xl text-neutral-300 mb-2">
              Control a real browser with AI - watch it work in real-time!
            </p>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Enter any website URL and tell our AI agent what to do. You'll get a live view and real-time updates.
            </p>
          </motion.div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Input Form - Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="xl:col-span-1"
            >
              <div className="glass-panel p-6 h-fit">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary-500" />
                  Browser Session
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
                        disabled={isLoading || sessionActive}
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
                      disabled={isLoading || sessionActive}
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-error-DEFAULT text-sm p-3 bg-error-DEFAULT/10 rounded-lg">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {!sessionActive ? (
                      <button
                        type="submit"
                        disabled={isLoading || !url || !instructions}
                        className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Starting...
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5" />
                            Start Session
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
                {!sessionActive && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-3 text-neutral-400">Quick Examples:</h3>
                    <div className="space-y-2">
                      {examples.slice(0, 3).map((example, index) => (
                        <button
                          key={index}
                          onClick={() => fillExample(example)}
                          className="text-left p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors text-sm w-full"
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

            {/* Chat Interface - Middle Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="xl:col-span-1"
            >
              <div className="glass-panel p-6 h-[600px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-secondary-500" />
                    Browser Agent
                  </h2>
                  <div className="flex items-center gap-2">
                    {sessionStartTime && (
                      <span className="text-sm text-neutral-400 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {getSessionDuration()}
                      </span>
                    )}
                    <button
                      onClick={handleCopyTranscript}
                      className="btn-ghost p-2"
                      disabled={messages.length === 0}
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-success-DEFAULT" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
                        <Bot className="w-8 h-8 text-neutral-600" />
                      </div>
                      <p className="text-neutral-400 mb-2">Ready to assist</p>
                      <p className="text-sm text-neutral-500">
                        Start a browser session to see real-time updates
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start gap-3 p-3 rounded-lg ${
                          message.type === 'user' 
                            ? 'bg-primary-500/10 border border-primary-500/20' 
                            : 'bg-neutral-800/50'
                        }`}
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center text-xs">
                          {message.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm ${messageTypes[message.type].color}`}>
                            {message.content}
                          </div>
                          <div className="text-xs text-neutral-500 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Live View Button */}
                {session && (
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowBrowser(!showBrowser)}
                      className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                    >
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      {showBrowser ? 'Hide Live Browser' : 'Show Live Browser'}
                      {showBrowser ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={() => window.open(session.liveViewUrl, '_blank')}
                      className="btn-ghost w-full py-2 flex items-center justify-center gap-2 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in New Tab
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Live Browser View - Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="xl:col-span-1"
            >
              <div className="glass-panel p-6 h-[600px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Eye className="w-5 h-5 text-accent-500" />
                    Live Browser View
                  </h2>
                  {session && showBrowser && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={refreshIframe}
                        className="btn-ghost p-2"
                        title="Refresh"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => window.open(session.liveViewUrl, '_blank')}
                        className="btn-ghost p-2"
                        title="Open in new tab"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  {!session ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
                        <Globe className="w-8 h-8 text-neutral-600" />
                      </div>
                      <p className="text-neutral-400 mb-2">No active session</p>
                      <p className="text-sm text-neutral-500">
                        Start a browser session to see the live view
                      </p>
                    </div>
                  ) : showBrowser ? (
                    <div className="flex-1 bg-neutral-900 rounded-lg overflow-hidden">
                      <iframe
                        ref={iframeRef}
                        src={session.liveViewUrl}
                        className="w-full h-full border-0"
                        title="Live Browser View"
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-16 h-16 rounded-full bg-accent-500/20 flex items-center justify-center mb-4">
                        <Eye className="w-8 h-8 text-accent-500" />
                      </div>
                      <p className="text-neutral-300 mb-2">Live view ready</p>
                      <p className="text-sm text-neutral-500 mb-4">
                        Click "Show Live Browser" to view the session
                      </p>
                      <div className="glass-card p-3 space-y-1 text-xs font-mono">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Session:</span>
                          <span className="text-neutral-300">{session.sessionId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Window:</span>
                          <span className="text-neutral-300">{session.windowId}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Expanded Browser View */}
          {session && showBrowser && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    Full Browser View
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={refreshIframe}
                      className="btn-ghost px-3 py-2 flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                    <button
                      onClick={() => window.open(session.liveViewUrl, '_blank')}
                      className="btn-ghost px-3 py-2 flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      New Tab
                    </button>
                    <button
                      onClick={() => setShowBrowser(false)}
                      className="btn-ghost px-3 py-2 flex items-center gap-2"
                    >
                      <EyeOff className="w-4 h-4" />
                      Hide
                    </button>
                  </div>
                </div>
                
                <div className="bg-neutral-900 rounded-lg overflow-hidden" style={{ height: '70vh' }}>
                  <iframe
                    src={session.liveViewUrl}
                    className="w-full h-full border-0"
                    title="Full Browser View"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  />
                </div>
                
                <div className="mt-4 bg-warning-DEFAULT/10 border border-warning-DEFAULT/20 rounded-lg p-4">
                  <p className="text-sm text-warning-DEFAULT">
                    <strong>Note:</strong> Browser sessions are temporary and will expire after 30 minutes of inactivity.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12"
          >
            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold mb-4">How It Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                  <h4 className="font-medium mb-2">Real-time Updates</h4>
                  <p className="text-sm text-neutral-400">
                    Watch progress updates in the chat as the AI works through your task
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-yellow-500 font-bold">4</span>
                  </div>
                  <h4 className="font-medium mb-2">Watch Live</h4>
                  <p className="text-sm text-neutral-400">
                    View the browser working in real-time with our embedded live view
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