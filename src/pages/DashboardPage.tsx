import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Wallet, Download, Star, Grid as Grid3x3, Clock, Workflow, ArrowUp, ArrowDown, Coins } from 'lucide-react';
import WorkflowCard from '../components/ui/WorkflowCard';
import PointsDisplay from '../components/ui/PointsDisplay';
import PointsHistoryTable from '../components/ui/PointsHistoryTable';
import { useSubscription } from '../hooks/useSubscription';
import { useTransactions } from '../hooks/useTransactions';
import { usePoints } from '../hooks/usePoints';
import { formatCurrency, formatDate } from '../utils/helpers';
import { workflows } from '../data/mockData';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('library');
  const { subscription } = useSubscription();
  const { transactions } = useTransactions(5);
  const { points } = usePoints();
  
  // Get 3 random workflows for demonstration
  const userWorkflows = workflows.slice(0, 3);
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="mb-8">Your Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            className="glass-panel p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-primary-500/20 text-primary-500">
              <Workflow className="w-6 h-6" />
            </div>
            <p className="text-neutral-400 text-sm">Workflows</p>
            <h3 className="text-2xl font-bold">{userWorkflows.length}</h3>
          </motion.div>
          
          <motion.div
            className="glass-panel p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-secondary-500/20 text-secondary-500">
              <Coins className="w-6 h-6" />
            </div>
            <p className="text-neutral-400 text-sm">Available Points</p>
            <h3 className="text-2xl font-bold">{points?.available_points || 0}</h3>
          </motion.div>
          
          <motion.div
            className="glass-panel p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-accent-500/20 text-accent-500">
              <Download className="w-6 h-6" />
            </div>
            <p className="text-neutral-400 text-sm">Downloads</p>
            <h3 className="text-2xl font-bold">{userWorkflows.reduce((sum, w) => sum + w.downloads, 0)}</h3>
          </motion.div>
          
          <motion.div
            className="glass-panel p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-primary-500/20 text-primary-500">
              <Wallet className="w-6 h-6" />
            </div>
            <p className="text-neutral-400 text-sm">Subscription</p>
            <h3 className="text-2xl font-bold">{subscription ? 'Active' : 'None'}</h3>
          </motion.div>
        </div>
        
        {/* Points and Subscription Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Points History */}
          <div className="lg:col-span-2">
            <PointsHistoryTable />
          </div>
          
          {/* Subscription Status */}
          <div>
            {subscription ? (
              <div className="glass-panel p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary-500" />
                  Active Subscription
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Plan:</span>
                    <span className="font-medium">Premium Plan</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Status:</span>
                    <span className="text-success-DEFAULT capitalize">{subscription.status}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Renews on:</span>
                    <span>{formatDate(subscription.current_period_end)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Price:</span>
                    <span>{formatCurrency(20)}/month</span>
                  </div>
                  
                  <div className="pt-4 border-t border-neutral-800">
                    <button className="btn-ghost w-full">
                      Manage Subscription
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-panel p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary-500" />
                  Subscription
                </h3>
                
                <div className="text-center py-6">
                  <Wallet className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
                  <p className="text-neutral-400 mb-4">
                    You don't have an active subscription
                  </p>
                  <a href="/pricing" className="btn-primary">
                    View Plans
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Transactions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          
          {transactions.length === 0 ? (
            <div className="glass-panel p-6 text-center">
              <Clock className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No transactions yet</h3>
              <p className="text-neutral-400 mb-6">
                Your purchase history will appear here
              </p>
            </div>
          ) : (
            <div className="glass-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-800">
                      <th className="text-left p-4 text-neutral-400 font-medium">Date</th>
                      <th className="text-left p-4 text-neutral-400 font-medium">Description</th>
                      <th className="text-right p-4 text-neutral-400 font-medium">Amount</th>
                      <th className="text-right p-4 text-neutral-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                        <td className="p-4 text-sm">
                          {formatDate(transaction.created_at)}
                        </td>
                        <td className="p-4">
                          {transaction.description || 'Purchase'}
                        </td>
                        <td className="p-4 text-right">
                          {formatCurrency(transaction.amount / 100)}
                        </td>
                        <td className="p-4 text-right">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            transaction.status === 'completed' 
                              ? 'bg-success-DEFAULT/20 text-success-DEFAULT' 
                              : 'bg-warning-DEFAULT/20 text-warning-DEFAULT'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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