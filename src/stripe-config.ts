interface Product {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const products: Product[] = [
  // Individual Workflows - $20-$40
  {
    priceId: 'price_1RYX9PQqrelvc6fFzP2IQv9x',
    name: 'RAG Pipeline & Chatbot',
    description: 'Build a document-based Q&A system that can understand and answer questions from your uploaded documents. Perfect for creating knowledge bases, FAQ bots, and intelligent document search systems.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYX9nQqrelvc6fFxrL4SRcY',
    name: 'Customer Support Workflow',
    description: 'Automate your email support with intelligent classification and auto-response capabilities. Routes emails to the right department and drafts contextual responses using AI.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYXAAQqrelvc6fFdHwBC023',
    name: 'LinkedIn Content Creator',
    description: 'Generate engaging LinkedIn posts automatically by researching topics and creating professional content. Includes hashtag optimization and content scheduling capabilities.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYXAWQqrelvc6fFyXz0UYBN',
    name: 'Invoice Workflow',
    description: 'Extract data from PDF invoices and automatically populate Google Sheets. Includes email notifications and database updates for seamless invoice processing.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYXAxQqrelvc6fFaK6vr5xH',
    name: 'First AI Agent',
    description: 'Your introduction to AI agents with basic email, calendar, and contact management tools. Perfect for beginners looking to build their first autonomous assistant.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYXDSQqrelvc6fFdYjDno0Z',
    name: 'API Calls in n8n',
    description: 'Master API integrations with examples for OpenWeather, Perplexity, and Tavily. Includes authentication patterns and error handling best practices.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYXDqQqrelvc6fFXD5N73Jp',
    name: 'Perplexity Research',
    description: 'Automate web research tasks with structured data extraction and summarization. Perfect for market research and competitive analysis.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYXEBQqrelvc6fFJV4Wqsjw',
    name: 'Firecrawl Extract',
    description: 'Advanced web scraping templates for extracting structured data from websites. Includes pagination handling and data transformation.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYXEaQqrelvc6fFEhiFUBjb',
    name: 'Apify Integration',
    description: 'Extract business data from Google Maps and other platforms using Apify actors. Includes lead generation and competitor analysis workflows.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYXEwQqrelvc6fFcBwCyEIf',
    name: 'OpenAI Image Gen',
    description: 'Create marketing images and social media graphics using AI. Includes prompt engineering tips and batch processing capabilities.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYXFNQqrelvc6fFcnD5bpU0',
    name: 'Product Videos',
    description: 'Generate product videos from static images using Runway ML. Includes 360-degree rotation effects and professional transitions.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYXFtQqrelvc6fFbLlBOTGH',
    name: 'Prompt Chaining',
    description: 'Build multi-step AI workflows where each step refines the previous output. Perfect for complex content generation and analysis tasks.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYXGIQqrelvc6fF8i751vc3',
    name: 'Routing',
    description: 'Intelligently route emails and requests to specialized handlers based on content classification. Includes priority handling and escalation paths.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYXGfQqrelvc6fFVAoaAYA5',
    name: 'Parallelization',
    description: 'Run multiple AI analyses concurrently for faster processing. Includes emotion, intent, and bias detection running simultaneously.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYXH3Qqrelvc6fFwyWtZ4Dz',
    name: 'Evaluator-Optimizer',
    description: 'Create self-improving workflows that evaluate and optimize their own outputs. Perfect for content generation with quality assurance.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYXBnQqrelvc6fFAyFqbDoZ',
    name: 'RAG Workflow vs RAG Agent',
    description: 'Compare and implement two advanced approaches to document retrieval and question answering. Includes vector database setup and optimization techniques.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYXBQQqrelvc6fFYVsVS6CO',
    name: 'Technical Analyst Agent vs Workflow',
    description: 'Analyze stock charts with AI-powered insights. Includes MACD analysis, volume indicators, and automated chart generation with technical commentary.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYXC9Qqrelvc6fFS7dBHjGT',
    name: 'Supabase/Postgres',
    description: 'Implement vector databases with persistent memory for your AI agents. Includes chat history, context retention, and scalable storage solutions.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYXCUQqrelvc6fFR2RVSwDn',
    name: 'Multi-Agent Orchestrator',
    description: 'Coordinate multiple specialized AI agents to handle complex tasks. Includes email, calendar, contact, and content creation agents working in harmony.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYXCtQqrelvc6fFwFop8COe',
    name: 'HITL Example Flows',
    description: 'Implement human approval workflows with Telegram integration. Perfect for high-stakes automation where human oversight is required.',
    mode: 'payment'
  },

  // Bundle Products - $30-$350
  {
    priceId: 'price_1RYWzgQqrelvc6fFVONGQjBy',
    name: 'AI Agent Starter Pack',
    description: 'Build intelligent chatbots with document understanding using our RAG Pipeline & Chatbot workflow. Create your first autonomous AI assistant with email, calendar, and contacts integration. Set up automated email classification and response systems for customer support. Generate AI-powered social media content for LinkedIn. Automate document processing and data extraction for invoices and more.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYX7IQqrelvc6fFrmdbl55h',
    name: 'API Integration Templates',
    description: 'Connect to OpenWeather, Perplexity, and Tavily with our API Calls in n8n template. Automate web research with Perplexity Research workflows. Extract data from websites using Firecrawl Extract templates. Leverage advanced web automation with Apify actors integration. Create AI-generated images for marketing with OpenAI Image Generation workflows.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYX7lQqrelvc6fFiwaGIrjP',
    name: 'Marketing & Content Suite',
    description: 'Generate automated product photography and videos with our Product Videos workflow. Create AI-powered LinkedIn posts with integrated image generation. Build blog posts with web research using our Content Creator Agent. Distribute content across multiple platforms with Social Media Automation templates.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYX6oQqrelvc6fFoiPWHD6c',
    name: 'Advanced AI Architectures',
    description: 'Master complex workflows with specialized AI agents working together in our Multi-Agent Orchestrator. Implement advanced document retrieval with RAG Workflow vs RAG Agent comparisons. Analyze stock markets with chart generation using our Technical Analyst Agent. Build sequential AI processing for complex tasks with Prompt Chaining. Create intelligent request routing to specialized agents and implement concurrent AI processing for faster results with Parallelization patterns.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYX8tQqrelvc6fF10usHmt1',
    name: 'Complete Bundle',
    description: 'Get 20 advanced workflow templates with complete setup documentation for each workflow. Includes API credential guides, best practices documentation, and email support for 30 days. Save over $100 compared to buying individually.',
    mode: 'payment'
  },

  // Service Products - $50-$1500
  {
    priceId: 'price_1RYXLZQqrelvc6fFfuApb26b',
    name: 'API Credits Package',
    description: 'Jumpstart your workflows with $30 worth of API credits including $10 for OpenRouter, $10 for Tavily, and $10 for Perplexity. Also includes detailed setup guides for all APIs and best practices for credit management to maximize your usage.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYXKZQqrelvc6fFdhcLmm3M',
    name: 'Workflow Installation',
    description: 'Complete hands-on setup of any workflow in your n8n instance. Includes API credential configuration, thorough testing and troubleshooting, and a 30-minute training call to ensure you understand how to use and modify the workflow.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYXLEQqrelvc6fFzVCHcPgt',
    name: 'Custom Workflow Development',
    description: 'Get a workflow built specifically for your unique requirements. Includes requirements gathering session, custom workflow design and architecture, full implementation and testing, comprehensive documentation, and 30 days of post-delivery support.',
    mode: 'subscription'
  },
  {
    priceId: 'price_1RYXJtQqrelvc6fFVYVxxLqo',
    name: 'Enterprise Support',
    description: 'Get all workflows with full source code access and rights to modify. Includes custom workflow development with 2 new workflows created specifically for your needs each month. White-label options available for agencies. Priority email and video support with guaranteed 24-hour response time. Monthly team training sessions included with 2 hours of hands-on instruction.',
    mode: 'payment'
  },
  {
    priceId: 'price_1RYX8BQqrelvc6fFpmfVFUF0',
    name: 'Enterprise Workflows',
    description: 'Implement vector storage with persistent memory using Supabase/Postgres Integration. Create approval workflows with Telegram integration through Human-in-the-Loop patterns. Build complete email management systems with Gmail integration. Automate invoice processing and financial workflows for your billing department.',
    mode: 'payment'
  },

  // Subscription Products - $20-$200
  {
    priceId: 'price_1RYXIaQqrelvc6fFsWaE3YTV',
    name: 'Workflow Club Membership',
    description: 'Access all current workflows with new templates added monthly. Includes priority support, community access, and instant notifications when new workflows are released. Annual members save over 12% compared to monthly billing.',
    mode: 'subscription'
  },
  {
    priceId: 'price_1RYXJ9Qqrelvc6fF5KWqwhKj',
    name: 'Workflow Club Membership (Yearly)',
    description: 'Access all current workflows with new templates added monthly. Includes priority support, community access, and instant notifications when new workflows are released. Annual members save over 12% compared to monthly billing.',
    mode: 'subscription'
  }
];