import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Lightbulb, User, Shield, AlertCircle, ChevronDown } from 'lucide-react';



export function Login({ onLogin }) {
  const [selectedMode, setSelectedMode] = useState('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    // Simple authentication - in real app, this would be handled by backend
    if (selectedMode === 'admin') {
      if (username === 'admin' && password === 'admin123') {
        onLogin('admin', username);
      } else {
        setError('Invalid admin credentials');
      }
    } else {
      if (password.length >= 4) {
        onLogin('user', username);
      } else {
        setError('Invalid credentials');
      }
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
            <p className="text-sm text-gray-600">Enter your credentials to continue</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
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
              />
            </div>

            {/* Login Type Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSelectedMode(selectedMode === 'admin' ? 'user' )}
                className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
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

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {selectedMode === 'admin' && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
                <p className="mb-1">Demo credentials:</p>
                <p>Username: <strong>admin</strong></p>
                <p>Password: <strong>admin123</strong></p>
              </div>
            )}

            {selectedMode === 'user' && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                <p>Enter any username and password (min 4 characters) to login</p>
              </div>
            )}

            <Button type="submit" className={`w-full ${
              selectedMode === 'admin' ? 'bg-purple-600 hover:bg-purple-700' 
            }`}>
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
