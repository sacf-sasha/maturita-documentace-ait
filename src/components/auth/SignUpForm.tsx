import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { memo } from 'react';

interface SignUpFormProps {
  email: string;
  password: string;
  confirmPassword: string;
  error: string;
  success: string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
}

const SignUpForm = memo(({
  email,
  password,
  confirmPassword,
  error,
  success,
  handleSubmit,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange
}: SignUpFormProps) => {
  return (
    <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow">
      <h2 className="text-3xl font-bold text-center text-white">Sign Up</h2>
      {error && <div className="text-red-500 text-center p-2 bg-red-100 rounded">{error}</div>}
      {success && <div className="text-green-500 text-center p-2 bg-green-100 rounded">{success}</div>}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
          <p className="mt-1 text-sm text-gray-400">Minimum 6 characters</p>
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            minLength={6}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
});

SignUpForm.displayName = 'SignUpForm';

export default SignUpForm;
