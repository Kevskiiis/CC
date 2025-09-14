import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native'; 
import { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OpeningRoutesStackParams } from '../routes/OpeningRoutes';

type props = NativeStackScreenProps<OpeningRoutesStackParams, 'LoginScreen'>

function LoginScreen ({navigation}: props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={LoginStyle.container}>
            <View style={LoginStyle.backButtonContainer}>
                <TouchableOpacity style={LoginStyle.backButton} onPress={() => navigation.goBack()}>
                    <Text style={LoginStyle.buttonText}>Back</Text>
                </TouchableOpacity>
            </View>
            <View style={LoginStyle.inputsContainer}>
                <TextInput
                    onChangeText={(newText) => setEmail(newText)}
                    style={LoginStyle.textInput}
                    value={email}
                    placeholder='Email'
                />
                <TextInput
                    onChangeText={(newText) => setPassword(newText)}
                    style={LoginStyle.textInput}
                    value={password}
                    placeholder='Password'
                />
                <TouchableOpacity style={LoginStyle.button}>
                    <Text style={LoginStyle.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default LoginScreen;

const LoginStyle = StyleSheet.create ({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputsContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        height: 400,
        width: 300
    },
    textInput: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderRadius: 15,
        textAlign: 'center',
        fontSize: 16,
        height: 50,
        width: 275,
        backgroundColor: '#ffffffff'
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderRadius: 15,
        height: 50,
        width: 275,
        backgroundColor: '#000000ff'
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 20
    },
    backButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4, 
        borderRadius: 15,
        width: 90,
        height: 50,
        backgroundColor: '#000000ff'
    },
    backButtonContainer: {
        position: 'relative',
        top: 85,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: 275,
        height: 'auto'
    }
})