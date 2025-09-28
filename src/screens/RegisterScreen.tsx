import { StyleSheet, View, Text, TouchableOpacity, Keyboard} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from 'react-native-phone-input';
import { useState, useRef } from "react";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OpeningRoutesStackParams } from '../routes/OpeningRoutes';

// React Native Paper Library Components:
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Appbar, Button, Icon} from 'react-native-paper';
import TextInputMask from "react-native-text-input-mask";

// Responsive Utility for Styling:
import { responsive } from "../utils/responsive";
import AppbarBackAction from "react-native-paper/lib/typescript/components/Appbar/AppbarBackAction";

type props = NativeStackScreenProps<OpeningRoutesStackParams, 'RegisterScreen'>;

function RegisterScreen ({navigation}: props) {
    // References:
    // const firstName = useRef<TextInput>(null);
    // const lastName = useRef<TextInput>(null);
    // const phoneNumber = useRef<PhoneInput>(null);
    // const email = useRef<TextInput>(null);
    // const password = useRef<TextInput>(null);

    // States:
    const [newForm, setForm] = useState({

    })

    // function handleEditChange (object: React.RefObject<TextInput | PhoneInput>) {
    //     object.current?.focus()
    // }   

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
                        />
                        <TextInput 
                            style={RegisterStyles.textInput} 
                            label="Email" 
                            placeholder="example@gmail.com" 
                            error={false} 
                            mode="flat"
                            underlineColor="#1a1a1aff"
                            activeUnderlineColor="#1a1a1aff"
                        >
                        </TextInput>
                        <TextInput 
                            style={RegisterStyles.textInput} 
                            label="Password" 
                            placeholder="Example14!" 
                            error={false} 
                            mode="flat"
                            underlineColor="#1a1a1aff"
                            activeUnderlineColor="#1a1a1aff"
                        >
                        </TextInput>
                        <TouchableOpacity style={RegisterStyles.submitButton}>
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
        color: '#DDA853'
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
        fontSize: responsive.number(20)
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