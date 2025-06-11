interface Workflow {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number | null;
  rating: number;
  downloads: number;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  tags: string[];
  featured: boolean;
  code?: string;
  stripeProductId?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

interface Testimonial {
  id: string;
  content: string;
  author: string;
  company: string;
  rating: number;
  avatarUrl?: string;
}

export const workflows = [
  {
    id: "rag-pipeline",
    title: "RAG Pipeline & Chatbot",
    description: "Build a document-based Q&A system that can understand and answer questions from your uploaded documents. Perfect for creating knowledge bases, FAQ bots, and intelligent document search systems.",
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
    price: 20,
    rating: 4.9,
    downloads: 328,
    category: "AI",
    author: {
      name: "AI Solutions Team",
      avatar: "https://randomuser.me/api/portraits/men/11.jpg"
    },
    createdAt: "2024-04-02",
    tags: ["RAG", "chatbot", "AI", "document-processing"],
    featured: true,
    stripeProductId: "price_1RYX9PQqrelvc6fFzP2IQv9x"
  },
  {
    id: "customer-support",
    title: "Customer Support Workflow",
    description: "Automate your email support with intelligent classification and auto-response capabilities. Routes emails to the right department and drafts contextual responses using AI.",
    image: "https://images.pexels.com/photos/8566472/pexels-photo-8566472.jpeg",
    price: 20,
    rating: 4.8,
    downloads: 245,
    category: "Support",
    author: {
      name: "Support Automation Team",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg"
    },
    createdAt: "2024-04-02",
    tags: ["customer-support", "email", "automation", "AI"],
    featured: true,
    stripeProductId: "price_1RYX9nQqrelvc6fFxrL4SRcY"
  },
  {
    id: "linkedin-content",
    title: "LinkedIn Content Creator",
    description: "Generate engaging LinkedIn posts automatically by researching topics and creating professional content. Includes hashtag optimization and content scheduling capabilities.",
    image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
    price: 20,
    rating: 4.7,
    downloads: 189,
    category: "Marketing",
    author: {
      name: "Social Media Team",
      avatar: "https://randomuser.me/api/portraits/women/14.jpg"
    },
    createdAt: "2024-04-02",
    tags: ["linkedin", "content", "social-media", "automation"],
    featured: false,
    stripeProductId: "price_1RYXAAQqrelvc6fFdHwBC023"
  },
  {
    id: "invoice-workflow",
    title: "Invoice Workflow",
    description: "Extract data from PDF invoices and automatically populate Google Sheets. Includes email notifications and database updates for seamless invoice processing.",
    image: "https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg",
    price: 20,
    rating: 4.6,
    downloads: 167,
    category: "Finance",
    author: {
      name: "Finance Automation Team",
      avatar: "https://randomuser.me/api/portraits/men/15.jpg"
    },
    createdAt: "2024-04-02",
    tags: ["invoice", "pdf", "automation", "finance"],
    featured: false,
    stripeProductId: "price_1RYXAWQqrelvc6fFyXz0UYBN"
  },
  {
    id: "first-ai-agent",
    title: "First AI Agent",
    description: "Your introduction to AI agents with basic email, calendar, and contact management tools. Perfect for beginners looking to build their first autonomous assistant.",
    image: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg",
    price: 20,
    rating: 4.8,
    downloads: 312,
    category: "AI",
    author: {
      name: "AI Education Team",
      avatar: "https://randomuser.me/api/portraits/men/21.jpg"
    },
    createdAt: "2024-04-02",
    tags: ["AI", "tutorial", "beginner", "agent"],
    featured: false,
    stripeProductId: "price_1RYXAxQqrelvc6fFaK6vr5xH"
  },
  {
    id: "api-calls",
    title: "API Calls in n8n",
    description: "Master API integrations with examples for OpenWeather, Perplexity, and Tavily. Includes authentication patterns and error handling best practices.",
    image: "https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg",
    price: 30,
    rating: 4.7,
    downloads: 156,
    category: "Integration",
    author: {
      name: "Integration Team",
      avatar: "https://randomuser.me/api/portraits/men/13.jpg"
    },
    createdAt: "2024-04-02",
    tags: ["api", "integration", "http", "weather"],
    featured: false,
    stripeProductId: "price_1RYXDSQqrelvc6fFdYjDno0Z"
  },
  {
    id: "research-perplexity",
    title: "Perplexity Research",
    description: "Automate web research tasks with structured data extraction and summarization. Perfect for market research and competitive analysis.",
    image: "https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg",
    price: 30,
    rating: 4.6,
    downloads: 134,
    category: "AI",
    author: {
      name: "Research Team",
      avatar: "https://randomuser.me/api/portraits/women/14.jpg"
    },
    createdAt: "2024-04-02",
    tags: ["research", "AI", "perplexity", "content"],
    featured: false,
    stripeProductId: "price_1RYXDqQqrelvc6fFXD5N73Jp"
  },
  {
    id: "firecrawl-extract",
    title: "Firecrawl Extract",
    description: "Advanced web scraping templates for extracting structured data from websites. Includes pagination handling and data transformation.",
    image: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg",
    price: 30,
    rating: 4.8,
    downloads: 189,
    category: "Integration",
    author: {
      name: "Web Scraping Team",
      avatar: "https://randomuser.me/api/portraits/men/15.jpg"
    },
    createdAt: "2024-04-02",
    tags: ["web-scraping", "extraction", "automation"],
    featured: false,
    stripeProductId: "price_1RYXEBQqrelvc6fFJV4Wqsjw"
  },
  {
    id: "apify-maps",
    title: "Apify Integration",
    description: "Extract business data from Google Maps and other platforms using Apify actors. Includes lead generation and competitor analysis workflows.",
    image: "https://images.pexels.com/photos/87009/earth-global-communications-computer-87009.jpeg",
    price: 30,
    rating: 4.7,
    downloads: 167,
    category: "Integration",
    author: {
      name: "Location Data Team",
      avatar: "https://randomuser.me/api/portraits/women/16.jpg"
    },
    createdAt: "2024-04-02",
    tags: ["google-maps", "location-data", "apify"],
    featured: false,
    stripeProductId: "price_1RYXEaQqrelvc6fFEhiFUBjb"
  },
  {
    id: "openai-linkedin",
    title: "OpenAI Image Gen",
    description: "Create marketing images and social media graphics using AI. Includes prompt engineering tips and batch processing capabilities.",
    image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
    price: 30,
    rating: 4.9,
    downloads: 278,
    category: "AI",
    author: {
      name: "Social Media Team",
      avatar: "https://randomuser.me/api/portraits/men/17.jpg"
    },
    createdAt: "2024-04-02",
    tags: ["openai", "linkedin", "social-media", "image-generation"],
    featured: true,
    stripeProductId: "price_1RYXEwQqrelvc6fFcBwCyEIf"
  },
  {
    id: "product-videos",
    title: "Product Videos",
    description: "Generate product videos from static images using Runway ML. Includes 360-degree rotation effects and professional transitions.",
    image: "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg",
    price: 30,
    rating: 4.8,
    downloads: 198,
    category: "AI",
    author: {
      name: "Video Production Team",
      avatar: "https://randomuser.me/api/portraits/women/18.jpg"
    },
    createdAt: "2024-04-02",
    tags: ["video", "product", "AI", "marketing"],
    featured: false,
    stripeProductId: "price_1RYXFNQqrelvc6fFcnD5bpU0"
  },
  {
    id: "prompt-chaining",
    title: "Prompt Chaining",
    description: "Build multi-step AI workflows where each step refines the previous output. Perfect for complex content generation and analysis tasks.",
    image: "https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg",
    price: 30,
    rating: 4.7,
    downloads: 156,
    category: "AI",
    author: {
      name: "Content AI Team",
      avatar: "https://randomuser.me/api/portraits/women/24.jpg"
    },
    createdAt: "2024-04-02",
    tags: ["prompt-engineering", "content", "AI", "automation"],
    featured: false,
    stripeProductId: "price_1RYXFtQqrelvc6fFbLlBOTGH"
  },
  {
    id: "routing",
    title: "Routing",
    description: "Intelligently route emails and requests to specialized handlers based on content classification. Includes priority handling and escalation paths.",
    image: "https://images.pexels.com/photos/193003/pexels-photo-193003.jpeg",
    price: 35,
    rating: 4.8,
    downloads: 178,
    category: "Support",
    author: {
      name: "Email Automation Team",
      avatar: "https://randomuser.me/api/portraits/men/25.jpg"
    },
    createdAt: "2024-04-02",
    tags: ["email", "automation", "AI", "support"],
    featured: false,
    stripeProductId: "price_1RYXGIQqrelvc6fF8i751vc3"
  },
  {
    id: "parallelization",
    title: "Parallelization",
    description: "Run multiple AI analyses concurrently for faster processing. Includes emotion, intent, and bias detection running simultaneously.",
    image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg",
    price: 35,
    rating: 4.6,
    downloads: 145,
    category: "AI",
    author: {
      name: "Text Analysis Team",
      avatar: "https://randomuser.me/api/portraits/women/26.jpg"
    },
    createdAt: "2024-04-02",
    tags: ["text-analysis", "AI", "parallel-processing"],
    featured: false,
    stripeProductId: "price_1RYXGfQqrelvc6fFVAoaAYA5"
  },
  {
    id: "evaluator-optimizer",
    title: "Evaluator-Optimizer",
    description: "Create self-improving workflows that evaluate and optimize their own outputs. Perfect for content generation with quality assurance.",
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
    price: 35,
    rating: 4.7,
    downloads: 167,
    category: "AI",
    author: {
      name: "Quality Assurance Team",
      avatar: "https://randomuser.me/api/portraits/men/27.jpg"
    },
    createdAt: "2024-04-02",
    tags: ["optimization", "quality", "AI", "evaluation"],
    featured: false,
    stripeProductId: "price_1RYXH3Qqrelvc6fFwyWtZ4Dz"
  },
  {
    id: "rag-comparison",
    title: "RAG Workflow vs RAG Agent",
    description: "Compare and implement two advanced approaches to document retrieval and question answering. Includes vector database setup and optimization techniques.",
    image: "https://images.pexels.com/photos/7376/startup-photos.jpg",
    price: 40,
    rating: 4.7,
    downloads: 145,
    category: "AI",
    author: {
      name: "AI Architecture Team",
      avatar: "https://randomuser.me/api/portraits/men/19.jpg"
    },
    createdAt: "2024-04-02",
    tags: ["RAG", "architecture", "AI", "comparison"],
    featured: false,
    stripeProductId: "price_1RYXBnQqrelvc6fFAyFqbDoZ"
  },
  {
    id: "technical-analyst",
    title: "Technical Analyst Agent vs Workflow",
    description: "Analyze stock charts with AI-powered insights. Includes MACD analysis, volume indicators, and automated chart generation with technical commentary.",
    image: "https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg",
    price: 40,
    rating: 4.9,
    downloads: 234,
    category: "Finance",
    author: {
      name: "Financial AI Team",
      avatar: "https://randomuser.me/api/portraits/women/20.jpg"
    },
    createdAt: "2024-04-02",
    tags: ["finance", "technical-analysis", "AI", "stocks"],
    featured: true,
    stripeProductId: "price_1RYXBQQqrelvc6fFYVsVS6CO"
  },
  {
    id: "supabase-postgres",
    title: "Supabase/Postgres",
    description: "Implement vector databases with persistent memory for your AI agents. Includes chat history, context retention, and scalable storage solutions.",
    image: "https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg",
    price: 40,
    rating: 4.7,
    downloads: 167,
    category: "Integration",
    author: {
      name: "Database Team",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg"
    },
    createdAt: "2024-04-02",
    tags: ["supabase", "postgres", "database", "integration"],
    featured: false,
    stripeProductId: "price_1RYXC9Qqrelvc6fFS7dBHjGT"
  },
  {
    id: "multi-agent-orchestrator",
    title: "Multi-Agent Orchestrator",
    description: "Coordinate multiple specialized AI agents to handle complex tasks. Includes email, calendar, contact, and content creation agents working in harmony.",
    image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
    price: 40,
    rating: 4.8,
    downloads: 189,
    category: "AI",
    author: {
      name: "Architecture Team",
      avatar: "https://randomuser.me/api/portraits/men/23.jpg"
    },
    createdAt: "2024-04-02",
    tags: ["architecture", "AI", "orchestration", "scalability"],
    featured: false,
    stripeProductId: "price_1RYXCUQqrelvc6fFR2RVSwDn"
  },
  {
    id: "hitl-flows",
    title: "HITL Example Flows",
    description: "Implement human approval workflows with Telegram integration. Perfect for high-stakes automation where human oversight is required.",
    image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg",
    price: 40,
    rating: 4.6,
    downloads: 123,
    category: "Support",
    author: {
      name: "Human-AI Team",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg"
    },
    createdAt: "2024-04-02",
    tags: ["human-in-loop", "approval", "telegram", "oversight"],
    featured: false,
    stripeProductId: "price_1RYXCtQqrelvc6fFwFop8COe"
  }
];

export const categories: Category[] = [
  {
    id: "ai",
    name: "AI",
    description: "Artificial Intelligence and machine learning workflows",
    icon: "Cpu",
    count: workflows.filter(w => w.category === "AI").length
  },
  {
    id: "support",
    name: "Support",
    description: "Customer support and service automation",
    icon: "LifeBuoy",
    count: workflows.filter(w => w.category === "Support").length
  },
  {
    id: "integration",
    name: "Integration",
    description: "Connect and automate different services",
    icon: "Plug",
    count: workflows.filter(w => w.category === "Integration").length
  },
  {
    id: "finance",
    name: "Finance",
    description: "Financial analysis and automation tools",
    icon: "DollarSign",
    count: workflows.filter(w => w.category === "Finance").length
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Streamline your marketing campaigns and analytics",
    icon: "Megaphone",
    count: workflows.filter(w => w.category === "Marketing").length
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    content: "This marketplace has transformed how we handle our automation needs. The workflows are top-notch!",
    author: "Sarah Johnson",
    company: "TechCorp",
    rating: 5,
    avatarUrl: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: "2",
    content: "The quality and variety of workflows available here is impressive. Saved us countless hours of work.",
    author: "Michael Chen",
    company: "DataFlow Inc",
    rating: 5,
    avatarUrl: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: "3",
    content: "Excellent platform for finding and sharing automation workflows. The community is incredibly helpful.",
    author: "Emily Rodriguez",
    company: "AutomateNow",
    rating: 4,
    avatarUrl: "https://randomuser.me/api/portraits/women/3.jpg"
  }
];

export const filterOptions = [
  {
    id: 'category',
    name: 'Categories',
    options: [
      { id: 'all', label: 'All' },
      { id: 'ai', label: 'AI' },
      { id: 'support', label: 'Support' },
      { id: 'integration', label: 'Integration' },
      { id: 'finance', label: 'Finance' },
      { id: 'marketing', label: 'Marketing' }
    ]
  },
  {
    id: 'price',
    name: 'Price Range',
    options: [
      { id: 'all', label: 'All' },
      { id: 'free', label: 'Free' },
      { id: 'under25', label: 'Under $25' },
      { id: '25to50', label: '$25 to $50' },
      { id: '50to100', label: '$50 to $100' },
      { id: 'over100', label: 'Over $100' }
    ]
  },
  {
    id: 'rating',
    name: 'Rating',
    options: [
      { id: 'all', label: 'All' },
      { id: '4plus', label: '4+ Stars' },
      { id: '3plus', label: '3+ Stars' },
      { id: '2plus', label: '2+ Stars' }
    ]
  },
  {
    id: 'sort',
    name: 'Sort By',
    options: [
      { id: 'popular', label: 'Most Popular' },
      { id: 'newest', label: 'Newest' },
      { id: 'price-low', label: 'Price: Low to High' },
      { id: 'price-high', label: 'Price: High to Low' },
      { id: 'rating', label: 'Rating' }
    ]
  }
];