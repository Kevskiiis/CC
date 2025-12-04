import {StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
<<<<<<< HEAD:src/screens/LandingScreen.tsx

=======
import type { PublicRoutesStackParams } from '../../routes/PublicRoutes';
>>>>>>> cf8d902537942eea0b65bdf5d34cddadcd6b7d8f:src/screens/PublicScreens/LandingScreen.tsx
import { StatusBar } from 'expo-status-bar';
import Logo from "../../../assets/logo.svg";

// React Native Paper:
import { responsive } from '../../utils/responsive';

<<<<<<< HEAD:src/screens/LandingScreen.tsx
type Props = NativeStackScreenProps<any>; 
=======
type props = NativeStackScreenProps<PublicRoutesStackParams, 'LandingScreen'>; 
>>>>>>> cf8d902537942eea0b65bdf5d34cddadcd6b7d8f:src/screens/PublicScreens/LandingScreen.tsx

function LandingScreen({navigation}: Props) {

  return (
    <View style={OpeninScreenStyle.container}>
        <Logo width={responsive.number(250)} height={responsive.number(250)}/>
        {/* Login Button */}
        <TouchableOpacity style={OpeninScreenStyle.button} onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={OpeninScreenStyle.buttonText}>Login</Text>
        </TouchableOpacity>
        {/* Create Account Button */}
        <TouchableOpacity style={OpeninScreenStyle.button} onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={OpeninScreenStyle.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <StatusBar style="auto" />
    </View>
  );
}
export default LandingScreen;

const OpeninScreenStyle = StyleSheet.create({ 
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#D2C1B6',
    alignItems: 'center',
    justifyContent: 'center',
    gap: responsive.number(20)
  },
  logo: {
    width: responsive.number(230),
    height: responsive.number(200),
    backgroundColor: '#3b4150ff'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsive.number(6),
    borderWidth: responsive.number(4),
    borderColor: '#1a1a1aff',
    width: responsive.number(230),
    height: responsive.number(65),
    backgroundColor: '#1a1a1aff'
  },
  buttonText: {
    fontSize: responsive.number(20),
    fontWeight: '700',
    color: '#DDA853',
    letterSpacing: responsive.number(2)
  }
});
