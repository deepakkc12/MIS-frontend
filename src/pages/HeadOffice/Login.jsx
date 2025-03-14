import React, { useState } from 'react';
import { Lock, User, Shield, Activity } from 'lucide-react';

const ERPLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter username and password');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      setTimeout(() => {
        if (email === 'admin' && password === 'password') {
          console.log('Login successful');
        } else {
          setError('Invalid credentials');
        }
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      setError('Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-100  justify-center to-blue-200">
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-blue-600 text-white p-8 text-center">
            <Shield className="mx-auto h-16 w-16 mb-4" strokeWidth={1.5} />
            <h2 className="text-3xl font-bold">Enterprise MIS</h2>
            <p className="text-blue-100 mt-2 flex items-center justify-center">
              <Activity className="mr-2" size={18} />
              Management Information System
            </p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full" />
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <a href="#" className="text-sm text-blue-600 hover:underline font-medium">
                Forgot Password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ERPLoginPage;