import { Button } from "react-native-paper";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { responsive } from "../utils/responsive";


export default function CommunityList () {
    const [isExpanded, setIsExpanded] = useState(false); 

    return (
        <View>
            <Button style={CommunityDropdown.button} mode="contained" buttonColor="white" textColor='black' icon='menu-down'>Example</Button>
        </View>
    );
}

const CommunityDropdown = StyleSheet.create({
    button: {
        // color: 'white',
        width: responsive.number(150),
        // height: responsive.number(5)
    }
});