import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff, AlertCircle, CheckCircle, XCircle, UserPlus } from 'lucide-react';

const RegisterForm = ({ onSwitchToLogin }) => {
  const { register: registerUser, authError, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    }
  });
  
  const password = watch('password', '');
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    clearError();
    
    try {
      await registerUser(data);
      // Redirect happens in the AuthPage component when isAuthenticated changes
    } catch (error) {
      // Error is handled by the auth context and displayed below
      console.error('Registration submission error', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculate password strength
  const getPasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return Math.min(strength, 5);
  };
  
  const passwordStrength = getPasswordStrength(password);
  
  const getStrengthLabel = (strength) => {
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return labels[strength] || '';
  };
  
  const getStrengthColor = (strength) => {
    const colors = [
      'bg-red-500', // Very Weak
      'bg-red-400', // Weak
      'bg-yellow-500', // Fair
      'bg-yellow-400', // Good
      'bg-green-400', // Strong
      'bg-green-500'  // Very Strong
    ];
    return colors[strength] || 'bg-gray-200';
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
      
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <motion.div 
          className="relative"
          initial="normal"
          animate={errors.name ? "error" : "normal"}
          whileFocus="focus"
          variants={inputVariants}
        >
          <input
            id="name"
            type="text"
            autoComplete="name"
            className={`appearance-none block w-full px-4 py-3 border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200`}
            placeholder="John Doe"
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters'
              }
            })}
          />
          {errors.name && (
            <motion.p 
              className="mt-1 text-sm text-red-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.name.message}
            </motion.p>
          )}
        </motion.div>
      </div>
      
      {/* Email Field */}
      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
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
            id="register-email"
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
        <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
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
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
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
        
        {/* Password Strength Indicator */}
        {password && (
          <motion.div 
            className="mt-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Password strength:</span>
              <span className={`text-xs font-medium ${
                passwordStrength < 2 ? 'text-red-500' : 
                passwordStrength < 4 ? 'text-yellow-500' : 
                'text-green-500'
              }`}>
                {getStrengthLabel(passwordStrength)}
              </span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${getStrengthColor(passwordStrength)}`}
                initial={{ width: '0%' }}
                animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            {/* Password Criteria */}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="flex items-center text-xs">
                {password.length >= 8 ? (
                  <CheckCircle size={14} className="text-green-500 mr-1.5" />
                ) : (
                  <XCircle size={14} className="text-gray-400 mr-1.5" />
                )}
                <span className={password.length >= 8 ? "text-green-700" : "text-gray-500"}>
                  8+ characters
                </span>
              </div>
              <div className="flex items-center text-xs">
                {/[A-Z]/.test(password) ? (
                  <CheckCircle size={14} className="text-green-500 mr-1.5" />
                ) : (
                  <XCircle size={14} className="text-gray-400 mr-1.5" />
                )}
                <span className={/[A-Z]/.test(password) ? "text-green-700" : "text-gray-500"}>
                  Uppercase letter
                </span>
              </div>
              <div className="flex items-center text-xs">
                {/[a-z]/.test(password) ? (
                  <CheckCircle size={14} className="text-green-500 mr-1.5" />
                ) : (
                  <XCircle size={14} className="text-gray-400 mr-1.5" />
                )}
                <span className={/[a-z]/.test(password) ? "text-green-700" : "text-gray-500"}>
                  Lowercase letter
                </span>
              </div>
              <div className="flex items-center text-xs">
                {/[0-9]/.test(password) ? (
                  <CheckCircle size={14} className="text-green-500 mr-1.5" />
                ) : (
                  <XCircle size={14} className="text-gray-400 mr-1.5" />
                )}
                <span className={/[0-9]/.test(password) ? "text-green-700" : "text-gray-500"}>
                  Number
                </span>
              </div>
              <div className="flex items-center text-xs">
                {/[^A-Za-z0-9]/.test(password) ? (
                  <CheckCircle size={14} className="text-green-500 mr-1.5" />
                ) : (
                  <XCircle size={14} className="text-gray-400 mr-1.5" />
                )}
                <span className={/[^A-Za-z0-9]/.test(password) ? "text-green-700" : "text-gray-500"}>
                  Special character
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Confirm Password Field */}
      <div>
        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <motion.div 
          className="relative"
          initial="normal"
          animate={errors.password_confirmation ? "error" : "normal"}
          whileFocus="focus"
          variants={inputVariants}
        >
          <input
            id="password_confirmation"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            className={`appearance-none block w-full px-4 py-3 border ${
              errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
            } rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200`}
            placeholder="••••••••••"
            {...register('password_confirmation', {
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            })}
          />
          {errors.password_confirmation && (
            <motion.p 
              className="mt-1 text-sm text-red-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.password_confirmation.message}
            </motion.p>
          )}
        </motion.div>
      </div>
      
      {/* Terms Agreement */}
      <div className="flex items-start mt-4">
        <div className="flex items-center h-5">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            {...register('terms', {
              required: 'You must agree to the terms and conditions'
            })}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="font-medium text-gray-700">
            I agree to the <a href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
          </label>
          {errors.terms && (
            <motion.p 
              className="mt-1 text-xs text-red-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.terms.message}
            </motion.p>
          )}
        </div>
      </div>
      
      {/* Register Button */}
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
              Creating account...
            </>
          ) : (
            <>
              <UserPlus size={18} className="mr-2" />
              Create Account
            </>
          )}
        </motion.button>
      </div>
      
      {/* Login Link */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-blue-600 hover:text-blue-800 transition-colors focus:outline-none"
          >
            Sign in instead
          </button>
        </p>
      </div>
    </form>
  );
}

export default RegisterForm;