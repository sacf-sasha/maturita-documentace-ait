import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import SignUpForm from '../components/auth/SignUpForm';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'http://localhost:5173/',
        }
      });

      if (error) throw error;

      if (data.user) {
        console.log('Registration successful:', data.user);
        setSuccess('Registration is successful! Please check your email address to log in to your account.');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message);
    }
  }, [email, password, confirmPassword, navigate]);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
  }, []);

  const handleConfirmPasswordChange = useCallback((value: string) => {
    setConfirmPassword(value);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <SignUpForm
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        error={error}
        success={success}
        handleSubmit={handleSubmit}
        onEmailChange={handleEmailChange}
        onPasswordChange={handlePasswordChange}
        onConfirmPasswordChange={handleConfirmPasswordChange}
      />
    </div>
  );
};

export default SignupPage;
