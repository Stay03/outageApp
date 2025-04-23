import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { LogIn, UserPlus, Zap } from 'lucide-react';
import powerIcon from '../../assets/power-svg.svg'; // Adjust the path as necessary

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Animation variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };
  
  const tabVariants = {
    inactive: { 
      color: '#6B7280',
      borderColor: 'transparent',
      background: 'transparent'
    },
    active: { 
      color: '#FFFFFF',
      borderColor: 'transparent',
      background: '#3B82F6' // blue color with white text
    }
  };
  
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-0 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements removed for a flat look */}
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 pt-12">
        <div className="flex justify-center mb-6">
            <img src={powerIcon} alt="Power icon" className="w-20 h-20  " />
        </div>
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-blue-600 font-inter">
            Power Outage Tracker
          </h2>
          <p className="mt-3 text-base text-gray-600 max-w font-inter">
            Track, analyze, and prepare for power outages
          </p>
        </div>
      </div>

      <motion.div 
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 flex-grow flex flex-col"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <div className="bg-white py-8 px-4 shadow-xl rounded-t-[2.5rem] rounded-b-none sm:px-10 border bg-blue-100 border-gray-100 h-full">
          {/* Tab Navigation - Hidden when showing forgot password */}
          {!showForgotPassword && (
            <div className="flex p-1 bg-gray-50 rounded-full mb-6 border border-black">
              <motion.button
                className="flex items-center px-4 py-2 font-medium text-sm rounded-full focus:outline-none flex-1 justify-center"
                onClick={() => setActiveTab('login')}
                variants={tabVariants}
                animate={activeTab === 'login' ? 'active' : 'inactive'}
                transition={{ duration: 0.2 }}
              >
                <LogIn size={18} className="mr-1.5" />
                Login
              </motion.button>
              
              <motion.button
                className="flex items-center px-4 py-2 font-medium text-sm rounded-full focus:outline-none flex-1 justify-center"
                onClick={() => setActiveTab('register')}
                variants={tabVariants}
                animate={activeTab === 'register' ? 'active' : 'inactive'}
                transition={{ duration: 0.2 }}
              >
                <UserPlus size={18} className="mr-1.5" />
                Register
              </motion.button>
            </div>
          )}
          
          {/* Form Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={showForgotPassword ? 'forgot' : activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {showForgotPassword ? (
                <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
              ) : activeTab === 'login' ? (
                <LoginForm 
                  onSwitchToRegister={() => setActiveTab('register')} 
                  onForgotPassword={() => setShowForgotPassword(true)}
                />
              ) : (
                <RegisterForm onSwitchToLogin={() => setActiveTab('login')} />
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Additional footer information */}
          <div className="mt-6 text-center text-xs text-gray-500">
            By using this service, you agree to our <a href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;