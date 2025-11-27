import { StyleSheet, View, Text, TouchableOpacity, Image, Keyboard} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from 'react-native-phone-input';
import { useState, useRef } from "react";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PublicRoutesStackParams } from '../../routes/PublicRoutes';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system";

// React Native Paper Library Components:
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Appbar} from 'react-native-paper';
import ErrorBox from "../../components/ErrorBox";
import SuccessBox from "../../components/SuccessBox";

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
    avatar: string | null;
}

type errorState = {
    errorState: boolean;
    message: string; 
}

type successState = {
    successState: boolean;
    message: string; 
}

function RegisterScreen ({navigation}: props) {
    // States: 
    const [registerForm, setForm] = useState<registerForm>({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        avatar: null
    })

    const [error, setError] = useState<errorState>({
        errorState: false,
        message: ''
    });
    
    const [success, setSuccess] = useState<successState>({
        successState: false,
        message: ''
    });

    const [isLoading, setLoading] = useState<Boolean>(false);

    // Contexts:
    const {isAuthenticated, createAccount} = useAuth(); 

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setForm((prev) => ({
                ...prev,
                avatar: result.assets[0].uri,
            }));
        }
    }

    const handleChange =  (inputName: string, newText: string) => {
        setForm((prevValue) => ({
            ...prevValue,
            [inputName]: newText
        }));
    }

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const formData = new FormData();

            // Append text fields
            formData.append("firstName", registerForm.firstName);
            formData.append("lastName", registerForm.lastName);
            formData.append("email", registerForm.email);
            formData.append("password", registerForm.password);

            // Append avatar if it exists
            if (registerForm.avatar) {
                const fileName = registerForm.avatar.split("/").pop(); // Extract filename
                const match = /\.(\w+)$/.exec(fileName ?? "");
                const type = match ? `image/${match[1]}` : `image`;

                formData.append("avatarImage", {
                    uri: registerForm.avatar,
                    name: fileName,
                    type: type,
                } as any); // `as any` to satisfy TypeScript
            }

            // Send to backend
            const response = await fetch("https://ccbackend-production-5adb.up.railway.app/create-account", {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const data = await response.json(); 

            if (data.success) {                
                // Set error back to false if it was set:
                if (error.errorState === true) {
                    setError({
                        errorState: false,
                        message: ""
                    })
                }

                // Display success message:
                setLoading(false)
                setSuccess({
                    successState: true,
                    message: data.message
                })

                // Handle success & pause for two seconds:
                setTimeout(()=> {
                    navigation.replace("LoginScreen");
                }, 3000)
            }
            else {
                // Handle Error Case:
                setLoading(false); 
                setError({
                    errorState: true,
                    message: data.message
                })
            }
            console.log(data);
        } 
        catch (err) {
            console.error(err);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={RegisterStyles.screen}>
                <KeyboardAwareScrollView
                    // style={RegisterStyles.scrollViewOutside}
                    contentContainerStyle={RegisterStyles.scrollViewInside}
                    enableOnAndroid={true}
                    extraScrollHeight={responsive.number(150)}
                    enableAutomaticScroll={true}
                >
                    <View style={RegisterStyles.formContainer}>
                        <Appbar.Header style={RegisterStyles.appBar}>
                            <Appbar.Content titleStyle={RegisterStyles.appBarTitle} title="CREATE ACCOUNT" color="#DDA853"/>
                            <Appbar.Action style={RegisterStyles.appBarItem} icon="arrow-left" color="#1a1a1aff" onPress={() => navigation.goBack()} />
                        </Appbar.Header>
                        {(!isLoading && success.successState) && <SuccessBox message={success.message} width={300} height={510}/>}
                        {(isLoading && !success.successState) && <Text style={RegisterStyles.loadingText}>Loading...</Text>}
                        {(!isLoading && !success.successState) && <>
                            {/* Error Box */}
                            {error.errorState === true && <ErrorBox message={error.message} width={300}/>}

                            {/* Register Avatar */}
                            {registerForm.avatar && (
                                <Image
                                    source={{ uri: registerForm.avatar }}
                                    style={{ width: 120, height: 120, borderRadius: 60 }}
                                />
                            )}

                            <TouchableOpacity
                                style={RegisterStyles.pickImageButton}
                                onPress={pickImage}
                            >
                                <Text>Select Profile Picture</Text>
                            </TouchableOpacity>
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
                                secureTextEntry={true}
                            >
                            </TextInput>
                            <TouchableOpacity style={RegisterStyles.submitButton} onPress={handleSubmit}>
                                <Text style={RegisterStyles.submitButtonText}>SIGN UP</Text>
                            </TouchableOpacity>
                        </>}
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
    loadingText: {
        flexDirection: 'row',
        textAlign: 'center',
        textAlignVertical: 'center',
        width: responsive.number(300),
        height: responsive.number(510),
        // backgroundColor: '#ecececff'
    },
    pickImageButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: responsive.number(300),
        height: responsive.number(60),
        borderRadius: responsive.number(4),
        borderWidth: responsive.number(2),
        backgroundColor: '#ecececff'
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