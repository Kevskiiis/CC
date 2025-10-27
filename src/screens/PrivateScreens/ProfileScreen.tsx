import { Text, Avatar, Card, IconButton, Button, Divider} from "react-native-paper";
import { StyleSheet, View, ScrollView} from "react-native";
import { responsive } from "../../utils/responsive";
import { COLORS } from "../../themes/colors";
import { useState } from "react";

export default function ProfileScreen () {

    return (
        <View>
            <View style={ProfileScreenStyles.TopNavContainer}>
                <Text>User's </Text>
                <IconButton icon="cog" mode="contained" size={30}/>
            </View>
            <View style={ProfileScreenStyles.configurationContainer}>
                <Avatar.Image style={ProfileScreenStyles.avatar} size={responsive.number(100)} source={require('../../../assets/icon.png')}/>
                <Text style={ProfileScreenStyles.profileName}>Kevin Rodriguez</Text>
                <Text style={ProfileScreenStyles.bio}>I am a pro Fortnite player. I know the ganme is dead, but I'm still the best.</Text>
                <Button style={ProfileScreenStyles.button}>Edit Profile</Button>
            </View>
            <Divider/>
            <Card style={ProfileScreenStyles.card} onPress={() => console.log(' was pressed')}>
                <Card.Title title="Create Post"/>
                <Card.Cover/>
                <Card.Content>
                    <Text variant="bodyLarge">Got something to say? Create a post and start the conversation!</Text>
                </Card.Content>
            </Card>
        </View>
    );
}

const ProfileScreenStyles = StyleSheet.create({
    TopNavContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: responsive.number(65),
        backgroundColor: COLORS.primary
    },
    configurationContainer: {
        gap: responsive.number(10),
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileName: {
        fontSize: responsive.fontSize(20)
    },
    bio: {
        alignSelf: 'flex-start',
        paddingLeft: responsive.number(15),
        paddingRight: responsive.number(15),
        paddingTop: responsive.number(10),
        paddingBottom: responsive.number(30),
        fontSize: responsive.fontSize(14)
    },
    avatar: {
        // borderWidth: responsive.number(2)
    },
    card: {
        width: responsive.number(230),
        // height: responsive.number(),
        // backgroundColor: '#f08080ff'
    },
    button: {
        width: responsive.number(200),
        height: responsive.number(50),
        backgroundColor: '#f08080ff'
    }
})