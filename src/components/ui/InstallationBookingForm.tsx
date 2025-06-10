import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CreditCard, Mail, MessageSquare, User, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from './AuthModal';

interface InstallationBookingFormProps {
  workflowTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

const InstallationBookingForm = ({ workflowTitle, isOpen, onClose }: InstallationBookingFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    notes: '',
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission
    console.log('Form submitted:', formData);
    // Reset form and close
    setFormData({
      name: '',
      email: '',
      date: '',
      time: '',
      notes: '',
    });
    onClose();
  };

  // Get available dates (next 14 days, excluding weekends)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    let current = new Date(today);
    
    while (dates.length < 14) {
      if (current.getDay() !== 0 && current.getDay() !== 6) { // Skip weekends
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  };

  // Get available time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
  ];

  if (!isOpen) return null;

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-background rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
            <p className="text-neutral-400 mb-6">
              Please sign in to book an installation service.
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="btn-primary w-full"
            >
              Sign In
            </button>
          </div>
        </motion.div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-background rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Book Installation Service</h2>
              {workflowTitle && (
                <p className="text-neutral-400">for {workflowTitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="glass-panel p-4 mb-6">
            <h3 className="font-semibold mb-2">Service Details</h3>
            <ul className="space-y-2 text-neutral-300">
              <li>• Complete workflow setup and configuration</li>
              <li>• Integration with your n8n instance</li>
              <li>• Testing and validation</li>
              <li>• 30-minute consultation</li>
              <li>• 2 weeks of support</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-neutral-800">
              <div className="text-2xl font-bold">$50 USD</div>
              <p className="text-neutral-400 text-sm">One-time payment</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Name
                </label>
                <input
                  type="text"
                  className="glass-card w-full p-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  className="glass-card w-full p-2"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date
                </label>
                <select
                  className="glass-card w-full p-2"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                >
                  <option value="">Select a date</option>
                  {getAvailableDates().map((date) => (
                    <option key={date.toISOString()} value={date.toISOString().split('T')[0]}>
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time (UTC)
                </label>
                <select
                  className="glass-card w-full p-2"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                >
                  <option value="">Select a time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time} UTC
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Additional Notes
              </label>
              <textarea
                className="glass-card w-full p-2 h-24 resize-none"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any specific requirements or questions?"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-500" />
                <span className="text-sm text-neutral-400">Secure payment with Stripe</span>
              </div>
              <button type="submit" className="btn-primary px-8">
                Book Now
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InstallationBookingForm;