import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';

const LoginForm = ({ onSwitchToRegister, onForgotPassword }) => {
  const { login, authError, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    clearError();
    
    try {
      await login(data.email, data.password, data.rememberMe);
      // Redirect happens in the AuthPage component when isAuthenticated changes
    } catch (error) {
      // Error is handled by the auth context and displayed below
      console.error('Login submission error', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Animation variants
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.03 },
    tap: { scale: 0.97 },
    disabled: { opacity: 0.7 }
  };
  
  const inputVariants = {
    focus: { 
      boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.3)',
      borderColor: '#4F46E5'
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Error Alert */}
      {authError && (
        <motion.div 
          className="bg-red-50 border-l-4 border-red-400 p-4 rounded-2xl flex items-start"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" size={18} />
          <span className="text-red-700 text-sm">{authError}</span>
        </motion.div>
      )}
      
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
            id="email"
            type="email"
            autoComplete="email"
            className={`appearance-none block w-full px-4 py-3 border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200`}
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
      
      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <motion.div 
          className="relative"
          initial="normal"
          animate={errors.password ? "error" : "normal"}
          whileFocus="focus"
          variants={inputVariants}
        >
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            className={`appearance-none block w-full px-4 py-3 border ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 pr-10`}
            placeholder="••••••••••"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1"
          >
            {showPassword ? (
              <EyeOff size={18} className="text-gray-500" />
            ) : (
              <Eye size={18} className="text-gray-500" />
            )}
          </button>
          {errors.password && (
            <motion.p 
              className="mt-1 text-sm text-red-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.password.message}
            </motion.p>
          )}
        </motion.div>
      </div>
      
      {/* Remember Me */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember_me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
            {...register('rememberMe')}
          />
          <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        
        <div className="text-sm">
          <button 
            type="button" 
            onClick={onForgotPassword}
            className="font-medium text-blue-600 hover:text-blue-800 transition-colors focus:outline-none"
          >
            Forgot password?
          </button>
        </div>
      </div>
      
      {/* Login Button */}
      <div>
        <motion.button
          type="submit"
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              Signing in...
            </>
          ) : (
            <>
              <LogIn size={18} className="mr-2" />
              Sign in
            </>
          )}
        </motion.button>
      </div>
      
      {/* Register Link */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-medium text-blue-600 hover:text-blue-800 transition-colors focus:outline-none"
          >
            Create an account
          </button>
        </p>
      </div>

    </form>
  );
};

export default LoginForm;