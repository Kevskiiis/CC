import { StyleSheet, View, Text, TouchableOpacity, Keyboard} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// React Native Paper Library Components:
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Appbar} from 'react-native-paper';
import ReactCodeInput from "react-code-input";
import { responsive } from "../../utils/responsive";


function ResetPasswordScreen () {
    const handleChange = () => {

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
                        <ReactCodeInput type="text" name="otp" inputMode="numeric" fields={6} onChange={handleChange}/>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

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