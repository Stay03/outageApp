import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPasswordForm = ({ onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      email: ''
    }
  });
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // This would connect to your API endpoint for password reset
      // For now, we'll just simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
      console.error('Password reset error', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Animation variants
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
    disabled: { opacity: 0.7 }
  };
  
  const inputVariants = {
    focus: { 
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3)',
      borderColor: '#3B82F6'
    },
    error: { 
      boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.3)',
      borderColor: '#EF4444'
    },
    normal: { 
      boxShadow: 'none',
      borderColor: '#D1D5DB'
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <motion.div
        className="text-center py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Reset link sent</h3>
        <p className="text-sm text-gray-500 mb-6">
          We've sent a password reset link to your email address. Please check your inbox.
        </p>
        <motion.button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={onBack}
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to login
        </motion.button>
      </motion.div>
    );
  }

  // Form state
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Reset your password</h3>
        <p className="text-sm text-gray-500 mt-1">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      
      {/* Error Alert */}
      {error && (
        <motion.div 
          className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md flex items-start"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" size={18} />
          <span className="text-red-700 text-sm">{error}</span>
        </motion.div>
      )}
      
      {/* Email Field */}
      <div>
        <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <motion.div 
          className="relative"
          initial="normal"
          animate={errors.email ? "error" : "normal"}
          whileFocus="focus"
          variants={inputVariants}
        >
          <input
            id="reset-email"
            type="email"
            autoComplete="email"
            className={`appearance-none block w-full px-3 py-2 border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200`}
            placeholder="your@email.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && (
            <motion.p 
              className="mt-1 text-sm text-red-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.email.message}
            </motion.p>
          )}
        </motion.div>
      </div>
      
      {/* Submit Button */}
      <div>
        <motion.button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={isSubmitting}
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
          animate={isSubmitting ? "disabled" : "idle"}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending email...
            </>
          ) : (
            'Send reset link'
          )}
        </motion.button>
      </div>
      
      {/* Back Link */}
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors focus:outline-none"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to login
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;