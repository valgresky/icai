import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { workflows } from '../data/mockData';

const WorkflowDetailPage = () => {
  const { id } = useParams();
  const workflow = workflows.find(w => w.id === id);

  if (!workflow) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1>Workflow not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-neutral-900 rounded-lg overflow-hidden h-[600px] mb-8">
              <img 
                src={workflow.image} 
                alt={workflow.title}
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="mb-4">{workflow.title}</h1>
            <p className="text-neutral-300 text-lg mb-8">{workflow.description}</p>

            <div className="glass-panel p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Workflow Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-neutral-400">Category</p>
                  <p className="font-semibold">{workflow.category}</p>
                </div>
                <div>
                  <p className="text-neutral-400">Downloads</p>
                  <p className="font-semibold">{workflow.downloads}</p>
                </div>
                <div>
                  <p className="text-neutral-400">Rating</p>
                  <p className="font-semibold">{workflow.rating}/5</p>
                </div>
                <div>
                  <p className="text-neutral-400">Created</p>
                  <p className="font-semibold">{workflow.createdAt}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="btn-primary flex-1 py-3">
                Download Workflow
              </button>
              <button className="btn-ghost flex-1 py-3">
                View Documentation
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDetailPage;