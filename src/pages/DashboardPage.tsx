import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Wallet, Download, Star, Grid as Grid3x3, Clock, Workflow, ArrowUp, ArrowDown } from 'lucide-react';
import WorkflowCard from '../components/ui/WorkflowCard';
import { workflows } from '../data/mockData';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('library');
  
  // Get 3 random workflows for demonstration
  const userWorkflows = workflows.slice(0, 3);
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="mb-8">Your Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Workflow className="w-6 h-6" />, label: 'Workflows', value: '12', color: 'primary' },
            { icon: <Clock className="w-6 h-6" />, label: 'Hours Saved', value: '342', color: 'secondary' },
            { icon: <Download className="w-6 h-6" />, label: 'Downloads', value: '68', color: 'accent' },
            { icon: <Wallet className="w-6 h-6" />, label: 'Revenue', value: '$1,250', color: 'primary' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="glass-panel p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-${stat.color}-500/20 text-${stat.color}-500`}>
                {stat.icon}
              </div>
              <p className="text-neutral-400 text-sm">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </motion.div>
          ))}
        </div>
        
        {/* Usage Chart */}
        <div className="glass-panel p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Usage Analytics</h2>
            <div className="flex items-center gap-2 text-sm">
              <button className="bg-primary-500/10 text-primary-500 px-3 py-1 rounded-md">Weekly</button>
              <button className="hover:bg-neutral-800 px-3 py-1 rounded-md">Monthly</button>
              <button className="hover:bg-neutral-800 px-3 py-1 rounded-md">Yearly</button>
            </div>
          </div>
          
          <div className="h-64 w-full relative">
            <div className="absolute inset-0 flex items-end justify-between px-4">
              {Array.from({ length: 7 }).map((_, i) => {
                const height = [60, 45, 75, 90, 60, 80, 50][i];
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div className="flex items-center text-xs mb-1">
                      {i % 2 === 0 ? (
                        <ArrowUp className="w-3 h-3 text-success-DEFAULT mr-1" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-error-DEFAULT mr-1" />
                      )}
                      {i % 2 === 0 ? '+12%' : '-8%'}
                    </div>
                    <motion.div
                      className="w-12 bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-md"
                      style={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                    <div className="text-xs text-neutral-400 mt-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Horizontal grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full h-px bg-neutral-800" />
              ))}
            </div>
            
            <div className="absolute left-0 top-0 flex flex-col justify-between h-full py-2 text-xs text-neutral-500">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-neutral-800 mb-6 overflow-x-auto">
          {['library', 'favorites', 'subscriptions', 'created'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 font-medium whitespace-nowrap capitalize ${
                activeTab === tab
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab === 'library' && <Download className="w-4 h-4 inline mr-2" />}
              {tab === 'favorites' && <Star className="w-4 h-4 inline mr-2" />}
              {tab === 'subscriptions' && <Wallet className="w-4 h-4 inline mr-2" />}
              {tab === 'created' && <Grid3x3 className="w-4 h-4 inline mr-2" />}
              {tab}
            </button>
          ))}
        </div>
        
        {/* Workflow Grid */}
        <div>
          {activeTab === 'library' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {userWorkflows.map((workflow) => (
                  <WorkflowCard key={workflow.id} {...workflow} />
                ))}
              </div>
              
              <div className="text-center">
                <button className="btn-ghost">
                  View All Workflows
                </button>
              </div>
            </>
          )}
          
          {activeTab === 'favorites' && (
            <div className="glass-panel p-12 text-center">
              <Star className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
              <p className="text-neutral-400 mb-6">
                Save your favorite workflows for quick access.
              </p>
              <a href="/marketplace" className="btn-primary">
                Browse Marketplace
              </a>
            </div>
          )}
          
          {activeTab === 'subscriptions' && (
            <div className="glass-panel p-12 text-center">
              <Wallet className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No active subscriptions</h3>
              <p className="text-neutral-400 mb-6">
                Subscribe to premium workflows for unlimited access.
              </p>
              <a href="/marketplace" className="btn-primary">
                Browse Premium Workflows
              </a>
            </div>
          )}
          
          {activeTab === 'created' && (
            <div className="glass-panel p-12 text-center">
              <Grid3x3 className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No created workflows</h3>
              <p className="text-neutral-400 mb-6">
                Share your expertise by publishing your n8n workflows.
              </p>
              <a href="/creator" className="btn-primary">
                Become a Creator
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;