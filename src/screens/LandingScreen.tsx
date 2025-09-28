import {StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OpeningRoutesStackParams } from '../routes/OpeningRoutes';
import { StatusBar } from 'expo-status-bar';

// React Native Paper:
import { responsive } from '../utils/responsive';

type props = NativeStackScreenProps<OpeningRoutesStackParams, 'LandingScreen'>; 

function LandingScreen({navigation}: props) {

  return (
    <View style={OpeninScreenStyle.container}>
        <Image 
          src={''}
          style={OpeninScreenStyle.logo}
        ></Image>
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
    color: '#DDA853'
  }
});
