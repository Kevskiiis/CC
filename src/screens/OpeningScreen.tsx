import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function OpeningScreen() {
  return (
    <View style={OpeninScreenStyle.container}>
        <Image 
            source={{uri:'https://tse1.mm.bing.net/th/id/OIP.fssi_WH8r1e_i5oXsAmKYwHaEQ?cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3'}}
                    style={OpeninScreenStyle.logo}
        ></Image>
        {/* Login Button */}
        <TouchableOpacity style={OpeninScreenStyle.button}>
          <Text style={OpeninScreenStyle.buttonText}>Login</Text>
        </TouchableOpacity>
        {/* Create Account Button */}
        <TouchableOpacity style={OpeninScreenStyle.button}>
          <Text style={OpeninScreenStyle.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <StatusBar style="auto" />
    </View>
  );
}

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
