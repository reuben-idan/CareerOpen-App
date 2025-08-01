import React, { useState, useEffect } from 'react';
import { authService, jobsService } from '../services/api';

const APITest = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          // Load jobs if user is authenticated
          loadJobs();
        } catch (err) {
          console.error('Failed to fetch user data:', err);
          setError('Failed to load user data. Please log in again.');
        }
      }
    };
    
    checkAuth();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userData = await authService.login(formData.email, formData.password);
      setUser(userData);
      // Load jobs after successful login
      await loadJobs();
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setJobs([]);
  };

  const loadJobs = async () => {
    try {
      setLoading(true);
      const jobsData = await jobsService.getJobs();
      setJobs(jobsData);
    } catch (err) {
      console.error('Failed to load jobs:', err);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">API Integration Test</h1>
      
      {!user ? (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Login</h2>
          {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>Test credentials (if available):</p>
            <p>Email: test@example.com</p>
            <p>Password: testpass123</p>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h2 className="text-lg font-semibold">Welcome, {user.email}!</h2>
            <p className="text-sm text-gray-600">You are now logged in.</p>
            <button
              onClick={handleLogout}
              className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Jobs</h2>
            {loading ? (
              <p>Loading jobs...</p>
            ) : jobs.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{job.company}</p>
                    <p className="text-gray-700 mt-2">{job.description?.substring(0, 100)}...</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-sm text-blue-600">{job.job_type}</span>
                      <span className="text-sm text-gray-500">{job.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No jobs found.</p>
            )}
          </div>
        </div>
      )}
      
      {error && !loading && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">API Endpoints</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li><code>POST /api/token/</code> - Get JWT tokens</li>
          <li><code>POST /api/token/refresh/</code> - Refresh access token</li>
          <li><code>GET /api/users/me/</code> - Get current user</li>
          <li><code>GET /api/jobs/</code> - List all jobs</li>
          <li><code>POST /api/jobs/</code> - Create a new job</li>
          <li><code>GET /api/jobs/&lt;id&gt;/</code> - Get job details</li>
        </ul>
      </div>
    </div>
  );
};

export default APITest;
