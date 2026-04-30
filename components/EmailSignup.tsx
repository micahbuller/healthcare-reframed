'use client';

import { useState } from 'react';

interface EmailSignupProps {
  className?: string;
  theme?: 'light' | 'dark';
  compact?: boolean;
}

export default function EmailSignup({ className = '', theme = 'light', compact = false }: EmailSignupProps) {
  const dark = theme === 'dark';
  const textColor = dark ? 'text-[#FFFBF7]' : 'text-[#2F2C2C]';
  const borderColor = dark ? 'border-[#FFFBF7]/30 focus:border-[#EC7A5B]' : 'border-[#2F2C2C] focus:border-[#EC7A5B]';
  const placeholderColor = dark ? 'placeholder-[#FFFBF7]/40' : 'placeholder-[#2F2C2C]/60';
  const mutedColor = dark ? 'text-[#FFFBF7]/40' : 'text-[#2F2C2C]/60';
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
        headers: { 'Content-Type': 'application/json' },
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

  // ── Compact (footer) pill-style ──────────────────────────────────────────
  if (compact) {
    if (isSuccess) {
      return (
        <p className={`text-sm font-mono tracking-wide ${textColor}/70`}>
          Thanks! You&apos;re subscribed.
        </p>
      );
    }
    return (
      <div className={className}>
        {message && (
          <p className={`mb-3 text-xs font-mono ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className={`flex items-center rounded-full p-1.5 ${dark ? 'bg-white/10 border border-white/20' : 'bg-[#2F2C2C]/5 border border-[#2F2C2C]/20'}`}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className={`flex-1 min-w-0 bg-transparent px-4 py-2 text-sm font-mono focus:outline-none ${textColor} ${placeholderColor}`}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="shrink-0 bg-[#EC7A5B] text-white font-mono uppercase text-xs px-5 py-2.5 rounded-full hover:opacity-80 disabled:opacity-50 transition-opacity"
            >
              {isLoading ? '...' : 'Subscribe'}
            </button>
          </div>
        </form>
        <p className={`mt-3 text-xs uppercase tracking-widest font-sans ${mutedColor}`}>
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    );
  }

  // ── Full (non-compact) form ──────────────────────────────────────────────
  return (
    <div className={`${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Main Heading */}
        <div className="text-center mb-16">
          <div className="max-w-2xl mx-auto">
            <p className={`text-lg md:text-xl mb-4 font-sans tracking-wide uppercase ${textColor}`}>
              SUBSCRIBE TO RECEIVE FIRST ACCESS TO NEW INTERVIEWS, INSIGHTS & OPPORTUNITIES TO TRANSFORM HEALTHCARE
            </p>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-8 p-6 text-center font-sans tracking-wide uppercase rounded-2xl ${
            isSuccess
              ? 'bg-green-50 text-green-800 border-2 border-green-200'
              : 'bg-red-50 text-red-800 border-2 border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Form */}
        {!isSuccess && (
          <div className="text-center">
            <form onSubmit={handleSubmit} className="inline-block">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                <div className="relative">
                  <label htmlFor="email" className="sr-only">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="YOUR EMAIL"
                    required
                    className={`w-80 md:w-96 px-6 py-4 bg-transparent border-2 font-mono tracking-wider text-sm uppercase focus:outline-none transition-colors duration-200 rounded-full ${textColor} ${borderColor} ${placeholderColor}`}
                  />
                </div>
                <div className="relative">
                  <label htmlFor="name" className="sr-only">First Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="NAME (OPTIONAL)"
                    className={`w-80 md:w-60 px-6 py-4 bg-transparent border-2 font-mono tracking-wider text-sm uppercase focus:outline-none transition-colors duration-200 rounded-full ${textColor} ${borderColor} ${placeholderColor}`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-80 md:w-auto px-8 py-4 bg-[#EC7A5B] hover:opacity-80 disabled:bg-gray-400 text-white font-mono tracking-wider text-sm uppercase transition-opacity duration-200 disabled:cursor-not-allowed rounded-full"
                >
                  {isLoading ? 'JOINING...' : 'SUBSCRIBE'}
                </button>
              </div>
            </form>
            <div className={`mt-6 text-xs uppercase tracking-widest font-sans text-center ${mutedColor}`}>
              <p>WE RESPECT YOUR PRIVACY. UNSUBSCRIBE AT ANY TIME.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
