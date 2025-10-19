import { StyleSheet, ScrollView, Text, View, Image} from "react-native";
import { Appbar, Button, IconButton, List, Modal, Portal} from "react-native-paper";
import { responsive } from "../utils/responsive";
import CommunityList from "./CommunityList";
import { COLORS } from "../themes/colors";
import { useState } from "react";

// Components: 


export default function TopNavigator () {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedCommunity, setSelectedCommunity] = useState('')

    const handleClick = () => {
        // Handle Navigation here
    }

    const showModal = () => setIsVisible(true);
    const hideModal = () => setIsVisible(false); 

    return (
        <View style={TopNavigatorStyles.TopNavContainer}>
            <Image style={TopNavigatorStyles.logo}/>
            <Button style={TopNavigatorStyles.button} mode="contained" buttonColor="white" textColor='black' icon='menu-down' onPress={showModal}>Community</Button>
            <IconButton size={responsive.number(32)} icon='chat' iconColor="white"/>
            <IconButton size={responsive.number(32)} icon='bell' iconColor="white"/>
            <Portal>
                <Modal visible={isVisible} onDismiss={hideModal} contentContainerStyle={TopNavigatorStyles.modal}>
                    <ScrollView>
                        <Button icon="close" style={TopNavigatorStyles.closeButton} onPress={hideModal}>Close</Button>
                        <Button style={TopNavigatorStyles.listItem}>Community 1</Button>
                        <Button style={TopNavigatorStyles.listItem}>Community 2</Button>
                        <Button style={TopNavigatorStyles.listItem}>Community 3</Button>
                        <Button style={TopNavigatorStyles.listItem}>Community 4</Button>
                    </ScrollView>
                </Modal>
            </Portal>
        </View>
    );
}

const TopNavigatorStyles = StyleSheet.create({
    TopNavContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: responsive.number(65),
        backgroundColor: COLORS.primary
    },
    logo: {
        width: responsive.number(32),
        height: responsive.number(32),
        backgroundColor: 'white'
    },
    ListContainer: {
        width: responsive.number(300),
        height: responsive.number(0),
        backgroundColor: '#6c0202ff'
    },
    button: {
        // color: 'white',
        width: responsive.number(150),
        height: responsive.number(40)
    },
    modal: {
        // position: 'relative',
        // top: responsive.number(-100),
        width: responsive.number(275),
        height: responsive.number(450),
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        alignSelf: 'center'
    },
    listItem: {
        marginTop: responsive.number(10),
        marginBottom: responsive.number(10),
        backgroundColor: '#d6ceceff'
    },
    closeButton: {
        marginTop: responsive.number(10),
        marginBottom: responsive.number(10),
        backgroundColor: '#f08080ff'
    }
})