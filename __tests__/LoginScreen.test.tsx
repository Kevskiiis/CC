import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import LoginScreen from '../src/screens/PublicScreens/LoginScreen';

jest.setTimeout(15000);
const originalSetTimeout = global.setTimeout;
beforeAll(() => {
  jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
    cb();
    return 0 as any;
  });
});
afterAll(() => {
  (global.setTimeout as any).mockRestore?.();
  global.setTimeout = originalSetTimeout;
});

jest.mock('react-native-phone-input', () => 'PhoneInput');
jest.mock('react-native-keyboard-aware-scroll-view', () => ({
  KeyboardAwareScrollView: ({ children }: any) => children,
}));
jest.mock('react-native-text-input-mask', () => 'TextInputMask');
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }: any) => <View>{children}</View>,
    SafeAreaView: ({ children }: any) => <View>{children}</View>,
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput: RNTextInput, TouchableOpacity } = require('react-native');

  const Button = ({ onPress, children, testID }: any) => (
    <TouchableOpacity onPress={onPress} testID={testID}>
      {children || <Text>Button</Text>}
    </TouchableOpacity>
  );

  const AppbarHeader = ({ children }: any) => <View>{children}</View>;
  const AppbarContent = ({ title }: any) => <Text>{title}</Text>;
  const AppbarAction = ({ onPress }: any) => (
    <TouchableOpacity onPress={onPress}>
      <Text>Back</Text>
    </TouchableOpacity>
  );

  return {
    TextInput: RNTextInput,
    Button,
    Appbar: {
      Header: AppbarHeader,
      Content: AppbarContent,
      Action: AppbarAction,
    },
    Icon: () => null,
  };
});

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  getItemAsync: jest.fn().mockResolvedValue(null),
}));

jest.mock('axios');
jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockedAxios = require('axios') as jest.Mocked<typeof import('axios')>;
const mockUseAuth = require('../src/contexts/AuthContext').useAuth as jest.Mock;
const { setItemAsync } = require('expo-secure-store');

describe('LoginScreen', () => {
  const navigation = {
    goBack: jest.fn(),
    navigate: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      setAuthenicatedStatus: jest.fn(),
    });
  });

  it('updates form fields and calls login flow on submit success', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        success: true,
        userID: 'user-1',
        access_token: 'access',
        refresh_token: 'refresh',
        message: 'Logged in',
      },
    } as any);

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={navigation} route={{} as any} />
    );

    fireEvent.changeText(getByPlaceholderText('example@gmail.com'), 'person@test.com');
    fireEvent.changeText(getByPlaceholderText('Password1!'), 'secret123');

    fireEvent.press(getByText('SIGN IN'));

    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalled());

    const ctx = mockUseAuth.mock.results[0].value;
    expect(setItemAsync).toHaveBeenCalledWith('userID', 'user-1');
    expect(setItemAsync).toHaveBeenCalledWith('access_token', 'access');
    expect(setItemAsync).toHaveBeenCalledWith('refresh_token', 'refresh');
    expect(ctx.setAuthenicatedStatus).toHaveBeenCalledWith(true);
  });
});
