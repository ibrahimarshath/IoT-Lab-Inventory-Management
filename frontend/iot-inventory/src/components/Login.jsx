import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Lightbulb, User, Shield, AlertCircle, ChevronDown } from 'lucide-react';

export function Login({ onLogin }) {
  const [selectedMode, setSelectedMode] = useState('user');
  const [isRegistering, setIsRegistering] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setSuccess('');
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const userRole = data.user.role.toLowerCase();

      // Prevent admins from logging into user portal
      if (selectedMode === 'user' && userRole === 'admin') {
        throw new Error('Admin accounts cannot login to the user portal. Please use the admin login.');
      }

      if (selectedMode === 'admin' && userRole !== 'admin') {
        throw new Error('Access denied: You do not have administrator privileges');
      }

      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));

      onLogin(userRole, data.user.name);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    if (!email || !password || !confirmPassword || !name) {
      setError('All fields are required');
      return;
    }

    if (!email.toLowerCase().endsWith('@atriauniversity.edu.in')) {
      setError('Registration is restricted to @atriauniversity.edu.in emails');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('Registration successful! You can now log in.');
      setIsRegistering(false);
      setPassword('');
      setConfirmPassword('');
      setName('');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-3 shadow-lg">
              <Lightbulb className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-gray-900 mb-1">IoT Lab Inventory Management</h1>
            <p className="text-sm text-gray-600">
              {isRegistering ? 'Create your account' : 'Enter your credentials to continue'}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (isRegistering) handleRegister();
            else handleLogin();
          }} className="space-y-4">

            {isRegistering && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@atriauniversity.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {isRegistering && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            {!isRegistering && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSelectedMode(selectedMode === 'admin' ? 'user' : 'admin')}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  disabled={loading}
                >
                  <span className="flex items-center gap-2">
                    {selectedMode === 'admin' ? (
                      <>
                        <Shield className="w-4 h-4 text-purple-600" />
                        <span>Administrator Login</span>
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4 text-blue-600" />
                        <span>User Login</span>
                      </>
                    )}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {!isRegistering && selectedMode === 'admin' && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
                <p className="mb-1">Note: You must have an admin account to log in here.</p>
              </div>
            )}

            <Button
              type="submit"
              className={`w-full ${!isRegistering && selectedMode === 'admin' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={loading}
            >
              {loading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Login')}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                  setSuccess('');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                {isRegistering ? 'Already have an account? Login' : 'New User? Create an Account'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}