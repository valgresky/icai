import React from 'react';
import { UploadWorkflowForm } from '../components/ui/UploadWorkflowForm';

const CreatorPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-6">Upload New Workflow</h2>
        <UploadWorkflowForm 
          onUpload={(workflow, password) => {
            // Here you would handle the workflow upload
            console.log('Uploading workflow with password');
          }} 
        />
      </div>
    </div>
  );
};

export default CreatorPage;