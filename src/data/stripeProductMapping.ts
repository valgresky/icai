// Mapping of our workflow names to Stripe price IDs
// This ensures our site items are properly connected to Stripe products

export const stripeProductMapping: Record<string, string> = {
  // Individual Workflows - $20-$40
  'RAG Pipeline & Chatbot': 'price_1RYX9PQqrelvc6fFzP2IQv9x',
  'Customer Support Workflow': 'price_1RYX9nQqrelvc6fFxrL4SRcY',
  'LinkedIn Content Creator': 'price_1RYXAAQqrelvc6fFdHwBC023',
  'Invoice Workflow': 'price_1RYXAWQqrelvc6fFyXz0UYBN',
  'First AI Agent': 'price_1RYXAxQqrelvc6fFaK6vr5xH',
  'API Calls in n8n': 'price_1RYXDSQqrelvc6fFdYjDno0Z',
  'Perplexity Research': 'price_1RYXDqQqrelvc6fFXD5N73Jp',
  'Firecrawl Extract': 'price_1RYXEBQqrelvc6fFJV4Wqsjw',
  'Apify Integration': 'price_1RYXEaQqrelvc6fFEhiFUBjb',
  'OpenAI Image Gen': 'price_1RYXEwQqrelvc6fFcBwCyEIf',
  'Product Videos': 'price_1RYXFNQqrelvc6fFcnD5bpU0',
  'Prompt Chaining': 'price_1RYXFtQqrelvc6fFbLlBOTGH',
  'Routing': 'price_1RYXGIQqrelvc6fF8i751vc3',
  'Parallelization': 'price_1RYXGfQqrelvc6fFVAoaAYA5',
  'Evaluator-Optimizer': 'price_1RYXH3Qqrelvc6fFwyWtZ4Dz',
  'RAG Workflow vs RAG Agent': 'price_1RYXBnQqrelvc6fFAyFqbDoZ',
  'Technical Analyst Agent vs Workflow': 'price_1RYXBQQqrelvc6fFYVsVS6CO',
  'Supabase/Postgres': 'price_1RYXC9Qqrelvc6fFS7dBHjGT',
  'Multi-Agent Orchestrator': 'price_1RYXCUQqrelvc6fFR2RVSwDn',
  'HITL Example Flows': 'price_1RYXCtQqrelvc6fFwFop8COe',

  // Bundle Products - $30-$350
  'AI Agent Starter Pack': 'price_1RYWzgQqrelvc6fFVONGQjBy',
  'API Integration Templates': 'price_1RYX7IQqrelvc6fFrmdbl55h',
  'Marketing & Content Suite': 'price_1RYX7lQqrelvc6fFiwaGIrjP',
  'Advanced AI Architectures': 'price_1RYX6oQqrelvc6fFoiPWHD6c',
  'Complete Bundle': 'price_1RYX8tQqrelvc6fF10usHmt1',

  // Service Products - $50-$1500
  'API Credits Package': 'price_1RYXLZQqrelvc6fFfuApb26b',
  'Workflow Installation': 'price_1RYXKZQqrelvc6fFdhcLmm3M',
  'Custom Workflow Development': 'price_1RYXLEQqrelvc6fFzVCHcPgt',
  'Enterprise Support': 'price_1RYXJtQqrelvc6fFVYVxxLqo',
  'Enterprise Workflows': 'price_1RYX8BQqrelvc6fFpmfVFUF0',

  // Subscription Products - $20-$200
  'Workflow Club Membership': 'price_1RYXIaQqrelvc6fFsWaE3YTV',
  'Workflow Club Membership (Yearly)': 'price_1RYXJ9Qqrelvc6fF5KWqwhKj'
};

// Reverse mapping for looking up workflow names by price ID
export const priceIdToWorkflowName: Record<string, string> = Object.fromEntries(
  Object.entries(stripeProductMapping).map(([name, priceId]) => [priceId, name])
);

// Get Stripe price ID for a workflow
export const getStripePriceId = (workflowName: string): string | undefined => {
  return stripeProductMapping[workflowName];
};

// Get workflow name from Stripe price ID
export const getWorkflowName = (priceId: string): string | undefined => {
  return priceIdToWorkflowName[priceId];
};