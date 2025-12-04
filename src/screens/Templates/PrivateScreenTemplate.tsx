import { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
// Libraries:
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";

// Components:
import BottomNavigator from '../../components/BottomNavigator';

export default function PrivateScreenTemplate () {
    return (
        <SafeAreaProvider>
            <PaperProvider>
                <SafeAreaView style={PrivateScreenTemplateStyles.screen}>
                    <BottomNavigator/>
                </SafeAreaView>
            </PaperProvider>
        </SafeAreaProvider>
    );
}

const PrivateScreenTemplateStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#000000ff'
    }
})
