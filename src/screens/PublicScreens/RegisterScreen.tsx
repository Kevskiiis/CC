import { StyleSheet, View, Text, TouchableOpacity, Keyboard} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from 'react-native-phone-input';
import { useState, useRef } from "react";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PublicRoutesStackParams } from '../../routes/PublicRoutes';

// React Native Paper Library Components:
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Appbar} from 'react-native-paper';

// Responsive Utility for Styling:
import { responsive } from "../../utils/responsive";

// Contexts:
import { useAuth } from "../../contexts/AuthContext";

type props = NativeStackScreenProps<PublicRoutesStackParams, 'RegisterScreen'>;

type registerForm = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
}

function RegisterScreen ({navigation}: props) {
    const [registerForm, setForm] = useState<registerForm>({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: ''
    })

    const {isAuthenticated, createAccount} = useAuth(); 

    function handleChange (inputName: string, newText: string) {
        setForm((prevValue) => ({
            ...prevValue,
            [inputName]: newText
        }));
        console.log(registerForm);
    }

    const handleSubmit = () => {
        try {
            createAccount(registerForm);
        }
        catch {

        }
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={RegisterStyles.screen}>
                <KeyboardAwareScrollView
                    // style={RegisterStyles.scrollViewOutside}
                    contentContainerStyle={RegisterStyles.scrollViewInside}
                    enableOnAndroid={true}
                    extraScrollHeight={responsive.number(80)}
                    enableAutomaticScroll={true}
                >
                    <View style={RegisterStyles.formContainer}>
                        <Appbar.Header style={RegisterStyles.appBar}>
                            <Appbar.Content titleStyle={RegisterStyles.appBarTitle} title="CREATE ACCOUNT" color="#DDA853"/>
                            <Appbar.Action style={RegisterStyles.appBarItem} icon="arrow-left" color="#1a1a1aff" onPress={() => navigation.goBack()} />
                        </Appbar.Header>
                        <TextInput 
                            style={RegisterStyles.textInput} 
                            label="First Name" 
                            placeholder="John" 
                            error={false} 
                            mode="flat"
                            underlineColor="#1a1a1aff"
                            activeUnderlineColor="#1a1a1aff"
                            value={registerForm.firstName}
                            onChangeText={(newText) => handleChange('firstName', newText)}
                        >
                        </TextInput>
                        <TextInput 
                            style={RegisterStyles.textInput} 
                            label="Last Name" 
                            placeholder="White" 
                            error={false} 
                            mode="flat"
                            underlineColor="#1a1a1aff"
                            activeUnderlineColor="#1a1a1aff"
                            value={registerForm.lastName}
                            onChangeText={(newText) => handleChange('lastName', newText)}
                        >  
                        </TextInput>
                        <PhoneInput
                            // ref={phoneNumber}
                            initialCountry="us"
                            autoFormat={true}
                            style={RegisterStyles.phoneInput}
                            textStyle={{ fontSize: responsive.number(16) }}
                            flagStyle={{ width: responsive.number(30), height: responsive.number(20)}}
                            // onPressFlag={() => {
                            //     console.log('Implement this later.')
                            // }}
                            // onPressConfirm={() =>{
                            //     email.current?.focus();
                            // }}
                            initialValue={registerForm.phoneNumber}
                            onChangePhoneNumber={(newText) => handleChange('phoneNumber', newText)}
                        />
                        <TextInput 
                            style={RegisterStyles.textInput} 
                            label="Email" 
                            placeholder="example@gmail.com" 
                            error={false} 
                            mode="flat"
                            underlineColor="#1a1a1aff"
                            activeUnderlineColor="#1a1a1aff"
                            value={registerForm.email}
                            onChangeText={(newText) => handleChange('email', newText)}
                        >
                        </TextInput>
                        <TextInput 
                            style={RegisterStyles.textInput} 
                            label="Password" 
                            placeholder="Password1!" 
                            error={false} 
                            mode="flat"
                            underlineColor="#1a1a1aff"
                            activeUnderlineColor="#1a1a1aff"
                            value={registerForm.password}
                            onChangeText={(newText) => handleChange('password', newText)}
                        >
                        </TextInput>
                        <TouchableOpacity style={RegisterStyles.submitButton} onPress={handleSubmit}>
                            <Text style={RegisterStyles.submitButtonText}>SIGN UP</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
export default RegisterScreen;

const RegisterStyles = StyleSheet.create({
    screen: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#D2C1B6'
    },
    submitButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: responsive.number(300),
        height: responsive.number(60),
        borderRadius: responsive.number(4),
        borderWidth: responsive.number(2),
        backgroundColor: '#1a1a1aff'
    },
    submitButtonText: {
        fontWeight: '500',
        fontSize: responsive.number(15),
        color: '#DDA853',
        letterSpacing: responsive.number(2)
    },
    textInput: {
        flexDirection: 'row',
        width: responsive.number(300),
        height: responsive.number(60),
        backgroundColor: '#ecececff'
    },
    appBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        height: responsive.number(80),
        backgroundColor: '#1a1a1aff',
        // tintColor: '#fcfcfcff'
    },
    appBarTitle: {
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '300',
        fontSize: responsive.number(20),
        letterSpacing: responsive.number(0.5)
    },
    appBarItem: {
        width: responsive.number(100),
        height: responsive.number(60),
        color: '#ffffffff',
        // fontWeight: '700',
        backgroundColor: '#DDA853'
    },
    scrollViewInside: {
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        gap: responsive.number(20),
        backgroundColor: '#D2C1B6'
    },
    formContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: responsive.number(15),
        paddingBottom: responsive.number(40),
        width: '90%',
        height: 'auto',
        borderWidth: responsive.number(6),
        borderRadius: responsive.number(8),
        borderColor: '#1a1a1aff',
        backgroundColor: '#F5F5F0',
    },
    phoneInput: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 10,
        borderTopRightRadius: responsive.number(4),
        borderTopLeftRadius: responsive.number(4),
        borderBottomWidth: responsive.number(1/2),
        borderColor: '#1a1a1aff',
        fontSize: responsive.number(16),
        width: responsive.number(300),
        height: responsive.number(60),
        color: '#1a1a1aff',
        backgroundColor: '#ecececff'
    },
}) 