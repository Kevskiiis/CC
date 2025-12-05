import React from 'react';
import { render } from '@testing-library/react-native';
import RoutesContainer from '../src/routes/RoutesContainer';

jest.mock('../src/routes/PublicRoutes', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => React.createElement(Text, null, 'Public Routes');
});

jest.mock('../src/routes/PrivateRoutes', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => React.createElement(Text, null, 'Private Routes');
});

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    NavigationContainer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = require('../src/contexts/AuthContext').useAuth as jest.Mock;

describe('RoutesContainer', () => {
  it('renders public routes when unauthenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });
    const { getByText, queryByText } = render(<RoutesContainer />);
    expect(getByText('Public Routes')).toBeTruthy();
    expect(queryByText('Private Routes')).toBeNull();
  });

  it('renders private routes when authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });
    const { getByText, queryByText } = render(<RoutesContainer />);
    expect(getByText('Private Routes')).toBeTruthy();
    expect(queryByText('Public Routes')).toBeNull();
  });
});
