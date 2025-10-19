import { StyleSheet, View } from "react-native";
import { useState } from "react";
import { BottomNavigation} from 'react-native-paper';

// Screens:
import ProfileScreen from "../screens/PrivateScreens/ProfileScreen";

// Directories:
import HomeDirectory from "../directories/HomeDirectory";
import CreateDirectory from "../directories/CreateDirectory";
import CommunityDirectory from "../directories/CommunityDirectory";

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
        create: CreateDirectory,
        communities: CommunityDirectory,
        profile: ProfileScreen
    })

    return (
        <View style={BottomNavigatorStyles.screen}>
            <BottomNavigation
                navigationState={{index, routes}}
                onIndexChange={setIndex}
                renderScene ={renderScene}
                inactiveColor={COLORS.primaryText}
                activeColor={COLORS.primaryText}
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
        backgroundColor: COLORS.primary
    },
    activatorIndicatorStyle: {
        backgroundColor: 'transparent'
    }
});