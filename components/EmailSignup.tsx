'use client';

import { useState } from 'react';

interface EmailSignupProps {
  className?: string;
}

export default function EmailSignup({ className = '' }: EmailSignupProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(data.message);
        setEmail('');
        setName('');
      } else {
        setIsSuccess(false);
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setIsSuccess(false);
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Main Heading - USAL inspired minimal style */}
        <div className="text-center mb-16">
          <div className="max-w-2xl mx-auto">
            <p className="text-lg md:text-xl text-[#2F2C2C] mb-4 font-sans tracking-wide uppercase">
              SUBSCRIBE TO RECEIVE FIRST ACCESS TO NEW INTERVIEWS, INSIGHTS & OPPORTUNITIES TO TRANSFORM HEALTHCARE
            </p>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-8 p-6 text-center font-sans tracking-wide uppercase ${
            isSuccess 
              ? 'bg-green-50 text-green-800 border-2 border-green-200' 
              : 'bg-red-50 text-red-800 border-2 border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Form - Clean minimal design */}
        {!isSuccess && (
          <div className="text-center">
            <form onSubmit={handleSubmit} className="inline-block">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                {/* Email Input */}
                <div className="relative">
                  <label htmlFor="email" className="sr-only">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="YOUR EMAIL"
                    required
                    className="w-80 md:w-96 px-6 py-4 bg-transparent border-2 border-[#2F2C2C] text-[#2F2C2C] placeholder-[#2F2C2C]/60 font-mono tracking-wider text-sm uppercase focus:outline-none focus:border-[#EC7A5B] transition-colors duration-200"
                  />
                </div>
                
                {/* Name Input */}
                <div className="relative">
                  <label htmlFor="name" className="sr-only">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="NAME (OPTIONAL)"
                    className="w-80 md:w-60 px-6 py-4 bg-transparent border-2 border-[#2F2C2C] text-[#2F2C2C] placeholder-[#2F2C2C]/60 font-mono tracking-wider text-sm uppercase focus:outline-none focus:border-[#EC7A5B] transition-colors duration-200"
                  />
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-80 md:w-auto px-8 py-4 bg-[#EC7A5B] hover:bg-[#2F2C2C] disabled:bg-gray-400 text-white font-mono tracking-wider text-sm uppercase transition-colors duration-200 disabled:cursor-not-allowed border-2 border-[#EC7A5B] hover:border-[#2F2C2C]"
                >
                  {isLoading ? 'JOINING...' : 'SUBMIT'}
                </button>
              </div>
            </form>
            
            {/* Privacy Note - Minimal */}
            <div className="mt-12 text-xs text-[#2F2C2C]/60 uppercase tracking-widest font-sans">
              <p>
                WE RESPECT YOUR PRIVACY. UNSUBSCRIBE AT ANY TIME.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}