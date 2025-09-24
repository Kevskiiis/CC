import { StyleSheet, View, Text, TouchableOpacity, TextInput} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useState } from "react";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OpeningRoutesStackParams } from '../routes/OpeningRoutes';

//
import { responsive } from "../utils/responsive";

// Components:
import InputBox from "../components/InputBox";

type props = NativeStackScreenProps<OpeningRoutesStackParams, 'RegisterScreen'>;

function RegisterScreen ({navigation}: props) {
    const [newForm, setForm] = useState({

    })

    return (
        <KeyboardAwareScrollView
            style={RegisterStyles.scrollViewOutside}
            contentContainerStyle={RegisterStyles.scrollViewInside}
            enableOnAndroid={true}
            extraScrollHeight={responsive.number(100)}
            enableAutomaticScroll={true}
            keyboardOpeningTime={350}
        >
            <View style={RegisterStyles.formContainer}>
                {/* Back Button */}
                <View style={RegisterStyles.backButtonContainer}>
                    <TouchableOpacity style={RegisterStyles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={RegisterStyles.buttonText}>Back</Text>
                    </TouchableOpacity>
                </View>
                {/* New User Entries */}
                <View style={RegisterStyles.inputsContainer}>
                    <Text style={RegisterStyles.label}>First Name</Text>
                    <InputBox boxPlaceholder="First Name"/>
                    <Text style={RegisterStyles.label}>Last Name</Text>
                    <InputBox boxPlaceholder="Last Name"/>
                    <Text style={RegisterStyles.label}>Phone Number</Text>
                    <InputBox boxPlaceholder="Phone Number"/>
                    <Text style={RegisterStyles.label}>Email</Text>
                    <InputBox boxPlaceholder="Email"/>
                    <Text style={RegisterStyles.label}>Password</Text>
                    <InputBox boxPlaceholder="Password"/>
                    <TouchableOpacity style={RegisterStyles.button}>
                        <Text style={RegisterStyles.buttonText}>Create Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}
export default RegisterScreen;

const RegisterStyles = StyleSheet.create({
    buttonText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 20
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: responsive.number(4),
        borderRadius: responsive.number(10),
        marginTop: responsive.number(10),
        height: responsive.number(50),
        width: responsive.number(275),
        backgroundColor: '#000000ff'
    },
    backButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: responsive.number(4),
        borderRadius: responsive.number(15),
        width: responsive.number(100),
        height: responsive.number(50),
        backgroundColor: '#000000ff'
    },
    label: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: responsive.number(8),
        fontSize: responsive.fontSize(18),
        // fontFamily: 'Georgia',
        fontWeight: "600",
        height: responsive.number(30),
        width: '100%',
        // backgroundColor: '#4CAF50'
    },
    scrollViewOutside: {
    },
    scrollViewInside: {
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start', 
        alignItems: 'center',
        paddingTop: responsive.number(50),
        paddingBottom: responsive.number(30),
        backgroundColor: '#4087d8ff'
    },
    formContainer: {
        // flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: responsive.number(15),
        paddingTop: responsive.number(10),
        paddingLeft: responsive.number(5),
        paddingRight: responsive.number(5),
        width: responsive.number(340),
        height: responsive.number(700),
        borderWidth: responsive.number(6),
        borderRadius: responsive.number(8),
        backgroundColor: '#D0F0C0',
    },
    backButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width:'100%',
        height: responsive.number(60),
        // backgroundColor: '#ffffff'
    },
    inputsContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: responsive.number(10),
        paddingLeft: responsive.number(10),
        paddingRight: responsive.number(10),
        width: '100%',
        height: responsive.number(600),
        // backgroundColor: '#ba3636ff'
    },
}) 