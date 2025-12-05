import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import LandingScreen from '../src/screens/PublicScreens/LandingScreen';

describe('LandingScreen', () => {
  const navigation = {
    navigate: jest.fn(),
  } as any;

  it('navigates to LoginScreen when Login is pressed', () => {
    const { getByText } = render(<LandingScreen navigation={navigation} route={{} as any} />);
    fireEvent.press(getByText('Login'));
    expect(navigation.navigate).toHaveBeenCalledWith('LoginScreen');
  });

  it('navigates to RegisterScreen when Create Account is pressed', () => {
    const { getByText } = render(<LandingScreen navigation={navigation} route={{} as any} />);
    fireEvent.press(getByText('Create Account'));
    expect(navigation.navigate).toHaveBeenCalledWith('RegisterScreen');
  });
});
