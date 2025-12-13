import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/auth';
import { ProfileProvider } from './context/profile';
import { ToastProvider } from './context/toast';

const AllTheProviders = ({ children }) => {
  return (
    <Router>
      <ThemeProvider>
        <UserProvider>
          <ProfileProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ProfileProvider>
        </UserProvider>
      </ThemeProvider>
    </Router>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
// Override render method
export { customRender as render };

// Helper function to mock useUser hook
export const mockUseUser = (user = null, overrides = {}) => {
  const mockUser = {
    uid: 'test-uid',
    email: 'test@example.com',
    displayName: 'Test User',
    emailVerified: true,
    ...overrides,
  };

  jest.mock('../context/auth', () => ({
    ...jest.requireActual('../context/auth'),
    useUser: () => ({
      user: user ? mockUser : null,
      loading: false,
      error: null,
      ...overrides,
    }),
  }));
};

// Helper function to mock useProfile hook
export const mockUseProfile = (profile = null, overrides = {}) => {
  const mockProfile = {
    id: 'test-uid',
    displayName: 'Test User',
    email: 'test@example.com',
    photoURL: '',
    headline: 'Software Engineer',
    location: 'San Francisco, CA',
    about: 'Passionate developer',
    skills: ['React', 'JavaScript', 'Node.js'],
    experience: [],
    education: [],
    ...overrides,
  };

  jest.mock('../context/profile', () => ({
    ...jest.requireActual('../context/profile'),
    useProfile: () => ({
      profile: profile ? mockProfile : null,
      loading: false,
      error: null,
      ...overrides,
    }),
  }));
};
