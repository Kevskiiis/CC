import { StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";


export default function TopNavigator () {

    const handleClick = () => {
        // Handle Navigation here
    }

    return (
        <Appbar>
            <Appbar.Content title="Community Connections"/>
            <Appbar.Action icon="airplane" onPress={handleClick}/>
        </Appbar>
    );
}

const TopNavigatorStyles = StyleSheet.create({

})