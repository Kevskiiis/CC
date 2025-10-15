import { StyleSheet, View } from "react-native";
import { useState } from "react";
import { BottomNavigation} from 'react-native-paper';
import { responsive } from "../utils/responsive";

// Screens:
// import HomeScreen from "../screens/PrivateScreens/HomeScreen";
import CommunityScreen from "../screens/PrivateScreens/CommunityScreen";
import PostScreen from "../screens/PrivateScreens/PostScreen";
import ProfileScreen from "../screens/PrivateScreens/ProfileScreen";

// Directories:
import HomeDirectory from "../directories/HomeDirectory";

// Themes:
import {COLORS} from '../themes/colors';

export default function BottomNavigator () {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "home", title: "Home", focusedIcon: 'home', unfocusedIcon: 'home-outline'},
        { key: "create", title: "Create", focusedIcon: "plus-box", unfocusedIcon: 'plus-box-outline'},
        { key: "communities", title: "Communities", focusedIcon:"account-group", unfocusedIcon: 'account-group-outline'},
        { key: "profile", title: "Profile", focusedIcon: "account", unfocusedIcon: 'account-outline'},
    ]);

    const renderScene = BottomNavigation.SceneMap({
        home: HomeDirectory,
        create: PostScreen,
        communities: CommunityScreen,
        profile: ProfileScreen
    })

    return (
        <View style={BottomNavigatorStyles.screen}>
            <BottomNavigation
                navigationState={{index, routes}}
                onIndexChange={setIndex}
                renderScene ={renderScene}
                inactiveColor="#8c1f1fff"
                activeColor="#010101ff"
                barStyle={BottomNavigatorStyles.barStyle} 
                activeIndicatorStyle={BottomNavigatorStyles.activatorIndicatorStyle}
            />
        </View>
    );
}

const BottomNavigatorStyles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    barStyle: {
        backgroundColor: '#f4f4f4ff'
    },
    activatorIndicatorStyle: {

    }
});