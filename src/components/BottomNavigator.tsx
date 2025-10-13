import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { responsive } from "../utils/responsive";

export default function BottomNavigator () {
    return (
        
        <View style={BottomNavigatorStyles.screen}>

        </View>
    );
}

const BottomNavigatorStyles = StyleSheet.create({
    screen: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        width: '100%',
        height: responsive.number(80),
        backgroundColor: '#1a1a1aff'
    }
});