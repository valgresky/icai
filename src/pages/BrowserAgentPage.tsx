import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Send,
  Minimize2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface BrowserSession {
  liveViewUrl: string;
  sessionId: string;
  windowId: string;
  result?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'system' | 'success' | 'error' | 'loading' | 'result';
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
  const [isIframeLoading, setIsIframeLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [browserViewHeight, setBrowserViewHeight] = useState(500);
  const [isTyping, setIsTyping] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

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
    }
  ];

  const messageTypes = {
    user: { icon: '👤', color: 'text-blue-400' },
    system: { icon: '🤖', color: 'text-gray-400' },
    success: { icon: '✅', color: 'text-green-400' },
    error: { icon: '❌', color: 'text-red-400' },
    loading: { icon: '⏳', color: 'text-yellow-400' },
    result: { icon: '📊', color: 'text-purple-400' }
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

  // Function to poll for results
  const pollForResults = async (sessionId: string) => {
    try {
      const pollUrl = `https://auto.owaiken.com/api/sessions/${sessionId}/result`;
      
      const checkResult = async () => {
        const response = await fetch(pollUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'completed' && data.result) {
          // Update session with result
          setSession(prev => prev ? {...prev, result: data.result} : null);
          
          // Add result message to chat
          setIsTyping(false);
          addMessage('result', data.result, '📊');
          return true;
        }
        
        return false;
      };
      
      // Poll every 5 seconds for up to 2 minutes
      let attempts = 0;
      const maxAttempts = 24; // 2 minutes
      
      const poll = async () => {
        if (attempts >= maxAttempts) {
          addMessage('system', 'Polling for results timed out. The task may still be processing.', '⏱️');
          return;
        }
        
        attempts++;
        const hasResult = await checkResult();
        
        if (!hasResult) {
          setTimeout(poll, 5000);
        }
      };
      
      // Start polling
      poll();
      
    } catch (error) {
      console.error('Error polling for results:', error);
      addMessage('error', 'Failed to retrieve results. Please try again.', '❌');
    }
  };

  const handleStartSession = async () => {
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
    setCurrentUrl(url);

    // Add initial user message
    addMessage('user', `Starting automation for ${new URL(url).hostname}...`);
    addMessage('system', `📍 URL: ${url}`);
    addMessage('system', `📝 Task: ${instructions}`);
    
    // Show typing indicator
    setIsTyping(true);
    addMessage('loading', 'Initializing browser session...');

    try {
      // Simulate progress updates with typing indicators
      setTimeout(() => {
        setIsTyping(false);
        addMessage('success', 'Browser session started');
        setIsTyping(true);
      }, 1000);
      
      setTimeout(() => {
        setIsTyping(false);
        addMessage('loading', 'Navigating to website...');
        setIsTyping(true);
      }, 2000);
      
      setTimeout(() => {
        setIsTyping(false);
        addMessage('success', 'Page loaded successfully');
        setIsTyping(true);
      }, 3500);
      
      setTimeout(() => {
        setIsTyping(false);
        addMessage('loading', 'Performing requested actions...');
      }, 4500);

      const sessionData = await startBrowserSession(url, instructions);
      setSession(sessionData);
      setSessionStartTime(new Date());
      setIsIframeLoading(true);
      
      setTimeout(() => {
        setIsTyping(false);
        addMessage('success', 'Task in progress!');
        addMessage('system', '🔗 Live browser view is now available');
        setShowBrowser(true);
        setIsIframeLoading(false);
        
        // Start polling for results
        if (sessionData && sessionData.sessionId) {
          pollForResults(sessionData.sessionId);
        }
      }, 6000);
      
    } catch (error) {
      setIsTyping(false);
      addMessage('error', 'Failed to start browser session. Please try again.');
      setSessionActive(false);
      console.error('Session error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleStartSession();
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim()) return;
    
    // Add user message to chat
    addMessage('user', userMessage);
    
    // Clear input
    setUserMessage('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      setIsTyping(false);
      addMessage('system', 'I\'m currently working on your task. You can see the progress in the browser view above. I\'ll provide a summary when the task is complete.');
    }, 1500);
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
    setCurrentUrl('');
    setIsTyping(false);
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
      setIsIframeLoading(true);
      iframeRef.current.src = iframeRef.current.src;
      setTimeout(() => setIsIframeLoading(false), 2000);
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

          {/* Desktop Container - Proper Vertical Stack */}
          <div className="desktop-container">
            {/* Top Section - Two Columns Side by Side */}
            <div className="top-section-wrapper">
              {/* Browser Session Form - Left Column */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="browser-session-card"
              >
                <div className="glass-panel p-6 h-full flex flex-col">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary-500" />
                    Browser Session
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6 flex-1">
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

                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2">
                        Instructions for AI Agent
                      </label>
                      <textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="Describe what you want the browser to do..."
                        rows={6}
                        className="glass-card w-full p-3 resize-none h-full"
                        disabled={isLoading || sessionActive}
                      />
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-error-DEFAULT text-sm p-3 bg-error-DEFAULT/10 rounded-lg">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}

                    {!sessionActive && (
                      <button
                        type="submit"
                        disabled={!url || !instructions || isLoading}
                        className="btn-primary w-full py-3 flex items-center justify-center gap-2"
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
                    )}

                    {/* Only show New Session button when session is active */}
                    {sessionActive && (
                      <button
                        type="button"
                        onClick={handleNewSession}
                        className="btn-ghost w-full py-3 flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-5 h-5" />
                        New Session
                      </button>
                    )}
                  </form>

                  {/* Quick Examples */}
                  {!sessionActive && (
                    <div className="mt-4 pt-4 border-t border-neutral-800">
                      <h3 className="text-sm font-medium mb-3 text-neutral-400">Quick Examples:</h3>
                      <div className="space-y-2">
                        {examples.slice(0, 2).map((example, index) => (
                          <button
                            key={index}
                            onClick={() => fillExample(example)}
                            className="text-left p-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors text-xs w-full"
                            disabled={isLoading}
                          >
                            <div className="font-medium text-primary-400 mb-1">
                              {new URL(example.url).hostname}
                            </div>
                            <div className="text-neutral-300 line-clamp-1">
                              {example.instructions}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Chat Interface - Right Column */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="browser-agent-card"
              >
                <div className="glass-panel p-6 h-full flex flex-col">
                  {/* Chat Header - Sticky */}
                  <div className="flex items-center justify-between mb-4 bg-background-secondary/50 backdrop-blur-sm -m-6 p-6 rounded-t-xl border-b border-neutral-800/50">
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
                  <div className="flex-1 overflow-y-auto space-y-3 px-1 mb-4">
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
                      <>
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-start gap-3 p-3 rounded-lg ${
                              message.type === 'user' 
                                ? 'bg-primary-500/10 border border-primary-500/20 ml-4' 
                                : message.type === 'result'
                                ? 'bg-secondary-500/10 border border-secondary-500/20 mr-4'
                                : 'bg-neutral-800/50 mr-4'
                            }`}
                          >
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                              message.type === 'result' 
                                ? 'bg-secondary-500/20 text-secondary-500'
                                : 'bg-neutral-700'
                            }`}>
                              {message.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm ${messageTypes[message.type]?.color || 'text-white'}`}>
                                {message.content}
                              </div>
                              <div className="text-xs text-neutral-500 mt-1">
                                {message.timestamp.toLocaleTimeString()}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        
                        {/* Typing Indicator */}
                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-3 p-3 rounded-lg bg-neutral-800/50 mr-4"
                          >
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center text-xs">
                              🤖
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                              </div>
                              <span className="text-sm text-neutral-400 ml-2">AI is thinking...</span>
                            </div>
                          </motion.div>
                        )}
                      </>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Chat Input */}
                  {sessionActive && (
                    <form onSubmit={handleChatSubmit} className="mt-auto">
                      <div className="relative">
                        <input
                          ref={chatInputRef}
                          type="text"
                          value={userMessage}
                          onChange={(e) => setUserMessage(e.target.value)}
                          placeholder="Ask a question about the task..."
                          className="glass-card w-full pl-4 pr-12 py-3 rounded-full"
                        />
                        <button
                          type="submit"
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-500 text-white rounded-full"
                          disabled={!userMessage.trim()}
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Browser Window - Full Width Below Top Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="browser-window-wrapper"
            >
              <div 
                className="browser-view-container"
                style={{ 
                  height: isMinimized ? '60px' : `${browserViewHeight}px`,
                  transition: 'height 0.3s ease'
                }}
              >
                <div className="h-full flex flex-col">
                  {/* Mock Browser Toolbar */}
                  <div className="browser-toolbar bg-neutral-900 rounded-t-lg p-3 flex items-center justify-between border-b border-neutral-800">
                    <div className="flex items-center gap-4">
                      {/* Traffic Lights */}
                      <div className="traffic-lights flex items-center gap-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                        <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      </div>
                      
                      {/* Session Status */}
                      <div className="session-status flex items-center gap-2">
                        {sessionActive ? (
                          <>
                            <span className="status-dot active w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="status-text text-sm text-green-400">Session Active</span>
                          </>
                        ) : (
                          <span className="status-text text-sm text-neutral-400">No active session</span>
                        )}
                      </div>
                      
                      {/* URL Bar */}
                      <div className="url-bar flex-1 max-w-md bg-neutral-800 rounded-md px-3 py-1 text-sm text-neutral-300">
                        {currentUrl || 'No active session'}
                      </div>
                    </div>
                    
                    {/* Browser Actions */}
                    <div className="browser-actions flex items-center gap-2">
                      {session && (
                        <>
                          <button
                            onClick={refreshIframe}
                            className="p-2 hover:bg-neutral-800 rounded-md transition-colors"
                            title="Refresh"
                          >
                            <RefreshCw className="w-4 h-4 text-neutral-400" />
                          </button>
                          <button
                            onClick={() => window.open(session.liveViewUrl, '_blank')}
                            className="p-2 hover:bg-neutral-800 rounded-md transition-colors"
                            title="Open in new tab"
                          >
                            <ExternalLink className="w-4 h-4 text-neutral-400" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-2 hover:bg-neutral-800 rounded-md transition-colors"
                        title={isMinimized ? "Expand" : "Minimize"}
                      >
                        {isMinimized ? (
                          <ChevronUp className="w-4 h-4 text-neutral-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-neutral-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Browser Content */}
                  {!isMinimized && (
                    <div className="flex-1 bg-neutral-900 rounded-b-lg overflow-hidden relative">
                      {!sessionActive ? (
                        /* No Session State - Show Start Button */
                        <div className="browser-content flex flex-col items-center justify-center h-full text-center p-8">
                          <div className="no-session-container">
                            <div className="globe-icon mb-6">
                              <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center mx-auto">
                                <Globe className="w-10 h-10 text-neutral-600" />
                              </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No Active Browser Session</h3>
                            <p className="text-neutral-400 mb-6">
                              Start a browser session to see the live view here
                            </p>
                            
                            <button 
                              className="start-session-btn bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/40"
                              onClick={handleStartSession}
                              disabled={!url || !instructions || isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <Loader className="w-5 h-5 animate-spin" />
                                  Starting...
                                </>
                              ) : (
                                <>
                                  <span className="btn-icon">▶</span>
                                  Start Session
                                </>
                              )}
                            </button>
                            
                            <p className="hint-text text-sm text-neutral-500 mt-4">
                              This area will show a real-time view of the browser once a session begins
                            </p>
                          </div>
                        </div>
                      ) : isLoading ? (
                        /* Loading State */
                        <div className="browser-content flex flex-col items-center justify-center h-full text-center">
                          <div className="session-loading">
                            <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4"></div>
                            <h3 className="text-xl font-semibold mb-2">Starting Browser Session...</h3>
                            <p className="text-neutral-400">Initializing automated browser</p>
                          </div>
                        </div>
                      ) : showBrowser ? (
                        /* Active Session with Browser View */
                        <>
                          {/* Loading Skeleton */}
                          {isIframeLoading && (
                            <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                              <div className="browser-loading">
                                <div className="w-full h-full bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 animate-pulse rounded-lg"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="flex items-center gap-3">
                                    <Loader className="w-6 h-6 animate-spin text-primary-500" />
                                    <span className="text-neutral-300">Loading browser view...</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Iframe */}
                          <iframe
                            ref={iframeRef}
                            src={session?.liveViewUrl}
                            className="browser-iframe w-full h-full border-0"
                            title="Live Browser View"
                            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                            onLoad={() => setIsIframeLoading(false)}
                          />
                          
                          {/* Session Info Overlay */}
                          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-xs font-mono">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                              <span className="text-red-400">LIVE</span>
                            </div>
                            <div className="text-neutral-400">
                              Session: {session?.sessionId.slice(0, 8)}...
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Session Ready - Show Browser Button */
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <div className="w-20 h-20 rounded-full bg-accent-500/20 flex items-center justify-center mb-6">
                            <Eye className="w-10 h-10 text-accent-500" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">Browser Session Ready</h3>
                          <p className="text-neutral-400 mb-4">
                            Your browser session is active and ready to view
                          </p>
                          <button
                            onClick={() => setShowBrowser(true)}
                            className="btn-primary px-6 py-3 flex items-center gap-2"
                          >
                            <Eye className="w-5 h-5" />
                            Show Live Browser
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

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
                  <h4 className="font-medium mb-2">Get Results</h4>
                  <p className="text-sm text-neutral-400">
                    Receive a detailed summary of findings and actions taken by the AI
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        /* Desktop Layout - Proper Vertical Stack */
        .desktop-container {
          display: flex;
          flex-direction: column;
          gap: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .top-section-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .browser-session-card,
        .browser-agent-card {
          min-height: fit-content;
          height: auto;
        }

        .browser-window-wrapper {
          width: 100%;
        }

        .browser-view-container {
          position: relative;
          width: 100%;
          background: #1a1a1a;
          border-radius: 12px;
          padding: 0;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          overflow: hidden;
        }

        .browser-iframe {
          background: #000;
          border-radius: 0 0 8px 8px;
        }

        .browser-loading::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .status-dot.active {
          animation: pulse 2s infinite;
        }

        .start-session-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .start-session-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }

        /* Mobile Layout - Stack Vertically */
        @media (max-width: 1024px) {
          .desktop-container {
            gap: 20px;
          }
          
          .top-section-wrapper {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .browser-view-container {
            height: 400px !important;
          }
        }

        @media (max-width: 768px) {
          .desktop-container {
            gap: 16px;
          }
          
          .browser-view-container {
            height: 300px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BrowserAgentPage;