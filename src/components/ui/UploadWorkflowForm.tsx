import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Lock, AlertCircle } from 'lucide-react';

interface UploadWorkflowFormProps {
  onUpload: (workflow: string, password: string) => void;
}

const UploadWorkflowForm = ({ onUpload }: UploadWorkflowFormProps) => {
  const [password, setPassword] = useState('');
  const [workflow, setWorkflow] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      // Validate workflow JSON
      JSON.parse(workflow);
      onUpload(workflow, password);
      setWorkflow('');
      setPassword('');
    } catch (err) {
      setError('Invalid workflow JSON format. Please check your JSON syntax.');
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text');
    try {
      // Try to parse as JSON to validate
      JSON.parse(text);
      setWorkflow(text);
      setError('');
    } catch (err) {
      setError('Invalid JSON format. Please check the workflow data.');
    }
  };

  return (
    <div className="glass-panel p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Workflow JSON
          </label>
          <textarea
            className="glass-card w-full p-3 h-48 font-mono text-sm resize-y"
            value={workflow}
            onChange={(e) => setWorkflow(e.target.value)}
            onPaste={handlePaste}
            placeholder="Paste your workflow JSON here..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Upload Password
          </label>
          <input
            type="password"
            className="glass-card w-full p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter the upload password"
            required
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-error-DEFAULT text-sm p-3 bg-error-DEFAULT/10 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <motion.button
          type="submit"
          className="btn-primary w-full flex items-center justify-center gap-2 py-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!workflow || !password}
        >
          <Upload className="w-4 h-4" />
          Upload Workflow
        </motion.button>
      </form>
    </div>
  );
};

export default UploadWorkflowForm;

export { UploadWorkflowForm }