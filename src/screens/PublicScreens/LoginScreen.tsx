import { StyleSheet, View, Text, TouchableOpacity, Keyboard} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from 'react-native-phone-input';
import { useState, useRef } from "react";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PublicRoutesStackParams } from '../../routes/PublicRoutes';
import axios from "axios";
import * as SecureStore from 'expo-secure-store';

// React Native Paper Library Components:
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Appbar, Button, Icon} from 'react-native-paper';
import TextInputMask from "react-native-text-input-mask";

// Authenticaton Context:
import { useAuth } from "../../contexts/AuthContext";

// Responsive Utility for Styling:
import { responsive } from "../../utils/responsive";
import AppbarBackAction from "react-native-paper/lib/typescript/components/Appbar/AppbarBackAction";

import ErrorBox from "../../components/ErrorBox";
import SuccessBox from "../../components/SuccessBox";

type props = NativeStackScreenProps<PublicRoutesStackParams, 'LoginScreen'>;

type loginForm = {
    email: string;
    password: string;
}

type errorState = {
    errorState: boolean;
    message: string; 
}

type successState = {
    successState: boolean;
    message: string; 
}

function LoginScreen ({navigation}: props) { 
    // REACT STATES:
    const [loginForm, setForm] = useState<loginForm>({
        email: '',
        password: ''
    });

    const [error, setError] = useState<errorState>({
        errorState: false,
        message: ''
    });
        
    const [success, setSuccess] = useState<successState>({
        successState: false,
        message: ''
    });
    
    const [isLoading, setLoading] = useState<Boolean>(false);

    // AUTH CONTEXT: 
    const {setAuthenicatedStatus} = useAuth();

    // REACT FUNCTIONS: 
    const handleChange = (inputName: string, newText: string) => {
        setForm ((prevValue) => ({
            ...prevValue,
            [inputName]: newText
        }))
        console.log(loginForm);
    }

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const response = await axios.post(
                "https://ccbackend-production-5adb.up.railway.app/sign-in",
                {
                    email: loginForm.email.toLowerCase().trim(),
                    password: loginForm.password.trim()
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = response.data; 
            console.log(response);

            if (data.success) {
                // Set error back to false if it was set:
                if (error.errorState === true) {
                    setError({
                        errorState: false,
                        message: ""
                    })
                }

                // Save tokens and id: 
                await SecureStore.setItemAsync("userID", data.userID);
                await SecureStore.setItemAsync("access_token", data.access_token);
                await SecureStore.setItemAsync("refresh_token", data.refresh_token);
                    
                // Display success message:
                setLoading(false);
                setSuccess({
                    successState: true,
                    message: data.message + " " + "Re-routing now..."
                });

                // Handle success & pause for two seconds:
                setTimeout(()=> {
                    setAuthenicatedStatus(true); 
                }, 3000);
            }
        }
        catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setLoading(false); 
                setError({
                    errorState: true,
                    message: err.response?.data?.message
                })
            }
            else {
                console.log("Unexpected error:", err);
            }
        }
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={RegisterStyles.screen}>
                <KeyboardAwareScrollView
                    // style={RegisterStyles.scrollViewOutside}
                    contentContainerStyle={RegisterStyles.scrollViewInside}
                    enableOnAndroid={true}
                    extraScrollHeight={responsive.number(20)}
                    enableAutomaticScroll={true}
                >
                    <View style={RegisterStyles.formContainer}>
                        <Appbar.Header style={RegisterStyles.appBar}>
                            <Appbar.Content titleStyle={RegisterStyles.appBarTitle} title="LOGIN" color="#DDA853"/>
                            <Appbar.Action style={RegisterStyles.appBarItem} icon="arrow-left" color="#1a1a1aff" onPress={() => navigation.goBack()} />
                        </Appbar.Header>
                        {(!isLoading && success.successState) && <SuccessBox message={success.message} width={300} height={280}/>}
                        {(isLoading && !success.successState) && <Text style={RegisterStyles.loadingText}>Loading...</Text>}
                        {(!isLoading && !success.successState) && <>
                            {/* Error Box */}
                            {error.errorState === true && <ErrorBox message={error.message} width={300}/>}
                            <TextInput 
                                style={RegisterStyles.textInput} 
                                label="Email" 
                                placeholder="example@gmail.com" 
                                error={false} 
                                mode="flat"
                                underlineColor="#1a1a1aff"
                                activeUnderlineColor="#1a1a1aff"
                                value={loginForm.email}
                                onChangeText={(newText) => handleChange('email', newText)}
                            >
                            </TextInput>
                            <View>
                                <TextInput 
                                    style={RegisterStyles.textInput} 
                                    label="Password" 
                                    placeholder="Password1!" 
                                    error={false} 
                                    mode="flat"
                                    underlineColor="#1a1a1aff"
                                    activeUnderlineColor="#1a1a1aff"
                                    value={loginForm.password}
                                    onChangeText={(newText) => handleChange('password', newText)}
                                >
                                </TextInput>
                                <Button style={RegisterStyles.forgotPassword} textColor="#0237beff">Forgot Password?</Button>
                            </View>
                            <TouchableOpacity style={RegisterStyles.submitButton} onPress={handleSubmit}>
                                <Text style={RegisterStyles.submitButtonText}>SIGN IN</Text>
                            </TouchableOpacity>
                        </>}
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
export default LoginScreen;

const RegisterStyles = StyleSheet.create({
    screen: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#D2C1B6'
    },
    forgotPassword: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        textDecorationLine: 'underline',
        textAlign: 'left',
        height: responsive.number(40)
        // backgroundColor: '#000000ff'
    },
    loadingText: {
        flexDirection: 'row',
        textAlign: 'center',
        textAlignVertical: 'center',
        width: responsive.number(300),
        height: responsive.number(280),
        // backgroundColor: '#ecececff'
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
    },
    appBarTitle: {
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '800',
        // fontSize: responsive.number(20),
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
        gap: responsive.number(20),
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