'use client';

import { useState, FormEvent } from 'react';

// Extended form data interface for type safety
interface FormData {
  // Step 1: Personal Info
  name: string;
  email: string;
  phone: string;
  // Step 2: Professional Info
  company: string;
  role: string;
  experience: string;
  // Step 3: Event Details
  event: string;
  message: string;
  newsletter: boolean;
}

// Form errors interface for validation
interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  experience?: string;
  event?: string;
  message?: string;
}

export default function EventsLeadForm() {
  // State management for form data, errors, loading, success, and current step
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    experience: '',
    event: '',
    message: '',
    newsletter: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Phone validation regex (basic international format)
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;

  // Validate current step fields
  const validateCurrentStep = (): boolean => {
    const newErrors: FormErrors = {};

    if (currentStep === 1) {
      // Step 1: Personal Info validation
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    } else if (currentStep === 2) {
      // Step 2: Professional Info validation
      if (!formData.company.trim()) {
        newErrors.company = 'Company is required';
      }
      if (!formData.role.trim()) {
        newErrors.role = 'Role is required';
      }
      if (!formData.experience) {
        newErrors.experience = 'Please select your experience level';
      }
    } else if (currentStep === 3) {
      // Step 3: Event Details validation
      if (!formData.event) {
        newErrors.event = 'Please select an event type';
      }
      if (!formData.message.trim()) {
        newErrors.message = 'Please tell us why you want to join';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate entire form (for final submission)
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate all fields
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.experience) newErrors.experience = 'Please select your experience level';
    if (!formData.event) newErrors.event = 'Please select an event type';
    if (!formData.message.trim()) newErrors.message = 'Please tell us why you want to join';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation functions
  const nextStep = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  // Handle input changes with real-time validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate entire form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to JSONPlaceholder
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Event Registration: ${formData.event}`,
          body: JSON.stringify(formData),
          userId: 1,
        }),
      });

      if (response.ok) {
        // Log form data to console as backup
        console.log('Form submitted successfully:', formData);
        
        // Show success message
        setIsSuccess(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            phone: '',
            company: '',
            role: '',
            experience: '',
            event: '',
            message: '',
            newsletter: false
          });
          setCurrentStep(1);
          setIsSuccess(false);
        }, 3000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Step components
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
            
            {/* Name field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 ${
                  errors.name 
                    ? 'border-red-500 bg-red-900/20' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                placeholder="Enter your full name"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1 animate-fade-in">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 ${
                  errors.email 
                    ? 'border-red-500 bg-red-900/20' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                placeholder="your.email@example.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 animate-fade-in">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone field */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 ${
                  errors.phone 
                    ? 'border-red-500 bg-red-900/20' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                placeholder="+1 (555) 123-4567"
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1 animate-fade-in">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6">Professional Information</h2>
            
            {/* Company field */}
            <div className="space-y-2">
              <label htmlFor="company" className="block text-sm font-medium text-gray-300">
                Company <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 ${
                  errors.company 
                    ? 'border-red-500 bg-red-900/20' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                placeholder="Your company name"
                disabled={isLoading}
              />
              {errors.company && (
                <p className="text-red-400 text-xs mt-1 animate-fade-in">
                  {errors.company}
                </p>
              )}
            </div>

            {/* Role field */}
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-300">
                Job Role <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 ${
                  errors.role 
                    ? 'border-red-500 bg-red-900/20' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                placeholder="e.g. Software Developer, Product Manager"
                disabled={isLoading}
              />
              {errors.role && (
                <p className="text-red-400 text-xs mt-1 animate-fade-in">
                  {errors.role}
                </p>
              )}
            </div>

            {/* Experience field */}
            <div className="space-y-2">
              <label htmlFor="experience" className="block text-sm font-medium text-gray-300">
                Experience Level <span className="text-red-400">*</span>
              </label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white ${
                  errors.experience 
                    ? 'border-red-500 bg-red-900/20' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                disabled={isLoading}
              >
                <option value="" className="bg-gray-800">Select your experience</option>
                <option value="beginner" className="bg-gray-800">Beginner (0-2 years)</option>
                <option value="intermediate" className="bg-gray-800">Intermediate (2-5 years)</option>
                <option value="advanced" className="bg-gray-800">Advanced (5-10 years)</option>
                <option value="expert" className="bg-gray-800">Expert (10+ years)</option>
              </select>
              {errors.experience && (
                <p className="text-red-400 text-xs mt-1 animate-fade-in">
                  {errors.experience}
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6">Event Details</h2>
            
            {/* Event selection */}
            <div className="space-y-2">
              <label htmlFor="event" className="block text-sm font-medium text-gray-300">
                Event Type <span className="text-red-400">*</span>
              </label>
              <select
                id="event"
                name="event"
                value={formData.event}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white ${
                  errors.event 
                    ? 'border-red-500 bg-red-900/20' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                disabled={isLoading}
              >
                <option value="" className="bg-gray-800">Select an event</option>
                <option value="workshop" className="bg-gray-800">Hands-on Workshop</option>
                <option value="webinar" className="bg-gray-800">Interactive Webinar</option>
                <option value="masterclass" className="bg-gray-800">Masterclass</option>
                <option value="networking" className="bg-gray-800">Networking Event</option>
              </select>
              {errors.event && (
                <p className="text-red-400 text-xs mt-1 animate-fade-in">
                  {errors.event}
                </p>
              )}
            </div>

            {/* Message field */}
            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                Why do you want to join? <span className="text-red-400">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 resize-none ${
                  errors.message 
                    ? 'border-red-500 bg-red-900/20' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                placeholder="Tell us about your goals and what you hope to learn..."
                disabled={isLoading}
              />
              {errors.message && (
                <p className="text-red-400 text-xs mt-1 animate-fade-in">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Newsletter checkbox */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                disabled={isLoading}
              />
              <label htmlFor="newsletter" className="text-sm text-gray-300">
                I&apos;d like to receive updates about future events and resources
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Main form container */}
      <div className="relative w-full max-w-2xl animate-fade-in">
        {/* Form card with glassmorphism effect */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-800/50">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Event Registration
            </h1>
            <p className="text-gray-400 text-sm">
              Join our exclusive events and accelerate your growth
            </p>
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <button
                    onClick={() => goToStep(step)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-200 ${
                      step === currentStep
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                        : step < currentStep
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                    }`}
                  >
                    {step < currentStep ? '✓' : step}
                  </button>
                  <div className="ml-3">
                    <p className={`text-xs font-medium ${
                      step === currentStep ? 'text-white' : step < currentStep ? 'text-green-400' : 'text-gray-500'
                    }`}>
                      {step === 1 ? 'Personal' : step === 2 ? 'Professional' : 'Event'}
                    </p>
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      step < currentStep ? 'bg-green-600' : 'bg-gray-700'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Success message */}
          {isSuccess && (
            <div className="mb-6 p-4 bg-green-900/50 border border-green-700/50 rounded-lg animate-slide-in backdrop-blur-sm">
              <p className="text-green-400 text-sm font-medium text-center">
                ✓ Registration successful! We&apos;ll be in touch soon.
              </p>
            </div>
          )}

          {/* Form content */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {renderStep()}

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-800">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1 || isLoading}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentStep === 1 || isLoading
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium transition-all duration-200 hover:from-purple-700 hover:to-blue-700 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/25"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                    isLoading
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/25'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
