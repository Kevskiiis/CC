import { StyleSheet, View, Text, TouchableOpacity, TextInput} from "react-native";
import { useState } from "react";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OpeningRoutesStackParams } from '../routes/OpeningRoutes';

type props = NativeStackScreenProps<OpeningRoutesStackParams, 'RegisterScreen'>;

function RegisterScreen ({navigation}: props) {
    const [newForm, setForm] = useState({

    })

    return (
        <View style={RegisterStyles.container}>
            {/* Back Button */}
            <View style={RegisterStyles.backButtonContainer}>
                <TouchableOpacity style={RegisterStyles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={RegisterStyles.buttonText}>Back</Text>
                </TouchableOpacity>
            </View>
            {/* New User Entries */}
            <View style={RegisterStyles.inputsContainer}>
                <TextInput
                    style={RegisterStyles.textInput}
                    placeholder="First name"
                />
                <TextInput
                    style={RegisterStyles.textInput}
                    placeholder="Middle name"
                />
                <TextInput
                    style={RegisterStyles.textInput}
                    placeholder="Last name"
                />
                <TextInput
                    style={RegisterStyles.textInput}
                    placeholder="Phone number"
                />
                <TextInput
                    style={RegisterStyles.textInput}
                    placeholder="Email"
                />
                <TextInput
                    style={RegisterStyles.textInput}
                    placeholder="Password"
                />
                <TextInput
                    style={RegisterStyles.textInput}
                    placeholder="Re-enter password"
                />
                <TouchableOpacity style={RegisterStyles.button}>
                    <Text style={RegisterStyles.buttonText}>Create Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default RegisterScreen;

const RegisterStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 20
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
        flex: 0.25,
        position: 'relative',
        top: 85,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: 275,
        height: 'auto'
    },
    inputsContainer: {
        flex: 0.75,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        width: 310,
        marginBottom: 50,
        backgroundColor: '#ffffff',
    },
    textInput: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 2,
        // borderWidth: 4,
        // borderRadius: 15,
        textAlign: 'center',
        fontSize: 16,
        height: 50,
        width: 275,
        color: '#ffffff',
        backgroundColor: '#29a01aff'
    }
})