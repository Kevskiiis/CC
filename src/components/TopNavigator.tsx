import { StyleSheet, ScrollView, Text, View, Image} from "react-native";
import { Appbar, Button, IconButton, List, Modal, Portal} from "react-native-paper";
import { responsive } from "../utils/responsive";
import CommunityList from "./CommunityList";
import { COLORS } from "../themes/colors";
import { useState } from "react";
import ErrorBox from "./ErrorBox";
import Logo from "../../assets/logo.svg";

// Frameworks:
import axios from "axios";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import * as SecureStore from 'expo-secure-store';

type community = {
  community_id: number;
  community_name: string;
  community_bio: string;
  attachment_url: string;
  role_name: string;
  join_code: string;
  community_public_url: string
};

export default function TopNavigator () {
    // REACT STATES: 
    const [isVisible, setIsVisible] = useState(false);
    const [selectedCommunity, setSelectedCommunity] = useState('');
    const [communities, setCommunities] = useState({
        isEmpty: false,
        message: '',
        communities: []
    })
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState({
            errorState: false,
            message: ''
    });

    // Functions:
    const getCommunities = async () => {
        try {
            // Set communities false in case there was a new community added:
            setCommunities((prevValue) => ({
                isEmpty: false,
                message: '',
                communities: []
            }))
    
            // Obtain the access token:
            const accessToken = await SecureStore.getItemAsync('access_token');
            console.log("Access Token: " + accessToken);
    
            // Set Loading: 
            setIsLoading(true);
    
            // Call the command to get all the user's communities:
            const result = await axios.get(
                'https://ccbackend-production-5adb.up.railway.app/get-user-communities',
                {
                    headers: {
                        Authorization: accessToken
                    }
                }
            )
    
            // Get the data portion only:
            const data = result.data;
    
            // Handle if success:
            console.log(data);
    
            if (data.communities.length === 0) {
                setCommunities({
                    isEmpty: true,
                    message: data.message,
                    communities: data.communities
                })
            }
            else {
                setCommunities({
                    isEmpty: false,
                    message: data.message,
                    communities: data.communities
                })
            }
    
            // Stop loading indicator:
            setIsLoading(false); 
        }
        catch (err) {
            setIsLoading(false);
            if (axios.isAxiosError(err)) {
                setIsLoading(false); 
                setError({
                    errorState: true,
                    message: err.response?.data?.message
                })
            }
            else {
                console.log("Unexpected error:", err);
            }
        }
    }

    const handleClick = () => {
        // Handle Navigation here
    }

    const showModal = () => setIsVisible(true);
    const hideModal = () => setIsVisible(false); 

    return (
        <View style={TopNavigatorStyles.TopNavContainer}>
            <Logo width={responsive.number(90)} height={responsive.number(50)}/>
            {/* <Image style={TopNavigatorStyles.logo}/> */}
            <Button style={TopNavigatorStyles.button} mode="contained" buttonColor="white" textColor='black' icon='menu-down' onPress={() => {
                showModal();
                getCommunities(); 
            }}>Communities</Button>
            {/* <IconButton size={responsive.number(32)} icon='chat' iconColor="white"/>
            <IconButton size={responsive.number(32)} icon='bell' iconColor="white"/> */}
            <Portal>
                <Modal visible={isVisible} onDismiss={hideModal} contentContainerStyle={TopNavigatorStyles.modal}>
                    <ScrollView>
                        <Button icon="close" style={TopNavigatorStyles.closeButton} onPress={hideModal}>Close</Button>
                        {error.errorState === true && <ErrorBox message={error.message} width={297}/>}
                        {isLoading && <ActivityIndicator animating={isLoading} color={MD2Colors.red800} size={responsive.number(60)}/>}
                        {communities.isEmpty && <Text>{communities.message}</Text>}

                        {/* For loop to load all of the communities: */}
                        {!communities.isEmpty ? communities.communities.map((object: community) => (
                            <Button key={object.community_id} style={TopNavigatorStyles.listItem} onPress={() => console.log(object.community_name)}>
                                {object.community_name}
                            </Button>))
                        : null}
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
        width: responsive.number(250),
        height: responsive.number(40)
    },
    modal: {
        borderRadius: responsive.number(15),
        padding: responsive.number(15),
        width: responsive.number(320),
        height: responsive.number(520),
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        alignSelf: 'center'
    },
    listItem: {
        borderRadius: responsive.number(10),
        marginTop: responsive.number(10),
        marginBottom: responsive.number(10),
        // height: responsive.number(50),
        backgroundColor: '#d6ceceff'
    },
    closeButton: {
        borderRadius: responsive.number(10),
        marginTop: responsive.number(10),
        marginBottom: responsive.number(10),
        // height: responsive.number(50),
        backgroundColor: '#f08080ff'
    }
})