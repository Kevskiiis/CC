import { Button, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OpeningRoutesStackParams } from '../routes/OpeningRoutes';
import { StatusBar } from 'expo-status-bar';


type props = NativeStackScreenProps<OpeningRoutesStackParams, 'LandingScreen'>; 

function LandingScreen({navigation}: props) {

  return (
    <View style={OpeninScreenStyle.container}>
        <Image 
            source={{uri:'https://tse1.mm.bing.net/th/id/OIP.fssi_WH8r1e_i5oXsAmKYwHaEQ?cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3'}}
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
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 5,
    borderColor: '#000000ff',
    width: 220,
    height: 60,
    margin: 5,
    backgroundColor: '#F5F5F5'
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: ''
  }
});
